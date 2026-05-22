import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { a4 as useNavigate, a6 as useSearch, L as Link, s as authStore, u as brandingStore, Q as objectType, W as stringType, $ as useBranding } from "./router-BNkFluS9.js";
import { I as InputField } from "./InputField-Cvgola_D.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { M as Mail } from "./mail-3ZyUvTlO.js";
import { k as createLucideIcon, A as APP_NAME, g as ShieldCheck } from "./constants-Bl7kXxvf.js";
import { L as LoaderCircle } from "./loader-circle-CMZ_gZVG.js";
import { A as ArrowRight } from "./arrow-right-DpgU8Kjo.js";
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
import "./eye-C01Vu7q5.js";
import "./index-LBw-IAWe.js";
import "./index-TU15xtvZ.js";
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
const schema = objectType({
  email: stringType().trim().min(1, "Email is required").email("Enter a valid email address").max(255),
  password: stringType().min(8, "Password must be at least 8 characters").max(72)
});
const DEMO_ROLES = [
  {
    label: "Super Admin",
    badge: "admin",
    email: "superadmin@360crd.io",
    password: "SuperAdmin@360!",
    tenantSlug: "system",
    color: "bg-violet-500/10 text-violet-600 border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-500/15"
  },
  {
    label: "Tenant Admin",
    badge: "admin",
    email: "admin@demo-corp.com",
    password: "Demo@360!",
    tenantSlug: "demo-corp",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/15"
  },
  {
    label: "Manager",
    badge: "app",
    email: "manager@demo-corp.com",
    password: "Manager@360!",
    tenantSlug: "demo-corp",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/15"
  },
  {
    label: "Staff",
    badge: "app",
    email: "staff@demo-corp.com",
    password: "Staff@360!",
    tenantSlug: "demo-corp",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/15"
  },
  {
    label: "Customer",
    badge: "portal",
    email: "customer@demo-corp.com",
    password: "Customer@360!",
    tenantSlug: "demo-corp",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20 hover:border-gray-500/50 hover:bg-gray-500/15"
  }
];
function getPanelHome(role) {
  if (["super_admin", "tenant_admin"].includes(role)) return "/admin/dashboard";
  if (role === "customer") return "/portal/dashboard";
  return "/app/dashboard";
}
function LoginForm() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(false);
  const [demoLoading, setDemoLoading] = reactExports.useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
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
      brandingStore.invalidate();
      brandingStore.fetch();
      navigate({ to: search.redirect && !search.redirect.includes("/dashboard") ? search.redirect : getPanelHome(role) });
    } catch (e2) {
      const msg = e2 && typeof e2 === "object" && "message" in e2 ? String(e2.message) : "Unable to sign in. Please try again.";
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };
  const onDemoLogin = async (demo) => {
    setDemoLoading(demo.label);
    setErrors({});
    setEmail(demo.email);
    setPassword(demo.password);
    try {
      const data = await authStore.login(demo.email, demo.password, demo.tenantSlug);
      const role = data.user?.roles?.[0] ?? data.user?.type ?? "";
      brandingStore.invalidate();
      brandingStore.fetch();
      navigate({ to: getPanelHome(role) });
    } catch (e) {
      const msg = e && typeof e === "object" && "message" in e ? String(e.message) : "Demo login failed. Please try again.";
      setErrors({ form: msg });
    } finally {
      setDemoLoading(null);
    }
  };
  const busy = loading || demoLoading !== null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        InputField,
        {
          label: "Work email",
          type: "email",
          autoComplete: "email",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
          value: email,
          onChange: (e) => setEmail(e.target.value),
          error: errors.email,
          disabled: busy
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        InputField,
        {
          label: "Password",
          type: "password",
          autoComplete: "current-password",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
          value: password,
          onChange: (e) => setPassword(e.target.value),
          error: errors.password,
          disabled: busy
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/forgot-password", className: "text-xs font-medium text-primary hover:underline", children: "Forgot password?" }) }),
      errors.form && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive", children: errors.form }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: busy,
          className: "h-11 w-full [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110 disabled:opacity-70",
          children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            " Signing in…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Sign In ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1.5 h-4 w-4" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60", children: "Quick demo access" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/60" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2", children: DEMO_ROLES.map((demo) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          disabled: busy,
          onClick: () => onDemoLogin(demo),
          className: `flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-all disabled:opacity-50 ${demo.color}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: demo.label }),
            demoLoading === demo.label ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider opacity-60 ring-1 ring-current/30", children: demo.badge })
          ]
        },
        demo.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-center text-[10px] text-muted-foreground/50", children: "Demo data — no real incidents or records" })
    ] })
  ] });
}
function LoginPage() {
  const {
    data: branding
  } = useBranding();
  const appName = branding?.appName || APP_NAME;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10", children: [
    branding?.loginBgUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 -z-10 bg-cover bg-center", style: {
      backgroundImage: `url(${branding.loginBgUrl})`
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/70 backdrop-blur-sm" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 -z-10", style: {
      background: "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 55%), radial-gradient(circle at 80% 90%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 50%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center justify-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl [background:var(--gradient-primary)] overflow-hidden", children: branding?.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: branding.logoUrl, alt: appName, className: "h-full w-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold tracking-tight", children: appName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 p-7 [background:var(--gradient-card)] [box-shadow:var(--shadow-elevated)] sm:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight sm:text-2xl", children: "Sign in to your workspace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: "Enter your credentials to access the platform." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginForm, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: branding?.footerText ?? "Protected by SOC 2 · ISO 27001 controls" })
    ] })
  ] });
}
export {
  LoginPage as component
};
