import { q as apiClient, E as ENDPOINTS } from "./router-BNkFluS9.js";
const wrap = (res) => res.data;
const siteService = {
  list: (params) => apiClient.get(ENDPOINTS.sites.list, params),
  get: (id) => apiClient.get(ENDPOINTS.sites.detail(id)).then(wrap),
  create: (payload) => apiClient.post(ENDPOINTS.sites.create, payload).then(wrap),
  update: (id, payload) => apiClient.patch(ENDPOINTS.sites.update(id), payload).then(wrap),
  remove: (id) => apiClient.delete(ENDPOINTS.sites.remove(id)),
  stats: () => apiClient.get(ENDPOINTS.sites.stats).then(wrap)
};
export {
  siteService as s
};
