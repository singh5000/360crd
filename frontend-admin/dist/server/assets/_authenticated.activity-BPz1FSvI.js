import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { u as useActivityStore, d as List, L as LayoutGrid, a as ActivityFilters, b as ActivityTable, c as ActivityTimeline, A as ActivityDetailsDrawer } from "./activity.store-C064u1FP.js";
import { O as filterLogs, w as cn } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./constants-Bl7kXxvf.js";
import "./index-LBw-IAWe.js";
import "./eye-C01Vu7q5.js";
import "./toggle-right-CeggEEHh.js";
import "./triangle-alert-GCFJUcPs.js";
import "./trash-2-Cz8eoZhE.js";
import "./plus-CM7VIcXc.js";
import "./circle-check-CVdlMzuE.js";
import "./sheet-BVXXTVLX.js";
import "./index-BYUMqYpj.js";
import "./index-TU15xtvZ.js";
import "./clock-kYCucZdt.js";
import "./laptop-C_oDjGx0.js";
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
const DEFAULT_FILTERS = {
  search: "",
  module: "All",
  user: "All",
  companyId: "All",
  action: "All",
  from: "",
  to: ""
};
function ActivityPage() {
  const {
    logs,
    loading,
    initialized,
    fetchLogs
  } = useActivityStore();
  const [filters, setFilters] = reactExports.useState(DEFAULT_FILTERS);
  const [view, setView] = reactExports.useState("table");
  const [selected, setSelected] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!initialized) fetchLogs();
  }, [initialized, fetchLogs]);
  const filtered = reactExports.useMemo(() => filterLogs(logs, filters), [logs, filters]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1280px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Activity Logs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
            "Centralized audit trail across every module · ",
            filtered.length,
            " of ",
            logs.length,
            " events"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchLogs(), disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-xl border border-border/70 bg-card/40 p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ViewBtn, { active: view === "table", onClick: () => setView("table"), icon: List, label: "Table" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ViewBtn, { active: view === "timeline", onClick: () => setView("timeline"), icon: LayoutGrid, label: "Timeline" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityFilters, { value: filters, onChange: setFilters }),
      view === "table" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityTable, { logs: filtered, onSelect: setSelected }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityTimeline, { logs: filtered, onSelect: setSelected })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityDetailsDrawer, { log: selected, onClose: () => setSelected(null) })
  ] });
}
function ViewBtn({
  active,
  onClick,
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: cn("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all", active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
    " ",
    label
  ] });
}
export {
  ActivityPage as component
};
