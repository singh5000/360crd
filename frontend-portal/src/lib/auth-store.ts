import { useSyncExternalStore } from "react";
import { authService, type LoginResponse } from "./api/services/auth.service";
import { setAuthToken, setRefreshToken, getAuthToken, getRefreshToken, setActiveTenantSlug } from "./api/axios";

// ─────────────────────────────────────────────────────────────────────────────
// Primary auth store — used by route guards and throughout the app.
// This is the single source of truth for authentication state.
// ─────────────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  customerId: string | null;
  permissions: string[];
};

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
};

const STORAGE_KEY = "360crd.auth";

function readPersistedState(): AuthState {
  if (typeof window === "undefined") return { isAuthenticated: false, user: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, user: null };
    const parsed = JSON.parse(raw) as AuthState;
    // If token is gone (expired), treat as unauthenticated
    if (parsed.isAuthenticated && !getAuthToken()) {
      return { isAuthenticated: false, user: null };
    }
    return parsed;
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

let state: AuthState = readPersistedState();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function mapUser(data: LoginResponse["user"]): AuthUser {
  return {
    id: data.id,
    name: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    role: data.roles?.[0] ?? data.type ?? "staff",
    tenantId: data.tenantId,
    permissions: data.permissions ?? [],
    customerId: (data as any).customerId ?? null,
  };
}

export const authStore = {
  getState: () => state,

  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },

  login: async (email: string, password: string, tenantSlug?: string): Promise<LoginResponse> => {
    // Use explicit slug override, or fall back to env default
    setActiveTenantSlug(
      tenantSlug ?? (import.meta as any).env?.VITE_DEFAULT_TENANT_SLUG ?? "demo-corp"
    );
    const res = await authService.login(email, password);
    const { tokens: { accessToken, refreshToken }, user } = res.data;

    setAuthToken(accessToken);
    setRefreshToken(refreshToken);
    setActiveTenantSlug(res.data.tenantSlug || user.tenantId);

    state = { isAuthenticated: true, user: mapUser(user) };
    persist();

    return res.data;
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    // Clear synchronously first so route guards see the change immediately
    setAuthToken(null);
    setRefreshToken(null);
    state = { isAuthenticated: false, user: null };
    persist();
    // Best-effort server-side session revocation
    try { await authService.logout(refreshToken ?? undefined); } catch { /* noop */ }
  },

  setUser: (user: AuthUser) => {
    state = { isAuthenticated: true, user };
    persist();
  },

  clear: () => {
    setAuthToken(null);
    setRefreshToken(null);
    state = { isAuthenticated: false, user: null };
    persist();
  },
};

export function useAuth() {
  return useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    () => ({ isAuthenticated: false, user: null }) as AuthState,
  );
}

/** Returns true if the current user has the given permission (e.g. "audit:create"). */
export function usePermission(permission: string): boolean {
  const { user } = useAuth();
  if (!user) return false;
  const perms = user.permissions ?? [];
  // Super admin shortcut
  if (perms.includes("*") || perms.includes("*:*")) return true;
  return perms.includes(permission);
}

/** Returns a can() checker for multiple permission checks in one component. */
export function usePermissions() {
  const { user } = useAuth();
  return (permission: string): boolean => {
    if (!user) return false;
    const perms = user.permissions ?? [];
    if (perms.includes("*") || perms.includes("*:*")) return true;
    return perms.includes(permission);
  };
}
