import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { z } from "zod";
import { useNavigate, useSearch, Link } from "@tanstack/react-router";
import { InputField } from "@/components/shared/InputField";
import { Button } from "@/components/shared/Button";
import { authStore } from "@/lib/auth-store";
import { brandingStore } from "@/lib/stores/branding.store";

const schema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

type Errors = Partial<Record<"email" | "password" | "form", string>>;

// Demo credentials for each panel
const DEMO_ROLES = [
  {
    label: "Super Admin",
    badge: "admin",
    email: "superadmin@360crd.io",
    password: "SuperAdmin@360!",
    tenantSlug: "system",
    color: "bg-violet-500/10 text-violet-600 border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-500/15",
  },
  {
    label: "Tenant Admin",
    badge: "admin",
    email: "admin@demo-corp.com",
    password: "Demo@360!",
    tenantSlug: "demo-corp",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/15",
  },
  {
    label: "Manager",
    badge: "app",
    email: "manager@demo-corp.com",
    password: "Manager@360!",
    tenantSlug: "demo-corp",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/15",
  },
  {
    label: "Staff",
    badge: "app",
    email: "staff@demo-corp.com",
    password: "Staff@360!",
    tenantSlug: "demo-corp",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/15",
  },
  {
    label: "Customer",
    badge: "portal",
    email: "customer@demo-corp.com",
    password: "Customer@360!",
    tenantSlug: "demo-corp",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20 hover:border-gray-500/50 hover:bg-gray-500/15",
  },
] as const;

function getPanelHome(role: string) {
  if (["super_admin", "tenant_admin"].includes(role)) return "/admin/dashboard";
  if (role === "customer") return "/portal/dashboard";
  return "/app/dashboard";
}

export function LoginForm() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" }) as { redirect?: string };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const data = await authStore.login(parsed.data.email, parsed.data.password);
      const role = data.user?.roles?.[0] ?? data.user?.type ?? "";
      // Reload branding for the new tenant
      brandingStore.invalidate();
      brandingStore.fetch();
      navigate({ to: (search.redirect && !search.redirect.includes("/dashboard") ? search.redirect : getPanelHome(role)) as any });
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Unable to sign in. Please try again.";
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const onDemoLogin = async (demo: typeof DEMO_ROLES[number]) => {
    setDemoLoading(demo.label);
    setErrors({});
    setEmail(demo.email);
    setPassword(demo.password);
    try {
      const data = await authStore.login(demo.email, demo.password, demo.tenantSlug);
      const role = data.user?.roles?.[0] ?? data.user?.type ?? "";
      brandingStore.invalidate();
      brandingStore.fetch();
      navigate({ to: getPanelHome(role) as any });
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Demo login failed. Please try again.";
      setErrors({ form: msg });
    } finally {
      setDemoLoading(null);
    }
  };

  const busy = loading || demoLoading !== null;

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <InputField
          label="Work email"
          type="email"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={busy}
        />
        <InputField
          label="Password"
          type="password"
          autoComplete="current-password"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={busy}
        />

        <div className="flex items-center justify-end pt-1">
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {errors.form && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {errors.form}
          </div>
        )}

        <Button
          type="submit"
          disabled={busy}
          className="h-11 w-full [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110 disabled:opacity-70"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>
          ) : (
            <>Sign In <ArrowRight className="ml-1.5 h-4 w-4" /></>
          )}
        </Button>
      </form>

      {/* ── Demo access ─────────────────────────────────────────────────────── */}
      <div>
        <div className="relative flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">Quick demo access</span>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {DEMO_ROLES.map((demo) => (
            <button
              key={demo.label}
              type="button"
              disabled={busy}
              onClick={() => onDemoLogin(demo)}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-all disabled:opacity-50 ${demo.color}`}
            >
              <span>{demo.label}</span>
              {demoLoading === demo.label ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span className="rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider opacity-60 ring-1 ring-current/30">
                  {demo.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
          Demo data — no real incidents or records
        </p>
      </div>
    </div>
  );
}
