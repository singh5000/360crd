import { useSyncExternalStore } from "react";

export type UserRole = "Admin" | "Manager" | "User";
export type UserStatus = "Active" | "Disabled";

export type AppUser = {
  id: string;
  reference: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export const USER_ROLES: UserRole[] = ["Admin", "Manager", "User"];
export const USER_STATUSES: UserStatus[] = ["Active", "Disabled"];

const seed: AppUser[] = [
  { id: "u-1", reference: "USR-1001", companyId: "c-9001", name: "Elena Marchetti", email: "elena@northwind.io", role: "Admin", status: "Active", createdAt: "2023-04-12" },
  { id: "u-2", reference: "USR-1002", companyId: "c-9001", name: "David Park", email: "david@northwind.io", role: "Manager", status: "Active", createdAt: "2023-05-02" },
  { id: "u-3", reference: "USR-1003", companyId: "c-9001", name: "Mara Lindqvist", email: "mara@northwind.io", role: "User", status: "Active", createdAt: "2023-06-18" },
  { id: "u-4", reference: "USR-1004", companyId: "c-9001", name: "Jake Okafor", email: "jake@northwind.io", role: "User", status: "Disabled", createdAt: "2023-07-01" },

  { id: "u-5", reference: "USR-1005", companyId: "c-9002", name: "Sara Bennett", email: "sara@helios.energy", role: "Admin", status: "Active", createdAt: "2024-01-23" },
  { id: "u-6", reference: "USR-1006", companyId: "c-9002", name: "Liam Chen", email: "liam@helios.energy", role: "Manager", status: "Active", createdAt: "2024-02-11" },

  { id: "u-7", reference: "USR-1007", companyId: "c-9003", name: "Priya Raman", email: "priya@meridian.health", role: "Admin", status: "Active", createdAt: "2022-09-08" },
  { id: "u-8", reference: "USR-1008", companyId: "c-9003", name: "Tom Becker", email: "tom@meridian.health", role: "Manager", status: "Active", createdAt: "2022-11-04" },
  { id: "u-9", reference: "USR-1009", companyId: "c-9003", name: "Aiko Tanaka", email: "aiko@meridian.health", role: "User", status: "Active", createdAt: "2023-01-20" },

  { id: "u-10", reference: "USR-1010", companyId: "c-9004", name: "Carlos Ruiz", email: "carlos@vanta.co", role: "Admin", status: "Disabled", createdAt: "2024-06-01" },

  { id: "u-11", reference: "USR-1011", companyId: "c-9005", name: "Hannah Weiss", email: "hannah@aurorapharma.com", role: "Admin", status: "Active", createdAt: "2021-11-19" },
  { id: "u-12", reference: "USR-1012", companyId: "c-9005", name: "Marco Bianchi", email: "marco@aurorapharma.com", role: "Manager", status: "Active", createdAt: "2022-02-09" },

  { id: "u-13", reference: "USR-1013", companyId: "c-9006", name: "Olivia Stone", email: "olivia@lumenretail.com", role: "Admin", status: "Active", createdAt: "2025-02-14" },
];

const STORAGE_KEY = "360crd.users";

function read(): AppUser[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as AppUser[];
  } catch {
    return seed;
  }
}

let state: AppUser[] = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function nextRef(): string {
  const max = state.reduce((acc, u) => {
    const n = parseInt(u.reference.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 1000);
  return `USR-${max + 1}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const userStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  addUser: (input: Omit<AppUser, "id" | "reference" | "createdAt">) => {
    const user: AppUser = {
      id: `u-${Date.now()}`,
      reference: nextRef(),
      createdAt: today(),
      ...input,
    };
    state = [user, ...state];
    emit();
    return user;
  },
  updateUser: (id: string, patch: Partial<AppUser>) => {
    state = state.map((u) => (u.id === id ? { ...u, ...patch } : u));
    emit();
  },
  toggleUserStatus: (id: string) => {
    state = state.map((u) =>
      u.id === id ? { ...u, status: u.status === "Active" ? "Disabled" : "Active" } : u,
    );
    emit();
  },
  getUsersByCompany: (companyId: string): AppUser[] =>
    state.filter((u) => u.companyId === companyId),
};

export function useUsers() {
  return useSyncExternalStore(userStore.subscribe, userStore.getState, () => seed);
}

export const userStatusTone: Record<UserStatus, "success" | "neutral"> = {
  Active: "success",
  Disabled: "neutral",
};

export const roleTone: Record<UserRole, "danger" | "warning" | "info"> = {
  Admin: "danger",
  Manager: "warning",
  User: "info",
};
