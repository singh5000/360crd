import { create } from "zustand";
import { toast } from "sonner";
import { dashboardService, type DashboardData } from "@/lib/api/services/dashboard.service";
import type { ApiError } from "@/lib/types/api.types";
import { toApiError } from "./_helpers";

type DashboardState = {
  data: DashboardData | null;
  loading: boolean;
  error: ApiError | null;
  initialized: boolean;
  fetchDashboard: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set) => ({
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
  },
}));
