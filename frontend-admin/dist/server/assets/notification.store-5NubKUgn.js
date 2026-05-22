import { k as createLucideIcon } from "./constants-Bl7kXxvf.js";
import { q as apiClient, E as ENDPOINTS, B as create, Y as toast, X as toApiError } from "./router-BNkFluS9.js";
const __iconNode = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode);
const wrap = (res) => res.data;
const notificationService = {
  list: (params) => apiClient.get(
    ENDPOINTS.notifications.list,
    params
  ),
  markRead: (id) => apiClient.patch(ENDPOINTS.notifications.markRead(id), {}),
  markAllRead: () => apiClient.post(ENDPOINTS.notifications.markAllRead, {}),
  remove: (id) => apiClient.delete(ENDPOINTS.notifications.remove(id)),
  getPreferences: () => apiClient.get(ENDPOINTS.notifications.preferences).then(wrap),
  updatePreferences: (prefs) => apiClient.put(ENDPOINTS.notifications.preferences, prefs).then(wrap)
};
const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await notificationService.list({ limit: 30 });
      set({
        notifications: res.data,
        unreadCount: res.unreadCount ?? res.data.filter((n) => !n.readAt).length,
        loading: false
      });
    } catch (e) {
      set({ loading: false, error: toApiError(e) });
    }
  },
  markRead: async (id) => {
    try {
      await notificationService.markRead(id);
      set((s) => ({
        notifications: s.notifications.map(
          (n) => n.id === id ? { ...n, readAt: (/* @__PURE__ */ new Date()).toISOString(), status: "READ" } : n
        ),
        unreadCount: Math.max(0, s.unreadCount - 1)
      }));
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },
  markAllRead: async () => {
    try {
      await notificationService.markAllRead();
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, readAt: (/* @__PURE__ */ new Date()).toISOString(), status: "READ" })),
        unreadCount: 0
      }));
      toast("All notifications marked as read");
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },
  remove: async (id) => {
    try {
      await notificationService.remove(id);
      set((s) => ({
        notifications: s.notifications.filter((n) => n.id !== id),
        unreadCount: s.notifications.find((n) => n.id === id && !n.readAt) ? s.unreadCount - 1 : s.unreadCount
      }));
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  }
}));
export {
  CheckCheck as C,
  useNotificationStore as u
};
