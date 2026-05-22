import { useSyncExternalStore } from "react";

export type NotificationType = "audit" | "incident" | "maintenance";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

let state: Notification[] = [
  { id: "n1", type: "incident", title: "Incident escalated", description: "INC-118 marked as critical at Plant 7.", time: "2m ago", read: false },
  { id: "n2", type: "audit", title: "Audit assigned", description: "AUD-2053 assigned to K. Tanaka.", time: "18m ago", read: false },
  { id: "n3", type: "maintenance", title: "Maintenance due", description: "Refinery South requires HVAC service.", time: "1h ago", read: false },
  { id: "n4", type: "audit", title: "Audit completed", description: "AUD-2049 closed at Hamburg DC-04.", time: "Yesterday", read: true },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

export const notificationStore = {
  subscribe,
  getSnapshot: () => state,
  markRead: (id: string) => {
    state = state.map((n) => (n.id === id ? { ...n, read: true } : n));
    emit();
  },
  markAllRead: () => {
    state = state.map((n) => ({ ...n, read: true }));
    emit();
  },
  clearAll: () => { state = []; emit(); },
};

export function useNotifications() {
  return useSyncExternalStore(subscribe, notificationStore.getSnapshot, notificationStore.getSnapshot);
}
