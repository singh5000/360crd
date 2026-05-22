import { createFileRoute, redirect } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { APP_NAME } from "@/lib/constants";
import { authStore } from "@/lib/auth-store";
import { useBranding } from "@/lib/stores/branding.store";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/dashboard",
  }),
  beforeLoad: ({ search }) => {
    if (authStore.getState().isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign in · 360CRD" },
      { name: "description", content: "Sign in to your 360CRD workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { data: branding } = useBranding();
  const appName = branding?.appName || APP_NAME;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Background — tenant loginBgUrl or default gradient */}
      {branding?.loginBgUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${branding.loginBgUrl})` }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
        </div>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 15% -5%, color-mix(in oklab, var(--color-primary) 32%, transparent), transparent 70%), radial-gradient(ellipse 55% 45% at 85% 105%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 70%)",
          }}
        />
      )}

      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl [background:var(--gradient-primary)] overflow-hidden">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt={appName} className="h-full w-full object-contain" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          <span className="text-lg font-semibold tracking-tight">{appName}</span>
        </div>

        <div className="rounded-2xl border border-border/80 p-7 [background:var(--gradient-card)] [box-shadow:var(--shadow-elevated)] sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Sign in to your workspace
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your credentials to access the platform.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {branding?.footerText ?? "Protected by SOC 2 · ISO 27001 controls"}
        </p>
      </div>
    </div>
  );
}
