import { B as create, Y as toast, X as toApiError } from "./router-BNkFluS9.js";
import { i as incidentService } from "./incident.service-Cg_BXvXy.js";
const useIncidentStore = create((set, get) => ({
  incidents: [],
  meta: null,
  loading: false,
  error: null,
  initialized: false,
  params: { page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" },
  setParams: (params) => {
    set((s) => ({ params: { ...s.params, ...params } }));
  },
  fetchIncidents: async (params) => {
    const merged = { ...get().params, ...params };
    set({ loading: true, error: null, params: merged });
    try {
      const res = await incidentService.list(merged);
      set({ incidents: res.data, meta: res.meta, loading: false, initialized: true });
    } catch (e) {
      const err = toApiError(e);
      set({ loading: false, error: err });
      toast.error("Failed to load incidents");
    }
  },
  createIncident: async (payload) => {
    try {
      const created = await incidentService.create(payload);
      toast.success(`Incident ${created.refNumber} reported`);
      await get().fetchIncidents();
      return created;
    } catch (e) {
      const err = toApiError(e);
      toast.error(err.message);
      throw err;
    }
  },
  updateIncident: async (id, payload) => {
    try {
      await incidentService.update(id, payload);
      toast.success("Incident updated");
      await get().fetchIncidents();
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },
  removeIncident: async (id) => {
    try {
      await incidentService.remove(id);
      set((s) => ({ incidents: s.incidents.filter((i) => i.id !== id) }));
      toast("Incident deleted");
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  }
}));
export {
  useIncidentStore as u
};
