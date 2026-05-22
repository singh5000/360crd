import { q as apiClient, E as ENDPOINTS, B as create, X as toApiError, Y as toast } from "./router-BNkFluS9.js";
const wrap = (res) => res.data;
const dashboardService = {
  get: () => apiClient.get(ENDPOINTS.reports.dashboard).then(wrap),
  trend: (params) => apiClient.get(ENDPOINTS.reports.trend, params).then(wrap)
};
const useDashboardStore = create((set) => ({
  data: null,
  loading: false,
  error: null,
  initialized: false,
  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.get();
      set({ data, loading: false, initialized: true });
    } catch (e) {
      const err = toApiError(e);
      set({ loading: false, error: err });
      toast.error("Failed to load dashboard metrics");
    }
  }
}));
export {
  useDashboardStore as u
};
