import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Warehouse, MapPin, Phone, Mail, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/sites/$id")({
  head: () => ({ meta: [{ title: "Site Detail · 360CRD" }] }),
  component: SiteDetailPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:      "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE:    "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CLOSED:      "bg-red-500/10 text-red-600 border-red-500/20",
};

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value || "—"}</p>
    </div>
  );
}

function SiteDetailPage() {
  const { id } = Route.useParams();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(ENDPOINTS.sites.detail(id));
      setSite(res.data);
    } catch {
      toast.error("Failed to load site details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return (
    <AppShell>
      <div className="mx-auto max-w-[900px] space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </AppShell>
  );

  if (!site) return (
    <AppShell>
      <div className="mx-auto max-w-[900px] flex flex-col items-center justify-center py-24">
        <Warehouse className="h-12 w-12 text-muted-foreground/30" />
        <p className="mt-4 text-sm font-medium">Site not found</p>
        <Link to="/portal/sites" className="mt-4 text-sm text-primary hover:underline">Back to My Sites</Link>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-[900px] space-y-6 animate-in fade-in duration-300">

        {/* Header */}
        <div className="flex items-start gap-3">
          <Link
            to="/portal/sites"
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">{site.name}</h1>
              <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", STATUS_COLOR[site.status] ?? "bg-gray-500/10 text-gray-600")}>
                {site.status}
              </span>
            </div>
            {site.code && <p className="mt-0.5 font-mono text-xs text-muted-foreground/60">{site.code}</p>}
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Site Info */}
          <div className="rounded-xl border border-border/60 bg-card/50 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Warehouse className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Site Information</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Type" value={site.type} />
              <Field label="Customer" value={site.customer?.name} />
              <Field label="Time Zone" value={site.timezone} />
            </div>
            {site.description && (
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Description</p>
                <p className="text-sm text-muted-foreground">{site.description}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="rounded-xl border border-border/60 bg-card/50 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Location</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Address" value={site.address} />
              <Field label="City" value={site.city} />
              <Field label="State / Region" value={site.state} />
              <Field label="Country" value={site.country} />
              <Field label="Postal Code" value={site.postalCode} />
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-border/60 bg-card/50 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Contact</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{site.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{site.email || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
