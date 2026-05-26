import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import { createReadStream, existsSync } from "fs";
import path from "path";
import { config } from "./config";
import { errorHandler } from "./shared/errors/error-handler";
import { requestContextPlugin } from "./middleware/request-context";
import { logger } from "@360crd/logger";

// ── Plugins ──────────────────────────────────────────────────────────────
import rateLimitPlugin from "./plugins/rate-limit.plugin";
import swaggerPlugin from "./plugins/swagger.plugin";
import websocketPlugin from "./plugins/websocket.plugin";

// ── Route modules ─────────────────────────────────────────────────────────
import authRoutes from "./modules/auth/auth.routes";
import publicRoutes from "./modules/public/public.routes";
import customerRoutes from "./modules/customers/customer.routes";
import tenantRoutes from "./modules/tenants/tenant.routes";
import userRoutes from "./modules/users/user.routes";
import siteRoutes from "./modules/sites/site.routes";
import incidentRoutes from "./modules/incidents/incident.routes";
import auditRoutes from "./modules/audits/audit.routes";
import trainingRoutes from "./modules/training/training.routes";
import inductionRoutes from "./modules/induction/induction.routes";
import ppeRoutes from "./modules/ppe/ppe.routes";
import assetRoutes from "./modules/assets/asset.routes";
import wasteRoutes from "./modules/waste/waste.routes";
import documentRoutes from "./modules/documents/document.routes";
import formFieldRoutes from "./modules/form-fields/form-field.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import reportRoutes from "./modules/reports/report.routes";
import activityRoutes from "./modules/activity/activity.routes";
import roleRoutes from "./modules/roles/role.routes";
import webhookRoutes from "./modules/webhooks/webhook.routes";
import feedbackRoutes from "./modules/feedback/feedback.routes";
import settingsRoutes from "./modules/settings/settings.routes";

export async function buildApp() {
  const app = Fastify({
    logger: false,
    genReqId: () => {
      const { randomUUID } = require("crypto");
      return randomUUID();
    },
    trustProxy: true,
    ajv: {
      customOptions: {
        coerceTypes: false,
        strict: false,
      },
    },
  });

  // ── Global hooks ───────────────────────────────────────────────────────
  app.addHook("onRequest", requestContextPlugin);

  app.addHook("onRequest", async (request, reply) => {
    logger.info("Incoming request", {
      requestId: (request as any).requestId,
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers["user-agent"],
    });
  });

  app.addHook("onResponse", async (request, reply) => {
    logger.info("Request completed", {
      requestId: (request as any).requestId,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime.toFixed(2),
    });
  });

  // ── Security plugins ───────────────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  });

  await app.register(cors, {
    origin: config.cors.origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "X-Tenant-ID",
      "X-Tenant-Slug",
      "X-Request-ID",
      "X-API-Key",
    ],
    exposedHeaders: ["X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
  });

  await app.register(multipart, {
    limits: {
      fileSize: config.storage.maxFileSizeMb * 1024 * 1024,
      files: 10,
    },
  });

  // ── Rate limiting ──────────────────────────────────────────────────────
  await app.register(rateLimitPlugin);

  // ── API Documentation ──────────────────────────────────────────────────
  if (!config.isProduction) {
    await app.register(swaggerPlugin);
  }

  // ── WebSocket ──────────────────────────────────────────────────────────
  await app.register(websocketPlugin);

  // ── Health check (no auth required) ───────────────────────────────────
  app.get("/health", async () => ({
    status: "ok",
    service: "360crd-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  }));

  app.get("/ping", async () => "pong");

  // ── Local file serving (dev only, when STORAGE_PROVIDER=local) ────────────
  if (config.storage.provider === "local") {
    const uploadsDir = path.join(process.cwd(), "uploads");
    app.get("/uploads/*", async (req, reply) => {
      const key = (req.params as any)["*"];
      const filePath = path.join(uploadsDir, key);
      if (!filePath.startsWith(uploadsDir) || !existsSync(filePath)) {
        return reply.status(404).send({ success: false, error: { code: "NOT_FOUND", message: "File not found" } });
      }
      const EXT_MIME: Record<string, string> = {
        ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
        ".svg": "image/svg+xml", ".txt": "text/plain", ".csv": "text/csv",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls": "application/vnd.ms-excel",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc": "application/msword", ".zip": "application/zip",
        ".mp4": "video/mp4", ".mp3": "audio/mpeg",
      };
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = EXT_MIME[ext] ?? "application/octet-stream";
      const filename = path.basename(filePath);
      reply.header("Content-Type", mimeType);
      reply.header("Content-Disposition", `inline; filename="${filename}"`);
      return reply.send(createReadStream(filePath));
    });
  }

  // ── API v1 Routes ──────────────────────────────────────────────────────
  await app.register(async (v1) => {
    // Public routes — no auth required, tenant resolved by header/subdomain
    await v1.register(authRoutes, { prefix: "/auth" });
    await v1.register(publicRoutes, { prefix: "/public" });

    // Tenant-aware routes
    await v1.register(async (tenant) => {
      // All routes in here require tenant resolution via middleware
      await tenant.register(tenantRoutes, { prefix: "/tenants" });
      await tenant.register(userRoutes, { prefix: "/users" });
      await tenant.register(customerRoutes, { prefix: "/customers" });
      await tenant.register(roleRoutes, { prefix: "/roles" });
      await tenant.register(siteRoutes, { prefix: "/sites" });
      await tenant.register(incidentRoutes, { prefix: "/incidents" });
      await tenant.register(auditRoutes, { prefix: "/audits" });
      await tenant.register(trainingRoutes, { prefix: "/training" });
      await tenant.register(inductionRoutes, { prefix: "/inductions" });
      await tenant.register(ppeRoutes, { prefix: "/ppe" });
      await tenant.register(assetRoutes, { prefix: "/assets" });
      await tenant.register(wasteRoutes, { prefix: "/waste" });
      await tenant.register(documentRoutes, { prefix: "/documents" });
      await tenant.register(formFieldRoutes, { prefix: "/form-fields" });
      await tenant.register(notificationRoutes, { prefix: "/notifications" });
      await tenant.register(reportRoutes, { prefix: "/reports" });
      await tenant.register(activityRoutes, { prefix: "/activity" });
      await tenant.register(webhookRoutes, { prefix: "/webhooks" });
      await tenant.register(feedbackRoutes, { prefix: "/feedback" });
      await tenant.register(settingsRoutes, { prefix: "/settings" });
    });
  }, { prefix: "/api/v1" });

  // ── 404 handler ─────────────────────────────────────────────────────────
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Route ${request.method} ${request.url} not found`,
        requestId: (request as any).requestId,
      },
    });
  });

  // ── Global error handler ────────────────────────────────────────────────
  app.setErrorHandler(errorHandler);

  return app;
}
