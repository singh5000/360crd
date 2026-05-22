import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { _ as useAuth, L as Link } from "./router-BNkFluS9.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { u as useDashboardStore } from "./dashboard.store-DzU9FCEY.js";
import { W as Warehouse, f as ShieldAlert, C as ClipboardCheck, F as FileText, B as Bell, M as MessageSquare } from "./constants-Bl7kXxvf.js";
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
function PortalDashboardPage() {
  const {
    data,
    loading,
    fetchDashboard
  } = useDashboardStore();
  const {
    user
  } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  reactExports.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);
  const tiles = [{
    label: "My Sites",
    to: "/portal/sites",
    desc: "View assigned site status",
    icon: Warehouse,
    color: "bg-blue-500/10 text-blue-500"
  }, {
    label: "Incidents",
    to: "/portal/incidents",
    desc: "Track incident status",
    icon: ShieldAlert,
    color: "bg-red-500/10 text-red-500"
  }, {
    label: "Audits",
    to: "/portal/audits",
    desc: "Compliance audit results",
    icon: ClipboardCheck,
    color: "bg-green-500/10 text-green-500"
  }, {
    label: "Documents",
    to: "/portal/documents",
    desc: "Policies and SOPs",
    icon: FileText,
    color: "bg-purple-500/10 text-purple-500"
  }, {
    label: "Notifications",
    to: "/portal/notifications",
    desc: "Alerts and reminders",
    icon: Bell,
    color: "bg-orange-500/10 text-orange-500"
  }, {
    label: "Feedback",
    to: "/portal/feedback",
    desc: "Submit queries or complaints",
    icon: MessageSquare,
    color: "bg-gray-500/10 text-gray-500"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[900px] space-y-8 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Welcome back, ",
        firstName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight md:text-3xl", children: "My Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Your site compliance and operational visibility." })
    ] }),
    loading && !data ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3", children: Array.from({
      length: 3
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: [{
      label: "Compliance Score",
      value: `${data?.audits.complianceScore ?? 0}%`,
      color: "text-green-500"
    }, {
      label: "Open Incidents",
      value: data?.incidents.open ?? 0,
      color: "text-red-500"
    }, {
      label: "Completed Audits",
      value: data?.audits.completed ?? 0,
      color: "text-blue-500"
    }].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "p-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${stat.color}`, children: stat.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: stat.label })
    ] }, stat.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: tiles.map((tile) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: tile.to, className: "group flex items-center gap-4 rounded-xl border border-border/60 bg-card/50 p-4 transition-all hover:border-border hover:bg-card hover:shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tile.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(tile.icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground group-hover:text-primary", children: tile.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground truncate", children: tile.desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" })
    ] }, tile.to)) })
  ] }) });
}
export {
  PortalDashboardPage as component
};
