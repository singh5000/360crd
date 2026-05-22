import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { w as cn, q as apiClient, E as ENDPOINTS, Y as toast } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import { L as LoaderCircle } from "./loader-circle-CMZ_gZVG.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
import { c as Archive } from "./constants-Bl7kXxvf.js";
import { D as Download } from "./download-COyionkw.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-LBw-IAWe.js";
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
import "./index-TU15xtvZ.js";
const REPORT_TYPES = [{
  value: "INCIDENT_SUMMARY",
  label: "Incident Summary"
}, {
  value: "AUDIT_SUMMARY",
  label: "Audit Summary"
}, {
  value: "TRAINING_COMPLETION",
  label: "Training Completion"
}, {
  value: "PPE_INVENTORY",
  label: "PPE Inventory"
}, {
  value: "WASTE_SUMMARY",
  label: "Waste Summary"
}, {
  value: "COMPLIANCE_STATUS",
  label: "Compliance Status"
}];
const STATUS_COLOR = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  FAILED: "bg-red-500/10 text-red-600 border-red-500/20"
};
function ReportsPage() {
  const [reports, setReports] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [generating, setGenerating] = reactExports.useState(null);
  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get(ENDPOINTS.reports.list, {
        limit: 20
      });
      setReports(res.data ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    load();
  }, []);
  async function generate(type, label) {
    setGenerating(type);
    try {
      await apiClient.post(ENDPOINTS.reports.create, {
        title: `${label} - ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`,
        type,
        parameters: {},
        filters: {}
      });
      toast.success(`${label} report requested — it will be ready shortly`);
      setTimeout(load, 2e3);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(null);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Generate and download compliance reports." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-sm font-medium text-muted-foreground", children: "Generate Report" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: REPORT_TYPES.map((rt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-auto flex-col gap-1.5 py-4", onClick: () => generate(rt.value, rt.label), disabled: generating !== null, children: [
        generating === rt.value ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: rt.label })
      ] }, rt.value)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-sm font-medium text-muted-foreground", children: "Recent Reports" }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 5
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-lg" }, i)) }) : reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No reports generated yet" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: reports.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-5 w-5 shrink-0 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: r.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            r.type?.replace(/_/g, " "),
            " · ",
            new Date(r.createdAt).toLocaleDateString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[r.status] ?? "bg-gray-500/10 text-gray-600"), children: r.status }),
          r.status === "COMPLETED" && r.fileUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-7 gap-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3" }),
            " Download"
          ] })
        ] })
      ] }, r.id)) })
    ] })
  ] }) });
}
export {
  ReportsPage as component
};
