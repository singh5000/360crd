import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell, e as ChevronRight } from "./AppShell-CYz6-NtT.js";
import { u as useFacilityStore } from "./facility.store-C52JwOYc.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BjLeeRHr.js";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-Cv8VvcC8.js";
import { F as FilterBar } from "./FilterBar-DE80M45K.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { a5 as usePermissions, w as cn } from "./router-BNkFluS9.js";
import { k as createLucideIcon, W as Warehouse } from "./constants-Bl7kXxvf.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { M as MapPin } from "./map-pin-Dr8rgQ1g.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
import { a as ToggleRight, T as ToggleLeft } from "./toggle-right-CeggEEHh.js";
import { T as Trash2 } from "./trash-2-Cz8eoZhE.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-LBw-IAWe.js";
import "./site.service-BcxgnHEC.js";
import "./index-TU15xtvZ.js";
import "./index-BQhF8c1W.js";
import "./index-BYUMqYpj.js";
import "./sheet-BVXXTVLX.js";
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
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
const STATUS_COLOR = {
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CLOSED: "bg-red-500/10 text-red-600 border-red-500/20"
};
const SITE_TYPES = ["FACILITY", "WAREHOUSE", "OFFICE", "CONSTRUCTION", "REMOTE", "RETAIL", "OTHER"];
const FILTER_CONFIGS = [{
  key: "status",
  label: "Status",
  options: [{
    value: "ACTIVE",
    label: "Active"
  }, {
    value: "INACTIVE",
    label: "Inactive"
  }, {
    value: "MAINTENANCE",
    label: "Maintenance"
  }, {
    value: "CLOSED",
    label: "Closed"
  }]
}, {
  key: "type",
  label: "Type",
  options: SITE_TYPES.map((t) => ({
    value: t,
    label: t.replace(/_/g, " ")
  }))
}];
const EMPTY_FORM = {
  name: "",
  code: "",
  type: "FACILITY",
  status: "ACTIVE",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: ""
};
function SitesPage() {
  const {
    facilities,
    loading,
    initialized,
    fetchFacilities,
    createFacility,
    updateFacility,
    removeFacility
  } = useFacilityStore();
  const can = usePermissions();
  const [search, setSearch] = reactExports.useState("");
  const [filterVals, setFilterVals] = reactExports.useState({});
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [editForm, setEditForm] = reactExports.useState(EMPTY_FORM);
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!initialized) fetchFacilities();
  }, [initialized, fetchFacilities]);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return facilities.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !(s.code ?? "").toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && s.status !== filterVals.status) return false;
      if (filterVals.type && filterVals.type !== "ALL" && s.type !== filterVals.type) return false;
      return true;
    });
  }, [facilities, search, filterVals]);
  const pills = [{
    label: "Total Sites",
    value: facilities.length,
    icon: Warehouse,
    color: "text-foreground"
  }, {
    label: "Active",
    value: facilities.filter((s) => s.status === "ACTIVE").length,
    icon: CircleCheck,
    color: "text-green-500"
  }, {
    label: "Locations",
    value: new Set(facilities.map((s) => s.country).filter(Boolean)).size,
    icon: MapPin,
    color: "text-blue-500"
  }];
  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createFacility({
        name: form.name,
        code: form.code,
        type: form.type,
        status: form.status || void 0,
        address: form.address || void 0,
        city: form.city || void 0,
        state: form.state || void 0,
        country: form.country || void 0,
        postalCode: form.postalCode || void 0
      });
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  }
  async function handleEdit(e) {
    e.preventDefault();
    if (!editTarget) return;
    setSubmitting(true);
    try {
      await updateFacility(editTarget.id, {
        name: editForm.name,
        code: editForm.code,
        type: editForm.type,
        status: editForm.status || void 0,
        address: editForm.address || void 0,
        city: editForm.city || void 0,
        state: editForm.state || void 0,
        country: editForm.country || void 0,
        postalCode: editForm.postalCode || void 0
      });
      setEditDrawerOpen(false);
      setEditTarget(null);
    } finally {
      setSubmitting(false);
    }
  }
  function openEdit(site) {
    setEditTarget(site);
    setEditForm({
      name: site.name,
      code: site.code,
      type: site.type,
      status: site.status,
      address: site.address ?? "",
      city: site.city ?? "",
      state: site.state ?? "",
      country: site.country ?? "",
      postalCode: site.postalCode ?? ""
    });
    setEditDrawerOpen(true);
  }
  async function handleToggleStatus(site) {
    const newStatus = site.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await updateFacility(site.id, {
      status: newStatus
    });
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    await removeFacility(deleteTarget.id);
    setDeleteTarget(null);
  }
  function SiteForm({
    id,
    formState,
    setFormState,
    onSubmit
  }) {
    const set = (k) => (e) => setFormState((f) => ({
      ...f,
      [k]: e.target.value
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx("form", { id, onSubmit, className: "space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: `${id}-name`, children: [
          "Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `${id}-name`, placeholder: "Main Warehouse", value: formState.name, onChange: set("name"), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: `${id}-code`, children: [
          "Code ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `${id}-code`, placeholder: "SITE-001", value: formState.code, onChange: set("code"), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `${id}-type`, children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formState.type, onValueChange: (v) => setFormState((f) => ({
          ...f,
          type: v
        })), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: `${id}-type`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SITE_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t.replace(/_/g, " ") }, t)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `${id}-status`, children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formState.status, onValueChange: (v) => setFormState((f) => ({
          ...f,
          status: v
        })), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: `${id}-status`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ACTIVE", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "INACTIVE", children: "Inactive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MAINTENANCE", children: "Maintenance" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `${id}-city`, children: "City" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `${id}-city`, placeholder: "Sydney", value: formState.city, onChange: set("city") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `${id}-state`, children: "State" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `${id}-state`, placeholder: "NSW", value: formState.state, onChange: set("state") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `${id}-country`, children: "Country" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `${id}-country`, placeholder: "Australia", value: formState.country, onChange: set("country") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `${id}-postal`, children: "Postal Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `${id}-postal`, placeholder: "2000", value: formState.postalCode, onChange: set("postalCode") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `${id}-address`, children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `${id}-address`, placeholder: "123 Main St", value: formState.address, onChange: set("address") })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Sites" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage operational sites, locations, and facilities." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchFacilities(), disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          can("site:create") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Site"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pills.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search sites...", filters: FILTER_CONFIGS, values: filterVals, onFilterChange: (key, val) => setFilterVals((prev) => ({
        ...prev,
        [key]: val
      })), onClear: () => {
        setSearch("");
        setFilterVals({});
      } }),
      loading && !initialized ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 6
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Warehouse, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No sites found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "Add your first site to get started" }),
        can("site:create") && !search && !Object.values(filterVals).some((v) => v && v !== "ALL") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add Site"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs w-[90px]", children: "Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs w-[90px]", children: "Incidents" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs w-[120px]", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((site) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: site.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: site.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[site.status] ?? "bg-gray-500/10 text-gray-600"), children: site.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground", children: site.type ?? "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: [site.city, site.country].filter(Boolean).join(", ") || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: site._count?.incidents ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            can("site:update") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", title: site.status === "ACTIVE" ? "Deactivate" : "Activate", onClick: () => handleToggleStatus(site), children: site.status === "ACTIVE" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "h-4 w-4 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", title: "Edit site", onClick: () => openEdit(site), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5 text-muted-foreground" }) })
            ] }),
            can("site:delete") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 hover:text-red-500", title: "Delete site", onClick: () => setDeleteTarget(site), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/50 ml-1" })
          ] }) })
        ] }, site.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen && can("site:create"), onOpenChange: setDrawerOpen, title: "Add Site", description: "Create a new operational site or facility", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "create-site-form", type: "submit", disabled: submitting || !form.name || !form.code, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Adding..." : "Add Site" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiteForm, { id: "create-site-form", formState: form, setFormState: setForm, onSubmit: handleCreate }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: editDrawerOpen, onOpenChange: (v) => {
      setEditDrawerOpen(v);
      if (!v) setEditTarget(null);
    }, title: "Edit Site", description: editTarget ? `Editing: ${editTarget.name}` : "", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "edit-site-form", type: "submit", disabled: submitting || !editForm.name || !editForm.code, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Saving..." : "Save Changes" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiteForm, { id: "edit-site-form", formState: editForm, setFormState: setEditForm, onSubmit: handleEdit }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteTarget, onOpenChange: (v) => !v && setDeleteTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete site?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "This will permanently delete ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleteTarget?.name }),
          ". This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-red-600 hover:bg-red-700 text-white", onClick: handleDelete, children: "Delete" })
      ] })
    ] }) })
  ] });
}
export {
  SitesPage as component
};
