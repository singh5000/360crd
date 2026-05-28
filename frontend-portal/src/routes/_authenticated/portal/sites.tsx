import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RefreshCw, Warehouse, MapPin, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterBar } from "@/components/shared/FilterBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/portal/sites")({
  head: () => ({ meta: [{ title: "My Sites · 360CRD" }] }),
  component: PortalSitesPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:   "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SUSPENDED:"bg-red-500/10 text-red-600 border-red-500/20",
};

function PortalSitesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(ENDPOINTS.sites.list, { limit: 100 });
      setItems(res.data ?? []);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((s) => !q || s.name.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[900px] space-y-5 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Sites</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your assigned operational sites.</p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>

        <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search sites…" filters={[]} values={{}} onFilterChange={() => {}} onClear={() => setSearch("")} />

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <Warehouse className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No sites found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((site: any) => (
              <div
                key={site.id}
                className="rounded-xl border border-border/60 bg-card/50 p-4 cursor-pointer transition-colors hover:bg-accent/30"
                onClick={() => navigate({ to: "/portal/sites/$id", params: { id: site.id } })}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                      <Warehouse className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{site.name}</p>
                      {site.address && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {site.address}
                        </p>
                      )}
                      {site.code && <p className="mt-0.5 text-xs text-muted-foreground font-mono">{site.code}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[site.status] ?? "bg-gray-500/10 text-gray-600")}>
                      {site.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
