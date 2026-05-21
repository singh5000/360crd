import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { X, o as useTenantStore, G as Globe, A as AppShell, i as TENANT_STATUS_COLOR, h as TENANT_PLAN_LABEL, T as TENANT_PLAN_COLOR, e as ChevronRight } from "./AppShell-CYz6-NtT.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BjLeeRHr.js";
import { F as FilterBar } from "./FilterBar-DE80M45K.js";
import { R as Root, P as Portal, a as Content, C as Close, T as Title, O as Overlay, D as Description } from "./index-BYUMqYpj.js";
import { w as cn } from "./router-BNkFluS9.js";
import { e as Building2, U as Users, W as Warehouse } from "./constants-Bl7kXxvf.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
import { L as LoaderCircle } from "./loader-circle-CMZ_gZVG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-LBw-IAWe.js";
import "./index-TU15xtvZ.js";
import "./input-CEuoZ34o.js";
import "./select-kKQ2c-Ih.js";
import "./index-BQhF8c1W.js";
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
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const PLAN_OPTIONS = [{
  value: "STARTER",
  label: "Starter"
}, {
  value: "PROFESSIONAL",
  label: "Professional"
}, {
  value: "ENTERPRISE",
  label: "Enterprise"
}, {
  value: "WHITE_LABEL",
  label: "White Label"
}];
const FILTER_CONFIGS = [{
  key: "status",
  label: "Status",
  options: [{
    value: "TRIAL",
    label: "Trial"
  }, {
    value: "ACTIVE",
    label: "Active"
  }, {
    value: "SUSPENDED",
    label: "Suspended"
  }, {
    value: "CANCELLED",
    label: "Cancelled"
  }]
}, {
  key: "plan",
  label: "Plan",
  options: PLAN_OPTIONS.map((p) => ({
    value: p.value,
    label: p.label
  }))
}];
function TenantsPage() {
  const {
    tenants,
    loading,
    initialized,
    total,
    fetchTenants,
    createTenant
  } = useTenantStore();
  const [search, setSearch] = reactExports.useState("");
  const [filterVals, setFilterVals] = reactExports.useState({});
  const [addOpen, setAddOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!initialized) fetchTenants();
  }, [initialized, fetchTenants]);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return tenants.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q) && !t.slug.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && t.status !== filterVals.status) return false;
      if (filterVals.plan && filterVals.plan !== "ALL" && t.plan !== filterVals.plan) return false;
      return true;
    });
  }, [tenants, search, filterVals]);
  const pills = [{
    label: "Total",
    value: total,
    icon: Building2,
    color: "text-foreground"
  }, {
    label: "Active",
    value: tenants.filter((t) => t.status === "ACTIVE").length,
    icon: CircleCheck,
    color: "text-green-500"
  }, {
    label: "Trial",
    value: tenants.filter((t) => t.status === "TRIAL").length,
    icon: Globe,
    color: "text-blue-500"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Companies" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "All organisations registered on the platform. Super admin only." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchTenants(), disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAddOpen(true), className: "inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Company"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pills.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search by name or slug…", filters: FILTER_CONFIGS, values: filterVals, onFilterChange: (key, val) => setFilterVals((prev) => ({
        ...prev,
        [key]: val
      })), onClear: () => {
        setSearch("");
        setFilterVals({});
      } }),
      loading && !initialized ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 6
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No companies found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "Add your first company to get started" }),
        !search && !Object.values(filterVals).some((v) => v && v !== "ALL") && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAddOpen(true), className: "mt-4 inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add Company"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Company" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Slug" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Industry" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs w-[80px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs w-[80px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Warehouse, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            t.branding?.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: t.branding.logoUrl, alt: t.name, className: "h-6 w-6 rounded object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5 text-primary/70" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: t.name }),
              t.legalName && t.legalName !== t.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: t.legalName })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: t.slug }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", TENANT_STATUS_COLOR[t.status]), children: t.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", TENANT_PLAN_COLOR[t.plan]), children: TENANT_PLAN_LABEL[t.plan] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-sm text-muted-foreground", children: t.industry ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: t._count?.users ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: t._count?.sites ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pr-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/50" }) })
        ] }, t.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddTenantDialog, { open: addOpen, onClose: () => setAddOpen(false), onCreate: async (body) => {
      await createTenant(body);
      setAddOpen(false);
    } })
  ] });
}
function AddTenantDialog({
  open,
  onClose,
  onCreate
}) {
  const [name, setName] = reactExports.useState("");
  const [slug, setSlug] = reactExports.useState("");
  const [legalName, setLegalName] = reactExports.useState("");
  const [plan, setPlan] = reactExports.useState("STARTER");
  const [industry, setIndustry] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [maxUsers, setMaxUsers] = reactExports.useState(50);
  const [maxSites, setMaxSites] = reactExports.useState(10);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const autoSlug = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const onNameChange = (v) => {
    setName(v);
    setSlug(autoSlug(v));
  };
  const handleClose = () => {
    setName("");
    setSlug("");
    setLegalName("");
    setPlan("STARTER");
    setIndustry("");
    setCountry("");
    setMaxUsers(50);
    setMaxSites(10);
    setError("");
    setSaving(false);
    onClose();
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Company name is required");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is required");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("Slug must be lowercase letters, numbers and hyphens only");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onCreate({
        name: name.trim(),
        slug: slug.trim(),
        ...legalName.trim() && {
          legalName: legalName.trim()
        },
        plan,
        ...industry.trim() && {
          industry: industry.trim()
        },
        ...country.trim() && {
          country: country.trim()
        },
        maxUsers,
        maxSites
      });
      handleClose();
    } catch (err) {
      setError(err?.message ?? "Failed to create company");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[520px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-primary" }),
      " Add Company"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-medium", children: [
            "Company name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => onNameChange(e.target.value), placeholder: "Acme Corporation", disabled: saving, className: "flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-medium", children: [
            "Slug ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: slug, onChange: (e) => setSlug(autoSlug(e.target.value)), placeholder: "acme-corporation", disabled: saving, className: "flex h-9 w-full rounded-md border border-input bg-card/50 px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Used as subdomain identifier" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: plan, onChange: (e) => setPlan(e.target.value), disabled: saving, className: "flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50", children: PLAN_OPTIONS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.value, children: p.label }, p.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Legal name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: legalName, onChange: (e) => setLegalName(e.target.value), placeholder: "Acme Corporation Ltd.", disabled: saving, className: "flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Industry" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: industry, onChange: (e) => setIndustry(e.target.value), placeholder: "Manufacturing", disabled: saving, className: "flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: country, onChange: (e) => setCountry(e.target.value), placeholder: "Australia", disabled: saving, className: "flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Max users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: maxUsers, onChange: (e) => setMaxUsers(Number(e.target.value)), disabled: saving, className: "flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Max sites" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: maxSites, onChange: (e) => setMaxSites(Number(e.target.value)), disabled: saving, className: "flex h-9 w-full rounded-md border border-input bg-card/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: handleClose, disabled: saving, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: saving, className: "inline-flex h-9 items-center gap-2 rounded-md [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-70", children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          " Creating…"
        ] }) : "Create company" })
      ] })
    ] })
  ] }) });
}
export {
  TenantsPage as component
};
