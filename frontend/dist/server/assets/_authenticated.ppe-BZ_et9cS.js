import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell, e as ChevronRight } from "./AppShell-CYz6-NtT.js";
import { a5 as usePermissions, w as cn, q as apiClient, E as ENDPOINTS, Y as toast } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BjLeeRHr.js";
import { F as FilterBar } from "./FilterBar-DE80M45K.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { P as Package, H as HardHat } from "./constants-Bl7kXxvf.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { T as TriangleAlert } from "./triangle-alert-GCFJUcPs.js";
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
const CONDITION_COLOR = {
  EXCELLENT: "text-green-500",
  GOOD: "text-blue-500",
  FAIR: "text-yellow-500",
  POOR: "text-orange-500",
  DAMAGED: "text-red-500"
};
const STATUS_COLOR = {
  AVAILABLE: "bg-green-500/10 text-green-600 border-green-500/20",
  ASSIGNED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  DISPOSED: "bg-gray-500/10 text-gray-600 border-gray-500/20"
};
const PPE_CATEGORIES = ["HEAD", "EYE", "EAR", "RESPIRATORY", "HAND", "FOOT", "BODY", "HIGH_VIS", "FALL_PROTECTION", "OTHER"];
const FILTER_CONFIGS = [{
  key: "status",
  label: "Status",
  options: [{
    value: "AVAILABLE",
    label: "Available"
  }, {
    value: "ASSIGNED",
    label: "Assigned"
  }, {
    value: "MAINTENANCE",
    label: "Maintenance"
  }, {
    value: "DISPOSED",
    label: "Disposed"
  }]
}, {
  key: "condition",
  label: "Condition",
  options: [{
    value: "EXCELLENT",
    label: "Excellent"
  }, {
    value: "GOOD",
    label: "Good"
  }, {
    value: "FAIR",
    label: "Fair"
  }, {
    value: "POOR",
    label: "Poor"
  }, {
    value: "DAMAGED",
    label: "Damaged"
  }]
}];
const EMPTY_FORM = {
  name: "",
  category: "HEAD",
  brand: "",
  model: "",
  serialNumber: ""
};
function PPEPage() {
  const [items, setItems] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [filterVals, setFilterVals] = reactExports.useState({});
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const can = usePermissions();
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [submitting, setSubmitting] = reactExports.useState(false);
  async function load() {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([apiClient.get(ENDPOINTS.ppe.list, {
        limit: 100
      }), apiClient.get(ENDPOINTS.ppe.stats)]);
      setItems(listRes.data ?? []);
      setStats(statsRes.data ?? null);
    } catch {
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    load();
  }, []);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q) && !(item.serialNumber ?? "").toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      if (filterVals.condition && filterVals.condition !== "ALL" && item.condition !== filterVals.condition) return false;
      return true;
    });
  }, [items, search, filterVals]);
  const pills = [{
    label: "Total Items",
    value: stats?.total ?? items.length,
    icon: Package,
    color: "text-foreground"
  }, {
    label: "Available",
    value: stats?.available ?? items.filter((i) => i.status === "AVAILABLE").length,
    icon: CircleCheck,
    color: "text-green-500"
  }, {
    label: "Assigned",
    value: stats?.assigned ?? items.filter((i) => i.status === "ASSIGNED").length,
    icon: HardHat,
    color: "text-blue-500"
  }, {
    label: "Expiring Soon",
    value: stats?.expiringSoon ?? 0,
    icon: TriangleAlert,
    color: "text-red-500"
  }];
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.ppe.create, {
        name: form.name,
        category: form.category,
        brand: form.brand || void 0,
        model: form.model || void 0,
        serialNumber: form.serialNumber || void 0
      });
      toast.success("PPE item added");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to add PPE item");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "PPE Inventory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage personal protective equipment and assignments." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          can("ppe:create") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add PPE"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pills.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search PPE items…", filters: FILTER_CONFIGS, values: filterVals, onFilterChange: (key, val) => setFilterVals((prev) => ({
        ...prev,
        [key]: val
      })), onClear: () => {
        setSearch("");
        setFilterVals({});
      } }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 8
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No PPE items found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "Add your first PPE item to the inventory" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Condition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell text-xs", children: "Brand / Model" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell text-xs", children: "Serial #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 cursor-pointer hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600"), children: item.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground", children: item.category }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: item.condition ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-xs font-medium", CONDITION_COLOR[item.condition] ?? "text-muted-foreground"), children: item.condition }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground", children: [item.brand, item.model].filter(Boolean).join(" ") || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell font-mono text-xs text-muted-foreground", children: item.serialNumber ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/50" }) })
        ] }, item.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen && can("ppe:create"), onOpenChange: setDrawerOpen, title: "Add PPE Item", description: "Register new personal protective equipment", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "create-ppe-form", type: "submit", disabled: submitting || !form.name, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Adding…" : "Add Item" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "create-ppe-form", onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "ppe-name", children: [
          "Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ppe-name", placeholder: "e.g. Safety Helmet — Class E", value: form.name, onChange: (e) => setForm((f) => ({
          ...f,
          name: e.target.value
        })), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ppe-category", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.category, onValueChange: (v) => setForm((f) => ({
          ...f,
          category: v
        })), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "ppe-category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PPE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c.replace(/_/g, " ") }, c)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ppe-brand", children: "Brand" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ppe-brand", placeholder: "3M", value: form.brand, onChange: (e) => setForm((f) => ({
            ...f,
            brand: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ppe-model", children: "Model" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ppe-model", placeholder: "H-700", value: form.model, onChange: (e) => setForm((f) => ({
            ...f,
            model: e.target.value
          })) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ppe-serial", children: "Serial Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ppe-serial", placeholder: "SN-XXXXXXXX", value: form.serialNumber, onChange: (e) => setForm((f) => ({
          ...f,
          serialNumber: e.target.value
        })) })
      ] })
    ] }) })
  ] });
}
export {
  PPEPage as component
};
