import { apiClient } from "../api-client";
import { ENDPOINTS } from "../endpoints";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    type: string;
    tenantId: string;
    avatarUrl?: string | null;
    roles: string[];
    permissions: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  sessionId: string;
  tenantSlug: string;
}

export interface MeResponse {
  userId: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
}

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<{ success: true; data: LoginResponse }>(ENDPOINTS.auth.login, { email, password }),

  logout: (refreshToken?: string, allDevices?: boolean) =>
    apiClient.post<{ success: true }>(ENDPOINTS.auth.logout, { refreshToken, allDevices }),

  me: () =>
    apiClient.get<{ success: true; data: MeResponse }>(ENDPOINTS.auth.me),

  refresh: (refreshToken: string) =>
    apiClient.post<{ success: true; data: { accessToken: string; refreshToken: string } }>(
      ENDPOINTS.auth.refresh,
      { refreshToken }
    ),

  forgotPassword: (email: string) =>
    apiClient.post<{ success: true; message: string }>(ENDPOINTS.auth.forgotPassword, { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<{ success: true; message: string }>(ENDPOINTS.auth.resetPassword, { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<{ success: true; message: string }>(ENDPOINTS.auth.changePassword, {
      currentPassword,
      newPassword,
    }),
};
