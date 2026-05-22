import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { http, getRefreshToken, setAuthToken, setRefreshToken } from "./axios";

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}

function forceLogout() {
  setAuthToken(null);
  setRefreshToken(null);
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

// ── 401 refresh interceptor ────────────────────────────────────────────────
// Registered after the base response interceptor in axios.ts.
// Catches 401s, attempts a token refresh, then replays the original request.
http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401s on non-refresh requests
    if (error.response?.status !== 401 || original._retry || original.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        return http(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      forceLogout();
      return Promise.reject(error);
    }

    try {
      const res = await http.post<{ data: { accessToken: string; refreshToken: string } }>(
        "/auth/refresh",
        { refreshToken },
      );
      const { accessToken, refreshToken: newRefresh } = res.data.data;
      setAuthToken(accessToken);
      setRefreshToken(newRefresh);

      original.headers = original.headers ?? {};
      (original.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      isRefreshing = false;

      return http(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      forceLogout();
      return Promise.reject(refreshError);
    }
  },
);
