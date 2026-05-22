import { apiClient } from "../api-client";
import { ENDPOINTS } from "../endpoints";

export interface DashboardData {
  incidents: {
    total: number;
    open: number;
    thisMonth: number;
  };
  audits: {
    total: number;
    completed: number;
    passed: number;
    complianceScore: number;
  };
  training: {
    enrolled: number;
    completed: number;
    completionRate: number;
  };
  actions: {
    openCapas: number;
    overdueAudits: number;
    overdueCapas: number;
  };
}

const wrap = <T>(res: { success: boolean; data: T }) => res.data;

export const dashboardService = {
  get: () =>
    apiClient.get<{ success: true; data: DashboardData }>(ENDPOINTS.reports.dashboard).then(wrap),

  trend: (params?: { months?: number }) =>
    apiClient.get<{ success: true; data: any[] }>(ENDPOINTS.reports.trend, params as any).then(wrap),
};
