import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useBranding } from "@/lib/stores/branding.store";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password · 360CRD" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { data: branding } = useBranding();
  const appName = branding?.appName || APP_NAME;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    setError("");
    setLoading(true);
    try {
      await apiClient.post(ENDPOINTS.auth.forgotPassword, { email });
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 55%), radial-gradient(circle at 80% 90%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 50%)",
        }}
      />

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

        <div className="rounded-2xl border border-border/60 p-7 [background:var(--gradient-card)] [box-shadow:var(--shadow-elevated)] sm:p-8">
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Mail className="h-6 w-6 text-green-500" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                If <span className="font-medium text-foreground">{email}</span> is registered, a 6-digit reset code has been sent. It expires in 30 minutes.
              </p>
              <Link
                to="/reset-password"
                search={{ email }}
                className="inline-flex h-10 w-full items-center justify-center rounded-md [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground hover:brightness-110"
              >
                Enter reset code
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Forgot password?</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your work email and we'll send you a reset code.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="fp-email" className="text-sm font-medium">Work email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="fp-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="flex h-10 w-full rounded-md border border-input bg-card/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md [background:var(--gradient-primary)] text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-70"
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send reset code"}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Link to="/login" search={{ redirect: "/" }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
