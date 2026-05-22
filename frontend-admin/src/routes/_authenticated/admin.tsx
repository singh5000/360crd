import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStore } from "@/lib/auth-store";

const ADMIN_ROLES = ["super_admin", "tenant_admin"];

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const role = authStore.getState().user?.role ?? "";
    if (!ADMIN_ROLES.includes(role)) {
      throw redirect({ to: role === "customer" ? "/portal/dashboard" : "/app/dashboard" });
    }
  },
  component: () => <Outlet />,
});
