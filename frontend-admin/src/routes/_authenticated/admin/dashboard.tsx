import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Warehouse, Building2, ShieldAlert, ClipboardCheck, ArrowRight, Activity } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStore } from "@/lib/stores/dashboard.store";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard · 360CRD" }] }),
  component: AdminDashboardPage,
});

function StatCard({ label, value, icon: Icon, color, to, loading }: {
  label: string; value: number | string; icon: React.ElementType;
  color: string; to?: string; loading?: boolean;
}) {
  if (loading) return <SurfaceCard className="p-5"><Skeleton className="h-20" /></SurfaceCard>;
  const inner = (
    <SurfaceCard className="group p-5 transition-all hover:border-border">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
      {to && <ArrowRight className="mt-2 h-3.5 w-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />}
    </SurfaceCard>
  );
  return to ? <Link to={to as any}>{inner}</Link> : inner;
}

function AdminDashboardPage() {
  const { data, loading, fetchDashboard } = useDashboardStore();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Admin";

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const quickLinks = [
    { label: "Manage Users", to: "/admin/users", desc: "Create, assign roles and permissions", icon: Users },
    { label: "View Sites", to: "/admin/sites", desc: "Monitor all operational sites", icon: Warehouse },
    { label: "Customers", to: "/admin/companies", desc: "Manage customer organizations", icon: Building2 },
    { label: "Incidents Overview", to: "/admin/incidents", desc: "Read-only incident visibility", icon: ShieldAlert },
    { label: "Audit Overview", to: "/admin/audits", desc: "Platform-wide audit status", icon: ClipboardCheck },
    { label: "Activity Log", to: "/admin/activity", desc: "Full platform audit trail", icon: Activity },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-8 animate-in fade-in duration-300">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, {firstName}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Platform Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enterprise-wide visibility across all sites and operations.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Open Incidents" value={data?.incidents.open ?? 0} icon={ShieldAlert} color="bg-red-500/10 text-red-500" to="/admin/incidents" loading={loading && !data} />
          <StatCard label="Compliance Score" value={`${data?.audits.complianceScore ?? 0}%`} icon={ClipboardCheck} color="bg-green-500/10 text-green-500" to="/admin/audits" loading={loading && !data} />
          <StatCard label="Training Rate" value={`${data?.training.completionRate ?? 0}%`} icon={Users} color="bg-blue-500/10 text-blue-500" to="/admin/training" loading={loading && !data} />
          <StatCard label="Open CAPAs" value={data?.actions.openCapas ?? 0} icon={Activity} color="bg-orange-500/10 text-orange-500" loading={loading && !data} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/50 p-4 transition-all hover:border-border hover:bg-card hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary">{item.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>

        {data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SurfaceCard className="p-5">
              <h3 className="text-sm font-medium text-muted-foreground">Audit Compliance</h3>
              <div className="mt-3 space-y-2 text-sm">
                {[["Completed", data.audits.completed], ["Passed", data.audits.passed, "text-green-500"], ["Total", data.audits.total]].map(([k, v, c]) => (
                  <div key={k as string} className="flex justify-between">
                    <span>{k}</span>
                    <span className={`font-medium ${c ?? ""}`}>{v}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>
            <SurfaceCard className="p-5">
              <h3 className="text-sm font-medium text-muted-foreground">Training Progress</h3>
              <div className="mt-3 space-y-2 text-sm">
                {[["Completed", data.training.completed, "text-green-500"], ["Enrolled", data.training.enrolled], ["Completion Rate", `${data.training.completionRate}%`]].map(([k, v, c]) => (
                  <div key={k as string} className="flex justify-between">
                    <span>{k}</span>
                    <span className={`font-medium ${c ?? ""}`}>{v}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>
            <SurfaceCard className="p-5">
              <h3 className="text-sm font-medium text-muted-foreground">Outstanding Actions</h3>
              <div className="mt-3 space-y-2 text-sm">
                {[["Open CAPAs", data.actions.openCapas, "text-orange-500"], ["Overdue Audits", data.actions.overdueAudits, "text-red-500"], ["Overdue CAPAs", data.actions.overdueCapas, "text-red-500"]].map(([k, v, c]) => (
                  <div key={k as string} className="flex justify-between">
                    <span>{k}</span>
                    <span className={`font-medium ${c ?? ""}`}>{v}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        )}
      </div>
    </AppShell>
  );
}
