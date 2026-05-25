import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { IncidentService } from "./incident.service";
import { UserRepository } from "../users/user.repository";
import {
  CreateIncidentDto, UpdateIncidentDto, ListIncidentsDto,
  CreateCAPADto, UpdateCAPADto,
} from "./incident.dto";
import { ValidationError, NotFoundError, ForbiddenError } from "../../shared/errors/http.errors";

const svc = new IncidentService();
const userRepo = new UserRepository();

export default async function incidentRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // ── Stats ────────────────────────────────────────────────────────────────────
  fastify.get("/stats", { preHandler: [authorize("incident:read")] }, async (req, reply) => {
    const r = req as any;
    const { dateFrom, dateTo } = req.query as any;

    let siteIds: string[] | undefined;
    if (!r.isSuperAdmin && ["MANAGER", "STAFF"].includes(r.userType)) {
      const userSites = await userRepo.getUserSites(r.userId);
      if (userSites.length > 0) {
        siteIds = userSites.map((s: any) => s.siteId);
      }
    }

    const stats = await svc.getStats(r.tenantId, dateFrom, dateTo, siteIds);
    return reply.send({ success: true, data: stats });
  });

  // ── List incidents ────────────────────────────────────────────────────────────
  fastify.get("/", { preHandler: [authorize("incident:read")] }, async (req, reply) => {
    const r = req as any;
    const query = ListIncidentsDto.safeParse(req.query);
    if (!query.success) throw new ValidationError("Invalid query", query.error.errors);

    // Customer users only see their own company data
    if (r.userType === "CUSTOMER" && r.customerId) {
      (query.data as any).customerId = r.customerId;
    }

    // Managers + Staff only see incidents from their assigned sites
    let restrictToSiteIds: string[] | undefined;
    if (!r.isSuperAdmin && ["MANAGER", "STAFF"].includes(r.userType)) {
      const userSites = await userRepo.getUserSites(r.userId);
      if (userSites.length > 0) {
        restrictToSiteIds = userSites.map((s: any) => s.siteId);
      }
    }

    const result = await svc.findMany(r.tenantId, query.data, restrictToSiteIds);
    return reply.send({ success: true, ...result });
  });

  // ── Create incident ───────────────────────────────────────────────────────────
  fastify.post("/", { preHandler: [authorize("incident:create")] }, async (req, reply) => {
    const r = req as any;
    const body = CreateIncidentDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    // Staff creating an incident — tag it with one of their sites if none provided
    if (!r.isSuperAdmin && r.userType === "STAFF" && !body.data.siteId) {
      const userSites = await userRepo.getUserSites(r.userId);
      if (userSites.length > 0) {
        (body.data as any).siteId = userSites[0].siteId;
      }
    }

    const incident = await svc.create(r.tenantId, r.userId, body.data, { ipAddress: req.ip });
    return reply.status(201).send({ success: true, data: incident });
  });

  // ── Get incident detail ───────────────────────────────────────────────────────
  fastify.get("/:id", { preHandler: [authorize("incident:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const incident = await svc.findById(id);

    // Managers/Staff can only view incidents in their sites
    if (!r.isSuperAdmin && ["MANAGER", "STAFF"].includes(r.userType) && incident.siteId) {
      const userSites = await userRepo.getUserSites(r.userId);
      const allowed = userSites.some((s: any) => s.siteId === incident.siteId);
      if (!allowed) throw new ForbiddenError("You do not have access to this incident");
    }

    return reply.send({ success: true, data: incident });
  });

  // ── Update incident ───────────────────────────────────────────────────────────
  fastify.patch("/:id", { preHandler: [authorize("incident:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = UpdateIncidentDto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const incident = await svc.update(id, r.tenantId, r.userId, body.data, { ipAddress: req.ip });
    return reply.send({ success: true, data: incident });
  });

  // ── Delete incident ───────────────────────────────────────────────────────────
  fastify.delete("/:id", { preHandler: [authorize("incident:delete")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    await svc.delete(id, r.tenantId, r.userId);
    return reply.status(204).send();
  });

  // ── Assign incident ───────────────────────────────────────────────────────────
  fastify.put("/:id/assign", { preHandler: [authorize("incident:assign")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const { assignedToId } = req.body as { assignedToId: string };
    if (!assignedToId) throw new ValidationError("assignedToId is required", []);

    const incident = await svc.update(id, r.tenantId, r.userId, { assignedToId } as any, { ipAddress: req.ip });
    return reply.send({ success: true, data: incident });
  });

  // ── Status transitions ────────────────────────────────────────────────────────
  fastify.put("/:id/investigate", { preHandler: [authorize("incident:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const { notes } = req.body as any;
    const incident = await svc.update(
      id, r.tenantId, r.userId,
      { status: "UNDER_INVESTIGATION", immediateActions: notes } as any,
      { ipAddress: req.ip }
    );
    return reply.send({ success: true, data: incident });
  });

  fastify.put("/:id/close", { preHandler: [authorize("incident:approve")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const { rootCause, notes } = req.body as any;
    const incident = await svc.update(
      id, r.tenantId, r.userId,
      { status: "CLOSED", rootCause, closedAt: new Date().toISOString() } as any,
      { ipAddress: req.ip }
    );
    return reply.send({ success: true, data: incident });
  });

  fastify.put("/:id/cancel", { preHandler: [authorize("incident:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const incident = await svc.update(
      id, r.tenantId, r.userId,
      { status: "CANCELLED" } as any,
      { ipAddress: req.ip }
    );
    return reply.send({ success: true, data: incident });
  });

  // ── Evidence ──────────────────────────────────────────────────────────────────
  fastify.get("/:id/evidence", { preHandler: [authorize("incident:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    // Ensure incident exists
    await svc.findById(id);
    const { IncidentRepository } = await import("./incident.repository");
    const repo = new IncidentRepository();
    const evidence = await repo.getEvidence(id);
    return reply.send({ success: true, data: evidence });
  });

  fastify.post("/:id/evidence", { preHandler: [authorize("incident:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = req.body as any;

    if (!body?.fileUrl || !body?.filename) {
      throw new ValidationError("fileUrl and filename are required", []);
    }

    await svc.findById(id);

    const { IncidentRepository } = await import("./incident.repository");
    const repo = new IncidentRepository();
    const evidence = await repo.addEvidence(r.tenantId, id, r.userId, {
      type: body.type || "PHOTO",
      fileUrl: body.fileUrl,
      filename: body.filename,
      fileSize: body.fileSize,
      mimeType: body.mimeType,
    });

    return reply.status(201).send({ success: true, data: evidence });
  });

  fastify.delete("/:id/evidence/:evidenceId", { preHandler: [authorize("incident:update")] }, async (req, reply) => {
    const { evidenceId } = req.params as { id: string; evidenceId: string };
    const { IncidentRepository } = await import("./incident.repository");
    const repo = new IncidentRepository();
    await repo.deleteEvidence(evidenceId);
    return reply.status(204).send();
  });

  // ── CAPA (Corrective & Preventive Actions) ────────────────────────────────────
  fastify.get("/:id/capas", { preHandler: [authorize("incident:read")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await svc.findById(id);
    const { IncidentRepository } = await import("./incident.repository");
    const repo = new IncidentRepository();
    const capas = await repo.findCapasByIncident(id);
    return reply.send({ success: true, data: capas });
  });

  fastify.post("/:id/capas", { preHandler: [authorize("incident:update")] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = req as any;
    const body = CreateCAPADto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const capa = await svc.createCAPA(id, r.tenantId, r.userId, body.data);
    return reply.status(201).send({ success: true, data: capa });
  });

  fastify.patch("/:id/capas/:capaId", { preHandler: [authorize("incident:update")] }, async (req, reply) => {
    const { capaId } = req.params as { id: string; capaId: string };
    const r = req as any;
    const body = UpdateCAPADto.safeParse(req.body);
    if (!body.success) throw new ValidationError("Validation failed", body.error.errors);

    const capa = await svc.updateCAPA(capaId, r.tenantId, r.userId, body.data);
    return reply.send({ success: true, data: capa });
  });

  fastify.put("/:id/capas/:capaId/verify", { preHandler: [authorize("incident:approve")] }, async (req, reply) => {
    const { capaId } = req.params as { id: string; capaId: string };
    const r = req as any;
    const { effectiveness } = req.body as any;
    const capa = await svc.updateCAPA(capaId, r.tenantId, r.userId, {
      status: "VERIFIED",
      effectiveness,
    } as any);
    return reply.send({ success: true, data: capa });
  });

  fastify.delete("/:id/capas/:capaId", { preHandler: [authorize("incident:update")] }, async (req, reply) => {
    const { capaId } = req.params as { id: string; capaId: string };
    const { IncidentRepository } = await import("./incident.repository");
    const repo = new IncidentRepository();
    const existing = await repo.findCapaById(capaId);
    if (!existing) throw new NotFoundError("CAPA", capaId);
    await repo.deleteCAPA(capaId);
    return reply.status(204).send();
  });
}
