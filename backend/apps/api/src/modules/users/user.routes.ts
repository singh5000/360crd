import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize, requireTenantAdmin } from "../../middleware/authorize";
import { prisma, basePrisma } from "@360crd/database";
import { UserRepository } from "./user.repository";
import { ListUsersDto, UpdateUserDto, AssignRoleDto, CreateUserDto } from "./user.dto";
import { ValidationError, NotFoundError, ConflictError, ForbiddenError } from "../../shared/errors/http.errors";
import { AuditLogService } from "../audit-logs/audit-log.service";
import bcrypt from "bcryptjs";
import { config } from "../../config";
import { emailQueue } from "@360crd/queue";
import { invalidatePermissionCache } from "../../middleware/authenticate";
import { assertUserLimit } from "../../shared/tenant-limits";

const repo = new UserRepository();
const auditLog = new AuditLogService();

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── Own profile ───────────────────────────────────────────────────────────
  fastify.get("/me", async (req, reply) => {
    const r = req as any;
    const user = await repo.findById(r.userId);
    if (!user) throw new NotFoundError("User");
    const sites = await repo.getUserSites(r.userId);
    const roles = await repo.getUserRoles(r.userId);
    return reply.send({ success: true, data: { ...user, sites: sites.map(s => s.site), roles: roles.map(ur => ur.role) } });
  });

  fastify.patch("/me", async (req, reply) => {
    const r = req as any;
    const body = UpdateUserDto.pick({
      firstName: true, lastName: true, phone: true,
      department: true, jobTitle: true, avatarUrl: true,
    }).safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const user = await repo.update(r.userId, body.data);
    return reply.send({ success: true, data: user });
  });

  // ── List users ────────────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("user:read")] }, async (req, reply) => {
    const r = req as any;
    const query = ListUsersDto.safeParse(req.query);
    if (!query.success) throw new ValidationError("Invalid query", query.error.errors);

    // Managers only see users on their assigned sites
    if (!r.isSuperAdmin && r.userType === "MANAGER") {
      const managerSites = await repo.getUserSites(r.userId);
      if (managerSites.length > 0) {
        const siteIds = managerSites.map((s: any) => s.siteId);
        const result = await repo.getUsersOnSites(r.tenantId, siteIds, query.data);
        return reply.send({ success: true, ...result });
      }
      // No sites assigned — fall through to show all tenant users
    }

    const result = await repo.findMany(r.tenantId, query.data);
    return reply.send({ success: true, ...result });
  });

  fastify.post("/", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const body = CreateUserDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const r = req as any;

    // Enforce tenant user limit
    await assertUserLimit(r.tenantId);

    const existing = await repo.findByEmail(r.tenantId, body.data.email);
    if (existing) throw new ConflictError("User with this email already exists");

    const password = body.data.password || Math.random().toString(36).slice(-12) + "A1!";
    const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);

    const user = await repo.create(r.tenantId, body.data, passwordHash);

    // Assign roles
    for (const roleId of body.data.roles) {
      await repo.assignRole(user.id, roleId, r.tenantId, r.userId);
    }

    // Assign sites
    if (body.data.siteIds && body.data.siteIds.length > 0) {
      await repo.assignSites(user.id, body.data.siteIds);
    }

    if (body.data.sendWelcomeEmail) {
      await emailQueue.add("welcome", {
        to: user.email,
        subject: "Welcome to 360CRD",
        htmlBody: `<p>Your account has been created. Temporary password: <strong>${password}</strong></p>`,
        tenantId: r.tenantId,
      });
    }

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "CREATE",
      resource: "user", resourceId: user.id,
      after: { email: user.email, type: user.type }, ipAddress: req.ip,
    });

    return reply.status(201).send({ success: true, data: user });
  });

  fastify.get("/:id", { preHandler: [authorize("user:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const user = await repo.findById(id);
    if (!user) throw new NotFoundError("User", id);
    return reply.send({ success: true, data: user });
  });

  fastify.patch("/:id", { preHandler: [authorize("user:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = UpdateUserDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const user = await repo.update(id, body.data);
    const r = req as any;
    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "UPDATE",
      resource: "user", resourceId: id, after: body.data, ipAddress: req.ip,
    });
    return reply.send({ success: true, data: user });
  });

  fastify.delete("/:id", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    if (id === r.userId) throw new ValidationError("Cannot delete your own account", []);
    await repo.softDelete(id);
    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "DELETE",
      resource: "user", resourceId: id, ipAddress: req.ip,
    });
    return reply.status(204).send();
  });

  // ── Role management ──────────────────────────────────────────────────────
  fastify.post("/:id/roles", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = AssignRoleDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const r = req as any;
    await repo.assignRole(id, body.data.roleId, r.tenantId, r.userId, {
      siteId: body.data.siteId,
      expiresAt: body.data.expiresAt ? new Date(body.data.expiresAt) : undefined,
    });
    await invalidatePermissionCache(id, r.tenantId);
    return reply.status(201).send({ success: true, message: "Role assigned" });
  });

  fastify.delete("/:id/roles/:roleId", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id, roleId } = req.params as { id: string; roleId: string };
    await repo.revokeRole(id, roleId);
    const r = req as any;
    await invalidatePermissionCache(id, r.tenantId);
    return reply.status(204).send();
  });

  fastify.get("/:id/roles", { preHandler: [authorize("user:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const roles = await repo.getUserRoles(id);
    return reply.send({ success: true, data: roles });
  });

  // ── Status management ─────────────────────────────────────────────────────
  fastify.put("/:id/status", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    if (id === r.userId) throw new ForbiddenError("Cannot change your own status");

    const body = { status: (req.body as any)?.status };
    if (!["ACTIVE", "INACTIVE", "SUSPENDED"].includes(body.status)) {
      throw new ValidationError("Invalid status", []);
    }

    const user = await repo.update(id, { status: body.status });
    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "STATUS_CHANGE",
      resource: "user", resourceId: id, after: { status: body.status }, ipAddress: req.ip,
    });
    return reply.send({ success: true, data: user });
  });

  // ── Account unlock ────────────────────────────────────────────────────────
  fastify.put("/:id/unlock", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const user = await repo.unlock(id);
    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "UNLOCK",
      resource: "user", resourceId: id, ipAddress: req.ip,
    });
    return reply.send({ success: true, data: user });
  });

  // ── Site assignment ───────────────────────────────────────────────────────
  fastify.put("/:id/sites", { preHandler: [authorize("user:assign")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = (req.body as any)?.siteIds;
    if (!Array.isArray(body)) throw new ValidationError("siteIds must be an array", []);

    await repo.assignSites(id, body);
    const r = req as any;
    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "ASSIGN_SITES",
      resource: "user", resourceId: id, after: { siteIds: body }, ipAddress: req.ip,
    });
    return reply.send({ success: true, message: "Sites assigned" });
  });

  fastify.get("/:id/sites", { preHandler: [authorize("user:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const sites = await repo.getUserSites(id);
    return reply.send({ success: true, data: sites.map((s: any) => s.site) });
  });

  fastify.delete("/:id/sites/:siteId", { preHandler: [authorize("user:assign")] }, async (req, reply) => {
    const { id, siteId } = req.params as { id: string; siteId: string };
    await repo.removeSite(id, siteId);
    return reply.status(204).send();
  });

  // ── Activity & login history ──────────────────────────────────────────────
  fastify.get("/:id/activity", { preHandler: [authorize("user:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const { limit = 20 } = req.query as any;

    const [sessions, activityLogs] = await Promise.all([
      repo.getLoginActivity(id, Number(limit)),
      repo.getActivityLogs(r.tenantId, id, Number(limit)),
    ]);

    return reply.send({
      success: true,
      data: { sessions, activityLogs },
    });
  });

  // ── Password reset by admin ───────────────────────────────────────────────
  fastify.put("/:id/reset-password", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const newPassword = Math.random().toString(36).slice(-10) + "A1!";
    const passwordHash = await bcrypt.hash(newPassword, config.auth.bcryptRounds);

    await basePrisma.user.update({
      where: { id },
      data: { passwordHash, mustChangePassword: true, passwordChangedAt: new Date() },
    });

    const user = await repo.findById(id);
    if (!user) throw new NotFoundError("User");

    await emailQueue.add("password-reset-by-admin", {
      to: user.email,
      subject: "Your password has been reset",
      htmlBody: `<p>Your account password has been reset by an administrator. New temporary password: <strong>${newPassword}</strong></p><p>Please change your password upon next login.</p>`,
      tenantId: r.tenantId,
    });

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "ADMIN_PASSWORD_RESET",
      resource: "user", resourceId: id, ipAddress: req.ip,
    });

    return reply.send({ success: true, message: "Password reset email sent" });
  });
}
