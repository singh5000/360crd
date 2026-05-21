import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { i as Route, a5 as usePermissions, L as Link, w as cn, q as apiClient, E as ENDPOINTS, Y as toast } from "./router-BNkFluS9.js";
import { A as AppShell, a as Avatar, c as AvatarImage, b as AvatarFallback } from "./AppShell-CYz6-NtT.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { B as Badge } from "./badge-DGbn1ykj.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { g as ShieldCheck, U as Users } from "./constants-Bl7kXxvf.js";
import { A as ArrowLeft } from "./arrow-left-BW4xafyP.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import { L as LoaderCircle } from "./loader-circle-CMZ_gZVG.js";
import { S as Save } from "./save-BXfLpzUX.js";
import { C as CircleCheck } from "./circle-check-CVdlMzuE.js";
import { C as CircleX } from "./circle-x-D8qbuU5G.js";
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
import "./index-TU15xtvZ.js";
const RESOURCE_LABEL = {
  tenant: "Tenant",
  user: "Users",
  role: "Roles",
  site: "Sites",
  customer: "Customers",
  incident: "Incidents",
  audit: "Audits",
  audit_template: "Audit Templates",
  training: "Training",
  induction: "Inductions",
  ppe: "PPE",
  asset: "Assets",
  waste: "Waste",
  document: "Documents",
  notification: "Notifications",
  report: "Reports",
  activity_log: "Activity Log",
  audit_log: "Audit Log",
  api_key: "API Keys",
  webhook: "Webhooks",
  feedback: "Feedback"
};
const ACTION_LABEL = {
  create: "Create",
  read: "Read",
  update: "Update",
  delete: "Delete",
  approve: "Approve",
  export: "Export",
  assign: "Assign"
};
const ACTION_ORDER = ["create", "read", "update", "delete", "approve", "export", "assign"];
const LEVEL_COLOR = {
  100: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  80: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  60: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  20: "bg-green-500/10 text-green-600 border-green-500/20",
  10: "bg-gray-500/10 text-gray-600 border-gray-500/20"
};
function getLevelLabel(level) {
  if (level >= 100) return "Super Admin";
  if (level >= 80) return "Admin";
  if (level >= 60) return "Manager";
  if (level >= 20) return "Staff";
  return "Limited";
}
function RoleDetailPage() {
  const {
    id
  } = Route.useParams();
  const can = usePermissions();
  const [role, setRole] = reactExports.useState(null);
  const [allPermsGrouped, setAllPermsGrouped] = reactExports.useState({});
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [enabledIds, setEnabledIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [dirty, setDirty] = reactExports.useState(false);
  async function load() {
    setLoading(true);
    try {
      const [roleRes, allRes, usersRes] = await Promise.all([apiClient.get(ENDPOINTS.roles.detail(id)), apiClient.get(ENDPOINTS.roles.permissionsGrouped), apiClient.get(ENDPOINTS.roles.users(id))]);
      const r = roleRes.data;
      setRole(r);
      setAllPermsGrouped(allRes.data ?? {});
      setUsers(usersRes.data ?? []);
      const ids = new Set((r.permissions ?? []).map((rp) => rp.permissionId ?? rp.permission?.id));
      setEnabledIds(ids);
      setDirty(false);
    } catch {
      toast.error("Failed to load role");
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    load();
  }, [id]);
  const isSystem = role?.isSystem ?? true;
  const canEdit = can("role:update") && !isSystem;
  function togglePerm(permId) {
    if (!canEdit) return;
    setEnabledIds((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
      return next;
    });
    setDirty(true);
  }
  async function savePermissions() {
    setSaving(true);
    try {
      await apiClient.put(ENDPOINTS.roles.setPerm(id), {
        permissionIds: [...enabledIds]
      });
      toast.success("Permissions saved");
      setDirty(false);
      load();
    } catch (e) {
      toast.error(e?.message ?? "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  }
  const sortedResources = reactExports.useMemo(() => Object.keys(allPermsGrouped).sort((a, b) => (RESOURCE_LABEL[a] ?? a).localeCompare(RESOURCE_LABEL[b] ?? b)), [allPermsGrouped]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[400px] rounded-xl" })
    ] }) });
  }
  if (!role) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] flex flex-col items-center justify-center py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-12 w-12 text-muted-foreground/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "Role not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/roles", className: "mt-4 text-sm text-primary hover:underline", children: "Back to Roles" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/roles", className: "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: role.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", LEVEL_COLOR[role.level] ?? "bg-gray-500/10 text-gray-600 border-gray-500/20"), children: getLevelLabel(role.level) }),
            role.isSystem && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: "System" }),
            role.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Default" })
          ] }),
          role.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: role.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-mono text-xs text-muted-foreground/60", children: role.slug })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
        canEdit && dirty && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: savePermissions, disabled: saving, className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          "Save Changes"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      [{
        label: "Assigned Users",
        value: role._count?.users ?? users.length,
        icon: Users,
        color: "text-foreground"
      }, {
        label: "Permissions",
        value: enabledIds.size,
        icon: ShieldCheck,
        color: "text-primary"
      }, {
        label: "Access Level",
        value: role.level,
        icon: ShieldCheck,
        color: "text-muted-foreground"
      }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)),
      isSystem && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-600", children: "System role — permissions are read-only" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/60 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Permissions Matrix" }),
          !canEdit && !isSystem && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Requires admin to edit" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[160px]", children: "Resource" }),
            ACTION_ORDER.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-[64px]", children: ACTION_LABEL[a] }, a))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedResources.map((resource, idx) => {
            const perms = allPermsGrouped[resource] ?? [];
            const permByAction = Object.fromEntries(perms.map((p) => [p.action, p]));
            const rowHasAny = ACTION_ORDER.some((a) => enabledIds.has(permByAction[a]?.id));
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: cn("border-b border-border/30 transition-colors", idx % 2 === 0 ? "bg-transparent" : "bg-muted/10", rowHasAny ? "" : "opacity-50"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: RESOURCE_LABEL[resource] ?? resource }) }),
              ACTION_ORDER.map((action) => {
                const perm = permByAction[action];
                if (!perm) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/20 text-xs", children: "—" }) }, action);
                }
                const enabled = enabledIds.has(perm.id);
                return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => togglePerm(perm.id), disabled: !canEdit, className: cn("inline-flex h-6 w-6 items-center justify-center rounded transition-all", canEdit && "hover:scale-110 cursor-pointer", !canEdit && "cursor-default"), title: `${enabled ? "Revoke" : "Grant"} ${resource}:${action}`, children: enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-muted-foreground/25" }) }) }, action);
              })
            ] }, resource);
          }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/60 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Assigned Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            role._count?.users ?? users.length,
            " total"
          ] })
        ] }),
        users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-10 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground text-center", children: "No users assigned to this role" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border/40", children: [
          users.slice(0, 15).map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-7 w-7 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatarUrl }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AvatarFallback, { className: "text-[10px]", children: [
                user.firstName?.[0],
                user.lastName?.[0]
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium truncate", children: [
                user.firstName,
                " ",
                user.lastName
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: user.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", user.status === "ACTIVE" ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-500"), children: user.status })
          ] }, user.id)),
          users.length > 15 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 text-center text-xs text-muted-foreground", children: [
            "+",
            users.length - 15,
            " more users"
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
}
export {
  RoleDetailPage as component
};
