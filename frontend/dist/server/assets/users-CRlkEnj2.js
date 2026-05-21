import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell, a as Avatar, c as AvatarImage, b as AvatarFallback } from "./AppShell-CYz6-NtT.js";
import { U as UserCheck, a as UserX, u as userService } from "./user.service-CtDYwha4.js";
import { _ as useAuth, a5 as usePermissions, w as cn, Y as toast, q as apiClient, E as ENDPOINTS } from "./router-BNkFluS9.js";
import { B as Button } from "./button-CdtyP9Yo.js";
import { S as Skeleton } from "./skeleton-CvtebHLb.js";
import { B as Badge } from "./badge-DGbn1ykj.js";
import { I as Input } from "./input-CEuoZ34o.js";
import { L as Label } from "./label-CgqhRjIf.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-kKQ2c-Ih.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BjLeeRHr.js";
import { F as FilterBar } from "./FilterBar-DE80M45K.js";
import { M as ModuleDrawer } from "./ModuleDrawer-3zc6-4Xr.js";
import { U as Users, g as ShieldCheck } from "./constants-Bl7kXxvf.js";
import { R as RefreshCw } from "./refresh-cw-6p7GE4Yh.js";
import { P as Plus } from "./plus-CM7VIcXc.js";
import { a as ToggleRight, T as ToggleLeft } from "./toggle-right-CeggEEHh.js";
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
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/20",
  INVITED: "bg-blue-500/10 text-blue-600 border-blue-500/20"
};
const USER_TYPES = [{
  value: "TENANT_ADMIN",
  label: "Tenant Admin"
}, {
  value: "MANAGER",
  label: "Manager"
}, {
  value: "STAFF",
  label: "Staff"
}];
const FILTER_CONFIGS = [{
  key: "status",
  label: "Status",
  options: [{
    value: "ACTIVE",
    label: "Active"
  }, {
    value: "INVITED",
    label: "Invited / Pending"
  }, {
    value: "INACTIVE",
    label: "Inactive"
  }, {
    value: "SUSPENDED",
    label: "Suspended"
  }]
}, {
  key: "type",
  label: "Type",
  options: [{
    value: "TENANT_ADMIN",
    label: "Tenant Admin"
  }, {
    value: "MANAGER",
    label: "Manager"
  }, {
    value: "STAFF",
    label: "Staff"
  }]
}];
const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  type: "STAFF",
  jobTitle: "",
  department: "",
  phone: "",
  sendWelcomeEmail: true,
  roles: []
};
function UsersPage() {
  const {
    user: me
  } = useAuth();
  const can = usePermissions();
  const isSuperAdmin = me?.role === "super_admin";
  const [users, setUsers] = reactExports.useState([]);
  const [roles, setRoles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [filterVals, setFilterVals] = reactExports.useState({});
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [submitting, setSubmitting] = reactExports.useState(false);
  async function load() {
    setLoading(true);
    try {
      const res = await userService.list({
        limit: 100
      });
      setUsers(res.data ?? []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }
  async function loadRoles() {
    try {
      const res = await apiClient.get(ENDPOINTS.roles.list);
      setRoles(res.data ?? []);
    } catch {
    }
  }
  reactExports.useEffect(() => {
    load();
    loadRoles();
  }, []);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (q && !u.firstName.toLowerCase().includes(q) && !u.lastName.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && u.status !== filterVals.status) return false;
      if (filterVals.type && filterVals.type !== "ALL" && u.type !== filterVals.type) return false;
      return true;
    });
  }, [users, search, filterVals]);
  const pills = [{
    label: "Total",
    value: users.length,
    icon: Users,
    color: "text-foreground"
  }, {
    label: "Active",
    value: users.filter((u) => u.status === "ACTIVE").length,
    icon: UserCheck,
    color: "text-green-500"
  }, {
    label: "Pending",
    value: users.filter((u) => u.status === "INVITED").length,
    icon: UserX,
    color: "text-blue-500"
  }, {
    label: "Inactive",
    value: users.filter((u) => u.status === "INACTIVE").length,
    icon: UserX,
    color: "text-gray-400"
  }];
  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await userService.create({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        type: form.type,
        jobTitle: form.jobTitle || void 0,
        department: form.department || void 0,
        phone: form.phone || void 0,
        roleIds: form.roles.length ? form.roles : void 0
      });
      toast.success(`User ${form.firstName} ${form.lastName} created`);
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      toast.error(err?.message ?? "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  }
  async function handleStatusChange(userId, newStatus) {
    try {
      await userService.updateStatus(userId, newStatus);
      toast.success(`User ${newStatus.toLowerCase()}`);
      setUsers((prev) => prev.map((u) => u.id === userId ? {
        ...u,
        status: newStatus
      } : u));
    } catch {
      toast.error("Failed to update status");
    }
  }
  async function handleApprove(userId) {
    await handleStatusChange(userId, "ACTIVE");
  }
  async function handleReject(userId) {
    await handleStatusChange(userId, "INACTIVE");
  }
  function toggleRole(roleId) {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(roleId) ? f.roles.filter((r) => r !== roleId) : [...f.roles, roleId]
    }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage team members, roles, and access." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: load, disabled: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
          can("user:create") && !isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", onClick: () => setDrawerOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Invite User"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pills.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: cn("h-3.5 w-3.5", p.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p.value })
      ] }, p.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search, onSearchChange: setSearch, searchPlaceholder: "Search users…", filters: FILTER_CONFIGS, values: filterVals, onFilterChange: (key, val) => setFilterVals((prev) => ({
        ...prev,
        [key]: val
      })), onClear: () => {
        setSearch("");
        setFilterVals({});
      } }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
        length: 8
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: "No users found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: search || Object.values(filterVals).some((v) => v && v !== "ALL") ? "Try adjusting filters" : "Invite your first team member" }),
        !search && !Object.values(filterVals).some((v) => v && v !== "ALL") && can("user:create") && !isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground", onClick: () => setDrawerOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Invite User"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell text-xs", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell text-xs", children: "Job Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell text-xs", children: "Roles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-right pr-3", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/60 hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-7 w-7 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatarUrl ?? void 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AvatarFallback, { className: "text-[10px]", children: [
                user.firstName[0],
                user.lastName[0]
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-sm", children: [
              user.firstName,
              " ",
              user.lastName
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[user.status] ?? "bg-gray-500/10 text-gray-600"), children: user.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground", children: user.type }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-sm text-muted-foreground", children: user.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground", children: user.jobTitle ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
            user.roles.slice(0, 2).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0", children: r.name }, r.id)),
            user.roles.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0", children: [
              "+",
              user.roles.length - 2
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
            user.status === "INVITED" && can("user:update") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-7 px-2 text-[10px] text-green-600 border-green-500/30 hover:bg-green-500/10", onClick: () => handleApprove(user.id), children: "Approve" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-7 px-2 text-[10px] text-red-600 border-red-500/30 hover:bg-red-500/10", onClick: () => handleReject(user.id), children: "Reject" })
            ] }),
            user.status === "ACTIVE" && can("user:update") && user.id !== me?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 px-2 gap-1 text-[10px] text-muted-foreground hover:text-foreground", onClick: () => handleStatusChange(user.id, "INACTIVE"), title: "Deactivate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-3.5 w-3.5 text-green-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Active" })
            ] }),
            user.status === "INACTIVE" && can("user:update") && user.id !== me?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 px-2 gap-1 text-[10px] text-muted-foreground hover:text-foreground", onClick: () => handleStatusChange(user.id, "ACTIVE"), title: "Activate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "h-3.5 w-3.5 text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Inactive" })
            ] }),
            user.status === "SUSPENDED" && can("user:update") && user.id !== me?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 px-2 gap-1 text-[10px] text-red-500 hover:text-foreground", onClick: () => handleStatusChange(user.id, "ACTIVE"), title: "Unsuspend", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Suspended" })
            ] })
          ] }) })
        ] }, user.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDrawer, { open: drawerOpen && can("user:create"), onOpenChange: setDrawerOpen, title: "Invite User", description: "Create a new team member account", size: "md", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDrawerOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { form: "create-user-form", type: "submit", disabled: submitting || !form.firstName || !form.lastName || !form.email, className: "[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110", children: submitting ? "Creating…" : "Create User" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "create-user-form", onSubmit: handleCreate, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "u-first", children: [
            "First Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "u-first", placeholder: "John", value: form.firstName, onChange: (e) => setForm((f) => ({
            ...f,
            firstName: e.target.value
          })), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "u-last", children: [
            "Last Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "u-last", placeholder: "Doe", value: form.lastName, onChange: (e) => setForm((f) => ({
            ...f,
            lastName: e.target.value
          })), required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "u-email", children: [
          "Email ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "u-email", type: "email", placeholder: "john@company.com", value: form.email, onChange: (e) => setForm((f) => ({
          ...f,
          email: e.target.value
        })), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "u-type", children: "User Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.type, onValueChange: (v) => setForm((f) => ({
          ...f,
          type: v
        })), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "u-type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: USER_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.value, children: t.label }, t.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "u-title", children: "Job Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "u-title", placeholder: "e.g. Site Manager", value: form.jobTitle, onChange: (e) => setForm((f) => ({
            ...f,
            jobTitle: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "u-dept", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "u-dept", placeholder: "e.g. Operations", value: form.department, onChange: (e) => setForm((f) => ({
            ...f,
            department: e.target.value
          })) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "u-phone", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "u-phone", type: "tel", placeholder: "+1 555 000 0000", value: form.phone, onChange: (e) => setForm((f) => ({
          ...f,
          phone: e.target.value
        })) })
      ] }),
      roles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          " Assign Roles"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5", children: roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleRole(r.id), className: cn("rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors", form.roles.includes(r.id) ? "bg-primary/15 border-primary/40 text-primary" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"), children: r.name }, r.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "u-welcome", type: "checkbox", checked: form.sendWelcomeEmail, onChange: (e) => setForm((f) => ({
          ...f,
          sendWelcomeEmail: e.target.checked
        })), className: "h-4 w-4 accent-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "u-welcome", className: "text-sm text-foreground cursor-pointer", children: "Send welcome email with login instructions" })
      ] })
    ] }) })
  ] });
}
export {
  UsersPage as component
};
