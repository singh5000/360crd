import { q as apiClient, E as ENDPOINTS, B as create, Y as toast, X as toApiError } from "./router-BNkFluS9.js";
const wrap = (res) => res.data;
const auditService = {
  list: (params) => apiClient.get(ENDPOINTS.audits.list, params),
  get: (id) => apiClient.get(ENDPOINTS.audits.detail(id)).then(wrap),
  create: (payload) => apiClient.post(ENDPOINTS.audits.create, payload).then(wrap),
  update: (id, payload) => apiClient.patch(ENDPOINTS.audits.update(id), payload).then(wrap),
  remove: (id) => apiClient.delete(ENDPOINTS.audits.remove(id)),
  stats: (params) => apiClient.get(ENDPOINTS.audits.stats, params).then(wrap),
  start: (id) => apiClient.put(ENDPOINTS.audits.start(id), {}).then(wrap),
  complete: (id, payload) => apiClient.put(ENDPOINTS.audits.complete(id), payload).then(wrap),
  cancel: (id, reason) => apiClient.put(ENDPOINTS.audits.cancel(id), { reason }).then(wrap),
  getFindings: (id) => apiClient.get(ENDPOINTS.audits.findings(id)).then(wrap),
  createFinding: (id, payload) => apiClient.post(ENDPOINTS.audits.findings(id), payload).then(wrap),
  updateFinding: (id, findingId, payload) => apiClient.patch(ENDPOINTS.audits.finding(id, findingId), payload).then(wrap),
  listTemplates: () => apiClient.get(ENDPOINTS.audits.templates).then(wrap)
};
const useAuditStore = create((set, get) => ({
  audits: [],
  meta: null,
  loading: false,
  error: null,
  initialized: false,
  params: { page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" },
  setParams: (params) => {
    set((s) => ({ params: { ...s.params, ...params } }));
  },
  fetchAudits: async (params) => {
    const merged = { ...get().params, ...params };
    set({ loading: true, error: null, params: merged });
    try {
      const res = await auditService.list(merged);
      set({ audits: res.data, meta: res.meta, loading: false, initialized: true });
    } catch (e) {
      const err = toApiError(e);
      set({ loading: false, error: err });
      toast.error("Failed to load audits");
    }
  },
  createAudit: async (payload) => {
    try {
      const created = await auditService.create(payload);
      toast.success(`Audit ${created.refNumber} created`);
      await get().fetchAudits();
      return created;
    } catch (e) {
      const err = toApiError(e);
      set({ error: err });
      toast.error(err.message);
      throw err;
    }
  },
  updateAudit: async (id, payload) => {
    try {
      await auditService.update(id, payload);
      toast.success("Audit updated");
      await get().fetchAudits();
    } catch (e) {
      const err = toApiError(e);
      toast.error(err.message);
      set({ error: err });
    }
  },
  removeAudit: async (id) => {
    try {
      await auditService.remove(id);
      set((s) => ({ audits: s.audits.filter((a) => a.id !== id) }));
      toast("Audit removed");
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  }
}));
export {
  auditService as a,
  useAuditStore as u
};
