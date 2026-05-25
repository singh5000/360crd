import { prisma, basePrisma } from "@360crd/database";
import type { CreateIncidentDtoType, ListIncidentsDtoType } from "./incident.dto";
import type { PaginatedResult } from "@360crd/shared-types";

export class IncidentRepository {
  async create(tenantId: string, reportedById: string, refNumber: string, data: CreateIncidentDtoType) {
    return prisma.incident.create({
      data: {
        tenantId,
        reportedById,
        refNumber,
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        type: data.type as any,
        severity: data.severity as any,
        priority: data.priority,
        status: "REPORTED",
        occurredAt: new Date(data.occurredAt),
        siteId: data.siteId,
        customerId: data.customerId,
        assignedToId: data.assignedToId,
        location: data.location,
        injuryType: data.injuryType,
        bodyPart: data.bodyPart,
        injuredPersons: data.injuredPersons,
        immediateActions: data.immediateActions,
        isAnonymous: data.isAnonymous,
        isNotifiable: data.isNotifiable,
        latitude: data.latitude as any,
        longitude: data.longitude as any,
        metadata: data.metadata as any,
      },
      include: this.includeRelations(),
    });
  }

  async findById(id: string) {
    return prisma.incident.findFirst({
      where: { id, deletedAt: null },
      include: this.includeRelations(),
    });
  }

  async findMany(
    tenantId: string,
    query: ListIncidentsDtoType,
    restrictToSiteIds?: string[]
  ): Promise<PaginatedResult<any>> {
    const skip = (query.page - 1) * query.limit;

    const where: any = {
      tenantId,
      deletedAt: null,
      ...(restrictToSiteIds?.length && { siteId: { in: restrictToSiteIds } }),
      ...(query.status && { status: query.status }),
      ...(query.severity && { severity: query.severity }),
      ...(query.type && { type: query.type }),
      ...(query.siteId && { siteId: query.siteId }),
      ...(query.customerId && { customerId: query.customerId }),
      ...(query.assignedToId && { assignedToId: query.assignedToId }),
      ...(query.dateFrom || query.dateTo
        ? {
            occurredAt: {
              ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
              ...(query.dateTo && { lte: new Date(query.dateTo) }),
            },
          }
        : {}),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: "insensitive" } },
          { description: { contains: query.search, mode: "insensitive" } },
          { refNumber: { contains: query.search, mode: "insensitive" } },
          { location: { contains: query.search, mode: "insensitive" } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.incident.count({ where }),
      prisma.incident.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        include: {
          reportedBy: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          site: { select: { id: true, name: true, code: true } },
          customer: { select: { id: true, name: true } },
          _count: { select: { capas: true, evidence: true } },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        hasNextPage: query.page < Math.ceil(total / query.limit),
        hasPrevPage: query.page > 1,
      },
    };
  }

  async update(id: string, data: Partial<any>) {
    return prisma.incident.update({
      where: { id },
      data,
      include: this.includeRelations(),
    });
  }

  async softDelete(id: string) {
    return prisma.incident.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ── CAPA ────────────────────────────────────────────────────────────────────
  async createCAPA(tenantId: string, incidentId: string, data: any) {
    return prisma.incidentCAPA.create({
      data: { tenantId, incidentId, ...data },
      include: { assignedTo: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async updateCAPA(id: string, data: Partial<any>) {
    return prisma.incidentCAPA.update({
      where: { id },
      data,
      include: { assignedTo: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findCapasByIncident(incidentId: string) {
    return prisma.incidentCAPA.findMany({
      where: { incidentId },
      orderBy: { createdAt: "asc" },
      include: { assignedTo: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findCapaById(id: string) {
    return basePrisma.incidentCAPA.findUnique({ where: { id } });
  }

  async deleteCAPA(id: string) {
    return basePrisma.incidentCAPA.delete({ where: { id } });
  }

  // ── Evidence ─────────────────────────────────────────────────────────────────
  async getEvidence(incidentId: string) {
    return prisma.incidentEvidence.findMany({
      where: { incidentId },
      orderBy: { uploadedAt: "asc" },
    });
  }

  async addEvidence(tenantId: string, incidentId: string, uploadedById: string, data: {
    type: string; fileUrl: string; filename: string;
    fileSize?: number; mimeType?: string;
  }) {
    return prisma.incidentEvidence.create({
      data: {
        tenantId,
        incidentId,
        uploadedBy: uploadedById,
        type: data.type as any,
        fileUrl: data.fileUrl,
        filename: data.filename,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      },
    });
  }

  async deleteEvidence(id: string) {
    return basePrisma.incidentEvidence.delete({ where: { id } });
  }

  // ── Stats ─────────────────────────────────────────────────────────────────────
  async getStats(tenantId: string, dateFrom?: Date, dateTo?: Date, siteIds?: string[]) {
    const where: any = {
      tenantId,
      deletedAt: null,
      ...(siteIds && { siteId: { in: siteIds } }),
      ...(dateFrom || dateTo
        ? { occurredAt: { ...(dateFrom && { gte: dateFrom }), ...(dateTo && { lte: dateTo }) } }
        : {}),
    };

    const [total, bySeverity, byStatus, byType, open, overdue] = await Promise.all([
      prisma.incident.count({ where }),
      prisma.incident.groupBy({ by: ["severity"], where, _count: true }),
      prisma.incident.groupBy({ by: ["status"], where, _count: true }),
      prisma.incident.groupBy({ by: ["type"], where, _count: true }),
      prisma.incident.count({ where: { ...where, status: { notIn: ["CLOSED", "CANCELLED"] } } }),
      prisma.incident.count({
        where: {
          ...where,
          status: { notIn: ["CLOSED", "CANCELLED"] },
          occurredAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      total,
      open,
      overdue,
      bySeverity: bySeverity.reduce((acc: any, r) => { acc[r.severity] = r._count; return acc; }, {}),
      byStatus: byStatus.reduce((acc: any, r) => { acc[r.status] = r._count; return acc; }, {}),
      byType: byType.reduce((acc: any, r) => { acc[r.type] = r._count; return acc; }, {}),
    };
  }

  async generateRefNumber(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.incident.count({
      where: { tenantId, refNumber: { startsWith: `INC-${year}-` } },
    });
    return `INC-${year}-${String(count + 1).padStart(4, "0")}`;
  }

  private includeRelations() {
    return {
      reportedBy: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      assignedTo: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      site: { select: { id: true, name: true, code: true, city: true } },
      customer: { select: { id: true, name: true } },
      capas: {
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "asc" as const },
      },
      evidence: { orderBy: { uploadedAt: "asc" as const } },
    };
  }
}
