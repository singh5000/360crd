import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, RefreshCw, Building2, CheckCircle2, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useCompanyStore } from "@/lib/stores/company.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FilterBar } from "@/components/shared/FilterBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/companies")({
  head: () => ({
    meta: [
      { title: "Customers · 360CRD" },
      { name: "description", content: "Manage customers and contracted sites." },
    ],
  }),
  component: CompaniesPage,
});

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:    "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE:  "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/20",
  PROSPECT:  "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "SUSPENDED", label: "Suspended" },
      { value: "PROSPECT", label: "Prospect" },
    ],
  },
];

function CompaniesPage() {
  const { companies, loading, initialized, fetchCompanies } = useCompanyStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!initialized) fetchCompanies();
  }, [initialized, fetchCompanies]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return companies.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && c.status !== filterVals.status) return false;
      return true;
    });
  }, [companies, search, filterVals]);

  const pills = [
    { label: "Total", value: companies.length, icon: Building2, color: "text-foreground" },
    { label: "Active", value: companies.filter((c) => c.status === "ACTIVE").length, icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Customers</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage customers and contracted sites.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchCompanies()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Link
              to="/companies/create"
              className="inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add Customer
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
          searchPlaceholder="Search customers..."
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
            <Building2 className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No customers found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "Add your first customer to get started"}
            </p>
            {!search && !Object.values(filterVals).some((v) => v && v !== "ALL") && (
              <Link
                to="/companies/create"
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 text-sm font-medium text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> Add Customer
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
                  <TableHead className="hidden md:table-cell text-xs">Industry</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Location</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">Email</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs w-[70px]">Sites</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((company) => (
                  <TableRow
                    key={company.id}
                    className="border-border/60 cursor-pointer hover:bg-muted/30"
                    onClick={() => navigate({ to: "/companies/$id", params: { id: company.id } })}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{company.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt={company.name} className="h-6 w-6 rounded object-cover" />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                            <Building2 className="h-3.5 w-3.5 text-primary/70" />
                          </div>
                        )}
                        <span className="font-medium">{company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[company.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {company.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{company.industry ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {[company.city, company.country].filter(Boolean).join(", ") || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{company.email ?? "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{company._count?.sites ?? "—"}</TableCell>
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

