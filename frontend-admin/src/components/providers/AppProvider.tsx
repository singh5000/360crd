import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/lib/stores/auth.store";
import { initActivityBridges } from "@/lib/activity.store";
import { brandingStore } from "@/lib/stores/branding.store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

export function AppProvider({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    hydrate();
    brandingStore.fetch();
    initActivityBridges();
    const onUnauthorized = () => logout();
    const onTenantChanged = () => { brandingStore.invalidate(); brandingStore.fetch(); };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    window.addEventListener("tenant:changed", onTenantChanged);
    return () => {
      window.removeEventListener("auth:unauthorized", onUnauthorized);
      window.removeEventListener("tenant:changed", onTenantChanged);
    };
  }, [hydrate, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={150}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
