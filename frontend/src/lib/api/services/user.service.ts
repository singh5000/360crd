import { apiClient } from "../api-client";
import { ENDPOINTS } from "../endpoints";

export interface UserRole {
  id: string;
  name: string;
  slug: string;
  level: number;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  status: string;
  jobTitle?: string | null;
  department?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  employeeId?: string | null;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
  sites?: { id: string; name: string; code: string }[];
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  jobTitle?: string;
  department?: string;
  phone?: string;
  employeeId?: string;
  password?: string;
  roleIds?: string[];
  siteIds?: string[];
}

const wrap = <T>(res: { success: boolean; data: T }) => res.data;

export const userService = {
  list: (params?: ListUsersParams) =>
    apiClient.get<{ success: true; data: User[]; meta: any }>(ENDPOINTS.users.list, params as any),

  me: () =>
    apiClient.get<{ success: true; data: User }>(ENDPOINTS.users.me).then(wrap),

  get: (id: string) =>
    apiClient.get<{ success: true; data: User }>(ENDPOINTS.users.detail(id)).then(wrap),

  create: (payload: CreateUserPayload) =>
    apiClient.post<{ success: true; data: User }>(ENDPOINTS.users.create, payload).then(wrap),

  update: (id: string, payload: Partial<CreateUserPayload>) =>
    apiClient.patch<{ success: true; data: User }>(ENDPOINTS.users.update(id), payload).then(wrap),

  remove: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.users.remove(id)),

  updateStatus: (id: string, status: string) =>
    apiClient.put<{ success: true; data: User }>(ENDPOINTS.users.status(id), { status }).then(wrap),

  assignRole: (id: string, roleId: string) =>
    apiClient.post<{ success: true }>(ENDPOINTS.users.roles(id), { roleId }),

  revokeRole: (id: string, roleId: string) =>
    apiClient.delete<void>(ENDPOINTS.users.revokeRole(id, roleId)),

  resendInvite: (id: string) =>
    apiClient.post<{ success: true }>(ENDPOINTS.users.resendInvite(id), {}),

  getSites: (id: string) =>
    apiClient.get<{ success: true; data: any[] }>(ENDPOINTS.users.sites(id)).then(wrap),
};
