import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, RefreshCw, Warehouse, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useFacilityStore } from "@/lib/stores/facility.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FilterBar } from "@/components/shared/FilterBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/sites")({
  head: () => ({
    meta: [
      { title: "Sites · 360CRD" },
      { name: "description", content: "Manage operational sites and locations." },
    ],
  }),
  component: FacilitiesPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:      "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE:    "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CLOSED:      "bg-red-500/10 text-red-600 border-red-500/20",
};

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "MAINTENANCE", label: "Maintenance" },
      { value: "CLOSED", label: "Closed" },
    ],
  },
];

function FacilitiesPage() {
  const { facilities, loading, initialized, fetchFacilities } = useFacilityStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!initialized) fetchFacilities();
  }, [initialized, fetchFacilities]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return facilities.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && s.status !== filterVals.status) return false;
      return true;
    });
  }, [facilities, search, filterVals]);

  const pills = [
    { label: "Total Sites", value: facilities.length, icon: Warehouse, color: "text-foreground" },
    { label: "Active", value: facilities.filter((s) => s.status === "ACTIVE").length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Locations", value: new Set(facilities.map((s) => s.country).filter(Boolean)).size, icon: MapPin, color: "text-blue-500" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Sites</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage operational sites, locations, and facilities.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchFacilities()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Link
              to="/facilities/create"
              className="inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add Site
            </Link>
          </div>
        </div>

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
          searchPlaceholder="Search sitesâ€¦"
          filters={FILTER_CONFIGS}
          values={filterVals}
          onFilterChange={(key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))}
          onClear={() => { setSearch(""); setFilterVals({}); }}
        />

        {loading && !initialized ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <Warehouse className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No sites found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Add your first site to get started"}
            </p>
            {!search && !Object.values(filterVals).some((v) => v && v !== "ALL") && (
              <Link
                to="/facilities/create"
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> Add Site
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs w-[90px]">Code</TableHead>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Type</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Location</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Customer</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs w-[90px]">Incidents</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((site) => (
                  <TableRow
                    key={site.id}
                    className="border-border/60 cursor-pointer hover:bg-muted/30"
                    onClick={() => navigate({ to: "/facilities/$id", params: { id: site.id } })}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{site.code}</TableCell>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[site.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {site.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {site.type ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {[site.city, site.country].filter(Boolean).join(", ") || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {(site as any).customer?.name ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {site._count?.incidents ?? "—"}
                    </TableCell>
                    <TableCell className="text-right pr-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

