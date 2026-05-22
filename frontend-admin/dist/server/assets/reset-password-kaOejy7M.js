import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { $ as useBranding, h as Route, a4 as useNavigate, L as Link, q as apiClient, E as ENDPOINTS } from "./router-BNkFluS9.js";
import { k as createLucideIcon, A as APP_NAME, g as ShieldCheck } from "./constants-Bl7kXxvf.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { L as LoaderCircle } from "./loader-circle-CMZ_gZVG.js";
import { A as ArrowLeft } from "./arrow-left-BW4xafyP.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "net";
import "tls";
import "assert";
import "os";
import "events";
import "http2";
import "zlib";
const __iconNode = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode);
function ResetPasswordPage() {
  const {
    data: branding
  } = useBranding();
  const appName = branding?.appName || APP_NAME;
  const {
    email: prefillEmail
  } = Route.useSearch();
  useNavigate();
  const [email, setEmail] = reactExports.useState(prefillEmail ?? "");
  const [code, setCode] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!code || code.length !== 6) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    if (!newPassword) {
      setError("New password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiClient.post(ENDPOINTS.auth.resetPassword, {
        email,
        token: code,
        newPassword
      });
      setDone(true);
    } catch (err) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 -z-10", style: {
      background: "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 55%), radial-gradient(circle at 80% 90%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 50%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center justify-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl [background:var(--gradient-primary)] overflow-hidden", children: branding?.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: branding.logoUrl, alt: appName, className: "h-full w-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold tracking-tight", children: appName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 p-7 [background:var(--gradient-card)] [box-shadow:var(--shadow-elevated)] sm:p-8", children: done ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6 text-green-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Password reset" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your password has been updated. You can now sign in with your new password." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", search: {
          redirect: "/"
        }, className: "inline-flex h-10 w-full items-center justify-center rounded-md [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground hover:brightness-110", children: "Back to sign in" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Reset password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter the code sent to your email" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rp-email", className: "text-sm font-medium", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "rp-email", type: "email", autoComplete: "email", placeholder: "you@company.com", value: email, onChange: (e) => setEmail(e.target.value), disabled: loading, className: "flex h-10 w-full rounded-md border border-input bg-card/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rp-code", className: "text-sm font-medium", children: "Reset code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "rp-code", type: "text", inputMode: "numeric", maxLength: 6, autoComplete: "one-time-code", placeholder: "6-digit code", value: code, onChange: (e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6)), disabled: loading, className: "flex h-10 w-full rounded-md border border-input bg-card/50 px-3 text-sm tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rp-new", className: "text-sm font-medium", children: "New password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "rp-new", type: "password", autoComplete: "new-password", placeholder: "Min 8 chars, uppercase, number, symbol", value: newPassword, onChange: (e) => setNewPassword(e.target.value), disabled: loading, className: "flex h-10 w-full rounded-md border border-input bg-card/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rp-confirm", className: "text-sm font-medium", children: "Confirm password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "rp-confirm", type: "password", autoComplete: "new-password", placeholder: "Repeat new password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), disabled: loading, className: "flex h-10 w-full rounded-md border border-input bg-card/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "flex h-10 w-full items-center justify-center gap-2 rounded-md [background:var(--gradient-primary)] text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-70", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            " Resetting…"
          ] }) : "Reset password" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", search: {
        redirect: "/"
      }, className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Back to sign in"
      ] }) })
    ] })
  ] });
}
export {
  ResetPasswordPage as component
};
