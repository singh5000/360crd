import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStore } from "@/lib/auth-store";

const ADMIN_ROLES = ["super_admin", "tenant_admin"];
const CUSTOMER_ROLES = ["customer"];

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    // Skip auth check on server — localStorage is unavailable there
    if (typeof window === "undefined") return;

    if (!authStore.getState().isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    const path = location.pathname;
    // Already on a panel path — don't redirect
    if (
      path.startsWith("/admin") ||
      path.startsWith("/app") ||
      path.startsWith("/portal")
    ) {
      return;
    }

    // Root or old routes — redirect to correct panel
    const role = authStore.getState().user?.role ?? "";
    if (ADMIN_ROLES.includes(role)) {
      throw redirect({ to: "/admin/dashboard" });
    }
    if (CUSTOMER_ROLES.includes(role)) {
      throw redirect({ to: "/portal/dashboard" });
    }
    throw redirect({ to: "/app/dashboard" });
  },
  component: () => <Outlet />,
});
