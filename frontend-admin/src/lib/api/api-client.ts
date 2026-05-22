import { http } from "./axios";
import type { ApiError } from "@/lib/types/api.types";

/**
 * Thin reusable client. Prefer this over importing axios directly.
 * Returns response payloads (unwrapped) and throws normalized ApiError.
 */
export const apiClient = {
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const res = await http.get<T>(url, { params });
    return res.data;
  },
  async post<T, B = unknown>(url: string, body?: B): Promise<T> {
    const res = await http.post<T>(url, body);
    return res.data;
  },
  async put<T, B = unknown>(url: string, body?: B): Promise<T> {
    const res = await http.put<T>(url, body);
    return res.data;
  },
  async patch<T, B = unknown>(url: string, body?: B): Promise<T> {
    const res = await http.patch<T>(url, body);
    return res.data;
  },
  async delete<T>(url: string): Promise<T> {
    const res = await http.delete<T>(url);
    return res.data;
  },
};

/**
 * Mock helper — wraps any value in a delayed Promise to simulate latency.
 * Used while a real backend is not yet wired in.
 */
export function mockRequest<T>(payload: T, opts?: { delay?: number; failRate?: number }): Promise<T> {
  const delay = opts?.delay ?? 350 + Math.random() * 400;
  const failRate = opts?.failRate ?? 0;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failRate > 0 && Math.random() < failRate) {
        const err: ApiError = { status: 500, message: "Mock API failure (simulated)." };
        reject(err);
      } else {
        resolve(payload);
      }
    }, delay);
  });
}

export type { ApiError };
