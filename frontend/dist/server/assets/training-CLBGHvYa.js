import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { a5 as usePermissions, w as cn, q as apiClient, E as ENDPOINTS, Y as toast } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { T as Textarea } from "./textarea-D7DuXlBF.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BjLeeRHr.js";
import { F as FilterBar } from "./FilterBar-DE80M45K.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { d as BookOpen, U as Users } from "./constants-Bl7kXxvf.js";
import { A as Award } from "./award-Egztx7yT.js";
import { C as Clock } from "./clock-kYCucZdt.js";
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
  PUBLISHED: "bg-green-500/10 text-green-600 border-green-500/20",
  ARCHIVED: "bg-orange-500/10 text-orange-600 border-orange-500/20"
};
const CATEGORIES = ["SAFETY", "COMPLIANCE", "OPERATIONS", "LEADERSHIP", "TECHNICAL", "OTHER"];
const FILTER_CONFIGS = [{
  key: "status",
  label: "Status",
  options: [{
    value: "DRAFT",
    label: "Draft"
  }, {
    value: "PUBLISHED",
    label: "Published"
  }, {
    value: "ARCHIVED",
    label: "Archived"
  }]
}, {
  key: "category",
  label: "Category",
  options: CATEGORIES.map((c) => ({
    value: c,
    label: c
  }))
}];
const EMPTY_FORM = {
  title: "",
  description: "",
  category: "SAFETY",
  durationMinutes: ""
};
function TrainingPage() {
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
      const [listRes, statsRes] = await Promise.all([apiClient.get(ENDPOINTS.training.list, {
        limit: 100
      }), apiClient.get(ENDPOINTS.training.stats)]);
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
    return items.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && t.status !== filterVals.status) return false;
      if (filterVals.category && filterVals.category !== "ALL" && t.category !== filterVals.category) return false;
      return true;
    });
  }, [items, search, filterVals]);
  const pills = [{
    label: "Total",
    value: stats?.total ?? items.length,
    icon: BookOpen,
    color: "text-foreground"
  }, {
    label: "Published",
    value: stats?.published ?? items.filter((t) => t.status === "PUBLISHED").length,
    icon: Award,
    color: "text-green-500"
  }, {
    label: "Enrollments",
    value: stats?.totalEnrollments ?? 0,
    icon: Users,
    color: "text-blue-500"
  }, {
    label: "Completion",
    value: stats?.completionRate ? `${stats.completionRate}%` : "—",
    icon: Clock,
    color: "text-primary"
  }];
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.training.create, {
        title: form.title,
        description: form.description || void 0,
        category: form.category,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : void 0
      });
      toast.success("Training program created");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to create training");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Training" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage safety and compliance training programs." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          can("training:create") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " New Training"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pills.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search training programsâ€¦", filters: FILTER_CONFIGS, values: filterVals, onFilterChange: (key, val) => setFilterVals((prev) => ({
        ...prev,
        [key]: val
      })), onClear: () => {
        setSearch("");
        setFilterVals({});
      } }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 6
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No training programs found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "Create your first training program to get started" }),
        !search && !Object.values(filterVals).some((v) => v && v !== "ALL") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground", onClick: () => setDrawerOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " New Training"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Duration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Enrollments" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 cursor-pointer hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: t.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[t.status] ?? "bg-gray-500/10 text-gray-600"), children: t.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground", children: t.category ?? "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: t.durationMinutes ? `${t.durationMinutes} min` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
            t._count?.enrollments ?? 0
          ] }) })
        ] }, t.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen && can("training:create"), onOpenChange: setDrawerOpen, title: "New Training Program", description: "Create a new training or compliance program", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "create-training-form", type: "submit", disabled: submitting || !form.title, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Creatingâ€¦" : "Create Program" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "create-training-form", onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "training-title", children: [
          "Title ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "training-title", placeholder: "e.g. Manual Handling Safety", value: form.title, onChange: (e) => setForm((f) => ({
          ...f,
          title: e.target.value
        })), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "training-category", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.category, onValueChange: (v) => setForm((f) => ({
            ...f,
            category: v
          })), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "training-category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "training-duration", children: "Duration (minutes)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "training-duration", type: "number", placeholder: "60", min: 1, value: form.durationMinutes, onChange: (e) => setForm((f) => ({
            ...f,
            durationMinutes: e.target.value
          })) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "training-desc", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "training-desc", placeholder: "Describe the training objectives and contentâ€¦", rows: 3, value: form.description, onChange: (e) => setForm((f) => ({
          ...f,
          description: e.target.value
        })) })
      ] })
    ] }) })
  ] });
}
export {
  TrainingPage as component
};
