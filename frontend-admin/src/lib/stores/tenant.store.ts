import { useSyncExternalStore } from "react";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export type TenantPlan = "STARTER" | "PROFESSIONAL" | "ENTERPRISE" | "WHITE_LABEL";
export type TenantStatus = "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED";

export type Tenant = {
  id: string;
  slug: string;
  name: string;
  legalName?: string | null;
  domain?: string | null;
  plan: TenantPlan;
  status: TenantStatus;
  industry?: string | null;
  country?: string | null;
  timezone: string;
  locale: string;
  maxUsers: number;
  maxSites: number;
  createdAt: string;
  branding?: { appName?: string | null; logoUrl?: string | null } | null;
  _count?: { users: number; sites: number };
};

type State = {
  tenants: Tenant[];
  total: number;
  loading: boolean;
  initialized: boolean;
  error: string | null;
};

const initial: State = {
  tenants: [],
  total: 0,
  loading: false,
  initialized: false,
  error: null,
};

let _state: State = { ...initial };
const _listeners = new Set<() => void>();

function emit() {
  _listeners.forEach((l) => l());
}

export const tenantStore = {
  getState: () => _state,
  subscribe: (l: () => void) => {
    _listeners.add(l);
    return () => _listeners.delete(l);
  },

  async fetch(params?: { search?: string; page?: number; limit?: number }) {
    if (_state.loading) return;
    _state = { ..._state, loading: true, error: null };
    emit();
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      const qs = query.toString();
      const res = await apiClient.get<{ data: Tenant[]; meta: { total: number } }>(
        `${ENDPOINTS.tenants.list}${qs ? `?${qs}` : ""}`,
      );
      _state = {
        tenants: res.data ?? [],
        total: res.meta?.total ?? 0,
        loading: false,
        initialized: true,
        error: null,
      };
    } catch (err: any) {
      _state = { ..._state, loading: false, error: err?.message ?? "Failed to load companies" };
    }
    emit();
  },

  async create(body: {
    slug: string;
    name: string;
    legalName?: string;
    plan?: TenantPlan;
    industry?: string;
    country?: string;
    maxUsers?: number;
    maxSites?: number;
  }): Promise<Tenant> {
    const res = await apiClient.post<{ data: Tenant }>(ENDPOINTS.tenants.create, body);
    const tenant = res.data;
    _state = {
      ..._state,
      tenants: [tenant, ..._state.tenants],
      total: _state.total + 1,
    };
    emit();
    return tenant;
  },

  async updateStatus(id: string, status: TenantStatus): Promise<void> {
    await apiClient.put(ENDPOINTS.tenants.status(id), { status });
    _state = {
      ..._state,
      tenants: _state.tenants.map((t) => (t.id === id ? { ...t, status } : t)),
    };
    emit();
  },

  invalidate() {
    _state = { ...initial };
    emit();
  },
};

export function useTenantStore() {
  const state = useSyncExternalStore(
    tenantStore.subscribe,
    tenantStore.getState,
    () => initial,
  );
  return {
    ...state,
    fetchTenants: tenantStore.fetch,
    createTenant: tenantStore.create,
    updateStatus: tenantStore.updateStatus,
  };
}

export function useTenants() {
  return useSyncExternalStore(tenantStore.subscribe, () => _state.tenants, () => []);
}

export const TENANT_PLAN_LABEL: Record<TenantPlan, string> = {
  STARTER: "Starter",
  PROFESSIONAL: "Professional",
  ENTERPRISE: "Enterprise",
  WHITE_LABEL: "White Label",
};

export const TENANT_STATUS_COLOR: Record<TenantStatus, string> = {
  TRIAL:     "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ACTIVE:    "bg-green-500/10 text-green-600 border-green-500/20",
  SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export const TENANT_PLAN_COLOR: Record<TenantPlan, string> = {
  STARTER:      "bg-gray-500/10 text-gray-600 border-gray-500/20",
  PROFESSIONAL: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ENTERPRISE:   "bg-violet-500/10 text-violet-600 border-violet-500/20",
  WHITE_LABEL:  "bg-amber-500/10 text-amber-600 border-amber-500/20",
};
