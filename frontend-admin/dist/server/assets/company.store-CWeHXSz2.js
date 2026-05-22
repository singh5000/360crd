import { B as create, Y as toast, X as toApiError } from "./router-BNkFluS9.js";
import { c as customerService } from "./customer.service-Cvvk1Dem.js";
const useCompanyStore = create((set, get) => ({
  companies: [],
  meta: null,
  loading: false,
  error: null,
  initialized: false,
  params: { page: 1, limit: 20, sortBy: "name", sortOrder: "asc" },
  setParams: (params) => {
    set((s) => ({ params: { ...s.params, ...params } }));
  },
  fetchCompanies: async (params) => {
    const merged = { ...get().params, ...params };
    set({ loading: true, error: null, params: merged });
    try {
      const res = await customerService.list(merged);
      set({ companies: res.data, meta: res.meta, loading: false, initialized: true });
    } catch (e) {
      const err = toApiError(e);
      set({ loading: false, error: err });
      toast.error("Failed to load customers");
    }
  },
  createCompany: async (payload) => {
    try {
      const created = await customerService.create(payload);
      toast.success(`Customer "${created.name}" added`);
      await get().fetchCompanies();
      return created;
    } catch (e) {
      const err = toApiError(e);
      toast.error(err.message);
      throw err;
    }
  },
  updateCompany: async (id, payload) => {
    try {
      await customerService.update(id, payload);
      toast.success("Customer updated");
      await get().fetchCompanies();
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },
  removeCompany: async (id) => {
    try {
      await customerService.remove(id);
      set((s) => ({ companies: s.companies.filter((c) => c.id !== id) }));
      toast("Customer removed");
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  }
}));
export {
  useCompanyStore as u
};
