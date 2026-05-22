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
import { R as Recycle } from "./constants-Bl7kXxvf.js";
import { S as Scale, D as DollarSign } from "./scale-BUEOS1q6.js";
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
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  APPROVED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  DISPOSED: "bg-green-500/10 text-green-600 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20"
};
const WASTE_CATEGORIES = ["HAZARDOUS", "NON_HAZARDOUS", "RECYCLABLE", "ELECTRONIC", "ORGANIC", "LIQUID", "OTHER"];
const WASTE_UNITS = ["KG", "LITRES", "UNITS", "TONNES", "M3"];
const FILTER_CONFIGS = [{
  key: "status",
  label: "Status",
  options: [{
    value: "PENDING",
    label: "Pending"
  }, {
    value: "APPROVED",
    label: "Approved"
  }, {
    value: "DISPOSED",
    label: "Disposed"
  }, {
    value: "REJECTED",
    label: "Rejected"
  }]
}, {
  key: "category",
  label: "Category",
  options: WASTE_CATEGORIES.map((c) => ({
    value: c,
    label: c.replace(/_/g, " ")
  }))
}];
const EMPTY_FORM = {
  wasteType: "",
  category: "NON_HAZARDOUS",
  quantity: "",
  unit: "KG",
  disposedAt: ""
};
function WastePage() {
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
      const [listRes, statsRes] = await Promise.all([apiClient.get(ENDPOINTS.waste.list, {
        limit: 100
      }), apiClient.get(ENDPOINTS.waste.stats)]);
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
      if (q && !item.wasteType.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      if (filterVals.category && filterVals.category !== "ALL" && item.category !== filterVals.category) return false;
      return true;
    });
  }, [items, search, filterVals]);
  const pills = [{
    label: "Total Records",
    value: stats?.total ?? items.length,
    icon: Recycle,
    color: "text-foreground"
  }, {
    label: "Quantity (kg)",
    value: stats?.totalQuantity ? stats.totalQuantity.toFixed(1) : "—",
    icon: Scale,
    color: "text-blue-500"
  }, {
    label: "Est. Cost",
    value: stats?.totalCost ? `$${stats.totalCost.toFixed(0)}` : "—",
    icon: DollarSign,
    color: "text-green-500"
  }];
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.waste.create, {
        wasteType: form.wasteType,
        category: form.category,
        quantity: Number(form.quantity),
        unit: form.unit,
        disposedAt: form.disposedAt || void 0
      });
      toast.success("Waste record created");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to create waste record");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Waste Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Track and manage waste disposal records." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          can("waste:create") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Log Waste"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pills.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search waste recordsâ€¦", filters: FILTER_CONFIGS, values: filterVals, onFilterChange: (key, val) => setFilterVals((prev) => ({
        ...prev,
        [key]: val
      })), onClear: () => {
        setSearch("");
        setFilterVals({});
      } }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 8
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Recycle, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No waste records found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "Log your first waste disposal record" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Waste Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell text-xs", children: "Site" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 cursor-pointer hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: item.wasteType }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600"), children: item.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground", children: item.category?.replace(/_/g, " ") ?? "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: [
            item.quantity,
            " ",
            item.unit
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground", children: item.site?.name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: new Date(item.disposedAt ?? item.createdAt).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/50" }) })
        ] }, item.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen && can("waste:create"), onOpenChange: setDrawerOpen, title: "Log Waste Record", description: "Record a waste disposal event", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "create-waste-form", type: "submit", disabled: submitting || !form.wasteType || !form.quantity, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Loggingâ€¦" : "Log Waste" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "create-waste-form", onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "waste-type", children: [
          "Waste Type ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "waste-type", placeholder: "e.g. Chemical Solvent", value: form.wasteType, onChange: (e) => setForm((f) => ({
          ...f,
          wasteType: e.target.value
        })), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "waste-category", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.category, onValueChange: (v) => setForm((f) => ({
          ...f,
          category: v
        })), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "waste-category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: WASTE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c.replace(/_/g, " ") }, c)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "waste-qty", children: [
            "Quantity ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "waste-qty", type: "number", step: "0.01", min: "0", placeholder: "0.00", value: form.quantity, onChange: (e) => setForm((f) => ({
            ...f,
            quantity: e.target.value
          })), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "waste-unit", children: "Unit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.unit, onValueChange: (v) => setForm((f) => ({
            ...f,
            unit: v
          })), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "waste-unit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: WASTE_UNITS.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: u, children: u }, u)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "waste-date", children: "Disposal Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "waste-date", type: "date", value: form.disposedAt, onChange: (e) => setForm((f) => ({
          ...f,
          disposedAt: e.target.value
        })) })
      ] })
    ] }) })
  ] });
}
export {
  WastePage as component
};
