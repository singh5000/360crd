import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { _ as useAuth, L as Link } from "./router-BNkFluS9.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { u as useDashboardStore } from "./dashboard.store-DzU9FCEY.js";
import { f as ShieldAlert, C as ClipboardCheck, U as Users, b as Activity, W as Warehouse, e as Building2 } from "./constants-Bl7kXxvf.js";
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
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  to,
  loading
}) {
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SurfaceCard, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20" }) });
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "group p-5 transition-all hover:border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-2xl font-bold tracking-tight", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: label }),
    to && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "mt-2 h-3.5 w-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" })
  ] });
  return to ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, children: inner }) : inner;
}
function AdminDashboardPage() {
  const {
    data,
    loading,
    fetchDashboard
  } = useDashboardStore();
  const {
    user
  } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Admin";
  reactExports.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);
  const quickLinks = [{
    label: "Manage Users",
    to: "/admin/users",
    desc: "Create, assign roles and permissions",
    icon: Users
  }, {
    label: "View Sites",
    to: "/admin/sites",
    desc: "Monitor all operational sites",
    icon: Warehouse
  }, {
    label: "Customers",
    to: "/admin/companies",
    desc: "Manage customer organizations",
    icon: Building2
  }, {
    label: "Incidents Overview",
    to: "/admin/incidents",
    desc: "Read-only incident visibility",
    icon: ShieldAlert
  }, {
    label: "Audit Overview",
    to: "/admin/audits",
    desc: "Platform-wide audit status",
    icon: ClipboardCheck
  }, {
    label: "Activity Log",
    to: "/admin/activity",
    desc: "Full platform audit trail",
    icon: Activity
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-8 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Welcome back, ",
        firstName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight md:text-3xl", children: "Platform Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Enterprise-wide visibility across all sites and operations." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Open Incidents", value: data?.incidents.open ?? 0, icon: ShieldAlert, color: "bg-red-500/10 text-red-500", to: "/admin/incidents", loading: loading && !data }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Compliance Score", value: `${data?.audits.complianceScore ?? 0}%`, icon: ClipboardCheck, color: "bg-green-500/10 text-green-500", to: "/admin/audits", loading: loading && !data }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Training Rate", value: `${data?.training.completionRate ?? 0}%`, icon: Users, color: "bg-blue-500/10 text-blue-500", to: "/admin/training", loading: loading && !data }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Open CAPAs", value: data?.actions.openCapas ?? 0, icon: Activity, color: "bg-orange-500/10 text-orange-500", loading: loading && !data })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: quickLinks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, className: "group flex items-center justify-between rounded-xl border border-border/60 bg-card/50 p-4 transition-all hover:border-border hover:bg-card hover:shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground group-hover:text-primary", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: item.desc })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" })
    ] }, item.to)) }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2 text-sm", children: [["Completed", data.training.completed, "text-green-500"], ["Enrolled", data.training.enrolled], ["Completion Rate", `${data.training.completionRate}%`]].map(([k, v, c]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
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
  AdminDashboardPage as component
};
