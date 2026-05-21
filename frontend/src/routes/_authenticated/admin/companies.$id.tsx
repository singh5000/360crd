import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, Globe, Mail, Phone, MapPin, Briefcase, Calendar, Warehouse, AlertTriangle, ClipboardCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { customerService, type Customer } from "@/lib/api/services/customer.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/companies/$id")({
  head: () => ({
    meta: [
      { title: "Customer Detail · 360CRD" },
      { name: "description", content: "Customer details and contracted sites." },
    ],
  }),
  component: CompanyDetailPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/20",
  PROSPECT: "bg-blue-500/10 text-blue-600 border-blue-500/20",
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

function CompanyDetailPage() {
  const { id } = Route.useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    customerService
      .get(id)
      .then(setCustomer)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300">
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to customers
        </Link>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-44 rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          </div>
        ) : notFound || !customer ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-inset ring-border">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">Customer not found</p>
            <p className="mt-1 text-sm text-muted-foreground">It may have been removed or the link is invalid.</p>
          </SurfaceCard>
        ) : (
          <div className="space-y-6">
            <SurfaceCard className="p-6 md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                  {customer.logoUrl ? (
                    <img src={customer.logoUrl} alt={customer.name} className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-7 w-7 text-primary/70" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
                      <span className="font-mono text-xs text-muted-foreground">{customer.code}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR[customer.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {customer.status}
                      </span>
                      {customer.type && (
                        <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {customer.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3 lg:grid-cols-4">
                <MetaItem icon={Briefcase} label="Industry" value={customer.industry} />
                <MetaItem icon={MapPin} label="Location" value={[customer.city, customer.country].filter(Boolean).join(", ")} />
                <MetaItem icon={Mail} label="Email" value={customer.email} />
                <MetaItem icon={Phone} label="Phone" value={customer.phone} />
                <MetaItem icon={Globe} label="Website" value={customer.website} />
                <MetaItem icon={Calendar} label="Contract Start" value={customer.contractStart ? new Date(customer.contractStart).toLocaleDateString() : null} />
                <MetaItem icon={Calendar} label="Contract End" value={customer.contractEnd ? new Date(customer.contractEnd).toLocaleDateString() : null} />
              </div>
            </SurfaceCard>

            {customer._count && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Sites" value={customer._count.sites} icon={Warehouse} />
                <StatCard label="Incidents" value={customer._count.incidents} icon={AlertTriangle} />
                <StatCard label="Audits" value={customer._count.audits} icon={ClipboardCheck} />
              </div>
            )}

            {customer.address && (
              <SurfaceCard className="p-6">
                <h2 className="text-sm font-semibold text-foreground">Address</h2>
                <p className="mt-3 text-sm text-foreground/85">
                  {[customer.address, customer.city, customer.country].filter(Boolean).join(", ")}
                </p>
                <div className="mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  Customer since {new Date(customer.createdAt).toLocaleDateString()}
                </div>
              </SurfaceCard>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

