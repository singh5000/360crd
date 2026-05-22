import { q as apiClient, E as ENDPOINTS } from "./router-BNkFluS9.js";
const wrap = (res) => res.data;
const customerService = {
  list: (params) => apiClient.get(ENDPOINTS.customers.list, params),
  get: (id) => apiClient.get(ENDPOINTS.customers.detail(id)).then(wrap),
  create: (payload) => apiClient.post(ENDPOINTS.customers.create, payload).then(wrap),
  update: (id, payload) => apiClient.patch(ENDPOINTS.customers.update(id), payload).then(wrap),
  remove: (id) => apiClient.delete(ENDPOINTS.customers.remove(id))
};
export {
  customerService as c
};
