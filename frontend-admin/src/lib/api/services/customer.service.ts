import { apiClient } from "../api-client";
import { ENDPOINTS } from "../endpoints";

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: string;
  status: string;
  industry?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  logoUrl?: string | null;
  contractStart?: string | null;
  contractEnd?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { sites: number; incidents: number; audits: number };
}

export interface ListCustomersParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  industry?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateCustomerPayload {
  name: string;
  code: string;
  type?: string;
  status?: string;
  industry?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  contractStart?: string;
  contractEnd?: string;
}

const wrap = <T>(res: { success: boolean; data: T }) => res.data;

export const customerService = {
  list: (params?: ListCustomersParams) =>
    apiClient.get<{ success: true; data: Customer[]; meta: any }>(ENDPOINTS.customers.list, params as any),

  get: (id: string) =>
    apiClient.get<{ success: true; data: Customer }>(ENDPOINTS.customers.detail(id)).then(wrap),

  create: (payload: CreateCustomerPayload) =>
    apiClient.post<{ success: true; data: Customer }>(ENDPOINTS.customers.create, payload).then(wrap),

  update: (id: string, payload: Partial<CreateCustomerPayload>) =>
    apiClient.patch<{ success: true; data: Customer }>(ENDPOINTS.customers.update(id), payload).then(wrap),

  remove: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.customers.remove(id)),
};
