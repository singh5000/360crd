import { create } from "zustand";
import { toast } from "sonner";
import { authStore as legacyAuth } from "@/lib/auth-store";
import { toApiError } from "./_helpers";
import type { ApiError } from "@/lib/types/api.types";
import type { AuthUser, LoginPayload } from "@/lib/types/user.types";
import { getAuthToken } from "@/lib/api/axios";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: ApiError | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getAuthToken(),
  loading: false,
  error: null,

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      await legacyAuth.login(email, password);
      const { user } = legacyAuth.getState();
      set({ user: user as unknown as AuthUser, token: getAuthToken(), loading: false });
      toast.success("Welcome back");
    } catch (e) {
      const err = toApiError(e);
      set({ loading: false, error: err });
      toast.error(err.message);
      throw err;
    }
  },

  logout: () => {
    legacyAuth.logout();
    set({ user: null, token: null, error: null });
    toast("Signed out");
  },

  hydrate: () => {
    const { isAuthenticated, user } = legacyAuth.getState();
    if (isAuthenticated && user) {
      set({ user: user as unknown as AuthUser, token: getAuthToken() });
    }
  },
}));
