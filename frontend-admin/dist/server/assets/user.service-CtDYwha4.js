import { k as createLucideIcon } from "./constants-Bl7kXxvf.js";
import { q as apiClient, E as ENDPOINTS } from "./router-BNkFluS9.js";
const __iconNode$1 = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
const wrap = (res) => res.data;
const userService = {
  list: (params) => apiClient.get(ENDPOINTS.users.list, params),
  me: () => apiClient.get(ENDPOINTS.users.me).then(wrap),
  get: (id) => apiClient.get(ENDPOINTS.users.detail(id)).then(wrap),
  create: (payload) => apiClient.post(ENDPOINTS.users.create, payload).then(wrap),
  update: (id, payload) => apiClient.patch(ENDPOINTS.users.update(id), payload).then(wrap),
  remove: (id) => apiClient.delete(ENDPOINTS.users.remove(id)),
  updateStatus: (id, status) => apiClient.put(ENDPOINTS.users.status(id), { status }).then(wrap),
  assignRole: (id, roleId) => apiClient.post(ENDPOINTS.users.roles(id), { roleId }),
  revokeRole: (id, roleId) => apiClient.delete(ENDPOINTS.users.revokeRole(id, roleId)),
  resendInvite: (id) => apiClient.post(ENDPOINTS.users.resendInvite(id), {}),
  getSites: (id) => apiClient.get(ENDPOINTS.users.sites(id)).then(wrap)
};
export {
  UserCheck as U,
  UserX as a,
  userService as u
};
