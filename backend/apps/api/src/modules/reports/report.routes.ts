import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma } from "@360crd/database";
import { reportQueue } from "@360crd/queue";
import { ValidationError, NotFoundError } from "../../shared/errors/http.errors";
import { generateReportPdf } from "./pdf.helper";

const RequestReportDto = z.object({
  title: z.string().min(3),
  type: z.enum(["INCIDENT_SUMMARY", "AUDIT_SUMMARY", "TRAINING_COMPLETION", "PPE_INVENTORY", "WASTE_SUMMARY", "COMPLIANCE_STATUS", "CUSTOM"]),
  parameters: z.record(z.unknown()).default({}),
  filters: z.record(z.unknown()).default({}),
});

export default async function reportRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── Dashboard overview ─────────────────────────────────────────────────────
  fastify.get("/dashboard", { preHandler: [authorize("report:read")] }, async (req, reply) => {
    const r = req as any;
    const tenantId = r.tenantId;
    const now = new Date();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      incidentTotal, incidentOpen, incidentThisMonth,
      auditTotal, auditCompleted, auditPassed,
      trainingEnrollments, trainingCompleted,
      openCapas, overdueAudits, overdueCapas,
    ] = await Promise.all([
      prisma.incident.count({ where: { tenantId, deletedAt: null } }),
      prisma.incident.count({ where: { tenantId, deletedAt: null, status: { notIn: ["CLOSED", "CANCELLED"] } } }),
      prisma.incident.count({ where: { tenantId, deletedAt: null, occurredAt: { gte: thirtyDaysAgo } } }),

      prisma.audit.count({ where: { tenantId, deletedAt: null } }),
      prisma.audit.count({ where: { tenantId, deletedAt: null, status: { in: ["COMPLETED", "REVIEWED"] } } }),
      prisma.audit.count({ where: { tenantId, deletedAt: null, passed: true } }),

      prisma.trainingEnrollment.count({ where: { tenantId } }),
      prisma.trainingEnrollment.count({ where: { tenantId, status: "COMPLETED" } }),

      prisma.incidentCAPA.count({ where: { tenantId, status: { notIn: ["COMPLETED", "VERIFIED", "CANCELLED"] } } }),
      prisma.audit.count({
        where: { tenantId, deletedAt: null, status: { notIn: ["COMPLETED", "REVIEWED", "ARCHIVED", "CANCELLED"] }, dueDate: { lt: now } },
      }),
      prisma.incidentCAPA.count({
        where: { tenantId, status: { notIn: ["COMPLETED", "VERIFIED", "CANCELLED"] }, dueDate: { lt: now } },
      }),
    ]);

    const complianceScore = auditCompleted > 0 ? Math.round((auditPassed / auditCompleted) * 100) : 0;

    return reply.send({
      success: true,
      data: {
        incidents: { total: incidentTotal, open: incidentOpen, thisMonth: incidentThisMonth },
        audits: { total: auditTotal, completed: auditCompleted, passed: auditPassed, complianceScore },
        training: { enrolled: trainingEnrollments, completed: trainingCompleted, completionRate: trainingEnrollments > 0 ? Math.round((trainingCompleted / trainingEnrollments) * 100) : 0 },
        actions: { openCapas, overdueAudits, overdueCapas },
      },
    });
  });

  // ── Compliance trend ───────────────────────────────────────────────────────
  fastify.get("/compliance-trend", { preHandler: [authorize("report:read")] }, async (req, reply) => {
    const r = req as any;
    const { months = 6 } = req.query as any;
    const tenantId = r.tenantId;

    const data = await prisma.audit.findMany({
      where: { tenantId, deletedAt: null, percentage: { not: null } },
      select: { completedAt: true, percentage: true, passed: true },
      orderBy: { completedAt: "desc" },
      take: Number(months) * 20,
    });

    return reply.send({ success: true, data });
  });

  // ── List reports ───────────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("report:read")] }, async (req, reply) => {
    const r = req as any;
    const { page = 1, limit = 20 } = req.query as any;
    const [total, data] = await Promise.all([
      prisma.report.count({ where: { tenantId: r.tenantId } }),
      prisma.report.findMany({
        where: { tenantId: r.tenantId },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
    ]);
    return reply.send({ success: true, data, meta: { total } });
  });

  // ── Request report generation ──────────────────────────────────────────────
  fastify.post("/", { preHandler: [authorize("report:export")] }, async (req, reply) => {
    const body = RequestReportDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const r = req as any;
    const report = await prisma.report.create({
      data: {
        tenantId: r.tenantId,
        title: body.data.title,
        type: body.data.type as any,
        status: "PENDING",
        parameters: body.data.parameters as any,
        filters: body.data.filters as any,
        requestedById: r.userId,
      },
    });

    await reportQueue.add("generate", {
      tenantId: r.tenantId,
      reportId: report.id,
      type: body.data.type,
      parameters: body.data.parameters,
      filters: body.data.filters,
      requestedById: r.userId,
    });

    return reply.status(201).send({ success: true, data: report });
  });

  // ── Get report detail ──────────────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("report:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const report = await prisma.report.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!report) throw new NotFoundError("Report", id);
    return reply.send({ success: true, data: report });
  });

  // ── Download report as PDF ─────────────────────────────────────────────────
  fastify.get("/:id/download", { preHandler: [authorize("report:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const report = await prisma.report.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!report) throw new NotFoundError("Report", id);

    const { generateReportData } = await import("../../workers/report.worker");
    const data = await generateReportData(report.type as string, r.tenantId, (report.parameters as any) ?? {});

    const pdfBuffer = await generateReportPdf(report, data);
    const filename = `${report.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;

    reply.header("Content-Type", "application/pdf");
    reply.header("Content-Disposition", `attachment; filename="${filename}"`);
    reply.header("Content-Length", pdfBuffer.length);
    return reply.send(pdfBuffer);
  });

  // ── Delete report ──────────────────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("report:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const report = await prisma.report.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!report) throw new NotFoundError("Report", id);
    await prisma.report.delete({ where: { id } });
    return reply.status(204).send();
  });
}
