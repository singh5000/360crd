import { createFileRoute, redirect } from "@tanstack/react-router";
import { authStore } from "@/lib/auth-store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: authStore.getState().isAuthenticated ? "/dashboard" : "/login",
    });
  },
});
