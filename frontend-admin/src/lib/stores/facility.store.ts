import { create } from "zustand";
import { toast } from "sonner";
import { siteService, type Site, type ListSitesParams, type CreateSitePayload } from "@/lib/api/services/site.service";
import type { ApiError } from "@/lib/types/api.types";
import { toApiError } from "./_helpers";

export type { Site } from "@/lib/api/services/site.service";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type FacilityState = {
  facilities: Site[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ApiError | null;
  initialized: boolean;
  params: ListSitesParams;
  fetchFacilities: (params?: ListSitesParams) => Promise<void>;
  createFacility: (payload: CreateSitePayload) => Promise<Site>;
  updateFacility: (id: string, payload: Partial<CreateSitePayload>) => Promise<void>;
  removeFacility: (id: string) => Promise<void>;
  setParams: (params: Partial<ListSitesParams>) => void;
};

export const useFacilityStore = create<FacilityState>((set, get) => ({
  facilities: [],
  meta: null,
  loading: false,
  error: null,
  initialized: false,
  params: { page: 1, limit: 20, sortBy: "name", sortOrder: "asc" },

  setParams: (params) => {
    set((s) => ({ params: { ...s.params, ...params } }));
  },

  fetchFacilities: async (params) => {
    const merged = { ...get().params, ...params };
    set({ loading: true, error: null, params: merged });
    try {
      const res = await siteService.list(merged);
      set({ facilities: res.data, meta: res.meta, loading: false, initialized: true });
    } catch (e) {
      const err = toApiError(e);
      set({ loading: false, error: err });
      toast.error("Failed to load sites");
    }
  },

  createFacility: async (payload) => {
    try {
      const created = await siteService.create(payload);
      toast.success(`Site "${created.name}" added`);
      await get().fetchFacilities();
      return created;
    } catch (e) {
      const err = toApiError(e);
      toast.error(err.message);
      throw err;
    }
  },

  updateFacility: async (id, payload) => {
    try {
      await siteService.update(id, payload);
      toast.success("Site updated");
      await get().fetchFacilities();
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },

  removeFacility: async (id) => {
    try {
      await siteService.remove(id);
      set((s) => ({ facilities: s.facilities.filter((f) => f.id !== id) }));
      toast("Site removed");
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },
}));
