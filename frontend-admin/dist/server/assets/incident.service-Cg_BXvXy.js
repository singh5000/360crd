import { q as apiClient, E as ENDPOINTS } from "./router-BNkFluS9.js";
const wrap = (res) => res.data;
const incidentService = {
  list: (params) => apiClient.get(ENDPOINTS.incidents.list, params),
  get: (id) => apiClient.get(ENDPOINTS.incidents.detail(id)).then(wrap),
  create: (payload) => apiClient.post(ENDPOINTS.incidents.create, payload).then(wrap),
  update: (id, payload) => apiClient.patch(ENDPOINTS.incidents.update(id), payload).then(wrap),
  remove: (id) => apiClient.delete(ENDPOINTS.incidents.remove(id)),
  stats: (params) => apiClient.get(ENDPOINTS.incidents.stats, params).then(wrap),
  assign: (id, userId) => apiClient.put(ENDPOINTS.incidents.assign(id), { userId }).then(wrap),
  investigate: (id) => apiClient.put(ENDPOINTS.incidents.investigate(id), {}).then(wrap),
  close: (id, closeReason) => apiClient.put(ENDPOINTS.incidents.close(id), { closeReason }).then(wrap),
  cancel: (id, reason) => apiClient.put(ENDPOINTS.incidents.cancel(id), { reason }).then(wrap),
  getEvidence: (id) => apiClient.get(ENDPOINTS.incidents.evidence(id)).then(wrap),
  deleteEvidence: (id, evidenceId) => apiClient.delete(ENDPOINTS.incidents.evidenceItem(id, evidenceId)),
  getCapas: (id) => apiClient.get(ENDPOINTS.incidents.capas(id)).then(wrap),
  createCapa: (id, payload) => apiClient.post(ENDPOINTS.incidents.capas(id), payload).then(wrap),
  updateCapa: (id, capaId, payload) => apiClient.patch(ENDPOINTS.incidents.capa(id, capaId), payload).then(wrap),
  deleteCapa: (id, capaId) => apiClient.delete(ENDPOINTS.incidents.capa(id, capaId)),
  verifyCapa: (id, capaId, notes) => apiClient.put(ENDPOINTS.incidents.capaVerify(id, capaId), { notes }).then(wrap)
};
export {
  incidentService as i
};
