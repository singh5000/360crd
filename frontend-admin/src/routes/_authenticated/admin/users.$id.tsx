import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, User, Mail, Phone, Briefcase, Building2,
  BadgeCheck, Warehouse, ToggleLeft, ToggleRight, ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService, type User } from "@/lib/api/services/user.service";
import { useAuth, usePermissions } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users/$id")({
  head: () => ({ meta: [{ title: "User Detail · 360CRD" }] }),
  component: UserDetailPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:    "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE:  "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/20",
  INVITED:   "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const TYPE_LABEL: Record<string, string> = {
  SUPER_ADMIN:  "Super Admin",
  TENANT_ADMIN: "Tenant Admin",
  MANAGER:      "Manager",
  STAFF:        "Staff",
};

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary/70">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function UserDetailPage() {
  const { id } = Route.useParams();
  const { user: me } = useAuth();
  const can = usePermissions();
  const isSuperAdmin = me?.role === "super_admin";

  const [user, setUser]       = useState<User | null>(null);
  const [sites, setSites]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [userData, sitesData] = await Promise.all([
          userService.get(id),
          userService.getSites(id).catch(() => []),
        ]);
        setUser(userData);
        setSites(sitesData ?? []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusChange(newStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED") {
    if (!user) return;
    try {
      const updated = await userService.updateStatus(user.id, newStatus);
      setUser(updated);
      toast.success(`User ${newStatus.toLowerCase()}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl space-y-5 animate-in fade-in duration-300">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-5 md:grid-cols-3">
            <Skeleton className="h-52 md:col-span-1" />
            <Skeleton className="h-52 md:col-span-2" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (notFound || !user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl space-y-5">
          <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Link>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-20">
            <User className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">User not found</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-5 animate-in fade-in duration-300">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Link>

          {can("user:update") && !isSuperAdmin && user.id !== me?.id && (
            <div className="flex items-center gap-2">
              {user.status === "ACTIVE" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-orange-600 border-orange-500/30 hover:bg-orange-500/10"
                  onClick={() => handleStatusChange("INACTIVE")}
                >
                  <ToggleRight className="h-3.5 w-3.5" /> Deactivate
                </Button>
              )}
              {user.status === "INACTIVE" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-green-600 border-green-500/30 hover:bg-green-500/10"
                  onClick={() => handleStatusChange("ACTIVE")}
                >
                  <ToggleLeft className="h-3.5 w-3.5" /> Activate
                </Button>
              )}
              {user.status === "SUSPENDED" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-green-600 border-green-500/30 hover:bg-green-500/10"
                  onClick={() => handleStatusChange("ACTIVE")}
                >
                  <ToggleLeft className="h-3.5 w-3.5" /> Unsuspend
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Profile card */}
          <SurfaceCard className="flex flex-col items-center gap-4 text-center md:col-span-1">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl ?? undefined} />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{fullName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <span className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                STATUS_COLOR[user.status] ?? "bg-gray-500/10 text-gray-600",
              )}>
                {user.status}
              </span>
              <span className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {TYPE_LABEL[user.type] ?? user.type}
              </span>
            </div>
            {user.employeeId && (
              <p className="text-[11px] text-muted-foreground font-mono">ID: {user.employeeId}</p>
            )}
          </SurfaceCard>

          {/* Info + roles + sites */}
          <div className="space-y-5 md:col-span-2">
            {/* Contact & job info */}
            <SurfaceCard className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Profile Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow icon={Mail}      label="Email"       value={user.email} />
                <InfoRow icon={Phone}     label="Phone"       value={user.phone} />
                <InfoRow icon={Briefcase} label="Job Title"   value={user.jobTitle} />
                <InfoRow icon={Building2} label="Department"  value={user.department} />
                <InfoRow icon={BadgeCheck} label="Employee ID" value={user.employeeId} />
              </div>
            </SurfaceCard>

            {/* Roles */}
            <SurfaceCard className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Assigned Roles</h3>
              </div>
              {user.roles.length === 0 ? (
                <p className="text-xs text-muted-foreground">No roles assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((r) => (
                    <Badge key={r.id} variant="outline" className="gap-1.5 px-2.5 py-1 text-xs">
                      <ShieldCheck className="h-3 w-3 text-primary/70" />
                      {r.name}
                    </Badge>
                  ))}
                </div>
              )}
            </SurfaceCard>

            {/* Sites */}
            <SurfaceCard className="space-y-3">
              <div className="flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Assigned Sites</h3>
              </div>
              {sites.length === 0 ? (
                <p className="text-xs text-muted-foreground">No sites assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sites.map((s) => (
                    <Link
                      key={s.id}
                      to="/admin/sites/$id"
                      params={{ id: s.id }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <Warehouse className="h-3 w-3 text-muted-foreground" />
                      {s.name}
                      {s.code && <span className="font-mono text-[10px] text-muted-foreground">· {s.code}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </SurfaceCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
