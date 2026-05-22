import { create } from "zustand";
import { toast } from "sonner";
import { notificationService, type Notification } from "@/lib/api/services/notification.service";
import type { ApiError } from "@/lib/types/api.types";
import { toApiError } from "./_helpers";

export type { Notification } from "@/lib/api/services/notification.service";

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: ApiError | null;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
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
        loading: false,
      });
    } catch (e) {
      set({ loading: false, error: toApiError(e) });
    }
  },

  markRead: async (id) => {
    try {
      await notificationService.markRead(id);
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString(), status: "READ" } : n
        ),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },

  markAllRead: async () => {
    try {
      await notificationService.markAllRead();
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, readAt: new Date().toISOString(), status: "READ" })),
        unreadCount: 0,
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
        unreadCount: s.notifications.find((n) => n.id === id && !n.readAt) ? s.unreadCount - 1 : s.unreadCount,
      }));
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },
}));
