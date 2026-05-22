import { apiClient } from "../api-client";
import { ENDPOINTS } from "../endpoints";

export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  message: string;
  channel: string;
  status: string;
  data?: Record<string, unknown> | null;
  readAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  incidents: boolean;
  audits: boolean;
  training: boolean;
  ppe: boolean;
}

const wrap = <T>(res: { success: boolean; data: T }) => res.data;

export const notificationService = {
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<{ success: true; data: Notification[]; meta: any; unreadCount: number }>(
      ENDPOINTS.notifications.list, params as any
    ),

  markRead: (id: string) =>
    apiClient.patch<{ success: true }>(ENDPOINTS.notifications.markRead(id), {}),

  markAllRead: () =>
    apiClient.post<{ success: true }>(ENDPOINTS.notifications.markAllRead, {}),

  remove: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.notifications.remove(id)),

  getPreferences: () =>
    apiClient.get<{ success: true; data: NotificationPreferences }>(ENDPOINTS.notifications.preferences).then(wrap),

  updatePreferences: (prefs: Partial<NotificationPreferences>) =>
    apiClient.put<{ success: true; data: NotificationPreferences }>(ENDPOINTS.notifications.preferences, prefs).then(wrap),
};
