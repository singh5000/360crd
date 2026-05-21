import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell, e as ChevronRight } from "./AppShell-CYz6-NtT.js";
import { u as useAuditStore, a as auditService } from "./audit.store-RbeqPsCg.js";
import { a5 as usePermissions, w as cn } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BjLeeRHr.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { T as Textarea } from "./textarea-D7DuXlBF.js";
import { F as FilterBar } from "./FilterBar-DE80M45K.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { C as ClipboardCheck } from "./constants-Bl7kXxvf.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { C as Clock } from "./clock-kYCucZdt.js";
import { T as TriangleAlert } from "./triangle-alert-GCFJUcPs.js";
import { C as ChartColumn } from "./chart-column-CwKUJLEQ.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
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
import "./index-BQhF8c1W.js";
import "./sheet-BVXXTVLX.js";
import "./index-BYUMqYpj.js";
const STATUS_COLOR = {
  DRAFT: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SCHEDULED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  REVIEWED: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20"
};
const AUDIT_TYPES = ["INTERNAL", "EXTERNAL", "SUPPLIER", "REGULATORY", "ISO9001", "ISO14001", "ISO45001", "CUSTOM"];
const FILTER_CONFIGS = [{
  key: "status",
  label: "Status",
  options: [{
    value: "DRAFT",
    label: "Draft"
  }, {
    value: "SCHEDULED",
    label: "Scheduled"
  }, {
    value: "IN_PROGRESS",
    label: "In Progress"
  }, {
    value: "COMPLETED",
    label: "Completed"
  }, {
    value: "REVIEWED",
    label: "Reviewed"
  }, {
    value: "CANCELLED",
    label: "Cancelled"
  }]
}, {
  key: "type",
  label: "Type",
  options: AUDIT_TYPES.map((t) => ({
    value: t,
    label: t.replace(/_/g, " ")
  }))
}];
const EMPTY_FORM = {
  title: "",
  description: "",
  type: "INTERNAL",
  scheduledAt: "",
  dueDate: ""
};
function AuditsPage() {
  const {
    audits,
    loading,
    initialized,
    fetchAudits,
    createAudit
  } = useAuditStore();
  const can = usePermissions();
  const [stats, setStats] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [filterVals, setFilterVals] = reactExports.useState({});
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!initialized) fetchAudits();
    auditService.stats().then(setStats).catch(() => {
    });
  }, [initialized, fetchAudits]);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return audits.filter((a) => {
      if (q && !a.title.toLowerCase().includes(q) && !a.refNumber.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && a.status !== filterVals.status) return false;
      if (filterVals.type && filterVals.type !== "ALL" && a.type !== filterVals.type) return false;
      return true;
    });
  }, [audits, search, filterVals]);
  const pills = [{
    label: "Total",
    value: stats?.total ?? audits.length,
    icon: ClipboardCheck,
    color: "text-foreground"
  }, {
    label: "Completed",
    value: stats?.completed ?? audits.filter((a) => a.status === "COMPLETED").length,
    icon: CircleCheck,
    color: "text-green-500"
  }, {
    label: "In Progress",
    value: audits.filter((a) => a.status === "IN_PROGRESS").length,
    icon: Clock,
    color: "text-yellow-500"
  }, {
    label: "Overdue",
    value: stats?.overdue ?? 0,
    icon: TriangleAlert,
    color: "text-red-500"
  }, {
    label: "Avg Score",
    value: stats?.avgScore ? `${stats.avgScore.toFixed(0)}%` : "—",
    icon: ChartColumn,
    color: "text-primary"
  }];
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAudit({
        ...form,
        scheduledAt: form.scheduledAt || void 0,
        dueDate: form.dueDate || void 0
      });
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Audits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Plan, execute and review compliance audits." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchAudits(), disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          can("audit:create") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " New Audit"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pills.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search auditsâ€¦", filters: FILTER_CONFIGS, values: filterVals, onFilterChange: (key, val) => setFilterVals((prev) => ({
        ...prev,
        [key]: val
      })), onClear: () => {
        setSearch("");
        setFilterVals({});
      } }),
      loading && !initialized ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 6
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No audits found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "Create your first audit to get started" }),
        !search && !Object.values(filterVals).some((v) => v && v !== "ALL") && can("audit:create") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground", onClick: () => setDrawerOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " New Audit"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[110px] text-xs", children: "Ref #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell text-xs", children: "Site" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell text-xs", children: "Assignee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Scheduled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs w-[80px]", children: "Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((audit) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 cursor-pointer hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: audit.refNumber }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium max-w-[200px] truncate", children: audit.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[audit.status] ?? "bg-gray-500/10 text-gray-600"), children: audit.status.replace(/_/g, " ") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground", children: audit.type }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground", children: audit.site?.name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground", children: audit.assignedTo ? `${audit.assignedTo.firstName} ${audit.assignedTo.lastName}` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: audit.scheduledAt ? new Date(audit.scheduledAt).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm font-semibold", children: audit.percentage != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: audit.passed ? "text-green-500" : "text-red-500", children: [
            audit.percentage.toFixed(0),
            "%"
          ] }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/50" }) })
        ] }, audit.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen && can("audit:create"), onOpenChange: setDrawerOpen, title: "New Audit", description: "Create a new compliance audit", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "create-audit-form", type: "submit", disabled: submitting || !form.title, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Creatingâ€¦" : "Create Audit" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "create-audit-form", onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "audit-title", children: [
          "Title ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "audit-title", placeholder: "e.g. Q2 Safety Compliance Audit", value: form.title, onChange: (e) => setForm((f) => ({
          ...f,
          title: e.target.value
        })), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "audit-type", children: "Audit Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.type, onValueChange: (v) => setForm((f) => ({
          ...f,
          type: v
        })), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "audit-type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: AUDIT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t.replace(/_/g, " ") }, t)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "audit-scheduled", children: "Scheduled Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "audit-scheduled", type: "date", value: form.scheduledAt, onChange: (e) => setForm((f) => ({
            ...f,
            scheduledAt: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "audit-due", children: "Due Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "audit-due", type: "date", value: form.dueDate, onChange: (e) => setForm((f) => ({
            ...f,
            dueDate: e.target.value
          })) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "audit-desc", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "audit-desc", placeholder: "Describe the scope and objectivesâ€¦", rows: 3, value: form.description, onChange: (e) => setForm((f) => ({
          ...f,
          description: e.target.value
        })) })
      ] })
    ] }) })
  ] });
}
export {
  AuditsPage as component
};
