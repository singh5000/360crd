import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/lib/types/api.types";

// ── Token & tenant storage ─────────────────────────────────────────────────
const TOKEN_KEY = "360crd.token";
const REFRESH_KEY = "360crd.refreshToken";
const TENANT_SLUG_KEY = "360crd.tenantSlug";

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch { /* noop */ }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(REFRESH_KEY); } catch { return null; }
}

export function setRefreshToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(REFRESH_KEY, token);
    else window.localStorage.removeItem(REFRESH_KEY);
  } catch { /* noop */ }
}

export function getActiveTenantSlug(): string {
  if (typeof window === "undefined") {
    return (import.meta as any).env?.VITE_DEFAULT_TENANT_SLUG ?? "demo-corp";
  }
  try {
    return (
      window.localStorage.getItem(TENANT_SLUG_KEY) ||
      (import.meta as any).env?.VITE_DEFAULT_TENANT_SLUG ||
      "demo-corp"
    );
  } catch { return "demo-corp"; }
}

export function setActiveTenantSlug(slug: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(TENANT_SLUG_KEY, slug); } catch { /* noop */ }
}

// ── Axios instance ─────────────────────────────────────────────────────────
export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:3000/api/v1";

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// ── Request: inject JWT + X-Tenant-Slug + X-Tenant-ID (for superadmin) ──────
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  const tenantSlug = getActiveTenantSlug();
  config.headers = config.headers ?? {};
  if (token) (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  (config.headers as Record<string, string>)["X-Tenant-Slug"] = tenantSlug;

  // When superadmin has selected a specific tenant, send its ID so the backend
  // creates/queries data in that tenant's context rather than the admin's own tenant.
  try {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("360crd.tenantContext");
      if (raw) {
        const ctx = JSON.parse(raw) as { state?: { selectedTenantId?: string | null } };
        const selectedTenantId = ctx?.state?.selectedTenantId;
        if (selectedTenantId) {
          (config.headers as Record<string, string>)["X-Tenant-ID"] = selectedTenantId;
        }
      }
    }
  } catch { /* ignore localStorage/parse errors */ }

  if (config.data instanceof FormData) {
    delete (config.headers as Record<string, string>)["Content-Type"];
  }
  return config;
});

// ── Response: auto-refresh on 401, then normalize errors ──────────────────
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: { message?: string; code?: string }; message?: string; code?: string; details?: unknown }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status ?? 0;

    if (
      status === 401 &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/logout")
    ) {
      const storedRefresh = getRefreshToken();
      if (storedRefresh) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push((newToken) => {
              if (!newToken) return reject(error);
              originalRequest.headers = originalRequest.headers ?? {};
              (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
              resolve(http(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const tenantSlug = getActiveTenantSlug();
          const res = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken: storedRefresh },
            { headers: { "Content-Type": "application/json", "X-Tenant-Slug": tenantSlug } }
          );
          const { accessToken, refreshToken: newRefresh } = res.data?.data ?? {};
          if (!accessToken) throw new Error("No token in refresh response");

          setAuthToken(accessToken);
          if (newRefresh) setRefreshToken(newRefresh);

          refreshQueue.forEach((cb) => cb(accessToken));
          refreshQueue = [];

          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
          return http(originalRequest);
        } catch {
          refreshQueue.forEach((cb) => cb(null));
          refreshQueue = [];
          setAuthToken(null);
          setRefreshToken(null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("360crd.tenantContext");
            window.localStorage.removeItem("360crd.tenantSlug");
            window.location.href = "/login";
          }
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        setAuthToken(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("360crd.tenantContext");
          window.localStorage.removeItem("360crd.tenantSlug");
          window.location.href = "/login";
        }
      }
    }

    const data = error.response?.data as any;
    const apiError: ApiError = {
      status,
      code: data?.error?.code ?? data?.code ?? error.code,
      message: data?.error?.message ?? data?.message ?? error.message ?? "Network request failed.",
      details: data?.details,
    };
    return Promise.reject(apiError);
  },
);
