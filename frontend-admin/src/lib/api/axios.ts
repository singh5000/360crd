import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/lib/types/api.types";

// ── Token & tenant storage ─────────────────────────────────────────────────
const TOKEN_KEY = "360crd.token";
const REFRESH_KEY = "360crd.refreshToken";
const TENANT_SLUG_KEY = "360crd.tenantSlug";

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

// ── Request: inject JWT + X-Tenant-Slug ───────────────────────────────────
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  const tenantSlug = getActiveTenantSlug();
  config.headers = config.headers ?? {};
  if (token) (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  (config.headers as Record<string, string>)["X-Tenant-Slug"] = tenantSlug;
  return config;
});

// ── Response: normalize errors (refresh logic lives in interceptors.ts) ────
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string; code?: string }; message?: string; code?: string; details?: unknown }>) => {
    const status = error.response?.status ?? 0;
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
