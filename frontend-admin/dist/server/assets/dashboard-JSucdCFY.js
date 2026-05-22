import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { _ as useAuth, a5 as usePermissions, L as Link } from "./router-BNkFluS9.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { L as LiveIndicator } from "./LiveIndicator-BRItgDsR.js";
import { u as useDashboardStore } from "./dashboard.store-DzU9FCEY.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
import { T as TriangleAlert } from "./triangle-alert-GCFJUcPs.js";
import { g as ShieldCheck, G as GraduationCap, C as ClipboardCheck } from "./constants-Bl7kXxvf.js";
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
import "./index-LBw-IAWe.js";
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  loading
}) {
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-5 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-3 h-7 w-20" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-1.5 h-3.5 w-28" })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-2xl font-bold tracking-tight", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: label }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground/70", children: sub })
  ] });
}
function AppDashboardPage() {
  const {
    data,
    loading,
    fetchDashboard
  } = useDashboardStore();
  const {
    user
  } = useAuth();
  const can = usePermissions();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  reactExports.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);
  const quickLinks = [{
    label: "View incidents",
    to: "/app/incidents",
    desc: "Track and resolve safety incidents",
    show: can("incident:read")
  }, {
    label: "Schedule audit",
    to: "/app/audits/create",
    desc: "Create a new compliance audit",
    show: can("audit:create")
  }, {
    label: "Manage training",
    to: "/app/training",
    desc: "Enroll users in safety training",
    show: can("training:read")
  }, {
    label: "PPE inventory",
    to: "/app/ppe",
    desc: "Check equipment assignments",
    show: can("ppe:read")
  }, {
    label: "Asset register",
    to: "/app/assets",
    desc: "Track all company assets",
    show: can("asset:read")
  }, {
    label: "Run report",
    to: "/app/reports",
    desc: "Generate compliance reports",
    show: can("report:read")
  }].filter((l) => l.show);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-8 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Welcome back, ",
          firstName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight md:text-3xl", children: "Operations Overview" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveIndicator, {}),
        can("incident:create") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/incidents/create", className: "inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Report Incident"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Open Incidents", value: data?.incidents.open ?? 0, sub: `${data?.incidents.thisMonth ?? 0} this month`, icon: TriangleAlert, color: "bg-red-500/10 text-red-500", loading: loading && !data }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Compliance Score", value: `${data?.audits.complianceScore ?? 0}%`, sub: `${data?.audits.completed ?? 0} audits completed`, icon: ShieldCheck, color: "bg-green-500/10 text-green-500", loading: loading && !data }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Training Completion", value: `${data?.training.completionRate ?? 0}%`, sub: `${data?.training.enrolled ?? 0} enrolled`, icon: GraduationCap, color: "bg-blue-500/10 text-blue-500", loading: loading && !data }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Open CAPAs", value: data?.actions.openCapas ?? 0, sub: `${data?.actions.overdueAudits ?? 0} overdue audits`, icon: ClipboardCheck, color: "bg-orange-500/10 text-orange-500", loading: loading && !data })
    ] }),
    quickLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: quickLinks.map((tile) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: tile.to, className: "group flex items-center justify-between rounded-xl border border-border/60 bg-card/50 p-4 transition-all hover:border-border hover:bg-card hover:shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground group-hover:text-primary", children: tile.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: tile.desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" })
    ] }, tile.to)) }),
    data && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Audit Compliance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2 text-sm", children: [["Completed", data.audits.completed], ["Passed", data.audits.passed, "text-green-500"], ["Total", data.audits.total]].map(([k, v, c]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${c ?? ""}`, children: v })
        ] }, k)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Training Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2 text-sm", children: [["Completed", data.training.completed, "text-green-500"], ["Enrolled", data.training.enrolled], ["Rate", `${data.training.completionRate}%`]].map(([k, v, c]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${c ?? ""}`, children: v })
        ] }, k)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Outstanding Actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2 text-sm", children: [["Open CAPAs", data.actions.openCapas, "text-orange-500"], ["Overdue Audits", data.actions.overdueAudits, "text-red-500"], ["Overdue CAPAs", data.actions.overdueCapas, "text-red-500"]].map(([k, v, c]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${c ?? ""}`, children: v })
        ] }, k)) })
      ] })
    ] })
  ] }) });
}
export {
  AppDashboardPage as component
};
