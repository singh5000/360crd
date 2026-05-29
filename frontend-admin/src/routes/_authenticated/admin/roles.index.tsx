import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  RefreshCw, ShieldCheck, Users, ChevronRight, Crown, Briefcase,
  HardHat, Eye, Plus,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModuleDrawer } from "@/components/shared/ModuleDrawer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/roles/")({
  head: () => ({ meta: [{ title: "Roles · 360CRD" }] }),
  component: RolesPage,
});

const ROLE_GROUPS = [
  {
    key: "admin",
    label: "Administrators",
    description: "Full platform and tenant access. View everything, manage everything.",
    icon: Crown,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    slugs: ["super_admin", "tenant_admin"],
  },
  {
    key: "manager",
    label: "Manager",
    description: "Operational control over assigned sites. Creates and approves records.",
    icon: Briefcase,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    slugs: ["manager"],
  },
  {
    key: "staff",
    label: "Staff",
    description: "Task execution and own data. Reports incidents, reads training.",
    icon: HardHat,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    slugs: ["staff"],
  },
  {
    key: "customer",
    label: "Customer",
    description: "Read-only visibility into sites, incidents, audits and reports.",
    icon: Eye,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    slugs: ["customer"],
  },
];

const KEY_MODULES = [
  { resource: "site",     label: "Sites"    },
  { resource: "asset",    label: "Assets"   },
  { resource: "customer", label: "Customer" },
  { resource: "ppe",      label: "PPE"      },
];

function getModuleCRUD(role: any, resource: string) {
  const rolePerms: any[] = role.permissions ?? [];
  return ["create", "read", "update", "delete"].map((action) => ({
    action,
    letter: action[0].toUpperCase(),
    enabled: rolePerms.some((rp) => {
      const p = rp.permission ?? rp;
      return p.resource === resource && p.action === action;
    }),
  }));
}

const EMPTY_FORM = { name: "", slug: "", description: "", level: "10" };

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugManual, setSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(ENDPOINTS.roles.list);
      setRoles(res.data ?? []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function getRolesForGroup(slugs: string[]) {
    return roles.filter((r) => slugs.includes(r.slug));
  }

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugManual ? f.slug : toSlug(name),
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.roles.create, {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        level: Number(form.level) || 10,
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

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Roles & Permissions</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Define access levels and permission sets for platform users.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button
              size="sm"
              className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
              onClick={() => setDrawerOpen(true)}
            >
              <Plus className="h-4 w-4" /> New Role
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {ROLE_GROUPS.map((group) => {
              const groupRoles = getRolesForGroup(group.slugs);
              const Icon = group.icon;
              return (
                <div key={group.key} className={cn("rounded-xl border bg-card/50", group.border)}>
                  <div className={cn("flex items-center gap-3 rounded-t-xl border-b px-5 py-4", group.border, group.bg + "/40")}>
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", group.bg)}>
                      <Icon className={cn("h-4.5 w-4.5", group.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{group.label}</p>
                      <p className="text-xs text-muted-foreground">{group.description}</p>
                    </div>
                  </div>
                  <div className="divide-y divide-border/40">
                    {groupRoles.length === 0 ? (
                      <div className="px-5 py-4 text-xs text-muted-foreground">No roles found</div>
                    ) : (
                      groupRoles.map((role) => (
                        <Link
                          key={role.id}
                          to="/admin/roles/$id"
                          params={{ id: role.id }}
                          className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-accent/40 cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground">{role.name}</span>
                              <span className="font-mono text-[10px] text-muted-foreground/60">{role.slug}</span>
                              {role.isSystem && <Badge variant="secondary" className="text-[10px] px-1.5">System</Badge>}
                              {role.isDefault && <Badge variant="outline" className="text-[10px] px-1.5">Default</Badge>}
                            </div>
                            {role.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{role.description}</p>
                            )}
                            {/* Module CRUD permission summary */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {KEY_MODULES.map(({ resource, label }) => {
                                const crud = getModuleCRUD(role, resource);
                                const hasAny = crud.some((p) => p.enabled);
                                return (
                                  <div
                                    key={resource}
                                    className={cn(
                                      "flex items-center gap-1 rounded-md border px-2 py-0.5",
                                      hasAny
                                        ? "border-border/50 bg-muted/30"
                                        : "border-border/20 bg-muted/10 opacity-40"
                                    )}
                                  >
                                    <span className="text-[9px] font-semibold text-muted-foreground mr-0.5">{label}</span>
                                    {crud.map(({ letter, enabled }) => (
                                      <span
                                        key={letter}
                                        className={cn(
                                          "text-[9px] font-bold w-3 text-center",
                                          enabled ? "text-primary" : "text-muted-foreground/25"
                                        )}
                                      >
                                        {letter}
                                      </span>
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0 mt-0.5">
                            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              <span>{role._count?.users ?? 0} users</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>{role.permissions?.length ?? 0} permissions</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              );
            })}

            {customRoles.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card/50">
                <div className="flex items-center gap-3 rounded-t-xl border-b border-border/60 bg-muted/20 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Custom Roles</p>
                    <p className="text-xs text-muted-foreground">Tenant-specific roles created by administrators.</p>
                  </div>
                </div>
                <div className="divide-y divide-border/40">
                  {customRoles.map((role) => (
                    <Link
                      key={role.id}
                      to="/admin/roles/$id"
                      params={{ id: role.id }}
                      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/40 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">{role.name}</span>
                          <span className="font-mono text-[10px] text-muted-foreground/60">{role.slug}</span>
                        </div>
                        {role.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{role.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{role._count?.users ?? 0} users</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ModuleDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="New Role"
        description="Create a custom role with a specific access level"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="create-role-form"
              type="submit"
              disabled={submitting || !form.name || !form.slug}
              className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              {submitting ? "Creating..." : "Create Role"}
            </Button>
          </div>
        }
      >
        <form id="create-role-form" onSubmit={handleCreate} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="role-name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="role-name"
              placeholder="e.g. Site Inspector"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-slug">Slug <span className="text-red-500">*</span></Label>
            <Input
              id="role-slug"
              placeholder="site_inspector"
              value={form.slug}
              onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
              className="font-mono text-sm"
              required
            />
            <p className="text-[11px] text-muted-foreground">Auto-generated from name. Edit to override.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-level">Level</Label>
            <Input
              id="role-level"
              type="number"
              min={1}
              max={100}
              placeholder="10"
              value={form.level}
              onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            />
            <p className="text-[11px] text-muted-foreground">Higher number = higher privilege. System roles: super_admin=100, tenant_admin=90, manager=50, staff=10.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description">Description</Label>
            <Textarea
              id="role-description"
              placeholder="Describe what this role can do..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>
        </form>
      </ModuleDrawer>
    </AppShell>
  );
}
