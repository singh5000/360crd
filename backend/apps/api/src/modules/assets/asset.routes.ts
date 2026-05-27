import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma, basePrisma } from "@360crd/database";
import { z } from "zod";
import { ValidationError, NotFoundError } from "../../shared/errors/http.errors";
import { AuditLogService } from "../audit-logs/audit-log.service";

const auditLog = new AuditLogService();

const CreateAssetDto = z.object({
  siteId: z.string().optional(),
  customerId: z.string().optional(),
  name: z.string().min(1).max(300).trim(),
  assetTag: z.string().optional(),
  category: z.string().min(1),
  type: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  purchaseCost: z.number().optional(),
  warrantyExpiry: z.string().datetime().optional(),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR", "DAMAGED"]).default("GOOD"),
  location: z.string().optional(),
  department: z.string().optional(),
  nextServiceDate: z.string().datetime().optional(),
  qrCode: z.string().optional(),
  photoUrl: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const ListAssetDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.string().optional(),
  category: z.string().optional(),
  siteId: z.string().optional(),
  customerId: z.string().optional(),
  search: z.string().optional(),
  serviceOverdue: z.coerce.boolean().optional(),
});

export default async function assetRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── Stats ──────────────────────────────────────────────────────────────────
  fastify.get("/stats", { preHandler: [authorize("asset:read")] }, async (req, reply) => {
    const r = req as any;
    const { customerId } = req.query as any;

    let siteFilter: any = {};
    if (customerId) {
      const customerSites = await prisma.site.findMany({ where: { tenantId: r.tenantId, customerId }, select: { id: true } });
      siteFilter = { siteId: { in: customerSites.map((s: any) => s.id) } };
    }

    const base = { tenantId: r.tenantId, deletedAt: null, ...siteFilter };
    const [total, byStatus, byCondition, serviceOverdue] = await Promise.all([
      prisma.asset.count({ where: base }),
      prisma.asset.groupBy({ by: ["status"], where: base, _count: true }),
      prisma.asset.groupBy({ by: ["condition"], where: base, _count: true }),
      prisma.asset.count({
        where: { ...base, nextServiceDate: { lt: new Date() }, status: { not: "DISPOSED" as any } },
      }),
    ]);
    return reply.send({
      success: true,
      data: {
        total,
        serviceOverdue,
        byStatus: byStatus.reduce((a: any, r) => { a[r.status] = r._count; return a; }, {}),
        byCondition: byCondition.reduce((a: any, r) => { a[r.condition] = r._count; return a; }, {}),
      },
    });
  });

  // ── List assets ────────────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("asset:read")] }, async (req, reply) => {
    const r = req as any;
    const q = ListAssetDto.safeParse(req.query);
    if (!q.success) throw new ValidationError("Invalid query", q.error.errors);
    const { page, limit, status, category, siteId, search, serviceOverdue } = q.data;
    const customerId = q.data.customerId ?? (r.userType === "CUSTOMER" ? r.customerId : undefined);

    let siteFilter: any = siteId ? { siteId } : {};
    if (customerId && !siteId) {
      const customerSites = await prisma.site.findMany({ where: { tenantId: r.tenantId, customerId }, select: { id: true } });
      siteFilter = { siteId: { in: customerSites.map((s: any) => s.id) } };
    }

    const where: any = {
      tenantId: r.tenantId,
      deletedAt: null,
      ...siteFilter,
      ...(status && { status }),
      ...(category && { category }),
      ...(serviceOverdue && { nextServiceDate: { lt: new Date() } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { assetTag: { contains: search, mode: "insensitive" } },
          { serialNumber: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.asset.count({ where }),
      prisma.asset.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          site: { select: { id: true, name: true, customerId: true, customer: { select: { id: true, name: true } } } },
          assignments: {
            where: { returnedAt: null },
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
          },
        },
      }),
    ]);
    return reply.send({ success: true, data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  // ── Create asset ───────────────────────────────────────────────────────────
  fastify.post("/", { preHandler: [authorize("asset:create")] }, async (req, reply) => {
    const r = req as any;
    const body = CreateAssetDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const asset = await prisma.asset.create({
      data: {
        ...body.data,
        tenantId: r.tenantId,
        status: "OPERATIONAL" as any,
        condition: body.data.condition as any,
        purchaseDate: body.data.purchaseDate ? new Date(body.data.purchaseDate) : undefined,
        warrantyExpiry: body.data.warrantyExpiry ? new Date(body.data.warrantyExpiry) : undefined,
        nextServiceDate: body.data.nextServiceDate ? new Date(body.data.nextServiceDate) : undefined,
        purchaseCost: body.data.purchaseCost as any,
        metadata: body.data.metadata as any,
      },
    });

    await auditLog.log({ tenantId: r.tenantId, userId: r.userId, action: "CREATE", resource: "asset", resourceId: asset.id, after: { name: asset.name, category: asset.category } });
    return reply.status(201).send({ success: true, data: asset });
  });

  // ── Get asset detail ───────────────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("asset:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const asset = await prisma.asset.findFirst({
      where: { id, tenantId: r.tenantId, deletedAt: null },
      include: {
        site: true,
        assignments: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
          orderBy: { assignedAt: "desc" },
        },
      },
    });
    if (!asset) throw new NotFoundError("Asset", id);
    return reply.send({ success: true, data: asset });
  });

  // ── Update asset ───────────────────────────────────────────────────────────
  fastify.patch("/:id", { preHandler: [authorize("asset:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = CreateAssetDto.partial().extend({
      status: z.enum(["OPERATIONAL", "UNDER_MAINTENANCE", "DECOMMISSIONED", "LOST"]).optional(),
      lastServiceDate: z.string().datetime().optional(),
    }).safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const existing = await prisma.asset.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Asset", id);

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        ...body.data,
        condition: body.data.condition as any,
        status: body.data.status as any,
        purchaseDate: body.data.purchaseDate ? new Date(body.data.purchaseDate) : undefined,
        warrantyExpiry: body.data.warrantyExpiry ? new Date(body.data.warrantyExpiry) : undefined,
        nextServiceDate: body.data.nextServiceDate ? new Date(body.data.nextServiceDate) : undefined,
        lastServiceDate: (body.data as any).lastServiceDate ? new Date((body.data as any).lastServiceDate) : undefined,
        purchaseCost: body.data.purchaseCost as any,
        metadata: body.data.metadata as any,
      },
    });
    return reply.send({ success: true, data: asset });
  });

  // ── Delete (decommission) asset ────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("asset:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const existing = await prisma.asset.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Asset", id);
    await prisma.asset.update({ where: { id }, data: { deletedAt: new Date(), status: "DISPOSED" as any } });
    return reply.status(204).send();
  });

  // ── Assign asset ───────────────────────────────────────────────────────────
  fastify.post("/:id/assign", { preHandler: [authorize("asset:assign")] }, async (req, reply) => {
    const { id: assetId } = req.params as { id: string };
    const r = req as any;
    const { userId, notes } = req.body as any;
    if (!userId) throw new ValidationError("userId is required", []);

    const asset = await prisma.asset.findFirst({ where: { id: assetId, tenantId: r.tenantId, deletedAt: null } });
    if (!asset) throw new NotFoundError("Asset", assetId);

    // Return any open assignment
    await basePrisma.assetAssignment.updateMany({
      where: { assetId, returnedAt: null },
      data: { returnedAt: new Date() },
    });

    const assignment = await basePrisma.assetAssignment.create({
      data: { tenantId: r.tenantId, assetId, userId, notes },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });

    return reply.status(201).send({ success: true, data: assignment });
  });

  // ── Return asset ───────────────────────────────────────────────────────────
  fastify.post("/:id/return", { preHandler: [authorize("asset:assign")] }, async (req, reply) => {
    const { id: assetId } = req.params as { id: string };
    const r = req as any;
    const { notes } = req.body as any;

    const asset = await prisma.asset.findFirst({ where: { id: assetId, tenantId: r.tenantId } });
    if (!asset) throw new NotFoundError("Asset", assetId);

    await basePrisma.assetAssignment.updateMany({
      where: { assetId, returnedAt: null },
      data: { returnedAt: new Date(), notes },
    });

    return reply.send({ success: true });
  });

  // ── Assignment history ─────────────────────────────────────────────────────
  fastify.get("/:id/assignments", { preHandler: [authorize("asset:read")] }, async (req, reply) => {
    const { id: assetId } = req.params as { id: string };
    const r = req as any;
    const asset = await prisma.asset.findFirst({ where: { id: assetId, tenantId: r.tenantId } });
    if (!asset) throw new NotFoundError("Asset", assetId);
    const assignments = await basePrisma.assetAssignment.findMany({
      where: { assetId },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { assignedAt: "desc" },
    });
    return reply.send({ success: true, data: assignments });
  });

  // ── Log service ────────────────────────────────────────────────────────────
  fastify.post("/:id/service", { preHandler: [authorize("asset:update")] }, async (req, reply) => {
    const { id: assetId } = req.params as { id: string };
    const r = req as any;
    const { nextServiceDate, notes } = req.body as any;

    const asset = await prisma.asset.findFirst({ where: { id: assetId, tenantId: r.tenantId, deletedAt: null } });
    if (!asset) throw new NotFoundError("Asset", assetId);

    const updated = await prisma.asset.update({
      where: { id: assetId },
      data: {
        lastServiceDate: new Date(),
        nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined,
        status: "OPERATIONAL" as any,
      },
    });

    await auditLog.log({ tenantId: r.tenantId, userId: r.userId, action: "UPDATE", resource: "asset", resourceId: assetId, after: { serviceLogged: true, notes } });
    return reply.send({ success: true, data: updated });
  });
}
