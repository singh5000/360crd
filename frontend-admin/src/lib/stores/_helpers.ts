import type { ApiError, AsyncState } from "@/lib/types/api.types";

export function initialAsync<T>(initial: T): AsyncState<T> {
  return { data: initial, loading: false, error: null, initialized: false };
}

export function toApiError(e: unknown): ApiError {
  if (e && typeof e === "object" && "message" in e) {
    const x = e as Partial<ApiError>;
    return {
      status: typeof x.status === "number" ? x.status : 0,
      code: x.code,
      message: String(x.message ?? "Unexpected error"),
      details: x.details,
    };
  }
  return { status: 0, message: "Unexpected error" };
}
