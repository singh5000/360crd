import { prisma, basePrisma } from "@360crd/database";
import type { CreateSiteDtoType, ListSitesDtoType, UpdateSiteDtoType } from "./site.dto";
import type { PaginatedResult } from "@360crd/shared-types";

const SITE_SELECT = {
  id: true, tenantId: true, name: true, code: true,
  type: true, status: true, address: true, city: true,
  state: true, country: true, postalCode: true,
  latitude: true, longitude: true, timezone: true,
  contactName: true, contactEmail: true, contactPhone: true,
  customerId: true, metadata: true, createdAt: true, updatedAt: true,
};

export class SiteRepository {
  async create(tenantId: string, data: CreateSiteDtoType) {
    return prisma.site.create({
      data: {
        tenantId,
        name: data.name,
        code: data.code,
        type: data.type as any,
        status: data.status as any,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        latitude: data.latitude as any,
        longitude: data.longitude as any,
        timezone: data.timezone,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        customerId: data.customerId,
        metadata: data.metadata,
      },
      select: SITE_SELECT,
    });
  }

  async findMany(
    tenantId: string,
    query: ListSitesDtoType,
    restrictToSiteIds?: string[]
  ): Promise<PaginatedResult<any>> {
    const skip = (query.page - 1) * query.limit;

    const where: any = {
      tenantId,
      deletedAt: null,
      ...(restrictToSiteIds?.length && { id: { in: restrictToSiteIds } }),
      ...(query.status && { status: query.status }),
      ...(query.type && { type: query.type }),
      ...(query.customerId && { customerId: query.customerId }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { code: { contains: query.search, mode: "insensitive" } },
          { city: { contains: query.search, mode: "insensitive" } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.site.count({ where }),
      prisma.site.findMany({
        where, skip, take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: {
          ...SITE_SELECT,
          customer: { select: { id: true, name: true, code: true } },
          _count: { select: { incidents: true, audits: true, assets: true } },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total, page: query.page, limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
        hasNextPage: query.page < Math.ceil(total / query.limit),
        hasPrevPage: query.page > 1,
      },
    };
  }

  async findById(id: string) {
    return prisma.site.findFirst({
      where: { id, deletedAt: null },
      select: {
        ...SITE_SELECT,
        customer: { select: { id: true, name: true, code: true, email: true } },
        _count: { select: { incidents: true, audits: true, assets: true, wasteRecords: true } },
      },
    });
  }

  async update(id: string, data: UpdateSiteDtoType) {
    return prisma.site.update({
      where: { id },
      data: {
        ...data,
        type: data.type as any,
        status: data.status as any,
        latitude: data.latitude as any,
        longitude: data.longitude as any,
      },
      select: SITE_SELECT,
    });
  }

  async softDelete(id: string) {
    return prisma.site.update({
      where: { id },
      data: { deletedAt: new Date(), status: "CLOSED" as any },
    });
  }

  // ── Staff assignment ──────────────────────────────────────────────────────
  async getStaff(siteId: string) {
    return basePrisma.userSite.findMany({
      where: { siteId },
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true, email: true,
            type: true, status: true, jobTitle: true, department: true,
            avatarUrl: true, lastLoginAt: true,
          },
        },
      },
    });
  }

  async assignStaff(siteId: string, userIds: string[]) {
    // Clear existing and replace
    await basePrisma.userSite.deleteMany({ where: { siteId } });
    if (userIds.length === 0) return;
    await basePrisma.userSite.createMany({
      data: userIds.map(userId => ({ userId, siteId })),
      skipDuplicates: true,
    });
  }

  async addStaffMember(siteId: string, userId: string) {
    return basePrisma.userSite.upsert({
      where: { userId_siteId: { userId, siteId } },
      update: {},
      create: { userId, siteId },
    });
  }

  async removeStaffMember(siteId: string, userId: string) {
    return basePrisma.userSite.deleteMany({ where: { siteId, userId } });
  }

  // ── Documents ─────────────────────────────────────────────────────────────
  async getDocuments(tenantId: string, siteId: string) {
    return basePrisma.document.findMany({
      where: { tenantId, deletedAt: null, tags: { has: `site:${siteId}` } },
      select: {
        id: true, title: true, filename: true, fileUrl: true,
        category: true, version: true, status: true,
        fileSize: true, mimeType: true, createdAt: true,
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ── Activity timeline ─────────────────────────────────────────────────────
  async getActivity(tenantId: string, siteId: string, limit = 50) {
    const [incidents, audits, logs] = await Promise.all([
      basePrisma.incident.findMany({
        where: { tenantId, siteId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: Math.floor(limit / 3),
        select: {
          id: true, refNumber: true, title: true, severity: true,
          status: true, createdAt: true,
          reportedBy: { select: { firstName: true, lastName: true } },
        },
      }),
      basePrisma.audit.findMany({
        where: { tenantId, siteId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: Math.floor(limit / 3),
        select: {
          id: true, refNumber: true, title: true, status: true,
          score: true, percentage: true, createdAt: true,
          assignedTo: { select: { firstName: true, lastName: true } },
        },
      }),
      basePrisma.activityLog.findMany({
        where: { tenantId, resourceId: siteId },
        orderBy: { createdAt: "desc" },
        take: Math.floor(limit / 3),
        select: {
          id: true, action: true, description: true,
          resource: true, ipAddress: true, createdAt: true,
          user: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    // Merge and sort by date
    const timeline = [
      ...incidents.map(i => ({ type: "incident", ...i })),
      ...audits.map(a => ({ type: "audit", ...a })),
      ...logs.map(l => ({ type: "activity", ...l })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return timeline;
  }

  // ── Compliance score ──────────────────────────────────────────────────────
  async getCompliance(tenantId: string, siteId: string) {
    const [incidentStats, auditStats, overdueAudits, openIncidents, auditScore] = await Promise.all([
      basePrisma.incident.groupBy({
        by: ["severity"],
        where: { tenantId, siteId, deletedAt: null },
        _count: { id: true },
      }),
      basePrisma.audit.groupBy({
        by: ["status"],
        where: { tenantId, siteId, deletedAt: null },
        _count: { id: true },
      }),
      basePrisma.audit.count({
        where: {
          tenantId, siteId, deletedAt: null,
          status: { notIn: ["COMPLETED", "REVIEWED", "ARCHIVED", "CANCELLED"] },
          dueDate: { lt: new Date() },
        },
      }),
      basePrisma.incident.count({
        where: { tenantId, siteId, deletedAt: null, status: { notIn: ["CLOSED", "CANCELLED"] } },
      }),
      basePrisma.audit.aggregate({
        where: { tenantId, siteId, percentage: { not: null } },
        _avg: { percentage: true },
      }),
    ]);

    return {
      complianceScore: Math.round(auditScore._avg.percentage || 0),
      overdueAudits,
      openIncidents,
      incidentsBySeverity: incidentStats.reduce((acc: any, r) => {
        acc[r.severity.toLowerCase()] = r._count.id;
        return acc;
      }, {}),
      auditsByStatus: auditStats.reduce((acc: any, r) => {
        acc[r.status.toLowerCase()] = r._count.id;
        return acc;
      }, {}),
    };
  }
}
