import { apiClient } from "../api-client";
import { ENDPOINTS } from "../endpoints";

export interface IncidentUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

export interface IncidentSite {
  id: string;
  name: string;
  code: string;
  city?: string | null;
}

export interface IncidentCustomer {
  id: string;
  name: string;
}

export interface IncidentCAPA {
  id: string;
  incidentId: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  completedAt?: string | null;
  assignedToId?: string | null;
  assignedTo?: Pick<IncidentUser, "id" | "firstName" | "lastName"> | null;
  createdAt: string;
}

export interface IncidentEvidence {
  id: string;
  incidentId: string;
  type: string;
  fileUrl: string;
  filename: string;
  fileSize?: number | null;
  mimeType?: string | null;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Incident {
  id: string;
  tenantId: string;
  reportedById: string;
  refNumber: string;
  title: string;
  description?: string | null;
  category?: string | null;
  subcategory?: string | null;
  type: string;
  severity: string;
  priority: string;
  status: string;
  occurredAt: string;
  siteId?: string | null;
  customerId?: string | null;
  assignedToId?: string | null;
  location?: string | null;
  isAnonymous: boolean;
  isNotifiable: boolean;
  createdAt: string;
  updatedAt: string;
  reportedBy: IncidentUser;
  assignedTo?: IncidentUser | null;
  site?: IncidentSite | null;
  customer?: IncidentCustomer | null;
  capas: IncidentCAPA[];
  evidence: IncidentEvidence[];
}

export interface IncidentStats {
  total: number;
  open: number;
  overdue: number;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
}

export interface ListIncidentsParams {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
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

export interface CreateIncidentPayload {
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;
  type: string;
  severity: string;
  priority: string;
  occurredAt: string;
  siteId?: string;
  customerId?: string;
  assignedToId?: string;
  location?: string;
  isAnonymous?: boolean;
  isNotifiable?: boolean;
  injuryType?: string;
  bodyPart?: string;
  injuredPersons?: number;
  immediateActions?: string;
}

const wrap = <T>(res: { success: boolean; data: T }) => res.data;

export const incidentService = {
  list: (params?: ListIncidentsParams) =>
    apiClient.get<{ success: true; data: Incident[]; meta: any }>(ENDPOINTS.incidents.list, params as any),

  get: (id: string) =>
    apiClient.get<{ success: true; data: Incident }>(ENDPOINTS.incidents.detail(id)).then(wrap),

  create: (payload: CreateIncidentPayload) =>
    apiClient.post<{ success: true; data: Incident }>(ENDPOINTS.incidents.create, payload).then(wrap),

  update: (id: string, payload: Partial<CreateIncidentPayload>) =>
    apiClient.patch<{ success: true; data: Incident }>(ENDPOINTS.incidents.update(id), payload).then(wrap),

  remove: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.incidents.remove(id)),

  stats: (params?: { dateFrom?: string; dateTo?: string; siteId?: string }) =>
    apiClient.get<{ success: true; data: IncidentStats }>(ENDPOINTS.incidents.stats, params as any).then(wrap),

  assign: (id: string, userId: string) =>
    apiClient.put<{ success: true; data: Incident }>(ENDPOINTS.incidents.assign(id), { userId }).then(wrap),

  investigate: (id: string) =>
    apiClient.put<{ success: true; data: Incident }>(ENDPOINTS.incidents.investigate(id), {}).then(wrap),

  close: (id: string, closeReason?: string) =>
    apiClient.put<{ success: true; data: Incident }>(ENDPOINTS.incidents.close(id), { closeReason }).then(wrap),

  cancel: (id: string, reason?: string) =>
    apiClient.put<{ success: true; data: Incident }>(ENDPOINTS.incidents.cancel(id), { reason }).then(wrap),

  getEvidence: (id: string) =>
    apiClient.get<{ success: true; data: IncidentEvidence[] }>(ENDPOINTS.incidents.evidence(id)).then(wrap),

  deleteEvidence: (id: string, evidenceId: string) =>
    apiClient.delete<void>(ENDPOINTS.incidents.evidenceItem(id, evidenceId)),

  getCapas: (id: string) =>
    apiClient.get<{ success: true; data: IncidentCAPA[] }>(ENDPOINTS.incidents.capas(id)).then(wrap),

  createCapa: (id: string, payload: { title: string; description?: string; type: string; priority: string; dueDate?: string; assignedToId?: string }) =>
    apiClient.post<{ success: true; data: IncidentCAPA }>(ENDPOINTS.incidents.capas(id), payload).then(wrap),

  updateCapa: (id: string, capaId: string, payload: Partial<{ title: string; description: string; status: string; priority: string; dueDate: string; completedAt: string }>) =>
    apiClient.patch<{ success: true; data: IncidentCAPA }>(ENDPOINTS.incidents.capa(id, capaId), payload).then(wrap),

  deleteCapa: (id: string, capaId: string) =>
    apiClient.delete<void>(ENDPOINTS.incidents.capa(id, capaId)),

  verifyCapa: (id: string, capaId: string, notes?: string) =>
    apiClient.put<{ success: true; data: IncidentCAPA }>(ENDPOINTS.incidents.capaVerify(id, capaId), { notes }).then(wrap),
};
