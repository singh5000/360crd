import { useSyncExternalStore } from "react";
import type { Role } from "./rbac";

const STORAGE_KEY = "sentinel.role";

function read(): Role {
  if (typeof window === "undefined") return "COMPANY_ADMIN";
  const raw = window.localStorage.getItem(STORAGE_KEY) as Role | null;
  return (raw as Role) ?? "COMPANY_ADMIN";
}

let role: Role = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, role);
  listeners.forEach((l) => l());
}

export const roleStore = {
  getState: () => role,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  switchRole: (next: Role) => {
    role = next;
    emit();
  },
};

export function useRole(): Role {
  return useSyncExternalStore(roleStore.subscribe, roleStore.getState, () => "COMPANY_ADMIN" as Role);
}
