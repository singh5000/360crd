import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma, basePrisma } from "@360crd/database";
import { AuditService } from "./audit.service";
import { AuditLogService } from "../audit-logs/audit-log.service";
import { notificationQueue } from "@360crd/queue";
import { UserRepository } from "../users/user.repository";
import {
  CreateAuditDto, ListAuditsDto, SubmitAuditDto,
  CreateFindingDto, ReviewAuditDto, CreateTemplateDto,
  UpdateTemplateDto, CreateSectionDto, CreateQuestionDto,
} from "./audit.dto";
import { ValidationError, NotFoundError, ForbiddenError } from "../../shared/errors/http.errors";

const svc = new AuditService();
const auditLog = new AuditLogService();
const userRepo = new UserRepository();

export default async function auditRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ══════════════════════════════════════════════════════════════════════════
  // AUDIT TEMPLATES
  // ══════════════════════════════════════════════════════════════════════════

  fastify.get("/templates", { preHandler: [authorize("audit_template:read")] }, async (req, reply) => {
    const { search, category, page = 1, limit = 20 } = req.query as any;
    const where: any = {
      OR: [{ tenantId: (req as any).tenantId }, { isPublic: true, tenantId: null }],
      isActive: true,
      ...(category && { category: { contains: category, mode: "insensitive" } }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    };
    const [total, data] = await Promise.all([
      basePrisma.auditTemplate.count({ where }),
      basePrisma.auditTemplate.findMany({
        where, skip: (page - 1) * limit, take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { sections: true, audits: true } } },
      }),
    ]);
    return reply.send({ success: true, data, meta: { total, page: Number(page), limit: Number(limit) } });
  });

  fastify.post("/templates", { preHandler: [authorize("audit_template:create")] }, async (req, reply) => {
    const body = CreateTemplateDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const r = req as any;
    const template = await basePrisma.auditTemplate.create({
      data: { ...body.data, tenantId: r.tenantId, createdById: r.userId },
    });
    return reply.status(201).send({ success: true, data: template });
  });

  fastify.get("/templates/:id", { preHandler: [authorize("audit_template:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const template = await basePrisma.auditTemplate.findFirst({
      where: { id, OR: [{ tenantId: (req as any).tenantId }, { isPublic: true }] },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: { questions: { orderBy: { order: "asc" } } },
        },
      },
    });
    if (!template) throw new NotFoundError("Audit template", id);
    return reply.send({ success: true, data: template });
  });

  fastify.patch("/templates/:id", { preHandler: [authorize("audit_template:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = UpdateTemplateDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const template = await basePrisma.auditTemplate.update({ where: { id }, data: body.data });
    return reply.send({ success: true, data: template });
  });

  fastify.delete("/templates/:id", { preHandler: [authorize("audit_template:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await basePrisma.auditTemplate.update({ where: { id }, data: { isActive: false } });
    return reply.status(204).send();
  });

  // ── Sections ──────────────────────────────────────────────────────────────
  fastify.post("/templates/:id/sections", { preHandler: [authorize("audit_template:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = CreateSectionDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const section = await basePrisma.auditTemplateSection.create({
      data: { ...body.data, templateId: id },
    });
    return reply.status(201).send({ success: true, data: section });
  });

  fastify.patch("/templates/:id/sections/:sectionId", { preHandler: [authorize("audit_template:update")] }, async (req, reply) => {
    const { sectionId } = req.params as { id: string; sectionId: string };
    const body = CreateSectionDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const section = await basePrisma.auditTemplateSection.update({ where: { id: sectionId }, data: body.data });
    return reply.send({ success: true, data: section });
  });

  fastify.delete("/templates/:id/sections/:sectionId", { preHandler: [authorize("audit_template:update")] }, async (req, reply) => {
    const { sectionId } = req.params as { id: string; sectionId: string };
    await basePrisma.auditTemplateSection.delete({ where: { id: sectionId } });
    return reply.status(204).send();
  });

  // ── Questions ─────────────────────────────────────────────────────────────
  fastify.post("/templates/:id/sections/:sectionId/questions", { preHandler: [authorize("audit_template:update")] }, async (req, reply) => {
    const { sectionId } = req.params as { id: string; sectionId: string };
    const body = CreateQuestionDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const question = await basePrisma.auditTemplateQuestion.create({
      data: { ...body.data, sectionId, options: body.data.options ?? undefined },
    });
    return reply.status(201).send({ success: true, data: question });
  });

  fastify.patch("/templates/:id/sections/:sectionId/questions/:questionId", { preHandler: [authorize("audit_template:update")] }, async (req, reply) => {
    const { questionId } = req.params as any;
    const body = CreateQuestionDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const question = await basePrisma.auditTemplateQuestion.update({ where: { id: questionId }, data: body.data as any });
    return reply.send({ success: true, data: question });
  });

  fastify.delete("/templates/:id/sections/:sectionId/questions/:questionId", { preHandler: [authorize("audit_template:update")] }, async (req, reply) => {
    const { questionId } = req.params as any;
    await basePrisma.auditTemplateQuestion.delete({ where: { id: questionId } });
    return reply.status(204).send();
  });

  // ── Scoring config ────────────────────────────────────────────────────────
  fastify.put("/templates/:id/scoring", { preHandler: [authorize("audit_template:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { passingScore } = req.body as { passingScore: number };
    if (typeof passingScore !== "number" || passingScore < 0 || passingScore > 100) {
      throw new ValidationError("passingScore must be 0-100", []);
    }
    const template = await basePrisma.auditTemplate.update({ where: { id }, data: { passingScore } });
    return reply.send({ success: true, data: template });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // AUDITS — LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════

  fastify.get("/", { preHandler: [authorize("audit:read")] }, async (req, reply) => {
    const r = req as any;
    const query = ListAuditsDto.safeParse(req.query);
    if (!query.success) throw new ValidationError("Invalid query", query.error.errors);

    // Customer users only see their own company data
    if (r.userType === "CUSTOMER" && r.customerId) {
      (query.data as any).customerId = r.customerId;
    }

    const where: any = {
      deletedAt: null,
      ...(query.data.status && { status: query.data.status }),
      ...(query.data.siteId && { siteId: query.data.siteId }),
      ...(query.data.customerId && { customerId: query.data.customerId }),
      ...(query.data.type && { type: query.data.type }),
      ...(query.data.assignedToId && { assignedToId: query.data.assignedToId }),
      ...(query.data.fromDate && { createdAt: { gte: new Date(query.data.fromDate) } }),
      ...(query.data.toDate && { createdAt: { lte: new Date(query.data.toDate) } }),
      ...(query.data.search && {
        OR: [
          { title: { contains: query.data.search, mode: "insensitive" } },
          { refNumber: { contains: query.data.search, mode: "insensitive" } },
        ],
      }),
    };

    const hasManagerRole = r.roles?.includes("manager") || r.roles?.includes("tenant_admin");
    const effectivelyManager = r.userType === "MANAGER" || hasManagerRole;
    const effectivelyStaff = r.userType === "STAFF" && !hasManagerRole;

    // Staff only see assigned audits
    if (!r.isSuperAdmin && effectivelyStaff) {
      where.OR = [{ assignedToId: r.userId }];
    }

    // Manager sees only their site audits — but if no sites assigned, show all tenant audits
    if (!r.isSuperAdmin && effectivelyManager) {
      const userSites = await userRepo.getUserSites(r.userId);
      if (userSites.length > 0) {
        where.siteId = { in: userSites.map((s: any) => s.siteId) };
      }
    }

    const skip = (query.data.page - 1) * query.data.limit;
    const [total, data] = await Promise.all([
      prisma.audit.count({ where }),
      prisma.audit.findMany({
        where, skip, take: query.data.limit,
        orderBy: { [query.data.sortBy]: query.data.sortOrder },
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          site: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } },
          template: { select: { id: true, name: true } },
          _count: { select: { responses: true, auditFindings: true } },
        },
      }),
    ]);

    return reply.send({
      success: true, data,
      meta: {
        total, page: query.data.page, limit: query.data.limit,
        totalPages: Math.ceil(total / query.data.limit),
      },
    });
  });

  fastify.post("/", { preHandler: [authorize("audit:create")] }, async (req, reply) => {
    const body = CreateAuditDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const r = req as any;
    const effectiveTenantId = body.data.tenantId ?? r.tenantId;
    if (!effectiveTenantId) throw new ValidationError("tenantId is required", []);

    // Auto-assign to STAFF user (not manager) when they create an audit without specifying assignedToId
    const hasManagerRoleCreate = r.roles?.includes("manager") || r.roles?.includes("tenant_admin");
    if (r.userType === "STAFF" && !hasManagerRoleCreate && !body.data.assignedToId) {
      (body.data as any).assignedToId = r.userId;
    }

    const refNumber = await svc.generateRefNumber(effectiveTenantId);

    const { tenantId: _t, ...auditData } = body.data;
    const audit = await prisma.audit.create({
      data: {
        ...auditData,
        tenantId: effectiveTenantId,
        refNumber,
        status: body.data.scheduledAt ? "SCHEDULED" : "DRAFT",
        scheduledAt: body.data.scheduledAt ? new Date(body.data.scheduledAt) : undefined,
        dueDate: body.data.dueDate ? new Date(body.data.dueDate) : undefined,
      },
    });

    if (body.data.assignedToId) {
      await svc.notifyAssignment(audit.id, body.data.assignedToId, effectiveTenantId);
    }

    await auditLog.log({
      tenantId: effectiveTenantId, userId: r.userId, action: "CREATE",
      resource: "audit", resourceId: audit.id,
      after: { refNumber, title: audit.title }, ipAddress: req.ip,
    });

    return reply.status(201).send({ success: true, data: audit });
  });

  fastify.get("/stats", { preHandler: [authorize("audit:read")] }, async (req, reply) => {
    const r = req as any;
    const now = new Date();

    const baseWhere: any = { deletedAt: null };
    const hasManagerRoleStats = r.roles?.includes("manager") || r.roles?.includes("tenant_admin");
    const effectivelyManagerStats = r.userType === "MANAGER" || hasManagerRoleStats;
    const effectivelyStaffStats = r.userType === "STAFF" && !hasManagerRoleStats;

    if (!r.isSuperAdmin && effectivelyStaffStats) baseWhere.OR = [{ assignedToId: r.userId }];
    if (!r.isSuperAdmin && effectivelyManagerStats) {
      const userSites = await userRepo.getUserSites(r.userId);
      if (userSites.length > 0) {
        baseWhere.siteId = { in: userSites.map((s: any) => s.siteId) };
      }
    }

    const [total, completed, overdue, byStatusRaw, byTypeRaw, avgAgg] = await Promise.all([
      prisma.audit.count({ where: baseWhere }),
      prisma.audit.count({ where: { ...baseWhere, status: "COMPLETED" } }),
      prisma.audit.count({
        where: {
          ...baseWhere,
          dueDate: { lt: now },
          status: { notIn: ["COMPLETED", "REVIEWED", "ARCHIVED"] },
        },
      }),
      prisma.audit.groupBy({ by: ["status"], where: baseWhere, _count: true }),
      prisma.audit.groupBy({ by: ["type"], where: baseWhere, _count: true }),
      prisma.audit.aggregate({
        where: { ...baseWhere, percentage: { not: null } },
        _avg: { percentage: true },
      }),
    ]);

    const byStatus = byStatusRaw.reduce((a: any, r) => { a[r.status] = r._count; return a; }, {});
    const byType   = byTypeRaw.reduce((a: any, r) => { a[r.type] = r._count; return a; }, {});

    return reply.send({
      success: true,
      data: {
        total,
        completed,
        overdue,
        avgScore: Math.round((avgAgg._avg.percentage ?? 0) * 100) / 100,
        byStatus,
        byType,
      },
    });
  });

  fastify.get("/:id", { preHandler: [authorize("audit:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const audit = await prisma.audit.findFirst({
      where: { id, deletedAt: null },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        completedBy: { select: { id: true, firstName: true, lastName: true } },
        site: { select: { id: true, name: true, city: true } },
        customer: { select: { id: true, name: true } },
        template: {
          include: {
            sections: { orderBy: { order: "asc" }, include: { questions: { orderBy: { order: "asc" } } } },
          },
        },
        responses: { orderBy: { createdAt: "asc" } },
        auditFindings: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!audit) throw new NotFoundError("Audit", id);

    // Staff can only see their assigned audits
    if (r.userType === "STAFF" && audit.assignedToId !== r.userId) {
      throw new ForbiddenError("You are not assigned to this audit");
    }

    return reply.send({ success: true, data: audit });
  });

  // ── Assign to staff ───────────────────────────────────────────────────────
  fastify.put("/:id/assign", { preHandler: [authorize("audit:assign")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { assignedToId, dueDate } = req.body as any;
    if (!assignedToId) throw new ValidationError("assignedToId is required", []);

    const audit = await prisma.audit.update({
      where: { id },
      data: {
        assignedToId,
        status: "SCHEDULED",
        ...(dueDate && { dueDate: new Date(dueDate) }),
      },
    });

    await svc.notifyAssignment(id, assignedToId, (req as any).tenantId);
    return reply.send({ success: true, data: audit });
  });

  // ── Staff starts audit ────────────────────────────────────────────────────
  fastify.put("/:id/start", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);
    if (audit.assignedToId !== r.userId && !r.isSuperAdmin && r.userType !== "MANAGER") {
      throw new ForbiddenError("Only the assigned user can start this audit");
    }
    if (!["DRAFT", "SCHEDULED"].includes(audit.status)) {
      throw new ValidationError(`Cannot start audit in status: ${audit.status}`, []);
    }

    const updated = await prisma.audit.update({
      where: { id },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
    });
    return reply.send({ success: true, data: updated });
  });

  // ── Save draft responses ──────────────────────────────────────────────────
  fastify.put("/:id/draft", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = SubmitAuditDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);

    if (body.data.responses?.length) {
      // Upsert each response (overwrite draft answers)
      for (const r of body.data.responses) {
        await basePrisma.auditResponse.upsert({
          where: { id: `${id}:${r.questionId}` },
          update: {
            answer: r.answer,
            numericAnswer: r.numericAnswer,
            booleanAnswer: r.booleanAnswer,
            selectedOptions: r.selectedOptions,
            notes: r.notes,
            evidenceUrls: r.evidenceUrls,
          },
          create: {
            id: `${id}:${r.questionId}`,
            tenantId: audit.tenantId,
            auditId: id,
            questionId: r.questionId,
            question: r.question,
            questionType: r.questionType,
            answer: r.answer,
            numericAnswer: r.numericAnswer,
            booleanAnswer: r.booleanAnswer,
            selectedOptions: r.selectedOptions ?? [],
            notes: r.notes,
            evidenceUrls: r.evidenceUrls ?? [],
          },
        });
      }
    }

    return reply.send({ success: true, message: "Draft saved" });
  });

  // ── Submit audit ──────────────────────────────────────────────────────────
  fastify.post("/:id/submit", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const body = SubmitAuditDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);
    if (audit.assignedToId !== r.userId && !r.isSuperAdmin && r.userType !== "MANAGER") {
      throw new ForbiddenError("Only the assigned user can submit this audit");
    }
    if (!["IN_PROGRESS", "DRAFT", "SCHEDULED"].includes(audit.status)) {
      throw new ValidationError(`Cannot submit audit in status: ${audit.status}`, []);
    }

    // Save all responses
    await basePrisma.auditResponse.deleteMany({ where: { auditId: id } });
    await basePrisma.auditResponse.createMany({
      data: body.data.responses.map(res => ({
        tenantId: audit.tenantId,
        auditId: id,
        questionId: res.questionId,
        question: res.question,
        questionType: res.questionType,
        answer: res.answer,
        numericAnswer: res.numericAnswer,
        booleanAnswer: res.booleanAnswer,
        selectedOptions: res.selectedOptions ?? [],
        notes: res.notes,
        evidenceUrls: res.evidenceUrls ?? [],
      })),
    });

    // Calculate score
    const scoreResult = await svc.calculateScore(id, body.data.responses);

    // Auto-create findings for non-compliant answers
    await svc.autoCreateFindings(id, body.data.responses, audit.tenantId);

    const updated = await prisma.audit.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        completedById: r.userId,
        notes: body.data.notes,
        ...scoreResult,
      },
    });

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "SUBMIT",
      resource: "audit", resourceId: id,
      after: { status: "COMPLETED", score: scoreResult.score, percentage: scoreResult.percentage },
      ipAddress: req.ip,
    });

    if (audit.assignedToId && audit.assignedToId !== r.userId) {
      notificationQueue.add("audit-completed", {
        tenantId: r.tenantId,
        userId: audit.assignedToId,
        type: "audit_completed",
        title: "Audit Completed",
        message: `Audit ${audit.refNumber} has been completed with a score of ${scoreResult.percentage?.toFixed(0) ?? "N/A"}%.`,
        channel: "in-app",
        data: { auditId: id, refNumber: audit.refNumber },
      }).catch(() => {});
    }

    return reply.send({ success: true, data: updated });
  });

  // ── Manager review: approve or reject ────────────────────────────────────
  fastify.put("/:id/review", { preHandler: [authorize("audit:approve")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const body = ReviewAuditDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);
    if (audit.status !== "COMPLETED") {
      throw new ValidationError("Only completed audits can be reviewed", []);
    }

    const newStatus = body.data.action === "approve" ? "REVIEWED" : "IN_PROGRESS";

    const updated = await prisma.audit.update({
      where: { id },
      data: {
        status: newStatus,
        conclusion: body.data.conclusion,
        notes: body.data.action === "reject"
          ? `[REJECTED] ${body.data.rejectReason}\n${audit.notes || ""}`.trim()
          : audit.notes ?? undefined,
      },
    });

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId,
      action: body.data.action === "approve" ? "APPROVE" : "REJECT",
      resource: "audit", resourceId: id,
      after: { status: newStatus, reason: body.data.rejectReason }, ipAddress: req.ip,
    });

    return reply.send({ success: true, data: updated });
  });

  // ── Update audit ──────────────────────────────────────────────────────────
  fastify.patch("/:id", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = CreateAuditDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);

    const { tenantId: _t, scheduledAt, dueDate, ...rest } = body.data;
    const updated = await prisma.audit.update({
      where: { id },
      data: {
        ...rest,
        ...(scheduledAt !== undefined && { scheduledAt: new Date(scheduledAt) }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      },
    });

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "UPDATE",
      resource: "audit", resourceId: id,
      after: body.data, ipAddress: req.ip,
    });

    return reply.send({ success: true, data: updated });
  });

  // ── Delete audit ──────────────────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("audit:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);

    await prisma.audit.update({ where: { id }, data: { deletedAt: new Date() } });

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "DELETE",
      resource: "audit", resourceId: id, ipAddress: req.ip,
    });

    return reply.status(204).send();
  });

  // ── Cancel audit ──────────────────────────────────────────────────────────
  fastify.put("/:id/cancel", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const { reason } = (req.body as any) ?? {};

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);
    if (!["SCHEDULED", "IN_PROGRESS", "DRAFT"].includes(audit.status)) {
      throw new ValidationError(`Cannot cancel audit in status: ${audit.status}`, []);
    }

    const updated = await prisma.audit.update({
      where: { id },
      data: {
        status: "CANCELLED",
        ...(reason && { notes: `[CANCELLED] ${reason}\n${audit.notes || ""}`.trim() }),
      },
    });

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "CANCEL",
      resource: "audit", resourceId: id,
      after: { status: "CANCELLED", reason }, ipAddress: req.ip,
    });

    return reply.send({ success: true, data: updated });
  });

  // ── Close audit ───────────────────────────────────────────────────────────
  fastify.put("/:id/close", { preHandler: [authorize("audit:approve")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);
    if (!["REVIEWED", "COMPLETED"].includes(audit.status)) {
      throw new ValidationError("Audit must be reviewed before closing", []);
    }

    const updated = await prisma.audit.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    await auditLog.log({
      tenantId: r.tenantId, userId: r.userId, action: "CLOSE",
      resource: "audit", resourceId: id, ipAddress: req.ip,
    });

    return reply.send({ success: true, data: updated });
  });

  // ── Evidence upload ───────────────────────────────────────────────────────
  fastify.post("/:id/evidence", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = req.body as any;

    if (!body?.fileUrl || !body?.filename) {
      throw new ValidationError("fileUrl and filename are required", []);
    }

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
        category: "AUDIT_EVIDENCE",
        tags: [`audit:${id}`],
        status: "PUBLISHED",
      },
      select: { id: true, title: true, filename: true, fileUrl: true, createdAt: true },
    });

    return reply.status(201).send({ success: true, data: doc });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FINDINGS (CAPA for Audits)
  // ══════════════════════════════════════════════════════════════════════════

  fastify.get("/:id/findings", { preHandler: [authorize("audit:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const findings = await prisma.auditFinding.findMany({
      where: { auditId: id },
      orderBy: { createdAt: "desc" },
    });
    return reply.send({ success: true, data: findings });
  });

  fastify.post("/:id/findings", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = CreateFindingDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const audit = await prisma.audit.findFirst({ where: { id, deletedAt: null } });
    if (!audit) throw new NotFoundError("Audit", id);

    const finding = await basePrisma.auditFinding.create({
      data: {
        tenantId: r.tenantId,
        auditId: id,
        type: body.data.type,
        title: body.data.title,
        description: body.data.description,
        severity: body.data.severity,
        status: "OPEN",
        dueDate: body.data.dueDate ? new Date(body.data.dueDate) : undefined,
        assignedToId: body.data.assignedToId,
        evidenceUrls: body.data.evidenceUrls,
      },
    });

    // Update findings count
    await prisma.audit.update({
      where: { id },
      data: {
        findings: { increment: 1 },
        nonConformances: body.data.type === "NON_CONFORMANCE" ? { increment: 1 } : undefined,
        observations: body.data.type === "OBSERVATION" ? { increment: 1 } : undefined,
      },
    });

    return reply.status(201).send({ success: true, data: finding });
  });

  fastify.patch("/:id/findings/:findingId", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { findingId } = req.params as { id: string; findingId: string };
    const body = CreateFindingDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const finding = await basePrisma.auditFinding.update({
      where: { id: findingId },
      data: {
        ...body.data,
        dueDate: body.data.dueDate ? new Date(body.data.dueDate) : undefined,
      },
    });
    return reply.send({ success: true, data: finding });
  });

  fastify.put("/:id/findings/:findingId/close", { preHandler: [authorize("audit:approve")] }, async (req, reply) => {
    const { findingId } = req.params as any;
    const finding = await basePrisma.auditFinding.update({
      where: { id: findingId },
      data: { status: "CLOSED", closedAt: new Date() },
    });
    return reply.send({ success: true, data: finding });
  });

  fastify.put("/:id/findings/:findingId/verify", { preHandler: [authorize("audit:approve")] }, async (req, reply) => {
    const { findingId } = req.params as any;
    const finding = await basePrisma.auditFinding.update({
      where: { id: findingId },
      data: { status: "VERIFIED" },
    });
    return reply.send({ success: true, data: finding });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // CAPA OVERVIEW (cross-audit findings)
  // ══════════════════════════════════════════════════════════════════════════

  fastify.get("/capa/open", { preHandler: [authorize("audit:read")] }, async (req, reply) => {
    const r = req as any;
    const { page = 1, limit = 20, assignedToId, severity } = req.query as any;

    const where: any = {
      tenantId: r.tenantId,
      status: { notIn: ["CLOSED", "VERIFIED"] },
      type: "NON_CONFORMANCE",
      ...(assignedToId && { assignedToId }),
      ...(severity && { severity }),
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [total, data] = await Promise.all([
      basePrisma.auditFinding.count({ where }),
      basePrisma.auditFinding.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          audit: { select: { id: true, refNumber: true, title: true, site: { select: { name: true } } } },
        },
      }),
    ]);

    return reply.send({
      success: true, data,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  });

  fastify.put("/capa/:findingId/assign", { preHandler: [authorize("audit:assign")] }, async (req, reply) => {
    const { findingId } = req.params as { findingId: string };
    const { assignedToId, dueDate } = req.body as any;
    const finding = await basePrisma.auditFinding.update({
      where: { id: findingId },
      data: {
        assignedToId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status: "IN_PROGRESS",
      },
    });
    return reply.send({ success: true, data: finding });
  });

  fastify.put("/capa/:findingId/resolve", { preHandler: [authorize("audit:update")] }, async (req, reply) => {
    const { findingId } = req.params as { findingId: string };
    const finding = await basePrisma.auditFinding.update({
      where: { id: findingId },
      data: { status: "CLOSED", closedAt: new Date() },
    });
    return reply.send({ success: true, data: finding });
  });

  fastify.put("/capa/:findingId/verify", { preHandler: [authorize("audit:approve")] }, async (req, reply) => {
    const { findingId } = req.params as { findingId: string };
    const finding = await basePrisma.auditFinding.update({
      where: { id: findingId },
      data: { status: "VERIFIED" },
    });
    return reply.send({ success: true, data: finding });
  });
}
