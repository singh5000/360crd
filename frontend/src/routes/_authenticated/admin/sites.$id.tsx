import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Warehouse, MapPin, Phone, Mail, User, Building2, AlertTriangle, ClipboardCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { siteService, type Site } from "@/lib/api/services/site.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/sites/$id")({
  head: () => ({
    meta: [
      { title: "Site Detail · 360CRD" },
      { name: "description", content: "Site details, contacts and statistics." },
    ],
  }),
  component: FacilityDetailPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CLOSED: "bg-red-500/10 text-red-600 border-red-500/20",
};

function MetaItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string | null }) {
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

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <SurfaceCard className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary/70">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </SurfaceCard>
  );
}

function FacilityDetailPage() {
  const { id } = Route.useParams();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    siteService
      .get(id)
      .then(setSite)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300">
        <Link
          to="/facilities"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sites
        </Link>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          </div>
        ) : notFound || !site ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-inset ring-border">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">Site not found</p>
            <p className="mt-1 text-sm text-muted-foreground">It may have been removed or the link is invalid.</p>
          </SurfaceCard>
        ) : (
          <div className="space-y-6">
            <SurfaceCard className="p-6 md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Warehouse className="h-6 w-6 text-primary/70" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-semibold tracking-tight">{site.name}</h1>
                      <span className="font-mono text-xs text-muted-foreground">{site.code}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR[site.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {site.status}
                      </span>
                      <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {site.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3 lg:grid-cols-4">
                <MetaItem icon={MapPin} label="Address" value={[site.address, site.city, site.state, site.country].filter(Boolean).join(", ")} />
                <MetaItem icon={Building2} label="Customer" value={site.customer?.name} />
                <MetaItem icon={User} label="Contact" value={site.contactName} />
                <MetaItem icon={Phone} label="Phone" value={site.contactPhone} />
                <MetaItem icon={Mail} label="Email" value={site.contactEmail} />
                {site.capacity && (
                  <MetaItem icon={Warehouse} label="Capacity" value={String(site.capacity)} />
                )}
              </div>
            </SurfaceCard>

            {site._count && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Incidents" value={site._count.incidents} icon={AlertTriangle} />
                <StatCard label="Audits" value={site._count.audits} icon={ClipboardCheck} />
                <StatCard label="Users" value={site._count.users} icon={User} />
              </div>
            )}

            <SurfaceCard className="p-6">
              <h2 className="text-sm font-semibold text-foreground">Location</h2>
              <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
                {site.address && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Address</p>
                    <p className="mt-0.5 text-foreground">{site.address}</p>
                  </div>
                )}
                {site.city && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">City</p>
                    <p className="mt-0.5 text-foreground">{site.city}</p>
                  </div>
                )}
                {site.state && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">State / Region</p>
                    <p className="mt-0.5 text-foreground">{site.state}</p>
                  </div>
                )}
                {site.country && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Country</p>
                    <p className="mt-0.5 text-foreground">{site.country}</p>
                  </div>
                )}
                {site.postalCode && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Postal Code</p>
                    <p className="mt-0.5 text-foreground">{site.postalCode}</p>
                  </div>
                )}
                {site.latitude && site.longitude && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Coordinates</p>
                    <p className="mt-0.5 text-foreground">{site.latitude}, {site.longitude}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                Created {new Date(site.createdAt).toLocaleDateString()} · Updated {new Date(site.updatedAt).toLocaleDateString()}
              </div>
            </SurfaceCard>
          </div>
        )}
      </div>
    </AppShell>
  );
}

