import { useSyncExternalStore } from "react";
import { http } from "./api/axios";
import { ENDPOINTS } from "./api/endpoints";

export type NotificationType = "audit" | "incident" | "maintenance" | "general";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  return `${d}d ago`;
}

function mapType(type: string): NotificationType {
  if (type?.includes("incident") || type?.includes("capa")) return "incident";
  if (type?.includes("audit")) return "audit";
  if (type?.includes("maintenance") || type?.includes("asset")) return "maintenance";
  return "general";
}

function mapApiNotification(n: any): Notification {
  return {
    id: n.id,
    type: mapType(n.type ?? ""),
    title: n.title ?? "Notification",
    description: n.message ?? "",
    time: relativeTime(n.createdAt ?? new Date().toISOString()),
    read: !!n.readAt,
  };
}

let state: Notification[] = [];
let unreadCount = 0;
let pollTimer: ReturnType<typeof setTimeout> | null = null;
let initialized = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  if (!initialized) startPolling();
  return () => {
    listeners.delete(l);
    if (listeners.size === 0 && pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
      initialized = false;
    }
  };
};

async function fetchNotifications() {
  try {
    const res = await http.get<any>(ENDPOINTS.notifications.list, { params: { limit: 30 } });
    const items: any[] = res.data?.data ?? [];
    state = items.map(mapApiNotification);
    unreadCount = res.data?.meta?.unreadCount ?? state.filter((n) => !n.read).length;
    emit();
  } catch {
    // silently ignore — network might not be available
  }
}

function startPolling() {
  if (initialized) return;
  initialized = true;
  fetchNotifications();
  const schedule = () => {
    pollTimer = setTimeout(async () => {
      await fetchNotifications();
      if (listeners.size > 0) schedule();
    }, 30_000);
  };
  schedule();
}

export const notificationStore = {
  subscribe,
  getSnapshot: () => state,
  getUnreadCount: () => unreadCount,
  markRead: async (id: string) => {
    state = state.map((n) => (n.id === id ? { ...n, read: true } : n));
    unreadCount = Math.max(0, unreadCount - 1);
    emit();
    try { await http.patch(ENDPOINTS.notifications.markRead(id)); } catch { /* ignore */ }
  },
  markAllRead: async () => {
    state = state.map((n) => ({ ...n, read: true }));
    unreadCount = 0;
    emit();
    try { await http.patch(ENDPOINTS.notifications.markAllRead); } catch { /* ignore */ }
  },
  clearAll: () => { state = []; unreadCount = 0; emit(); },
  addLocal: (n: Notification) => {
    state = [n, ...state];
    if (!n.read) unreadCount += 1;
    emit();
  },
};

export function useNotifications() {
  return useSyncExternalStore(subscribe, notificationStore.getSnapshot, notificationStore.getSnapshot);
}

export function useUnreadCount() {
  return useSyncExternalStore(subscribe, notificationStore.getUnreadCount, notificationStore.getUnreadCount);
}
