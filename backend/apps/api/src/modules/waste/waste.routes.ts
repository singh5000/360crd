import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma } from "@360crd/database";
import { z } from "zod";
import { ValidationError, NotFoundError } from "../../shared/errors/http.errors";
import { AuditLogService } from "../audit-logs/audit-log.service";
import { notificationQueue } from "@360crd/queue";

const auditLog = new AuditLogService();

const CreateWasteDto = z.object({
  siteId: z.string().optional(),
  customerId: z.string().optional(),
  category: z.string().min(1),
  type: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  disposalMethod: z.string().optional(),
  contractor: z.string().optional(),
  manifestNumber: z.string().optional(),
  disposedAt: z.string().datetime(),
  cost: z.number().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const ListWasteDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.string().optional(),
  category: z.string().optional(),
  siteId: z.string().optional(),
  customerId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

export default async function wasteRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── Stats ──────────────────────────────────────────────────────────────────
  fastify.get("/stats", { preHandler: [authorize("waste:read")] }, async (req, reply) => {
    const r = req as any;
    const { dateFrom, dateTo, customerId } = req.query as any;

    let siteFilter: any = {};
    if (customerId) {
      const customerSites = await prisma.site.findMany({ where: { tenantId: r.tenantId, customerId }, select: { id: true } });
      siteFilter = { siteId: { in: customerSites.map((s: any) => s.id) } };
    }

    const where: any = {
      tenantId: r.tenantId,
      ...siteFilter,
      ...(dateFrom || dateTo
        ? { disposedAt: { ...(dateFrom && { gte: new Date(dateFrom) }), ...(dateTo && { lte: new Date(dateTo) }) } }
        : {}),
    };

    const [total, byCategory, byStatus, aggregates] = await Promise.all([
      prisma.wasteRecord.count({ where }),
      prisma.wasteRecord.groupBy({ by: ["category"], where, _count: true }),
      prisma.wasteRecord.groupBy({ by: ["status"], where, _count: true }),
      prisma.wasteRecord.aggregate({ where, _sum: { quantity: true, cost: true } }),
    ]);

    return reply.send({
      success: true,
      data: {
        total,
        totalQuantity: aggregates._sum.quantity,
        totalCost: aggregates._sum.cost,
        byCategory: byCategory.reduce((a: any, r) => { a[r.category] = r._count; return a; }, {}),
        byStatus: byStatus.reduce((a: any, r) => { a[r.status] = r._count; return a; }, {}),
      },
    });
  });

  // ── List waste records ─────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("waste:read")] }, async (req, reply) => {
    const r = req as any;
    const q = ListWasteDto.safeParse(req.query);
    if (!q.success) throw new ValidationError("Invalid query", q.error.errors);
    const { page, limit, status, category, siteId, dateFrom, dateTo, search } = q.data;
    const customerId = q.data.customerId ?? (r.userType === "CUSTOMER" ? r.customerId : undefined);

    let siteFilter: any = siteId ? { siteId } : {};
    if (customerId && !siteId) {
      const customerSites = await prisma.site.findMany({ where: { tenantId: r.tenantId, customerId }, select: { id: true } });
      siteFilter = { siteId: { in: customerSites.map((s: any) => s.id) } };
    }

    const where: any = {
      tenantId: r.tenantId,
      ...siteFilter,
      ...(status && { status }),
      ...(category && { category }),
      ...(dateFrom || dateTo
        ? { disposedAt: { ...(dateFrom && { gte: new Date(dateFrom) }), ...(dateTo && { lte: new Date(dateTo) }) } }
        : {}),
      ...(search && {
        OR: [
          { category: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { manifestNumber: { contains: search, mode: "insensitive" } },
          { contractor: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.wasteRecord.count({ where }),
      prisma.wasteRecord.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { disposedAt: "desc" },
        include: { site: { select: { id: true, name: true, customerId: true, customer: { select: { id: true, name: true } } } } },
      }),
    ]);
    return reply.send({ success: true, data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  // ── Create waste record ────────────────────────────────────────────────────
  fastify.post("/", { preHandler: [authorize("waste:create")] }, async (req, reply) => {
    const r = req as any;
    const body = CreateWasteDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const record = await prisma.wasteRecord.create({
      data: {
        ...body.data,
        tenantId: r.tenantId,
        createdById: r.userId,
        status: "PENDING" as any,
        disposedAt: new Date(body.data.disposedAt),
        quantity: body.data.quantity as any,
        cost: body.data.cost as any,
        metadata: body.data.metadata as any,
      },
      include: { site: { select: { id: true, name: true } } },
    });

    await auditLog.log({ tenantId: r.tenantId, userId: r.userId, action: "CREATE", resource: "waste", resourceId: record.id, after: { category: record.category, quantity: body.data.quantity, unit: record.unit } });

    notificationQueue.add("waste-created", {
      tenantId: r.tenantId,
      userId: r.userId,
      type: "waste_created",
      title: "Waste Record Logged",
      message: `A new waste record (${body.data.category}, ${body.data.quantity} ${body.data.unit}) has been logged and is pending review.`,
      channel: "in-app",
      data: { wasteRecordId: record.id },
    }).catch(() => {});

    return reply.status(201).send({ success: true, data: record });
  });

  // ── Get waste record ───────────────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("waste:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const record = await prisma.wasteRecord.findFirst({
      where: { id, tenantId: r.tenantId },
      include: { site: { select: { id: true, name: true } } },
    });
    if (!record) throw new NotFoundError("Waste Record", id);
    return reply.send({ success: true, data: record });
  });

  // ── Update waste record ────────────────────────────────────────────────────
  fastify.patch("/:id", { preHandler: [authorize("waste:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = CreateWasteDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const existing = await prisma.wasteRecord.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!existing) throw new NotFoundError("Waste Record", id);

    const record = await prisma.wasteRecord.update({
      where: { id },
      data: {
        ...body.data,
        disposedAt: body.data.disposedAt ? new Date(body.data.disposedAt) : undefined,
        quantity: body.data.quantity as any,
        cost: body.data.cost as any,
        metadata: body.data.metadata as any,
      },
    });
    return reply.send({ success: true, data: record });
  });

  // ── Update status (approve/dispose) ───────────────────────────────────────
  fastify.put("/:id/status", { preHandler: [authorize("waste:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const { status } = req.body as { status: string };

    const existing = await prisma.wasteRecord.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!existing) throw new NotFoundError("Waste Record", id);

    const record = await prisma.wasteRecord.update({ where: { id }, data: { status: status as any } });
    return reply.send({ success: true, data: record });
  });

  // ── Delete waste record ────────────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("waste:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const existing = await prisma.wasteRecord.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!existing) throw new NotFoundError("Waste Record", id);
    await prisma.wasteRecord.delete({ where: { id } });
    return reply.status(204).send();
  });
}
