import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, RefreshCw, ShieldCheck, Users, CheckCircle2,
  XCircle, Save, Loader2, Eye, EyeOff, ToggleLeft, ToggleRight,
  Monitor, Briefcase, Globe,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePermissions, authStore } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/roles/$id")({
  head: () => ({ meta: [{ title: "Role Detail · 360CRD" }] }),
  component: RoleDetailPage,
});

// ── Constants ─────────────────────────────────────────────────────────────────

const RESOURCE_LABEL: Record<string, string> = {
  tenant:         "Tenant Management",
  user:           "Users",
  role:           "Roles & Permissions",
  site:           "Sites / Facilities",
  customer:       "Customers / Companies",
  incident:       "Incidents",
  audit:          "Audits",
  audit_template: "Audit Templates",
  training:       "Training",
  induction:      "Inductions",
  ppe:            "PPE",
  asset:          "Assets",
  waste:          "Waste",
  document:       "Documents",
  notification:   "Notifications",
  report:         "Reports",
  activity_log:   "Activity Log",
  audit_log:      "Audit Log",
  api_key:        "API Keys",
  webhook:        "Webhooks",
  feedback:       "Feedback",
};

// Which panels each resource/module appears in
const MODULE_PANELS: Record<string, Array<"admin" | "manager" | "portal">> = {
  incident:       ["admin", "manager", "portal"],
  audit:          ["admin", "manager", "portal"],
  ppe:            ["admin", "manager"],
  training:       ["admin", "manager"],
  induction:      ["admin", "manager"],
  document:       ["admin", "manager", "portal"],
  waste:          ["admin", "manager"],
  asset:          ["admin", "manager"],
  site:           ["admin", "manager", "portal"],
  customer:       ["admin"],
  user:           ["admin"],
  role:           ["admin"],
  report:         ["admin", "manager", "portal"],
  feedback:       ["admin", "portal"],
  webhook:        ["admin"],
  notification:   ["admin", "manager", "portal"],
  activity_log:   ["admin"],
  audit_log:      ["admin"],
  api_key:        ["admin"],
  tenant:         ["admin"],
  audit_template: ["admin"],
};

const PANEL_CONFIG = {
  admin:   { label: "Admin Panel",     color: "bg-purple-500/10 text-purple-700 border-purple-500/20", icon: Monitor },
  manager: { label: "Manager Panel",   color: "bg-blue-500/10 text-blue-700 border-blue-500/20",       icon: Briefcase },
  portal:  { label: "Customer Portal", color: "bg-green-500/10 text-green-700 border-green-500/20",    icon: Globe },
} as const;

const ACTION_ORDER = ["create", "read", "update", "delete", "approve", "export", "assign"];
const ACTION_LABEL: Record<string, string> = {
  create: "Create", read: "View", update: "Edit",
  delete: "Delete", approve: "Approve", export: "Export", assign: "Assign",
};

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

// ── Component ─────────────────────────────────────────────────────────────────

function RoleDetailPage() {
  const { id } = Route.useParams();
  const can = usePermissions();

  const [role, setRole] = useState<any>(null);
  const [allPermsGrouped, setAllPermsGrouped] = useState<Record<string, any[]>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"modules" | "matrix">("modules");
  const [panelFilter, setPanelFilter] = useState<"all" | "admin" | "manager" | "portal">("all");

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

  const isSuperAdmin = authStore.getState().user?.role === "super_admin";
  const isSystem = role?.isSystem ?? true;
  const canEdit  = can("role:update") && (!isSystem || isSuperAdmin);

  function togglePerm(permId: string) {
    if (!canEdit) return;
    setEnabledIds((prev) => {
      const next = new Set(prev);
      next.has(permId) ? next.delete(permId) : next.add(permId);
      return next;
    });
    setDirty(true);
  }

  function toggleAllForResource(resource: string, enable: boolean) {
    if (!canEdit) return;
    const perms = allPermsGrouped[resource] ?? [];
    setEnabledIds((prev) => {
      const next = new Set(prev);
      for (const p of perms) {
        enable ? next.add(p.id) : next.delete(p.id);
      }
      return next;
    });
    setDirty(true);
  }

  function toggleModuleVisible(resource: string, readPerm: any) {
    if (!canEdit || !readPerm) return;
    const isVisible = enabledIds.has(readPerm.id);
    if (isVisible) {
      // Turning off visibility = remove ALL permissions for this resource
      toggleAllForResource(resource, false);
    } else {
      // Turning on visibility = at minimum grant read
      setEnabledIds((prev) => {
        const next = new Set(prev);
        next.add(readPerm.id);
        return next;
      });
      setDirty(true);
    }
  }

  async function savePermissions() {
    setSaving(true);
    try {
      await apiClient.put(ENDPOINTS.roles.setPerm(id), { permissionIds: [...enabledIds] });
      toast.success("Permissions saved successfully");
      setDirty(false);
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  }

  const sortedResources = useMemo(
    () => Object.keys(allPermsGrouped).sort((a, b) =>
      (RESOURCE_LABEL[a] ?? a).localeCompare(RESOURCE_LABEL[b] ?? b)
    ),
    [allPermsGrouped]
  );

  const filteredResources = useMemo(() => {
    if (panelFilter === "all") return sortedResources;
    return sortedResources.filter((r) => MODULE_PANELS[r]?.includes(panelFilter as any));
  }, [sortedResources, panelFilter]);

  // Panel access summary
  const panelSummary = useMemo(() => {
    const summary: Record<string, string[]> = { admin: [], manager: [], portal: [] };
    for (const resource of sortedResources) {
      const perms = allPermsGrouped[resource] ?? [];
      const readPerm = perms.find((p) => p.action === "read");
      if (readPerm && enabledIds.has(readPerm.id)) {
        const panels = MODULE_PANELS[resource] ?? [];
        for (const panel of panels) {
          summary[panel].push(RESOURCE_LABEL[resource] ?? resource);
        }
      }
    }
    return summary;
  }, [enabledIds, allPermsGrouped, sortedResources]);

  if (loading) return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </AppShell>
  );

  if (!role) return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] flex flex-col items-center justify-center py-24">
        <ShieldCheck className="h-12 w-12 text-muted-foreground/30" />
        <p className="mt-4 text-sm font-medium">Role not found</p>
        <Link to="/admin/roles" className="mt-4 text-sm text-primary hover:underline">Back to Roles</Link>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-6 animate-in fade-in duration-300">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Link
              to="/admin/roles"
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
              {role.description && <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>}
              <p className="mt-0.5 font-mono text-xs text-muted-foreground/60">{role.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {canEdit && dirty && (
              <Button size="sm" onClick={savePermissions} disabled={saving}
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Assigned Users", value: role._count?.users ?? users.length, icon: Users, color: "text-foreground" },
            { label: "Active Permissions", value: enabledIds.size, icon: ShieldCheck, color: "text-primary" },
            { label: "Modules Enabled", value: sortedResources.filter(r => { const rp = (allPermsGrouped[r] ?? []).find(p => p.action === "read"); return rp && enabledIds.has(rp.id); }).length, icon: Eye, color: "text-green-500" },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2">
              <p.icon className={cn("h-3.5 w-3.5", p.color)} />
              <span className="text-xs text-muted-foreground">{p.label}</span>
              <span className="text-sm font-semibold">{p.value}</span>
            </div>
          ))}
          {isSystem && !isSuperAdmin && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
              <span className="text-xs text-amber-600">System role — permissions are read-only</span>
            </div>
          )}
          {isSystem && isSuperAdmin && (
            <div className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2">
              <span className="text-xs text-purple-600">System role — editable by super admin only</span>
            </div>
          )}
          {dirty && (
            <div className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
              <span className="text-xs text-blue-600">Unsaved changes — click Save to apply</span>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main permission area — 2/3 */}
          <div className="lg:col-span-2 space-y-4">

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg border border-border/60 bg-card/40 p-1 w-fit">
              {([["modules", "Module Access"], ["matrix", "All Permissions"]] as const).map(([tab, label]) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                  className={cn("rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                    activeTab === tab ? "bg-primary/12 text-foreground ring-1 ring-inset ring-primary/25" : "text-muted-foreground hover:text-foreground"
                  )}
                >{label}</button>
              ))}
            </div>

            {/* MODULE ACCESS TAB */}
            {activeTab === "modules" && (
              <div className="space-y-3">
                {/* Panel filter */}
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => setPanelFilter("all")}
                    className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      panelFilter === "all" ? "bg-foreground text-background border-foreground" : "border-border/60 text-muted-foreground hover:text-foreground"
                    )}>All Panels</button>
                  {(["admin", "manager", "portal"] as const).map((panel) => {
                    const cfg = PANEL_CONFIG[panel];
                    const Icon = cfg.icon;
                    return (
                      <button key={panel} type="button" onClick={() => setPanelFilter(panel)}
                        className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                          panelFilter === panel ? cfg.color : "border-border/60 text-muted-foreground hover:text-foreground"
                        )}>
                        <Icon className="h-3 w-3" />{cfg.label}
                      </button>
                    );
                  })}
                </div>

                {/* Module cards */}
                {filteredResources.map((resource) => {
                  const perms = allPermsGrouped[resource] ?? [];
                  const permByAction = Object.fromEntries(perms.map((p) => [p.action, p]));
                  const readPerm = permByAction["read"];
                  const isVisible = readPerm ? enabledIds.has(readPerm.id) : false;
                  const panels = MODULE_PANELS[resource] ?? [];

                  return (
                    <div key={resource}
                      className={cn("rounded-xl border bg-card/50 overflow-hidden transition-all",
                        isVisible ? "border-border/60" : "border-border/30 opacity-60"
                      )}
                    >
                      {/* Module header */}
                      <div className={cn("flex items-center justify-between gap-3 px-4 py-3",
                        isVisible ? "bg-muted/10" : "bg-card/30"
                      )}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{RESOURCE_LABEL[resource] ?? resource}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {panels.map((panel) => {
                                const cfg = PANEL_CONFIG[panel];
                                const Icon = cfg.icon;
                                return (
                                  <span key={panel} className={cn("inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium", cfg.color)}>
                                    <Icon className="h-2.5 w-2.5" />{cfg.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Visibility toggle */}
                        <div className="flex items-center gap-2 shrink-0">
                          {canEdit && (
                            <button type="button"
                              onClick={() => toggleAllForResource(resource, !isVisible || enabledIds.size === 0)}
                              className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border/40 hover:bg-accent transition-colors"
                            >
                              {isVisible ? "Disable all" : "Enable all"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleModuleVisible(resource, readPerm)}
                            disabled={!canEdit || !readPerm}
                            className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
                              isVisible
                                ? "bg-green-500/15 text-green-700 border-green-500/30 hover:bg-green-500/25"
                                : "bg-muted/40 text-muted-foreground border-border/40 hover:bg-muted/60",
                              !canEdit && "cursor-default opacity-70"
                            )}
                            title={isVisible ? "Click to hide this module" : "Click to show this module"}
                          >
                            {isVisible ? <><Eye className="h-3 w-3" /> Visible</> : <><EyeOff className="h-3 w-3" /> Hidden</>}
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      {isVisible && (
                        <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border/30">
                          {ACTION_ORDER.filter((a) => a !== "read").map((action) => {
                            const perm = permByAction[action];
                            if (!perm) return null;
                            const enabled = enabledIds.has(perm.id);
                            return (
                              <button
                                key={action}
                                type="button"
                                onClick={() => togglePerm(perm.id)}
                                disabled={!canEdit}
                                className={cn(
                                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all",
                                  enabled
                                    ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                                    : "bg-muted/20 text-muted-foreground border-border/30 hover:bg-muted/40",
                                  !canEdit && "cursor-default"
                                )}
                              >
                                {enabled
                                  ? <CheckCircle2 className="h-3 w-3 text-primary" />
                                  : <XCircle className="h-3 w-3 text-muted-foreground/40" />
                                }
                                {ACTION_LABEL[action]}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ALL PERMISSIONS TAB (raw matrix) */}
            {activeTab === "matrix" && (
              <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                  <p className="text-sm font-medium">Full Permission Matrix</p>
                  <span className="text-xs text-muted-foreground">{enabledIds.size} permissions active</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/20">
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[200px]">Module</th>
                        {ACTION_ORDER.map((a) => (
                          <th key={a} className="px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-[72px]">
                            {ACTION_LABEL[a]}
                          </th>
                        ))}
                        {canEdit && <th className="px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-[80px]">Toggle</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedResources.map((resource, idx) => {
                        const perms = allPermsGrouped[resource] ?? [];
                        const permByAction = Object.fromEntries(perms.map((p) => [p.action, p]));
                        const rowHasAny = ACTION_ORDER.some((a) => enabledIds.has(permByAction[a]?.id));
                        const allOn = perms.length > 0 && perms.every((p) => enabledIds.has(p.id));
                        return (
                          <tr key={resource}
                            className={cn("border-b border-border/30 transition-colors",
                              idx % 2 === 0 ? "bg-transparent" : "bg-muted/10",
                              !rowHasAny && "opacity-50"
                            )}
                          >
                            <td className="px-4 py-2.5">
                              <span className="text-xs font-medium">{RESOURCE_LABEL[resource] ?? resource}</span>
                            </td>
                            {ACTION_ORDER.map((action) => {
                              const perm = permByAction[action];
                              if (!perm) return <td key={action} className="px-2 py-2.5 text-center"><span className="text-muted-foreground/20 text-xs">—</span></td>;
                              const enabled = enabledIds.has(perm.id);
                              return (
                                <td key={action} className="px-2 py-2.5 text-center">
                                  <button type="button" onClick={() => togglePerm(perm.id)} disabled={!canEdit}
                                    className={cn("inline-flex h-6 w-6 items-center justify-center rounded transition-all",
                                      canEdit && "hover:scale-110 cursor-pointer", !canEdit && "cursor-default"
                                    )}
                                    title={`${enabled ? "Revoke" : "Grant"} ${resource}:${action}`}
                                  >
                                    {enabled
                                      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      : <XCircle className="h-4 w-4 text-muted-foreground/25" />
                                    }
                                  </button>
                                </td>
                              );
                            })}
                            {canEdit && (
                              <td className="px-2 py-2.5 text-center">
                                <button type="button" onClick={() => toggleAllForResource(resource, !allOn)}
                                  className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                  title={allOn ? "Disable all" : "Enable all"}
                                >
                                  {allOn
                                    ? <ToggleRight className="h-5 w-5 text-primary" />
                                    : <ToggleLeft className="h-5 w-5" />
                                  }
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right column — 1/3 */}
          <div className="space-y-4">

            {/* Panel Access Summary */}
            <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
              <div className="border-b border-border/60 px-4 py-3">
                <p className="text-sm font-medium">Panel Access Summary</p>
                <p className="text-xs text-muted-foreground mt-0.5">What this role can see in each panel</p>
              </div>
              <div className="divide-y divide-border/40">
                {(["admin", "manager", "portal"] as const).map((panel) => {
                  const cfg = PANEL_CONFIG[panel];
                  const Icon = cfg.icon;
                  const modules = panelSummary[panel] ?? [];
                  return (
                    <div key={panel} className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("flex h-6 w-6 items-center justify-center rounded-md border text-[10px]", cfg.color)}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <p className="text-xs font-medium">{cfg.label}</p>
                        <span className="ml-auto text-[10px] text-muted-foreground">{modules.length} modules</span>
                      </div>
                      {modules.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic">No modules accessible</p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {modules.map((m) => (
                            <span key={m} className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-foreground/70">{m}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assigned Users */}
            <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
              <div className="border-b border-border/60 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Assigned Users</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{role._count?.users ?? users.length} total</p>
                </div>
              </div>
              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4">
                  <Users className="h-8 w-8 text-muted-foreground/30" />
                  <p className="mt-3 text-xs text-muted-foreground text-center">No users assigned to this role</p>
                  <Link to="/admin/users" className="mt-2 text-xs text-primary hover:underline">Assign from Users page</Link>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {users.slice(0, 12).map((user: any) => (
                    <div key={user.id} className="flex items-center gap-3 px-4 py-2.5">
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
                      <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        user.status === "ACTIVE" ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-500"
                      )}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                  {users.length > 12 && (
                    <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                      +{users.length - 12} more — <Link to="/admin/users" className="text-primary hover:underline">view all in Users</Link>
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
