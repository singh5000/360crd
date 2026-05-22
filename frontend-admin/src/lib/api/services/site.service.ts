import { apiClient } from "../api-client";
import { ENDPOINTS } from "../endpoints";

export interface Site {
  id: string;
  tenantId: string;
  customerId?: string | null;
  name: string;
  code: string;
  type: string;
  status: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  capacity?: number | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string } | null;
  _count?: { incidents: number; audits: number; users: number };
}

export interface SiteStats {
  total: number;
  active: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface ListSitesParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  customerId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateSitePayload {
  name: string;
  code: string;
  type: string;
  status?: string;
  customerId?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const wrap = <T>(res: { success: boolean; data: T }) => res.data;

export const siteService = {
  list: (params?: ListSitesParams) =>
    apiClient.get<{ success: true; data: Site[]; meta: any }>(ENDPOINTS.sites.list, params as any),

  get: (id: string) =>
    apiClient.get<{ success: true; data: Site }>(ENDPOINTS.sites.detail(id)).then(wrap),

  create: (payload: CreateSitePayload) =>
    apiClient.post<{ success: true; data: Site }>(ENDPOINTS.sites.create, payload).then(wrap),

  update: (id: string, payload: Partial<CreateSitePayload>) =>
    apiClient.patch<{ success: true; data: Site }>(ENDPOINTS.sites.update(id), payload).then(wrap),

  remove: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.sites.remove(id)),

  stats: () =>
    apiClient.get<{ success: true; data: SiteStats }>(ENDPOINTS.sites.stats).then(wrap),
};
