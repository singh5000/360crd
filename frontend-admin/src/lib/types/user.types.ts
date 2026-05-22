export type UserRole = "SUPER_ADMIN" | "COMPANY_ADMIN" | "MANAGER" | "USER";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatarUrl?: string;
  tenantId: string;
  permissions: string[];
};

export type LoginPayload = { email: string; password: string };
export type AuthSession = { token: string; user: AuthUser };
