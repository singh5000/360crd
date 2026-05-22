import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useBranding } from "@/lib/stores/branding.store";

const searchSchema = z.object({
  email: z.string().email().optional().catch(undefined),
});

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password · 360CRD" }] }),
  validateSearch: searchSchema,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { data: branding } = useBranding();
  const appName = branding?.appName || APP_NAME;
  const { email: prefillEmail } = Route.useSearch();
  const navigate = useNavigate();

  const [email, setEmail] = useState(prefillEmail ?? "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    if (!code || code.length !== 6) { setError("Enter the 6-digit code from your email"); return; }
    if (!newPassword) { setError("New password is required"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }

    setError("");
    setLoading(true);
    try {
      await apiClient.post(ENDPOINTS.auth.resetPassword, {
        email,
        token: code,
        newPassword,
      });
      setDone(true);
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
          {done ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Password reset</h1>
              <p className="text-sm text-muted-foreground">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                search={{ redirect: "/" }}
                className="inline-flex h-10 w-full items-center justify-center rounded-md [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground hover:brightness-110"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Reset password</h1>
                  <p className="text-xs text-muted-foreground">Enter the code sent to your email</p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="rp-email" className="text-sm font-medium">Email</label>
                  <input
                    id="rp-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-card/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rp-code" className="text-sm font-medium">Reset code</label>
                  <input
                    id="rp-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-card/50 px-3 text-sm tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rp-new" className="text-sm font-medium">New password</label>
                  <input
                    id="rp-new"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min 8 chars, uppercase, number, symbol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-card/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rp-confirm" className="text-sm font-medium">Confirm password</label>
                  <input
                    id="rp-confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-card/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                  />
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
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Resetting…</> : "Reset password"}
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
