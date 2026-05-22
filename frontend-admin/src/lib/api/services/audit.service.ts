import { apiClient } from "../api-client";
import { ENDPOINTS } from "../endpoints";

export interface AuditUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  type: string;
  severity: string;
  status: string;
  title: string;
  description?: string | null;
  location?: string | null;
  dueDate?: string | null;
  assignedToId?: string | null;
  closedAt?: string | null;
  createdAt: string;
}

export interface Audit {
  id: string;
  tenantId: string;
  refNumber: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  dueDate?: string | null;
  score?: number | null;
  maxScore?: number | null;
  percentage?: number | null;
  grade?: string | null;
  passed?: boolean | null;
  siteId?: string | null;
  customerId?: string | null;
  assignedToId?: string | null;
  templateId?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo?: AuditUser | null;
  completedBy?: AuditUser | null;
  site?: { id: string; name: string; code: string } | null;
  customer?: { id: string; name: string } | null;
  auditFindings?: AuditFinding[];
  _count?: { responses: number; auditFindings: number };
}

export interface AuditStats {
  total: number;
  completed: number;
  overdue: number;
  avgScore: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
}

export interface ListAuditsParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  siteId?: string;
  customerId?: string;
  assignedToId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateAuditPayload {
  tenantId?: string;
  title: string;
  description?: string;
  type: string;
  templateId?: string;
  siteId?: string;
  customerId?: string;
  assignedToId?: string;
  scheduledAt?: string;
  dueDate?: string;
}

const wrap = <T>(res: { success: boolean; data: T }) => res.data;

export const auditService = {
  list: (params?: ListAuditsParams) =>
    apiClient.get<{ success: true; data: Audit[]; meta: any }>(ENDPOINTS.audits.list, params as any),

  get: (id: string) =>
    apiClient.get<{ success: true; data: Audit }>(ENDPOINTS.audits.detail(id)).then(wrap),

  create: (payload: CreateAuditPayload) =>
    apiClient.post<{ success: true; data: Audit }>(ENDPOINTS.audits.create, payload).then(wrap),

  update: (id: string, payload: Partial<CreateAuditPayload>) =>
    apiClient.patch<{ success: true; data: Audit }>(ENDPOINTS.audits.update(id), payload).then(wrap),

  remove: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.audits.remove(id)),

  stats: (params?: { dateFrom?: string; dateTo?: string; siteId?: string }) =>
    apiClient.get<{ success: true; data: AuditStats }>(ENDPOINTS.audits.stats, params as any).then(wrap),

  start: (id: string) =>
    apiClient.put<{ success: true; data: Audit }>(ENDPOINTS.audits.start(id), {}).then(wrap),

  complete: (id: string, payload: { score?: number; maxScore?: number; notes?: string }) =>
    apiClient.put<{ success: true; data: Audit }>(ENDPOINTS.audits.complete(id), payload).then(wrap),

  cancel: (id: string, reason?: string) =>
    apiClient.put<{ success: true; data: Audit }>(ENDPOINTS.audits.cancel(id), { reason }).then(wrap),

  getFindings: (id: string) =>
    apiClient.get<{ success: true; data: AuditFinding[] }>(ENDPOINTS.audits.findings(id)).then(wrap),

  createFinding: (id: string, payload: { type: string; severity: string; title: string; description?: string; location?: string; dueDate?: string; assignedToId?: string }) =>
    apiClient.post<{ success: true; data: AuditFinding }>(ENDPOINTS.audits.findings(id), payload).then(wrap),

  updateFinding: (id: string, findingId: string, payload: Partial<{ status: string; closedAt: string }>) =>
    apiClient.patch<{ success: true; data: AuditFinding }>(ENDPOINTS.audits.finding(id, findingId), payload).then(wrap),

  listTemplates: () =>
    apiClient.get<{ success: true; data: any[] }>(ENDPOINTS.audits.templates).then(wrap),
};
