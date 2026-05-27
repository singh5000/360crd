import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma, basePrisma } from "@360crd/database";
import { z } from "zod";
import { ValidationError, NotFoundError, ForbiddenError } from "../../shared/errors/http.errors";
import { AuditLogService } from "../audit-logs/audit-log.service";
import { eventBus, Events } from "@360crd/event-bus";
import { notificationQueue } from "@360crd/queue";

const auditLog = new AuditLogService();

const CreateTrainingDto = z.object({
  title: z.string().min(3).max(300).trim(),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(["ONLINE", "CLASSROOM", "ON_THE_JOB", "BLENDED"]).default("ONLINE"),
  durationMins: z.number().min(1).optional(),
  passingScore: z.number().min(0).max(100).optional(),
  maxAttempts: z.number().min(1).optional(),
  isRecurring: z.boolean().default(false),
  recurringDays: z.number().optional(),
  validityDays: z.number().optional(),
  coverImageUrl: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const CreateContentDto = z.object({
  type: z.string(),
  title: z.string().min(1),
  contentUrl: z.string().optional(),
  durationSecs: z.number().optional(),
  order: z.number().min(0),
  isRequired: z.boolean().default(true),
});

const CreateQuestionDto = z.object({
  question: z.string().min(1),
  type: z.enum(["MULTIPLE_CHOICE", "SINGLE_CHOICE", "YES_NO", "TEXT"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().min(1).default(1),
  order: z.number().min(0),
});

const SubmitQuizDto = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string(),
  })),
});

const ListTrainingDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

export default async function trainingRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── List trainings ─────────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const r = req as any;
    const q = ListTrainingDto.safeParse(req.query);
    if (!q.success) throw new ValidationError("Invalid query", q.error.errors);
    const { page, limit, status, type, category, search } = q.data;

    const where: any = {
      tenantId: r.tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(type && { type }),
      ...(category && { category }),
      ...(search && { title: { contains: search, mode: "insensitive" } }),
    };

    const [total, data] = await Promise.all([
      prisma.training.count({ where }),
      prisma.training.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { enrollments: true, contents: true } } },
      }),
    ]);
    return reply.send({ success: true, data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  // ── Create training ────────────────────────────────────────────────────────
  fastify.post("/", { preHandler: [authorize("training:create")] }, async (req, reply) => {
    const r = req as any;
    const body = CreateTrainingDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const training = await prisma.training.create({
      data: { ...body.data, tenantId: r.tenantId, createdById: r.userId, status: "DRAFT" as any },
    });

    await auditLog.log({ tenantId: r.tenantId, userId: r.userId, action: "CREATE", resource: "training", resourceId: training.id, after: { title: training.title } });
    return reply.status(201).send({ success: true, data: training });
  });

  // ── Get training detail ────────────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const training = await prisma.training.findFirst({
      where: { id, tenantId: r.tenantId, deletedAt: null },
      include: {
        contents: { orderBy: { order: "asc" } },
        questions: { orderBy: { order: "asc" } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!training) throw new NotFoundError("Training", id);
    return reply.send({ success: true, data: training });
  });

  // ── Update training ────────────────────────────────────────────────────────
  fastify.patch("/:id", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = CreateTrainingDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const existing = await prisma.training.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Training", id);

    const training = await prisma.training.update({ where: { id }, data: body.data as any });
    return reply.send({ success: true, data: training });
  });

  // ── Publish / Archive training ─────────────────────────────────────────────
  fastify.put("/:id/publish", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const existing = await prisma.training.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!existing) throw new NotFoundError("Training", id);
    const training = await prisma.training.update({ where: { id }, data: { status: "PUBLISHED" as any } });
    return reply.send({ success: true, data: training });
  });

  fastify.put("/:id/archive", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const existing = await prisma.training.findFirst({ where: { id, tenantId: r.tenantId } });
    if (!existing) throw new NotFoundError("Training", id);
    const training = await prisma.training.update({ where: { id }, data: { status: "ARCHIVED" as any } });
    return reply.send({ success: true, data: training });
  });

  // ── Delete training ────────────────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("training:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const existing = await prisma.training.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Training", id);
    await prisma.training.update({ where: { id }, data: { deletedAt: new Date(), status: "ARCHIVED" as any } });
    return reply.status(204).send();
  });

  // ── Content management ─────────────────────────────────────────────────────
  fastify.post("/:id/contents", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { id: trainingId } = req.params as { id: string };
    const r = req as any;
    const body = CreateContentDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const existing = await prisma.training.findFirst({ where: { id: trainingId, tenantId: r.tenantId } });
    if (!existing) throw new NotFoundError("Training", trainingId);

    const content = await basePrisma.trainingContent.create({ data: { trainingId, ...body.data } });
    return reply.status(201).send({ success: true, data: content });
  });

  fastify.patch("/:id/contents/:contentId", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { contentId } = req.params as { id: string; contentId: string };
    const body = CreateContentDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const content = await basePrisma.trainingContent.update({ where: { id: contentId }, data: body.data });
    return reply.send({ success: true, data: content });
  });

  fastify.delete("/:id/contents/:contentId", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { contentId } = req.params as { id: string; contentId: string };
    await basePrisma.trainingContent.delete({ where: { id: contentId } });
    return reply.status(204).send();
  });

  // ── Quiz questions ─────────────────────────────────────────────────────────
  fastify.get("/:id/questions", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const { id: trainingId } = req.params as { id: string };
    const questions = await basePrisma.trainingQuestion.findMany({
      where: { trainingId }, orderBy: { order: "asc" },
    });
    return reply.send({ success: true, data: questions });
  });

  fastify.post("/:id/questions", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { id: trainingId } = req.params as { id: string };
    const r = req as any;
    const body = CreateQuestionDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const existing = await prisma.training.findFirst({ where: { id: trainingId, tenantId: r.tenantId } });
    if (!existing) throw new NotFoundError("Training", trainingId);

    const question = await basePrisma.trainingQuestion.create({
      data: { trainingId, ...body.data, type: body.data.type as any, options: body.data.options as any },
    });
    return reply.status(201).send({ success: true, data: question });
  });

  fastify.patch("/:id/questions/:questionId", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { questionId } = req.params as { id: string; questionId: string };
    const body = CreateQuestionDto.partial().safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);
    const question = await basePrisma.trainingQuestion.update({
      where: { id: questionId }, data: { ...body.data, type: body.data.type as any, options: body.data.options as any },
    });
    return reply.send({ success: true, data: question });
  });

  fastify.delete("/:id/questions/:questionId", { preHandler: [authorize("training:update")] }, async (req, reply) => {
    const { questionId } = req.params as { id: string; questionId: string };
    await basePrisma.trainingQuestion.delete({ where: { id: questionId } });
    return reply.status(204).send();
  });

  // ── Enrollments ────────────────────────────────────────────────────────────
  fastify.get("/:id/enrollments", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const { id: trainingId } = req.params as { id: string };
    const r = req as any;
    const { status } = req.query as any;

    const enrollments = await prisma.trainingEnrollment.findMany({
      where: { trainingId, tenantId: r.tenantId, ...(status && { status }) },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } } },
      orderBy: { enrolledAt: "desc" },
    });
    return reply.send({ success: true, data: enrollments });
  });

  // Enroll self
  fastify.post("/:id/enroll", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const { id: trainingId } = req.params as { id: string };
    const r = req as any;

    const training = await prisma.training.findFirst({ where: { id: trainingId, tenantId: r.tenantId, deletedAt: null } });
    if (!training) throw new NotFoundError("Training", trainingId);
    if (training.status !== "PUBLISHED") throw new ForbiddenError("Training is not published");

    const enrollment = await prisma.trainingEnrollment.upsert({
      where: { trainingId_userId: { trainingId, userId: r.userId } },
      update: {},
      create: {
        tenantId: r.tenantId, trainingId, userId: r.userId, status: "ENROLLED",
        expiresAt: training.validityDays
          ? new Date(Date.now() + training.validityDays * 24 * 60 * 60 * 1000)
          : undefined,
      },
    });

    eventBus.publish({ type: Events.TRAINING_ENROLLMENT_CREATED, tenantId: r.tenantId, userId: r.userId, payload: { trainingId, enrollmentId: enrollment.id } });

    notificationQueue.add("training-enrolled", {
      tenantId: r.tenantId,
      userId: r.userId,
      type: "training_enrolled",
      title: "Training Enrollment Confirmed",
      message: `You have been enrolled in "${training.title}". Start learning when you're ready.`,
      channel: "in-app",
      data: { trainingId, enrollmentId: enrollment.id },
    }).catch(() => {});

    return reply.status(201).send({ success: true, data: enrollment });
  });

  // Admin bulk enroll
  fastify.post("/:id/enroll/bulk", { preHandler: [authorize("training:assign")] }, async (req, reply) => {
    const { id: trainingId } = req.params as { id: string };
    const r = req as any;
    const { userIds } = req.body as { userIds: string[] };
    if (!Array.isArray(userIds) || userIds.length === 0) throw new ValidationError("userIds must be a non-empty array", []);

    const training = await prisma.training.findFirst({ where: { id: trainingId, tenantId: r.tenantId } });
    if (!training) throw new NotFoundError("Training", trainingId);

    const results = await Promise.allSettled(
      userIds.map(userId =>
        prisma.trainingEnrollment.upsert({
          where: { trainingId_userId: { trainingId, userId } },
          update: {},
          create: { tenantId: r.tenantId, trainingId, userId, status: "ENROLLED" },
        })
      )
    );

    const enrolled = results.filter(r => r.status === "fulfilled").length;

    // Notify each successfully enrolled user
    const enrolledUserIds = userIds.filter((_, i) => results[i].status === "fulfilled");
    await Promise.all(
      enrolledUserIds.map(userId =>
        notificationQueue.add("training-bulk-enrolled", {
          tenantId: r.tenantId,
          userId,
          type: "training_enrolled",
          title: "Training Assigned",
          message: `You have been enrolled in "${training.title}". Complete it at your earliest convenience.`,
          channel: "in-app",
          data: { trainingId },
        }).catch(() => {})
      )
    );

    return reply.send({ success: true, data: { enrolled, total: userIds.length } });
  });

  // ── My enrollments ─────────────────────────────────────────────────────────
  fastify.get("/my-enrollments", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const r = req as any;
    const { status } = req.query as any;
    const enrollments = await prisma.trainingEnrollment.findMany({
      where: { userId: r.userId, tenantId: r.tenantId, ...(status && { status }) },
      include: {
        training: { select: { id: true, title: true, type: true, durationMins: true, coverImageUrl: true, category: true } },
      },
      orderBy: { enrolledAt: "desc" },
    });
    return reply.send({ success: true, data: enrollments });
  });

  // ── Start training ─────────────────────────────────────────────────────────
  fastify.put("/:id/start", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const { id: trainingId } = req.params as { id: string };
    const r = req as any;

    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { trainingId_userId: { trainingId, userId: r.userId } },
    });
    if (!enrollment) throw new NotFoundError("Enrollment", trainingId);

    const updated = await prisma.trainingEnrollment.update({
      where: { trainingId_userId: { trainingId, userId: r.userId } },
      data: { status: "IN_PROGRESS", startedAt: enrollment.startedAt ?? new Date() },
    });
    return reply.send({ success: true, data: updated });
  });

  // ── Submit quiz ────────────────────────────────────────────────────────────
  fastify.post("/:id/submit", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const { id: trainingId } = req.params as { id: string };
    const r = req as any;
    const body = SubmitQuizDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const training = await prisma.training.findFirst({
      where: { id: trainingId, tenantId: r.tenantId },
      include: { questions: true },
    });
    if (!training) throw new NotFoundError("Training", trainingId);

    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { trainingId_userId: { trainingId, userId: r.userId } },
    });
    if (!enrollment) throw new NotFoundError("Enrollment", trainingId);

    // Check attempt limit
    if (training.maxAttempts && enrollment.attempts >= training.maxAttempts) {
      throw new ForbiddenError("Maximum attempts reached");
    }

    // Grade the quiz
    let earned = 0;
    let total = 0;
    for (const question of training.questions) {
      total += question.points;
      const submitted = body.data.answers.find(a => a.questionId === question.id);
      if (submitted?.answer === question.correctAnswer) {
        earned += question.points;
      }
    }

    const percentage = total > 0 ? (earned / total) * 100 : 100;
    const passingScore = training.passingScore ?? 70;
    const passed = percentage >= passingScore;

    const updated = await prisma.trainingEnrollment.update({
      where: { trainingId_userId: { trainingId, userId: r.userId } },
      data: {
        attempts: { increment: 1 },
        score: Math.round(percentage * 100) / 100,
        passed,
        status: passed ? "COMPLETED" : enrollment.status,
        completedAt: passed ? new Date() : enrollment.completedAt,
        expiresAt: passed && training.validityDays
          ? new Date(Date.now() + training.validityDays * 24 * 60 * 60 * 1000)
          : enrollment.expiresAt,
      },
    });

    if (passed) {
      eventBus.publish({ type: Events.TRAINING_COMPLETED, tenantId: r.tenantId, userId: r.userId, payload: { trainingId, enrollmentId: enrollment.id, score: percentage } });

      notificationQueue.add("training-completed", {
        tenantId: r.tenantId,
        userId: r.userId,
        type: "training_completed",
        title: "Training Completed",
        message: `Congratulations! You passed "${training.title}" with a score of ${Math.round(percentage)}%.`,
        channel: "in-app",
        data: { trainingId, score: Math.round(percentage) },
      }).catch(() => {});
    }

    return reply.send({ success: true, data: { score: percentage, passed, enrollment: updated } });
  });

  // ── Enrollment detail / unenroll ───────────────────────────────────────────
  fastify.get("/:id/enrollment/:userId", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const { id: trainingId, userId } = req.params as { id: string; userId: string };
    const r = req as any;
    const targetUserId = userId === "me" ? r.userId : userId;

    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { trainingId_userId: { trainingId, userId: targetUserId } },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
    if (!enrollment) throw new NotFoundError("Enrollment", trainingId);
    return reply.send({ success: true, data: enrollment });
  });

  fastify.delete("/:id/enrollment/:userId", { preHandler: [authorize("training:assign")] }, async (req, reply) => {
    const { id: trainingId, userId } = req.params as { id: string; userId: string };
    await prisma.trainingEnrollment.delete({
      where: { trainingId_userId: { trainingId, userId } },
    }).catch(() => {});
    return reply.status(204).send();
  });

  // ── Stats ──────────────────────────────────────────────────────────────────
  fastify.get("/stats", { preHandler: [authorize("training:read")] }, async (req, reply) => {
    const r = req as any;
    const [total, byStatus, byType, enrollmentStats] = await Promise.all([
      prisma.training.count({ where: { tenantId: r.tenantId, deletedAt: null } }),
      prisma.training.groupBy({ by: ["status"], where: { tenantId: r.tenantId, deletedAt: null }, _count: true }),
      prisma.training.groupBy({ by: ["type"], where: { tenantId: r.tenantId, deletedAt: null }, _count: true }),
      prisma.trainingEnrollment.groupBy({ by: ["status"], where: { tenantId: r.tenantId }, _count: true }),
    ]);
    return reply.send({
      success: true,
      data: {
        total,
        byStatus: byStatus.reduce((a: any, r) => { a[r.status] = r._count; return a; }, {}),
        byType: byType.reduce((a: any, r) => { a[r.type] = r._count; return a; }, {}),
        enrollmentByStatus: enrollmentStats.reduce((a: any, r) => { a[r.status] = r._count; return a; }, {}),
      },
    });
  });
}
