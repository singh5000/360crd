import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus, RefreshCw, Users, UserCheck, UserX, ChevronRight,
  ToggleLeft, ToggleRight, ShieldCheck, Eye,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { userService, type User } from "@/lib/api/services/user.service";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FilterBar } from "@/components/shared/FilterBar";
import { ModuleDrawer } from "@/components/shared/ModuleDrawer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth, usePermissions } from "@/lib/auth-store";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Users · 360CRD" }] }),
  component: UsersPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:    "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE:  "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/20",
  INVITED:   "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const USER_TYPES = [
  { value: "TENANT_ADMIN", label: "Tenant Admin" },
  { value: "MANAGER",      label: "Manager" },
  { value: "STAFF",        label: "Staff" },
];

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ACTIVE",    label: "Active" },
      { value: "INVITED",   label: "Invited / Pending" },
      { value: "INACTIVE",  label: "Inactive" },
      { value: "SUSPENDED", label: "Suspended" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { value: "TENANT_ADMIN", label: "Tenant Admin" },
      { value: "MANAGER",      label: "Manager" },
      { value: "STAFF",        label: "Staff" },
    ],
  },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  type: "STAFF",
  jobTitle: "",
  department: "",
  phone: "",
  sendWelcomeEmail: true,
  roles: [] as string[],
};

function UsersPage() {
  const { user: me } = useAuth();
  const can = usePermissions();
  const isSuperAdmin = me?.role === "super_admin";
  const navigate = useNavigate();

  const [users, setUsers]       = useState<User[]>([]);
  const [roles, setRoles]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await userService.list({ limit: 100 });
      setUsers(res.data ?? []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function loadRoles() {
    try {
      const res = await apiClient.get<any>(ENDPOINTS.roles.list);
      setRoles(res.data ?? []);
    } catch { /* silently handle */ }
  }

  useEffect(() => {
    load();
    loadRoles();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (q && !u.firstName.toLowerCase().includes(q) && !u.lastName.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && u.status !== filterVals.status) return false;
      if (filterVals.type   && filterVals.type   !== "ALL" && u.type   !== filterVals.type)   return false;
      return true;
    });
  }, [users, search, filterVals]);

  const pills = [
    { label: "Total",    value: users.length,                                           icon: Users,     color: "text-foreground" },
    { label: "Active",   value: users.filter((u) => u.status === "ACTIVE").length,      icon: UserCheck, color: "text-green-500"  },
    { label: "Pending",  value: users.filter((u) => u.status === "INVITED").length,     icon: UserX,     color: "text-blue-500"   },
    { label: "Inactive", value: users.filter((u) => u.status === "INACTIVE").length,    icon: UserX,     color: "text-gray-400"   },
  ];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await userService.create({
        email:            form.email,
        firstName:        form.firstName,
        lastName:         form.lastName,
        type:             form.type,
        jobTitle:         form.jobTitle || undefined,
        department:       form.department || undefined,
        phone:            form.phone || undefined,
        roleIds:          form.roles.length ? form.roles : undefined,
      } as any);
      toast.success(`User ${form.firstName} ${form.lastName} created`);
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(userId: string, newStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED") {
    try {
      await userService.updateStatus(userId, newStatus);
      toast.success(`User ${newStatus.toLowerCase()}`);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function handleApprove(userId: string) {
    await handleStatusChange(userId, "ACTIVE");
  }

  async function handleReject(userId: string) {
    await handleStatusChange(userId, "INACTIVE");
  }

  function toggleRole(roleId: string) {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(roleId)
        ? f.roles.filter((r) => r !== roleId)
        : [...f.roles, roleId],
    }));
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Users</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage team members, roles, and access.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("user:create") && !isSuperAdmin && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> Invite User
              </Button>
            )}
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2">
              <p.icon className={cn("h-3.5 w-3.5", p.color)} />
              <span className="text-xs text-muted-foreground">{p.label}</span>
              <span className="text-sm font-semibold">{p.value}</span>
            </div>
          ))}
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users…"
          filters={FILTER_CONFIGS}
          values={filterVals}
          onFilterChange={(key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))}
          onClear={() => { setSearch(""); setFilterVals({}); }}
        />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <Users className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No users found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Invite your first team member"}
            </p>
            {!search && !Object.values(filterVals).some((v) => v && v !== "ALL") && can("user:create") && !isSuperAdmin && (
              <Button size="sm" className="mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground" onClick={() => setDrawerOpen(true)}>
                <Plus className="h-4 w-4" /> Invite User
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs">User</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Type</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Email</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Job Title</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Roles</TableHead>
                  <TableHead className="text-xs text-right pr-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} className="border-border/60 hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarImage src={user.avatarUrl ?? undefined} />
                          <AvatarFallback className="text-[10px]">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{user.firstName} {user.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[user.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {user.type}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{user.jobTitle ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.slice(0, 2).map((r) => (
                          <Badge key={r.id} variant="outline" className="text-[10px] px-1.5 py-0">{r.name}</Badge>
                        ))}
                        {user.roles.length > 2 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{user.roles.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                          onClick={() => navigate({ to: "/admin/users/$id", params: { id: user.id } })}
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {user.status === "INVITED" && can("user:update") && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-[10px] text-green-600 border-green-500/30 hover:bg-green-500/10"
                              onClick={() => handleApprove(user.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-[10px] text-red-600 border-red-500/30 hover:bg-red-500/10"
                              onClick={() => handleReject(user.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {user.status === "ACTIVE" && can("user:update") && user.id !== me?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                            onClick={() => handleStatusChange(user.id, "INACTIVE")}
                            title="Deactivate"
                          >
                            <ToggleRight className="h-3.5 w-3.5 text-green-500" />
                            <span className="hidden sm:inline">Active</span>
                          </Button>
                        )}
                        {user.status === "INACTIVE" && can("user:update") && user.id !== me?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                            onClick={() => handleStatusChange(user.id, "ACTIVE")}
                            title="Activate"
                          >
                            <ToggleLeft className="h-3.5 w-3.5 text-gray-400" />
                            <span className="hidden sm:inline">Inactive</span>
                          </Button>
                        )}
                        {user.status === "SUSPENDED" && can("user:update") && user.id !== me?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 gap-1 text-[10px] text-red-500 hover:text-foreground"
                            onClick={() => handleStatusChange(user.id, "ACTIVE")}
                            title="Unsuspend"
                          >
                            <ToggleLeft className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Suspended</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create User Drawer */}
      <ModuleDrawer
        open={drawerOpen && can("user:create")}
        onOpenChange={setDrawerOpen}
        title="Invite User"
        description="Create a new team member account"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-user-form"
              type="submit"
              disabled={submitting || !form.firstName || !form.lastName || !form.email}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Creating…" : "Create User"}
            </Button>
          </div>
        }
      >
        <form id="create-user-form" onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="u-first">First Name <span className="text-red-500">*</span></Label>
              <Input
                id="u-first"
                placeholder="John"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-last">Last Name <span className="text-red-500">*</span></Label>
              <Input
                id="u-last"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="u-email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="u-email"
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="u-type">User Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger id="u-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {USER_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="u-title">Job Title</Label>
              <Input
                id="u-title"
                placeholder="e.g. Site Manager"
                value={form.jobTitle}
                onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-dept">Department</Label>
              <Input
                id="u-dept"
                placeholder="e.g. Operations"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="u-phone">Phone</Label>
            <Input
              id="u-phone"
              type="tel"
              placeholder="+1 555 000 0000"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>

          {roles.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" /> Assign Roles
              </Label>
              <div className="flex flex-wrap gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRole(r.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                      form.roles.includes(r.id)
                        ? "bg-primary/15 border-primary/40 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
            <input
              id="u-welcome"
              type="checkbox"
              checked={form.sendWelcomeEmail}
              onChange={(e) => setForm((f) => ({ ...f, sendWelcomeEmail: e.target.checked }))}
              className="h-4 w-4 accent-primary"
            />
            <label htmlFor="u-welcome" className="text-sm text-foreground cursor-pointer">
              Send welcome email with login instructions
            </label>
          </div>
        </form>
      </ModuleDrawer>
    </AppShell>
  );
}
