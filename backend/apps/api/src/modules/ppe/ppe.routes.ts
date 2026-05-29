import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma, basePrisma } from "@360crd/database";
import { z } from "zod";
import { ValidationError, NotFoundError } from "../../shared/errors/http.errors";
import { AuditLogService } from "../audit-logs/audit-log.service";
import { notificationQueue } from "@360crd/queue";

const auditLog = new AuditLogService();

const CreatePPEDto = z.object({
  name: z.string().min(1).max(200).trim(),
  category: z.string().min(1),
  type: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  condition: z.string().optional(),
  storageLocation: z.string().optional(),
  photoUrl: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const AssignPPEDto = z.object({
  userId: z.string(),
  notes: z.string().optional(),
});

const ListPPEDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  expiringBefore: z.string().optional(),
});

export default async function ppeRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── Stats ──────────────────────────────────────────────────────────────────
  fastify.get("/stats", { preHandler: [authorize("ppe:read")] }, async (req, reply) => {
    const r = req as any;
    const [total, byStatus, expiringSoon] = await Promise.all([
      prisma.pPEItem.count({ where: { tenantId: r.tenantId } }),
      prisma.pPEItem.groupBy({ by: ["status"], where: { tenantId: r.tenantId }, _count: true }),
      prisma.pPEItem.count({
        where: {
          tenantId: r.tenantId,
          expiryDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          status: { not: "DISPOSED" as any },
        },
      }),
    ]);
    return reply.send({
      success: true,
      data: {
        total,
        expiringSoon,
        byStatus: byStatus.reduce((a: any, r) => { a[r.status] = r._count; return a; }, {}),
      },
    });
  });

  // ── List PPE items ─────────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("ppe:read")] }, async (req, reply) => {
    const r = req as any;
    const q = ListPPEDto.safeParse(req.query);
    if (!q.success) throw new ValidationError("Invalid query", q.error.errors);
    const { page, limit, status, category, search, expiringBefore } = q.data;

    const where: any = {
      tenantId: r.tenantId,
      ...(status && { status }),
      ...(category && { category }),
      ...(expiringBefore && { expiryDate: { lte: new Date(expiringBefore) } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { serialNumber: { contains: search, mode: "insensitive" } },
          { manufacturer: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.pPEItem.count({ where }),
      prisma.pPEItem.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          assignments: {
            where: { returnedAt: null },
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
          },
        },
      }),
    ]);
    return reply.send({ success: true, data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  // ── Create PPE item ────────────────────────────────────────────────────────
  fastify.post("/", { preHandler: [authorize("ppe:create")] }, async (req, reply) => {
    const r = req as any;
    const body = CreatePPEDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const ppe = await prisma.pPEItem.create({
      data: {
        ...body.data,
        tenantId: r.tenantId,
        status: "AVAILABLE" as any,
        purchaseDate: body.data.purchaseDate ? new Date(body.data.purchaseDate) : undefined,
        expiryDate: body.data.expiryDate ? new Date(body.data.expiryDate) : undefined,
        metadata: body.data.metadata as any,
      },
    });

    await auditLog.log({ tenantId: r.tenantId, userId: r.userId, action: "CREATE", resource: "ppe", resourceId: ppe.id, after: { name: ppe.name, category: ppe.category } });
    return reply.status(201).send({ success: true, data: ppe });
  });

  // ── Get PPE item ───────────────────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("ppe:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const ppe = await prisma.pPEItem.findFirst({
      where: r.isSuperAdmin ? { id } : { id, tenantId: r.tenantId },
      include: {
        assignments: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
          orderBy: { assignedAt: "desc" },
        },
      },
    });
    if (!ppe) throw new NotFoundError("PPE Item", id);
    return reply.send({ success: true, data: ppe });
  });

  // ── Update PPE item ────────────────────────────────────────────────────────
  fastify.patch("/:id", { preHandler: [authorize("ppe:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = CreatePPEDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const existing = await prisma.pPEItem.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!existing) throw new NotFoundError("PPE Item", id);

    const ppe = await prisma.pPEItem.update({
      where: { id },
      data: {
        ...body.data,
        purchaseDate: body.data.purchaseDate ? new Date(body.data.purchaseDate) : undefined,
        expiryDate: body.data.expiryDate ? new Date(body.data.expiryDate) : undefined,
        metadata: body.data.metadata as any,
      },
    });
    return reply.send({ success: true, data: ppe });
  });

  // ── Delete (dispose) PPE item ──────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("ppe:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const existing = await prisma.pPEItem.findFirst({
      where: r.isSuperAdmin ? { id } : { id, tenantId: r.tenantId },
    });
    if (!existing) throw new NotFoundError("PPE Item", id);
    await prisma.pPEItem.update({ where: { id }, data: { status: "DISPOSED" as any } });
    return reply.status(204).send();
  });

  // ── Assign PPE ─────────────────────────────────────────────────────────────
  fastify.post("/:id/assign", { preHandler: [authorize("ppe:assign")] }, async (req, reply) => {
    const { id: ppeItemId } = req.params as { id: string };
    const r = req as any;
    const body = AssignPPEDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const ppe = await prisma.pPEItem.findFirst({ where: { id: ppeItemId, tenantId: r.tenantId } });
    if (!ppe) throw new NotFoundError("PPE Item", ppeItemId);

    // Close any open assignment first
    await basePrisma.pPEAssignment.updateMany({
      where: { ppeItemId, returnedAt: null },
      data: { returnedAt: new Date() },
    });

    const [assignment] = await Promise.all([
      basePrisma.pPEAssignment.create({
        data: { tenantId: r.tenantId, ppeItemId, userId: body.data.userId, notes: body.data.notes },
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
      }),
      prisma.pPEItem.update({ where: { id: ppeItemId }, data: { status: "ASSIGNED" as any } }),
    ]);

    notificationQueue.add("ppe-assigned", {
      tenantId: r.tenantId,
      userId: body.data.userId,
      type: "ppe_assigned",
      title: "PPE Assigned to You",
      message: `${ppe.name} (${ppe.category}) has been assigned to you.`,
      channel: "in-app",
      data: { ppeItemId, assignmentId: assignment.id },
    }).catch(() => {});

    return reply.status(201).send({ success: true, data: assignment });
  });

  // ── Return PPE ─────────────────────────────────────────────────────────────
  fastify.post("/:id/return", { preHandler: [authorize("ppe:assign")] }, async (req, reply) => {
    const { id: ppeItemId } = req.params as { id: string };
    const r = req as any;
    const { condition, notes } = req.body as any;

    const ppe = await prisma.pPEItem.findFirst({ where: { id: ppeItemId, tenantId: r.tenantId } });
    if (!ppe) throw new NotFoundError("PPE Item", ppeItemId);

    await basePrisma.pPEAssignment.updateMany({
      where: { ppeItemId, returnedAt: null },
      data: { returnedAt: new Date(), condition, notes },
    });

    await prisma.pPEItem.update({
      where: { id: ppeItemId },
      data: { status: "AVAILABLE" as any, condition },
    });

    return reply.send({ success: true });
  });

  // ── Assignment history ─────────────────────────────────────────────────────
  fastify.get("/:id/assignments", { preHandler: [authorize("ppe:read")] }, async (req, reply) => {
    const { id: ppeItemId } = req.params as { id: string };
    const r = req as any;
    const ppe = await prisma.pPEItem.findFirst({ where: { id: ppeItemId, tenantId: r.tenantId } });
    if (!ppe) throw new NotFoundError("PPE Item", ppeItemId);
    const assignments = await basePrisma.pPEAssignment.findMany({
      where: { ppeItemId },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { assignedAt: "desc" },
    });
    return reply.send({ success: true, data: assignments });
  });

  // ── My PPE ─────────────────────────────────────────────────────────────────
  fastify.get("/my-ppe", { preHandler: [authorize("ppe:read")] }, async (req, reply) => {
    const r = req as any;
    const assignments = await basePrisma.pPEAssignment.findMany({
      where: { userId: r.userId, returnedAt: null },
      include: { ppeItem: true },
      orderBy: { assignedAt: "desc" },
    });
    return reply.send({ success: true, data: assignments });
  });
}
