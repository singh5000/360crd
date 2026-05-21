import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, RefreshCw, ShieldCheck, Users, CheckCircle2,
  XCircle, Save, Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/roles/$id")({
  head: () => ({ meta: [{ title: "Role Detail · 360CRD" }] }),
  component: RoleDetailPage,
});

// Human-readable labels
const RESOURCE_LABEL: Record<string, string> = {
  tenant:        "Tenant",
  user:          "Users",
  role:          "Roles",
  site:          "Sites",
  customer:      "Customers",
  incident:      "Incidents",
  audit:         "Audits",
  audit_template:"Audit Templates",
  training:      "Training",
  induction:     "Inductions",
  ppe:           "PPE",
  asset:         "Assets",
  waste:         "Waste",
  document:      "Documents",
  notification:  "Notifications",
  report:        "Reports",
  activity_log:  "Activity Log",
  audit_log:     "Audit Log",
  api_key:       "API Keys",
  webhook:       "Webhooks",
  feedback:      "Feedback",
};

const ACTION_LABEL: Record<string, string> = {
  create:  "Create",
  read:    "Read",
  update:  "Update",
  delete:  "Delete",
  approve: "Approve",
  export:  "Export",
  assign:  "Assign",
};

const ACTION_ORDER = ["create", "read", "update", "delete", "approve", "export", "assign"];

const LEVEL_COLOR: Record<number, string> = {
  100: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  80:  "bg-blue-500/10 text-blue-600 border-blue-500/20",
  60:  "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  20:  "bg-green-500/10 text-green-600 border-green-500/20",
  10:  "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

function getLevelLabel(level: number) {
  if (level >= 100) return "Super Admin";
  if (level >= 80) return "Admin";
  if (level >= 60) return "Manager";
  if (level >= 20) return "Staff";
  return "Limited";
}

function RoleDetailPage() {
  const { id } = Route.useParams();
  const can = usePermissions();

  const [role, setRole] = useState<any>(null);
  const [allPermsGrouped, setAllPermsGrouped] = useState<Record<string, any[]>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local set of enabled permissionIds (for editing custom roles)
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [roleRes, allRes, usersRes] = await Promise.all([
        apiClient.get<any>(ENDPOINTS.roles.detail(id)),
        apiClient.get<any>(ENDPOINTS.roles.permissionsGrouped),
        apiClient.get<any>(ENDPOINTS.roles.users(id)),
      ]);
      const r = roleRes.data;
      setRole(r);
      setAllPermsGrouped(allRes.data ?? {});
      setUsers(usersRes.data ?? []);

      const ids = new Set<string>(
        (r.permissions ?? []).map((rp: any) => rp.permissionId ?? rp.permission?.id)
      );
      setEnabledIds(ids);
      setDirty(false);
    } catch {
      toast.error("Failed to load role");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  const isSystem = role?.isSystem ?? true;
  const canEdit = can("role:update") && !isSystem;

  function togglePerm(permId: string) {
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
        permissionIds: [...enabledIds],
      });
      toast.success("Permissions saved");
      setDirty(false);
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  }

  const sortedResources = useMemo(
    () => Object.keys(allPermsGrouped).sort((a, b) => (RESOURCE_LABEL[a] ?? a).localeCompare(RESOURCE_LABEL[b] ?? b)),
    [allPermsGrouped]
  );

  if (loading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-[1400px] space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!role) {
    return (
      <AppShell>
        <div className="mx-auto max-w-[1400px] flex flex-col items-center justify-center py-24">
          <ShieldCheck className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm font-medium">Role not found</p>
          <Link to="/roles" className="mt-4 text-sm text-primary hover:underline">Back to Roles</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-6 animate-in fade-in duration-300">

        {/* Back + Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Link
              to="/roles"
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight">{role.name}</h1>
                <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", LEVEL_COLOR[role.level] ?? "bg-gray-500/10 text-gray-600 border-gray-500/20")}>
                  {getLevelLabel(role.level)}
                </span>
                {role.isSystem && <Badge variant="secondary" className="text-[10px]">System</Badge>}
                {role.isDefault && <Badge variant="outline" className="text-[10px]">Default</Badge>}
              </div>
              {role.description && (
                <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
              )}
              <p className="mt-0.5 font-mono text-xs text-muted-foreground/60">{role.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {canEdit && dirty && (
              <Button
                size="sm"
                onClick={savePermissions}
                disabled={saving}
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Assigned Users", value: role._count?.users ?? users.length, icon: Users, color: "text-foreground" },
            { label: "Permissions", value: enabledIds.size, icon: ShieldCheck, color: "text-primary" },
            { label: "Access Level", value: role.level, icon: ShieldCheck, color: "text-muted-foreground" },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2">
              <p.icon className={cn("h-3.5 w-3.5", p.color)} />
              <span className="text-xs text-muted-foreground">{p.label}</span>
              <span className="text-sm font-semibold">{p.value}</span>
            </div>
          ))}
          {isSystem && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
              <span className="text-xs text-amber-600">System role — permissions are read-only</span>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Permission Matrix — takes 2/3 */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <p className="text-sm font-medium">Permissions Matrix</p>
                {!canEdit && !isSystem && (
                  <span className="text-xs text-muted-foreground">Requires admin to edit</span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/20">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[160px]">Resource</th>
                      {ACTION_ORDER.map((a) => (
                        <th key={a} className="px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-[64px]">
                          {ACTION_LABEL[a]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResources.map((resource, idx) => {
                      const perms = allPermsGrouped[resource] ?? [];
                      const permByAction = Object.fromEntries(perms.map((p) => [p.action, p]));
                      const rowHasAny = ACTION_ORDER.some((a) => enabledIds.has(permByAction[a]?.id));

                      return (
                        <tr
                          key={resource}
                          className={cn(
                            "border-b border-border/30 transition-colors",
                            idx % 2 === 0 ? "bg-transparent" : "bg-muted/10",
                            rowHasAny ? "" : "opacity-50",
                          )}
                        >
                          <td className="px-4 py-2.5">
                            <span className="text-xs font-medium text-foreground">
                              {RESOURCE_LABEL[resource] ?? resource}
                            </span>
                          </td>
                          {ACTION_ORDER.map((action) => {
                            const perm = permByAction[action];
                            if (!perm) {
                              return <td key={action} className="px-2 py-2.5 text-center"><span className="text-muted-foreground/20 text-xs">—</span></td>;
                            }
                            const enabled = enabledIds.has(perm.id);
                            return (
                              <td key={action} className="px-2 py-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => togglePerm(perm.id)}
                                  disabled={!canEdit}
                                  className={cn(
                                    "inline-flex h-6 w-6 items-center justify-center rounded transition-all",
                                    canEdit && "hover:scale-110 cursor-pointer",
                                    !canEdit && "cursor-default",
                                  )}
                                  title={`${enabled ? "Revoke" : "Grant"} ${resource}:${action}`}
                                >
                                  {enabled ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground/25" />
                                  )}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Users assigned — takes 1/3 */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
              <div className="border-b border-border/60 px-4 py-3">
                <p className="text-sm font-medium">Assigned Users</p>
                <p className="text-xs text-muted-foreground mt-0.5">{role._count?.users ?? users.length} total</p>
              </div>

              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4">
                  <Users className="h-8 w-8 text-muted-foreground/30" />
                  <p className="mt-3 text-xs text-muted-foreground text-center">No users assigned to this role</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {users.slice(0, 15).map((user: any) => (
                    <div key={user.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="text-[10px]">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <span className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        user.status === "ACTIVE" ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-500"
                      )}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                  {users.length > 15 && (
                    <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                      +{users.length - 15} more users
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

