import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../../middleware/authenticate";
import { authorize, requireTenantAdmin, requireSuperAdmin } from "../../middleware/authorize";
import { prisma, basePrisma } from "@360crd/database";
import { ValidationError, NotFoundError, ForbiddenError } from "../../shared/errors/http.errors";
import { invalidatePermissionCache } from "../../middleware/authenticate";

const CreateRoleDto = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9_]+$/),
  description: z.string().optional(),
  level: z.number().default(0),
  permissions: z.array(z.string()).default([]),
});

export default async function roleRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/", { preHandler: [authorize("role:read")] }, async (req, reply) => {
    const tenantId = (req as any).tenantId;
    const roles = await basePrisma.role.findMany({
      where: { OR: [{ tenantId: null }, { tenantId }] },
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
      orderBy: { level: "desc" },
    });
    return reply.send({ success: true, data: roles });
  });

  fastify.post("/", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const body = CreateRoleDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const tenantId = (req as any).tenantId;
    const role = await basePrisma.role.create({
      data: { tenantId, name: body.data.name, slug: body.data.slug, description: body.data.description, level: body.data.level },
    });

    if (body.data.permissions.length > 0) {
      const perms = await basePrisma.permission.findMany({ where: { id: { in: body.data.permissions } } });
      await basePrisma.rolePermission.createMany({
        data: perms.map(p => ({ roleId: role.id, permissionId: p.id })),
        skipDuplicates: true,
      });
    }

    return reply.status(201).send({ success: true, data: role });
  });

  fastify.get("/permissions", { preHandler: [authorize("role:read")] }, async (_req, reply) => {
    const permissions = await basePrisma.permission.findMany({ orderBy: [{ resource: "asc" }, { action: "asc" }] });
    return reply.send({ success: true, data: permissions });
  });

  fastify.patch("/:id", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = CreateRoleDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const { permissions: _perms, ...roleData } = body.data;
    const role = await basePrisma.role.update({ where: { id }, data: roleData });
    return reply.send({ success: true, data: role });
  });

  fastify.delete("/:id", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const role = await basePrisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundError("Role", id);
    if (role.isSystem) throw new ForbiddenError("Cannot delete system roles");
    await basePrisma.role.delete({ where: { id } });
    return reply.status(204).send();
  });

  // ── Get specific role detail ───────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("role:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const role = await basePrisma.role.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
    if (!role) throw new NotFoundError("Role", id);
    return reply.send({ success: true, data: role });
  });

  // ── Replace all permissions for a role ────────────────────────────────────
  fastify.put("/:id/permissions", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = z.object({ permissionIds: z.array(z.string()) }).safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const isSuperAdmin = (req as any).isSuperAdmin;
    const role = await basePrisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundError("Role", id);
    if (role.isSystem && !isSuperAdmin) throw new ForbiddenError("Cannot modify system role permissions directly");

    const perms = await basePrisma.permission.findMany({
      where: { id: { in: body.data.permissionIds } },
    });

    // Replace: delete existing, insert new
    await basePrisma.$transaction([
      basePrisma.rolePermission.deleteMany({ where: { roleId: id } }),
      basePrisma.rolePermission.createMany({
        data: perms.map(p => ({ roleId: id, permissionId: p.id, grantedBy: (req as any).userId })),
        skipDuplicates: true,
      }),
    ]);

    // Invalidate permission cache for all users with this role
    const affectedUsers = await basePrisma.userRole.findMany({
      where: { roleId: id },
      select: { userId: true, tenantId: true },
    });
    await Promise.all(
      affectedUsers.map(u => invalidatePermissionCache(u.userId, u.tenantId))
    );

    const updated = await basePrisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    });
    return reply.send({ success: true, data: updated });
  });

  // ── Add a single permission to a role ─────────────────────────────────────
  fastify.post("/:id/permissions", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = z.object({ permissionId: z.string() }).safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const [role, perm] = await Promise.all([
      basePrisma.role.findUnique({ where: { id } }),
      basePrisma.permission.findUnique({ where: { id: body.data.permissionId } }),
    ]);
    if (!role) throw new NotFoundError("Role", id);
    if (!perm) throw new NotFoundError("Permission", body.data.permissionId);

    await basePrisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: id, permissionId: perm.id } },
      update: {},
      create: { roleId: id, permissionId: perm.id, grantedBy: (req as any).userId },
    });

    const affectedUsers = await basePrisma.userRole.findMany({
      where: { roleId: id },
      select: { userId: true, tenantId: true },
    });
    await Promise.all(
      affectedUsers.map(u => invalidatePermissionCache(u.userId, u.tenantId))
    );

    return reply.status(201).send({ success: true, message: "Permission added" });
  });

  // ── Remove a single permission from a role ────────────────────────────────
  fastify.delete("/:id/permissions/:permId", { preHandler: [requireTenantAdmin()] }, async (req, reply) => {
    const { id, permId } = req.params as { id: string; permId: string };

    const isSuperAdmin = (req as any).isSuperAdmin;
    const role = await basePrisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundError("Role", id);
    if (role.isSystem && !isSuperAdmin) throw new ForbiddenError("Cannot modify system role permissions directly");

    await basePrisma.rolePermission.deleteMany({
      where: { roleId: id, permissionId: permId },
    });

    const affectedUsers = await basePrisma.userRole.findMany({
      where: { roleId: id },
      select: { userId: true, tenantId: true },
    });
    await Promise.all(
      affectedUsers.map(u => invalidatePermissionCache(u.userId, u.tenantId))
    );

    return reply.status(204).send();
  });

  // ── List users assigned to a role ─────────────────────────────────────────
  fastify.get("/:id/users", { preHandler: [authorize("role:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { page = 1, limit = 20 } = req.query as any;

    const role = await basePrisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundError("Role", id);

    const skip = (Number(page) - 1) * Number(limit);
    const [total, userRoles] = await Promise.all([
      basePrisma.userRole.count({ where: { roleId: id } }),
      basePrisma.userRole.findMany({
        where: { roleId: id },
        skip,
        take: Number(limit),
        include: {
          user: {
            select: {
              id: true, firstName: true, lastName: true,
              email: true, status: true, avatarUrl: true, jobTitle: true,
            },
          },
        },
      }),
    ]);

    return reply.send({
      success: true,
      data: userRoles.map(ur => ({ ...ur.user, assignedAt: ur.assignedAt })),
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  });

  // ── Permission list grouped by resource (for UI permission matrix) ────────
  fastify.get("/permissions/grouped", { preHandler: [authorize("role:read")] }, async (_req, reply) => {
    const permissions = await basePrisma.permission.findMany({
      orderBy: [{ resource: "asc" }, { action: "asc" }],
    });

    const grouped = permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = [];
      acc[p.resource].push(p);
      return acc;
    }, {});

    return reply.send({ success: true, data: grouped });
  });
}
