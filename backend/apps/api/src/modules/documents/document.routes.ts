import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { prisma, basePrisma } from "@360crd/database";
import { z } from "zod";
import { createHash } from "crypto";
import { uploadFile, getPresignedDownloadUrl, deleteFile, buildStorageKey } from "../../shared/storage/storage.service";
import { ValidationError, NotFoundError } from "../../shared/errors/http.errors";
import { AuditLogService } from "../audit-logs/audit-log.service";

const auditLog = new AuditLogService();

const ListDocumentsDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  category: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
});

const UpdateDocumentDto = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

async function parseMultipart(req: any): Promise<{
  fileBuffer: Buffer;
  filename: string;
  mimetype: string;
  fields: Record<string, string>;
} | null> {
  let fileBuffer: Buffer | null = null;
  let filename = "";
  let mimetype = "";
  const fields: Record<string, string> = {};

  const parts = req.parts();
  for await (const part of parts) {
    if (part.type === "file") {
      const chunks: Buffer[] = [];
      for await (const chunk of part.file) chunks.push(chunk);
      fileBuffer = Buffer.concat(chunks);
      filename = part.filename;
      mimetype = part.mimetype;
    } else {
      fields[part.fieldname] = part.value as string;
    }
  }

  if (!fileBuffer || !filename) return null;
  return { fileBuffer, filename, mimetype, fields };
}

export default async function documentRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── List documents ─────────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("document:read")] }, async (req, reply) => {
    const r = req as any;
    const q = ListDocumentsDto.safeParse(req.query);
    if (!q.success) throw new ValidationError("Invalid query", q.error.errors);
    const { page, limit, category, status, search, tag } = q.data;

    const where: any = {
      tenantId: r.tenantId,
      deletedAt: null,
      ...(category && { category }),
      ...(status && { status }),
      ...(tag && { tags: { has: tag } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { filename: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, title: true, filename: true, fileUrl: true,
          category: true, status: true, version: true, tags: true,
          fileSize: true, mimeType: true, createdAt: true, updatedAt: true,
          uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
    ]);
    return reply.send({ success: true, data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  // ── Get document detail ────────────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("document:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const doc = await prisma.document.findFirst({
      where: { id, tenantId: r.tenantId, deletedAt: null },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        versions: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!doc) throw new NotFoundError("Document", id);
    return reply.send({ success: true, data: doc });
  });

  // ── Get download URL ──────────────────────────────────────────────────────
  fastify.get("/:id/download", { preHandler: [authorize("document:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const doc = await prisma.document.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!doc) throw new NotFoundError("Document", id);

    const url = await getPresignedDownloadUrl(doc.storageKey ?? doc.fileUrl, 3600);
    return reply.send({ success: true, data: { url, expiresIn: 3600, filename: doc.filename } });
  });

  // ── Upload document ────────────────────────────────────────────────────────
  fastify.post("/upload", { preHandler: [authorize("document:create")] }, async (req, reply) => {
    const r = req as any;
    const tenantId = r.tenantId;
    if (!tenantId) {
      return reply.status(400).send({ success: false, error: { code: "NO_TENANT", message: "Select a company before uploading" } });
    }

    const parsed = await parseMultipart(req);
    if (!parsed) {
      return reply.status(400).send({ success: false, error: { code: "NO_FILE", message: "No file uploaded" } });
    }
    const { fileBuffer, filename, mimetype, fields } = parsed;

    const checksum = createHash("sha256").update(fileBuffer).digest("hex");
    const title = fields.title || filename;
    const category = fields.category || "GENERAL";
    const description = fields.description;
    const tags = fields.tags ? JSON.parse(fields.tags) : [];

    const storageKey = buildStorageKey(tenantId, "documents", filename);
    const { url: fileUrl } = await uploadFile(storageKey, fileBuffer, mimetype, {
      tenantId, uploadedBy: r.userId, originalName: filename,
    });

    const doc = await prisma.document.create({
      data: {
        tenantId,
        uploadedById: r.userId,
        title,
        filename,
        fileUrl,
        storageKey,
        fileSize: fileBuffer.length,
        mimeType: mimetype,
        checksum,
        category,
        description,
        tags,
        status: "DRAFT",
        version: "1.0",
      },
    });

    await auditLog.log({ tenantId, userId: r.userId, action: "CREATE", resource: "document", resourceId: doc.id, after: { title, filename } });
    return reply.status(201).send({ success: true, data: doc });
  });

  // ── Update document metadata ───────────────────────────────────────────────
  fastify.patch("/:id", { preHandler: [authorize("document:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = UpdateDocumentDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const existing = await prisma.document.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Document", id);

    const doc = await prisma.document.update({ where: { id }, data: { ...body.data, status: body.data.status as any } });
    return reply.send({ success: true, data: doc });
  });

  // ── Publish document ───────────────────────────────────────────────────────
  fastify.put("/:id/publish", { preHandler: [authorize("document:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const existing = await prisma.document.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Document", id);
    const doc = await prisma.document.update({ where: { id }, data: { status: "PUBLISHED" } });
    return reply.send({ success: true, data: doc });
  });

  // ── Archive document ───────────────────────────────────────────────────────
  fastify.put("/:id/archive", { preHandler: [authorize("document:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const existing = await prisma.document.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Document", id);
    const doc = await prisma.document.update({ where: { id }, data: { status: "ARCHIVED" } });
    return reply.send({ success: true, data: doc });
  });

  // ── Upload new version ─────────────────────────────────────────────────────
  fastify.post("/:id/versions", { preHandler: [authorize("document:update")] }, async (req, reply) => {
    const { id: documentId } = req.params as { id: string };
    const r = req as any;

    const existing = await prisma.document.findFirst({ where: { id: documentId, tenantId: r.tenantId, deletedAt: null } });
    if (!existing) throw new NotFoundError("Document", documentId);

    const parsed = await parseMultipart(req);
    if (!parsed) {
      return reply.status(400).send({ success: false, error: { code: "NO_FILE", message: "No file uploaded" } });
    }
    const { fileBuffer, filename, mimetype } = parsed;

    const checksum = createHash("sha256").update(fileBuffer).digest("hex");
    const storageKey = buildStorageKey(r.tenantId, "documents", filename);
    const { url: fileUrl } = await uploadFile(storageKey, fileBuffer, mimetype, { tenantId: r.tenantId, uploadedBy: r.userId });

    const versionParts = (existing.version || "1.0").split(".");
    const newVersion = `${versionParts[0]}.${Number(versionParts[1] || 0) + 1}`;

    await basePrisma.documentVersion.create({
      data: {
        documentId,
        version: existing.version || "1.0",
        fileUrl: existing.fileUrl,
        filename: existing.filename,
        fileSize: existing.fileSize ?? undefined,
        uploadedById: r.userId,
      },
    });

    const updated = await prisma.document.update({
      where: { id: documentId },
      data: { fileUrl, storageKey, filename, fileSize: fileBuffer.length, mimeType: mimetype, checksum, version: newVersion, status: "DRAFT" },
    });

    return reply.status(201).send({ success: true, data: updated });
  });

  // ── Delete document ────────────────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("document:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const doc = await prisma.document.findFirst({ where: { id, tenantId: r.tenantId, deletedAt: null } });
    if (!doc) throw new NotFoundError("Document", id);

    if (doc.storageKey) {
      await deleteFile(doc.storageKey).catch(() => {});
    }

    await prisma.document.update({ where: { id }, data: { deletedAt: new Date() } });
    await auditLog.log({ tenantId: r.tenantId, userId: r.userId, action: "DELETE", resource: "document", resourceId: id, before: { title: doc.title } });
    return reply.status(204).send();
  });
}
