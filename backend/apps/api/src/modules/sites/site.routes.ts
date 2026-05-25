import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma, basePrisma } from "@360crd/database";
import { SiteRepository } from "./site.repository";
import { CreateSiteDto, UpdateSiteDto, ListSitesDto } from "./site.dto";
import { ValidationError, NotFoundError, ForbiddenError } from "../../shared/errors/http.errors";
import { AuditLogService } from "../audit-logs/audit-log.service";
import { assertSiteLimit } from "../../shared/tenant-limits";
import { UserRepository } from "../users/user.repository";

const repo = new SiteRepository();
const userRepo = new UserRepository();
const auditLog = new AuditLogService();

export default async function siteRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── List sites ────────────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("site:read")] }, async (req, reply) => {
    const r = req as any;
    const query = ListSitesDto.safeParse(req.query);
    if (!query.success) throw new ValidationError("Invalid query", query.error.errors);

    // Managers + Staff only see their assigned sites
    let restrictToSiteIds: string[] | undefined;
    if (!r.isSuperAdmin && ["MANAGER", "STAFF"].includes(r.userType)) {
      const userSites = await userRepo.getUserSites(r.userId);
      if (userSites.length > 0) {
        restrictToSiteIds = userSites.map((s: any) => s.siteId);
      }
    }

    const result = await repo.findMany(r.tenantId, query.data, restrictToSiteIds);
    return reply.send({ success: true, ...result });
  });

  // ── Create site ───────────────────────────────────────────────────────────
  fastify.post("/", { preHandler: [authorize("site:create")] }, async (req, reply) => {
    const body = CreateSiteDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const r = req as any;
    await assertSiteLimit(r.tenantId);

    const site = await repo.create(r.tenantId, body.data);

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "CREATE",
      resource: "site", resourceId: site.id,
      after: { name: site.name, type: site.type }, ipAddress: req.ip,
    });

    return reply.status(201).send({ success: true, data: site });
  });

  // ── Get site detail ───────────────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("site:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    // Manager/Staff can only see their assigned sites
    if (!r.isSuperAdmin && ["MANAGER", "STAFF"].includes(r.userType)) {
      const userSites = await userRepo.getUserSites(r.userId);
      const allowed = userSites.some((s: any) => s.siteId === id);
      if (!allowed) throw new ForbiddenError("You are not assigned to this site");
    }

    return reply.send({ success: true, data: site });
  });

  // ── Update site ───────────────────────────────────────────────────────────
  fastify.patch("/:id", { preHandler: [authorize("site:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = UpdateSiteDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Site", id);

    const site = await repo.update(id, body.data);
    const r = req as any;

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "UPDATE",
      resource: "site", resourceId: id,
      before: { name: existing.name, status: existing.status },
      after: body.data, ipAddress: req.ip,
    });

    return reply.send({ success: true, data: site });
  });

  // ── Delete site ───────────────────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("site:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Site", id);

    await repo.softDelete(id);
    const r = req as any;

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "DELETE",
      resource: "site", resourceId: id,
      before: { name: existing.name }, ipAddress: req.ip,
    });

    return reply.status(204).send();
  });

  // ── Assign customer to site ───────────────────────────────────────────────
  fastify.put("/:id/customer", { preHandler: [authorize("site:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { customerId } = req.body as { customerId: string | null };

    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Site", id);

    if (customerId) {
      const customer = await basePrisma.customer.findFirst({
        where: { id: customerId, tenantId: (req as any).tenantId, deletedAt: null },
      });
      if (!customer) throw new NotFoundError("Customer", customerId);
    }

    const site = await repo.update(id, { customerId: customerId ?? undefined });
    return reply.send({ success: true, data: site });
  });

  // ── Staff management ──────────────────────────────────────────────────────
  fastify.get("/:id/staff", { preHandler: [authorize("site:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    const staff = await repo.getStaff(id);
    return reply.send({ success: true, data: staff.map((s: any) => s.user) });
  });

  fastify.put("/:id/staff", { preHandler: [authorize("site:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { userIds } = req.body as { userIds: string[] };
    if (!Array.isArray(userIds)) throw new ValidationError("userIds must be an array", []);

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    await repo.assignStaff(id, userIds);
    const r = req as any;

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "ASSIGN_STAFF",
      resource: "site", resourceId: id,
      after: { userIds }, ipAddress: req.ip,
    });

    return reply.send({ success: true, message: `${userIds.length} staff assigned` });
  });

  fastify.post("/:id/staff/:userId", { preHandler: [authorize("site:update")] }, async (req, reply) => {
    const { id, userId } = req.params as { id: string; userId: string };

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    const user = await basePrisma.user.findFirst({
      where: { id: userId, tenantId: (req as any).tenantId, deletedAt: null },
    });
    if (!user) throw new NotFoundError("User", userId);

    await repo.addStaffMember(id, userId);
    return reply.status(201).send({ success: true, message: "Staff member added to site" });
  });

  fastify.delete("/:id/staff/:userId", { preHandler: [authorize("site:update")] }, async (req, reply) => {
    const { id, userId } = req.params as { id: string; userId: string };
    await repo.removeStaffMember(id, userId);
    return reply.status(204).send();
  });

  // ── Documents ─────────────────────────────────────────────────────────────
  fastify.get("/:id/documents", { preHandler: [authorize("site:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    const docs = await repo.getDocuments(r.tenantId, id);
    return reply.send({ success: true, data: docs });
  });

  fastify.post("/:id/documents", { preHandler: [authorize("document:create")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = req.body as any;

    if (!body?.fileUrl || !body?.filename) {
      throw new ValidationError("fileUrl and filename are required", []);
    }

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    const doc = await basePrisma.document.create({
      data: {
        tenantId: r.tenantId,
        uploadedById: r.userId,
        title: body.title || body.filename,
        filename: body.filename,
        fileUrl: body.fileUrl,
        storageKey: body.storageKey,
        fileSize: body.fileSize,
        mimeType: body.mimeType,
        category: body.category || "SITE_DOCUMENT",
        tags: [`site:${id}`, ...(body.tags || [])],
        status: "PUBLISHED",
        description: body.description,
      },
      select: {
        id: true, title: true, filename: true,
        fileUrl: true, category: true, status: true, createdAt: true,
      },
    });

    return reply.status(201).send({ success: true, data: doc });
  });

  // ── Activity timeline ─────────────────────────────────────────────────────
  fastify.get("/:id/activity", { preHandler: [authorize("site:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const { limit = 50 } = req.query as any;

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    const timeline = await repo.getActivity(r.tenantId, id, Number(limit));
    return reply.send({ success: true, data: timeline });
  });

  // ── Compliance score ──────────────────────────────────────────────────────
  fastify.get("/:id/compliance", { preHandler: [authorize("site:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    const compliance = await repo.getCompliance(r.tenantId, id);
    return reply.send({ success: true, data: compliance });
  });

  // ── Site audits ───────────────────────────────────────────────────────────
  fastify.get("/:id/audits", { preHandler: [authorize("audit:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { page = 1, limit = 20, status } = req.query as any;

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { siteId: id, deletedAt: null, ...(status && { status }) };

    const [total, data] = await Promise.all([
      prisma.audit.count({ where }),
      prisma.audit.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: "desc" },
        select: {
          id: true, refNumber: true, title: true, type: true,
          status: true, score: true, percentage: true, passed: true,
          scheduledAt: true, dueDate: true, completedAt: true, createdAt: true,
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
          template: { select: { id: true, name: true } },
        },
      }),
    ]);

    return reply.send({ success: true, data, meta: { total, page: Number(page), limit: Number(limit) } });
  });

  // ── Site incidents ────────────────────────────────────────────────────────
  fastify.get("/:id/incidents", { preHandler: [authorize("incident:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { page = 1, limit = 20, status, severity } = req.query as any;

    const site = await repo.findById(id);
    if (!site) throw new NotFoundError("Site", id);

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {
      siteId: id, deletedAt: null,
      ...(status && { status }),
      ...(severity && { severity }),
    };

    const [total, data] = await Promise.all([
      prisma.incident.count({ where }),
      prisma.incident.findMany({
        where, skip, take: Number(limit),
        orderBy: { occurredAt: "desc" },
        select: {
          id: true, refNumber: true, title: true, type: true,
          severity: true, status: true, priority: true,
          occurredAt: true, reportedAt: true, closedAt: true,
          reportedBy: { select: { id: true, firstName: true, lastName: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
    ]);

    return reply.send({ success: true, data, meta: { total, page: Number(page), limit: Number(limit) } });
  });
}
