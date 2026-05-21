import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { a5 as usePermissions, _ as useAuth, w as cn, L as Link } from "./router-BNkFluS9.js";
import { A as AppShell, e as ChevronRight } from "./AppShell-CYz6-NtT.js";
import { S as SurfaceCard } from "./Card-wMv8w39G.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { F as FilterBar } from "./FilterBar-DE80M45K.js";
import { u as useIncidentStore } from "./incident.store-CblRw8Bo.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { T as Textarea } from "./textarea-D7DuXlBF.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BjLeeRHr.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
import { f as ShieldAlert } from "./constants-Bl7kXxvf.js";
import { C as Clock } from "./clock-kYCucZdt.js";
import { T as TriangleAlert } from "./triangle-alert-GCFJUcPs.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { S as Send } from "./send-D1lhRYvj.js";
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
import "./sheet-BVXXTVLX.js";
import "./index-BYUMqYpj.js";
import "./index-TU15xtvZ.js";
import "./incident.service-Cg_BXvXy.js";
import "./index-BQhF8c1W.js";
const STATUS_COLOR = {
  OPEN: "bg-red-500/10 text-red-600 border-red-500/20",
  REPORTED: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  INVESTIGATING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_REVIEW: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  RESOLVED: "bg-green-500/10 text-green-600 border-green-500/20",
  CLOSED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-400/20"
};
const SEVERITY_COLOR = {
  LOW: "bg-gray-500/10 text-gray-600",
  MEDIUM: "bg-yellow-500/10 text-yellow-600",
  HIGH: "bg-orange-500/10 text-orange-600",
  CRITICAL: "bg-red-500/10 text-red-600"
};
const FILTER_CONFIGS = [{
  key: "status",
  label: "Status",
  options: [{
    value: "OPEN",
    label: "Open"
  }, {
    value: "REPORTED",
    label: "Reported"
  }, {
    value: "INVESTIGATING",
    label: "Investigating"
  }, {
    value: "IN_REVIEW",
    label: "In Review"
  }, {
    value: "RESOLVED",
    label: "Resolved"
  }, {
    value: "CLOSED",
    label: "Closed"
  }, {
    value: "CANCELLED",
    label: "Cancelled"
  }]
}, {
  key: "severity",
  label: "Severity",
  options: [{
    value: "LOW",
    label: "Low"
  }, {
    value: "MEDIUM",
    label: "Medium"
  }, {
    value: "HIGH",
    label: "High"
  }, {
    value: "CRITICAL",
    label: "Critical"
  }]
}, {
  key: "type",
  label: "Type",
  options: [{
    value: "SAFETY",
    label: "Safety"
  }, {
    value: "ENVIRONMENTAL",
    label: "Environmental"
  }, {
    value: "QUALITY",
    label: "Quality"
  }, {
    value: "SECURITY",
    label: "Security"
  }, {
    value: "NEAR_MISS",
    label: "Near Miss"
  }, {
    value: "PROPERTY_DAMAGE",
    label: "Property Damage"
  }, {
    value: "OTHER",
    label: "Other"
  }]
}];
const INCIDENT_TYPES = ["SAFETY", "ENVIRONMENTAL", "QUALITY", "SECURITY", "NEAR_MISS", "PROPERTY_DAMAGE", "OTHER"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
function CreateIncidentForm({
  onSuccess,
  onCancel
}) {
  const {
    createIncident
  } = useIncidentStore();
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [type, setType] = reactExports.useState("SAFETY");
  const [severity, setSeverity] = reactExports.useState("MEDIUM");
  const [priority, setPriority] = reactExports.useState("MEDIUM");
  const [occurredAt, setOccurredAt] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 16));
  const [location, setLocation] = reactExports.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createIncident({
        title: title.trim(),
        description: description.trim() || void 0,
        type,
        severity,
        priority,
        occurredAt: new Date(occurredAt).toISOString(),
        location: location.trim() || void 0
      });
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "create-incident-form", onSubmit: handleSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: [
        "Title ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Brief description of the incident", required: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "What happened, where and when. Include immediate actions taken.", rows: 3 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: [
          "Type ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: setType, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: INCIDENT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t.replace(/_/g, " ") }, t)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: [
          "Date & Time ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: occurredAt, onChange: (e) => setOccurredAt(e.target.value), className: "h-9", required: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Building, area, or GPS coordinates" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Severity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: SEVERITIES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSeverity(s), className: cn("h-9 rounded-lg border text-xs font-semibold transition-all", severity === s ? s === "LOW" ? "border-gray-400 bg-gray-500/10 text-gray-700" : s === "MEDIUM" ? "border-yellow-400 bg-yellow-500/10 text-yellow-700" : s === "HIGH" ? "border-orange-400 bg-orange-500/10 text-orange-700" : "border-red-400 bg-red-500/10 text-red-700" : "border-border/60 text-muted-foreground hover:border-border"), children: s }, s)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Priority" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: PRIORITIES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPriority(p), className: cn("h-9 rounded-lg border text-xs font-semibold transition-all", priority === p ? "border-primary/60 bg-primary/10 text-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]" : "border-border/60 text-muted-foreground hover:border-border"), children: p }, p)) })
    ] })
  ] });
}
function StatPill({
  label,
  value,
  icon: Icon,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 rounded-lg border border-border/50 bg-card/60 px-4 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold leading-none text-foreground", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: label })
    ] })
  ] });
}
function IncidentsPage() {
  const {
    incidents,
    loading,
    initialized,
    fetchIncidents
  } = useIncidentStore();
  const can = usePermissions();
  const {
    user
  } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [filterValues, setFilterValues] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (!initialized) fetchIncidents();
  }, [initialized, fetchIncidents]);
  const filtered = reactExports.useMemo(() => {
    return incidents.filter((inc) => {
      if (filterValues.status && filterValues.status !== "ALL" && inc.status !== filterValues.status) return false;
      if (filterValues.severity && filterValues.severity !== "ALL" && inc.severity !== filterValues.severity) return false;
      if (filterValues.type && filterValues.type !== "ALL" && inc.type !== filterValues.type) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${inc.title} ${inc.refNumber} ${inc.site?.name ?? ""} ${inc.reportedBy?.firstName ?? ""} ${inc.reportedBy?.lastName ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [incidents, search, filterValues]);
  const stats = reactExports.useMemo(() => ({
    total: incidents.length,
    open: incidents.filter((i) => ["OPEN", "REPORTED", "INVESTIGATING", "IN_REVIEW"].includes(i.status)).length,
    critical: incidents.filter((i) => i.severity === "CRITICAL").length,
    resolved: incidents.filter((i) => i.status === "RESOLVED").length
  }), [incidents]);
  const handleFilterChange = (key, val) => setFilterValues((prev) => ({
    ...prev,
    [key]: val
  }));
  const handleClear = () => {
    setSearch("");
    setFilterValues({});
  };
  const handleCreateSuccess = () => {
    setDrawerOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Incidents" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Track, triage and resolve operational incidents." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchIncidents(), disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          can("incident:create") && !isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setDrawerOpen(true), className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Report Incident"
          ] })
        ] })
      ] }),
      !loading && incidents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Total", value: stats.total, icon: ShieldAlert, color: "bg-primary/10 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Open", value: stats.open, icon: Clock, color: "bg-orange-500/10 text-orange-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Critical", value: stats.critical, icon: TriangleAlert, color: "bg-red-500/10 text-red-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Resolved", value: stats.resolved, icon: CircleCheck, color: "bg-green-500/10 text-green-500" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search incidentsâ€¦", filters: FILTER_CONFIGS, values: filterValues, onFilterChange: handleFilterChange, onClear: handleClear }),
      loading && !initialized ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({
        length: 6
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex flex-col items-center justify-center py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-10 w-10 text-muted-foreground/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium text-foreground", children: incidents.length === 0 ? "No incidents yet" : "No incidents match filters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: incidents.length === 0 ? "Report the first incident to get started." : "Try adjusting your search or filter criteria." }),
        incidents.length === 0 && can("incident:create") && !isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground", onClick: () => setDrawerOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Report Incident"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Showing ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: filtered.length }),
          " of",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: incidents.length }),
          " incidents"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-transparent border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[110px] text-xs font-semibold uppercase tracking-wider", children: "Ref #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold uppercase tracking-wider", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[110px] text-xs font-semibold uppercase tracking-wider", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[90px] text-xs font-semibold uppercase tracking-wider", children: "Severity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[90px] text-xs font-semibold uppercase tracking-wider hidden md:table-cell", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[140px] text-xs font-semibold uppercase tracking-wider hidden lg:table-cell", children: "Site" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[120px] text-xs font-semibold uppercase tracking-wider hidden lg:table-cell", children: "Reporter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[100px] text-xs font-semibold uppercase tracking-wider hidden sm:table-cell", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[40px]" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((inc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "group cursor-pointer border-border/40 hover:bg-accent/40", onClick: () => {
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/incidents/$id", params: {
              id: inc.id
            }, className: "block", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground hover:text-foreground transition-colors", children: inc.refNumber }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/incidents/$id", params: {
              id: inc.id
            }, className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm leading-snug line-clamp-1", children: inc.title }),
              inc.location && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: inc.location })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", STATUS_COLOR[inc.status] ?? "bg-gray-500/10 text-gray-600 border-gray-500/20"), children: inc.status.replace(/_/g, " ") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", SEVERITY_COLOR[inc.severity] ?? "bg-gray-500/10 text-gray-600"), children: inc.severity }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: inc.type?.replace(/_/g, " ") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80", children: inc.site?.name ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "—" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80", children: inc.reportedBy ? `${inc.reportedBy.firstName} ${inc.reportedBy.lastName}` : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "—" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(inc.occurredAt).toLocaleDateString() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/incidents/$id", params: {
              id: inc.id
            }, className: "flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" }) }) })
          ] }, inc.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen && can("incident:create") && !isSuperAdmin, onOpenChange: setDrawerOpen, title: "Report Incident", description: "Document what happened, classify severity, and notify the team.", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", form: "create-incident-form", size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5" }),
        "Submit Report"
      ] })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreateIncidentForm, { onSuccess: handleCreateSuccess, onCancel: () => setDrawerOpen(false) }) })
  ] });
}
export {
  IncidentsPage as component
};
