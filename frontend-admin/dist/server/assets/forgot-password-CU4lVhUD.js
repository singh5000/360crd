import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { $ as useBranding, L as Link, q as apiClient, E as ENDPOINTS } from "./router-BNkFluS9.js";
import { A as APP_NAME, g as ShieldCheck } from "./constants-Bl7kXxvf.js";
import { M as Mail } from "./mail-3ZyUvTlO.js";
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
function ForgotPasswordPage() {
  const {
    data: branding
  } = useBranding();
  const appName = branding?.appName || APP_NAME;
  const [email, setEmail] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [sent, setSent] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiClient.post(ENDPOINTS.auth.forgotPassword, {
        email
      });
      setSent(true);
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 p-7 [background:var(--gradient-card)] [box-shadow:var(--shadow-elevated)] sm:p-8", children: sent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-6 w-6 text-green-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Check your email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "If ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: email }),
          " is registered, a 6-digit reset code has been sent. It expires in 30 minutes."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reset-password", search: {
          email
        }, className: "inline-flex h-10 w-full items-center justify-center rounded-md [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground hover:brightness-110", children: "Enter reset code" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight sm:text-2xl", children: "Forgot password?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: "Enter your work email and we'll send you a reset code." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-6 space-y-4", noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "fp-email", className: "text-sm font-medium", children: "Work email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "fp-email", type: "email", autoComplete: "email", placeholder: "you@company.com", value: email, onChange: (e) => setEmail(e.target.value), disabled: loading, className: "flex h-10 w-full rounded-md border border-input bg-card/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
            ] })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "flex h-10 w-full items-center justify-center gap-2 rounded-md [background:var(--gradient-primary)] text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-70", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            " Sending…"
          ] }) : "Send reset code" })
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
  ForgotPasswordPage as component
};
