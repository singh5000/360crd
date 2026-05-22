import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell, e as ChevronRight } from "./AppShell-CYz6-NtT.js";
import { a5 as usePermissions, w as cn, q as apiClient, E as ENDPOINTS, Y as toast } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { T as Textarea } from "./textarea-D7DuXlBF.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BjLeeRHr.js";
import { F as FilterBar } from "./FilterBar-DE80M45K.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { F as FileText } from "./constants-Bl7kXxvf.js";
import { F as FolderOpen } from "./folder-open-B9V3BILK.js";
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
  ARCHIVED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  EXPIRED: "bg-red-500/10 text-red-600 border-red-500/20"
};
const DOC_CATEGORIES = ["POLICY", "PROCEDURE", "FORM", "RECORD", "PLAN", "REPORT", "REGISTER", "OTHER"];
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
  }, {
    value: "EXPIRED",
    label: "Expired"
  }]
}, {
  key: "category",
  label: "Category",
  options: DOC_CATEGORIES.map((c) => ({
    value: c,
    label: c
  }))
}];
const EMPTY_FORM = {
  title: "",
  category: "POLICY",
  description: ""
};
function DocumentsPage() {
  const [items, setItems] = reactExports.useState([]);
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
      const res = await apiClient.get(ENDPOINTS.documents.list, {
        limit: 100
      });
      setItems(res.data ?? []);
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
      if (q && !item.title.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      if (filterVals.category && filterVals.category !== "ALL" && item.category !== filterVals.category) return false;
      return true;
    });
  }, [items, search, filterVals]);
  const pills = [{
    label: "Total",
    value: items.length,
    icon: FileText,
    color: "text-foreground"
  }, {
    label: "Published",
    value: items.filter((d) => d.status === "PUBLISHED").length,
    icon: FolderOpen,
    color: "text-green-500"
  }];
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.documents.create, {
        title: form.title,
        category: form.category,
        description: form.description || void 0
      });
      toast.success("Document created");
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      toast.error("Failed to create document");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Documents" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Central repository for compliance and safety documents." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          can("document:create") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " New Document"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pills.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search documentsâ€¦", filters: FILTER_CONFIGS, values: filterVals, onFilterChange: (key, val) => setFilterVals((prev) => ({
        ...prev,
        [key]: val
      })), onClear: () => {
        setSearch("");
        setFilterVals({});
      } }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 8
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No documents found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "Upload your first document to get started" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Created" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 cursor-pointer hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: item.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600"), children: item.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground", children: item.category ?? "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: item.version ? `v${item.version}` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: new Date(item.createdAt).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/50" }) })
        ] }, item.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen && can("document:create"), onOpenChange: setDrawerOpen, title: "New Document", description: "Add a document to the repository", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "create-doc-form", type: "submit", disabled: submitting || !form.title, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Creatingâ€¦" : "Create Document" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "create-doc-form", onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "doc-title", children: [
          "Title ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "doc-title", placeholder: "e.g. Work Health & Safety Policy", value: form.title, onChange: (e) => setForm((f) => ({
          ...f,
          title: e.target.value
        })), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "doc-category", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.category, onValueChange: (v) => setForm((f) => ({
          ...f,
          category: v
        })), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "doc-category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DOC_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "doc-desc", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "doc-desc", placeholder: "Brief description of this documentâ€¦", rows: 3, value: form.description, onChange: (e) => setForm((f) => ({
          ...f,
          description: e.target.value
        })) })
      ] })
    ] }) })
  ] });
}
export {
  DocumentsPage as component
};
