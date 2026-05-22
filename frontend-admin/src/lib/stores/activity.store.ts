import { create } from "zustand";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ActivityLog, ActivityModule, ActivityAction } from "@/lib/activity.types";

const MODULE_MAP: Record<string, ActivityModule> = {
  incidents: "Incidents",
  audits: "Audits",
  sites: "Facilities",
  facilities: "Facilities",
  customers: "Companies",
  companies: "Companies",
  users: "Users",
  settings: "Settings",
  auth: "Auth",
};

const ACTION_MAP: Record<string, ActivityAction> = {
  create: "created",
  created: "created",
  update: "updated",
  updated: "updated",
  delete: "deleted",
  deleted: "deleted",
  login: "login",
  logout: "logout",
  status_change: "status_changed",
  escalate: "escalated",
  enable: "enabled",
  disable: "disabled",
};

function mapBackendLog(item: any): ActivityLog {
  const resource = (item.resource ?? "system").toLowerCase();
  const action = (item.action ?? "updated").toLowerCase();
  const userName = item.user
    ? `${item.user.firstName ?? ""} ${item.user.lastName ?? ""}`.trim()
    : "System";
  const targetId = item.resourceId ?? item.id;
  const shortId = typeof targetId === "string" ? targetId.slice(0, 8) : String(targetId);

  return {
    id: item.id,
    timestamp: item.createdAt,
    user: userName || "System",
    module: MODULE_MAP[resource] ?? "Settings",
    action: ACTION_MAP[action] ?? "updated",
    targetId,
    targetLabel: `${resource.toUpperCase()}-${shortId}`,
    summary: `${ACTION_MAP[action] ?? action} ${resource} ${shortId}`,
    metadata: item.ipAddress ? { ip: item.ipAddress } : undefined,
  };
}

interface ActivityState {
  logs: ActivityLog[];
  loading: boolean;
  initialized: boolean;
  total: number;
  fetchLogs: (params?: { page?: number; limit?: number; resource?: string; userId?: string }) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  logs: [],
  loading: false,
  initialized: false,
  total: 0,

  fetchLogs: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await apiClient.get<{ success: true; data: any[]; meta: { total: number } }>(
        ENDPOINTS.activity.list,
        { limit: 100, ...params } as any,
      );
      const logs = (res.data ?? []).map(mapBackendLog);
      set({ logs, total: res.meta?.total ?? logs.length, loading: false, initialized: true });
    } catch {
      set({ loading: false, initialized: true });
    }
  },
}));
