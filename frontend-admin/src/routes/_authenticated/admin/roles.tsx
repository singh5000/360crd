import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStore } from "@/lib/auth-store";

export const Route = createFileRoute("/_authenticated/admin/roles")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const user = authStore.getState().user;
    if (user?.role !== "super_admin") throw redirect({ to: "/admin/dashboard" });
  },
  component: () => <Outlet />,
});
