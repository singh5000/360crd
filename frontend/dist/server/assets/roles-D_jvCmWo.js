import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell, e as ChevronRight } from "./AppShell-CYz6-NtT.js";
import { w as cn, q as apiClient, E as ENDPOINTS, Y as toast } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { B as Badge } from "./badge-DGbn1ykj.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { T as Textarea } from "./textarea-D7DuXlBF.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { C as Crown } from "./crown-KMCQBfk7.js";
import { B as Briefcase } from "./briefcase-CMFZgo63.js";
import { H as HardHat, U as Users, g as ShieldCheck } from "./constants-Bl7kXxvf.js";
import { E as Eye } from "./eye-C01Vu7q5.js";
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
import "./sheet-BVXXTVLX.js";
import "./index-BYUMqYpj.js";
const ROLE_GROUPS = [{
  key: "admin",
  label: "Administrators",
  description: "Full platform and tenant access. View everything, manage everything.",
  icon: Crown,
  color: "text-purple-500",
  bg: "bg-purple-500/10",
  border: "border-purple-500/20",
  slugs: ["super_admin", "tenant_admin"]
}, {
  key: "manager",
  label: "Manager",
  description: "Operational control over assigned sites. Creates and approves records.",
  icon: Briefcase,
  color: "text-blue-500",
  bg: "bg-blue-500/10",
  border: "border-blue-500/20",
  slugs: ["manager"]
}, {
  key: "staff",
  label: "Staff",
  description: "Task execution and own data. Reports incidents, reads training.",
  icon: HardHat,
  color: "text-green-500",
  bg: "bg-green-500/10",
  border: "border-green-500/20",
  slugs: ["staff"]
}, {
  key: "customer",
  label: "Customer",
  description: "Read-only visibility into sites, incidents, audits and reports.",
  icon: Eye,
  color: "text-gray-500",
  bg: "bg-gray-500/10",
  border: "border-gray-500/20",
  slugs: ["customer"]
}];
const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  level: "10"
};
function toSlug(name) {
  return name.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}
function RolesPage() {
  const [roles, setRoles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [slugManual, setSlugManual] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get(ENDPOINTS.roles.list);
      setRoles(res.data ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    load();
  }, []);
  function getRolesForGroup(slugs) {
    return roles.filter((r) => slugs.includes(r.slug));
  }
  function handleNameChange(name) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugManual ? f.slug : toSlug(name)
    }));
  }
  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.roles.create, {
        name: form.name,
        slug: form.slug,
        description: form.description || void 0,
        level: Number(form.level) || 10
      });
      toast.success(`Role "${form.name}" created`);
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      setSlugManual(false);
      load();
    } catch {
      toast.error("Failed to create role");
    } finally {
      setSubmitting(false);
    }
  }
  const matchedSlugs = ROLE_GROUPS.flatMap((g) => g.slugs);
  const customRoles = roles.filter((r) => !matchedSlugs.includes(r.slug));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Roles & Permissions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Define access levels and permission sets for platform users." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " New Role"
          ] })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Array.from({
        length: 4
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        ROLE_GROUPS.map((group) => {
          const groupRoles = getRolesForGroup(group.slugs);
          const Icon = group.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-xl border bg-card/50", group.border), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-3 rounded-t-xl border-b px-5 py-4", group.border, group.bg + "/40"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", group.bg), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4.5 w-4.5", group.color) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: group.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: group.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: groupRoles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 text-xs text-muted-foreground", children: "No roles found" }) : groupRoles.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-5 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: role.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/60", children: role.slug }),
                  role.isSystem && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] px-1.5", children: "System" }),
                  role.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] px-1.5", children: "Default" })
                ] }),
                role.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: role.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    role._count?.users ?? 0,
                    " users"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    role.permissions?.length ?? 0,
                    " permissions"
                  ] })
                ] })
              ] })
            ] }, role.id)) })
          ] }, group.key);
        }),
        customRoles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-t-xl border-b border-border/60 bg-muted/20 px-5 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Custom Roles" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tenant-specific roles created by administrators." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: customRoles.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-5 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: role.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/60", children: role.slug })
              ] }),
              role.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: role.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  role._count?.users ?? 0,
                  " users"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/50" })
            ] })
          ] }, role.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen, onOpenChange: setDrawerOpen, title: "New Role", description: "Create a custom role with a specific access level", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "create-role-form", type: "submit", disabled: submitting || !form.name || !form.slug, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Creating..." : "Create Role" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "create-role-form", onSubmit: handleCreate, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "role-name", children: [
          "Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "role-name", placeholder: "e.g. Site Inspector", value: form.name, onChange: (e) => handleNameChange(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "role-slug", children: [
          "Slug ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "role-slug", placeholder: "site_inspector", value: form.slug, onChange: (e) => {
          setSlugManual(true);
          setForm((f) => ({
            ...f,
            slug: e.target.value
          }));
        }, className: "font-mono text-sm", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Auto-generated from name. Edit to override." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "role-level", children: "Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "role-level", type: "number", min: 1, max: 100, placeholder: "10", value: form.level, onChange: (e) => setForm((f) => ({
          ...f,
          level: e.target.value
        })) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Higher number = higher privilege. System roles: super_admin=100, tenant_admin=90, manager=50, staff=10." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "role-description", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "role-description", placeholder: "Describe what this role can do...", value: form.description, onChange: (e) => setForm((f) => ({
          ...f,
          description: e.target.value
        })), rows: 3 })
      ] })
    ] }) })
  ] });
}
export {
  RolesPage as component
};
