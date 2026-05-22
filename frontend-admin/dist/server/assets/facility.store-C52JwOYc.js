import { B as create, Y as toast, X as toApiError } from "./router-BNkFluS9.js";
import { s as siteService } from "./site.service-BcxgnHEC.js";
const useFacilityStore = create((set, get) => ({
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
  }
}));
export {
  useFacilityStore as u
};
