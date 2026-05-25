import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, HardHat, Tag, User, Calendar, AlertTriangle, CheckCircle2, Package,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/ppe/$id")({
  head: () => ({
    meta: [
      { title: "PPE Detail · 360CRD" },
      { name: "description", content: "PPE item details and assignment history." },
    ],
  }),
  component: PPEDetailPage,
});

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE:   "bg-green-500/10 text-green-600 border-green-500/20",
  ASSIGNED:    "bg-blue-500/10 text-blue-600 border-blue-500/20",
  MAINTENANCE: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  DISPOSED:    "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const CONDITION_COLOR: Record<string, string> = {
  EXCELLENT: "bg-green-500/10 text-green-600 border-green-500/20",
  GOOD:      "bg-blue-500/10 text-blue-600 border-blue-500/20",
  FAIR:      "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  POOR:      "bg-orange-500/10 text-orange-600 border-orange-500/20",
  DAMAGED:   "bg-red-500/10 text-red-600 border-red-500/20",
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

function PPEDetailPage() {
  const { id } = Route.useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiClient
      .get<any>(ENDPOINTS.ppe.detail(id))
      .then((res) => setItem(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300">
        <Link
          to="/app/ppe"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to PPE inventory
        </Link>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Skeleton className="h-48 rounded-xl lg:col-span-2" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        ) : notFound || !item ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-inset ring-border">
              <HardHat className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">PPE item not found</p>
            <p className="mt-1 text-sm text-muted-foreground">It may have been removed or the link is invalid.</p>
          </SurfaceCard>
        ) : (
          <div className="space-y-6">
            {/* Header card */}
            <SurfaceCard className="p-6 md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {item.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{item.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600")}>
                      {item.status}
                    </span>
                    {item.condition && (
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", CONDITION_COLOR[item.condition] ?? "bg-gray-500/10 text-gray-600")}>
                        {item.condition}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3 lg:grid-cols-4">
                <MetaItem icon={Package} label="Manufacturer" value={item.manufacturer} />
                <MetaItem icon={Tag} label="Model" value={item.model} />
                <MetaItem icon={Tag} label="Serial Number" value={item.serialNumber} />
                <MetaItem icon={Tag} label="Storage Location" value={item.storageLocation} />
                <MetaItem icon={Calendar} label="Purchase Date" value={item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : null} />
                <MetaItem icon={AlertTriangle} label="Expiry Date" value={item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : null} />
              </div>
            </SurfaceCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Assignments list */}
              <div className="lg:col-span-2">
                {item.assignments && item.assignments.length > 0 ? (
                  <SurfaceCard className="p-6">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Assignment History ({item.assignments.length})
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {item.assignments.map((a: any) => (
                        <li key={a.id} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {a.user ? `${a.user.firstName} ${a.user.lastName}` : "Unknown"}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Assigned {new Date(a.assignedAt).toLocaleDateString()}
                              {a.returnedAt && ` → Returned ${new Date(a.returnedAt).toLocaleDateString()}`}
                            </p>
                            {a.notes && <p className="mt-1 text-xs text-muted-foreground">{a.notes}</p>}
                          </div>
                          <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", a.returnedAt ? "bg-gray-500/10 text-gray-600 border-gray-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20")}>
                            {a.returnedAt ? "Returned" : "Active"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </SurfaceCard>
                ) : (
                  <SurfaceCard className="p-6 flex flex-col items-center justify-center py-10 text-center">
                    <User className="h-8 w-8 text-muted-foreground/40" />
                    <p className="mt-3 text-sm text-muted-foreground">No assignment history</p>
                  </SurfaceCard>
                )}
              </div>

              {/* Details sidebar */}
              <div>
                <SurfaceCard className="p-6">
                  <h2 className="text-sm font-semibold text-foreground">Details</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {item.status}
                      </span>
                    </div>
                    {item.condition && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Condition</span>
                        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", CONDITION_COLOR[item.condition] ?? "bg-gray-500/10 text-gray-600")}>
                          {item.condition}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{item.category.replace(/_/g, " ")}</span>
                    </div>
                    {item.assignments && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Assignments</span>
                        <span className="font-medium">{item.assignments.length}</span>
                      </div>
                    )}
                    <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </SurfaceCard>

                {item.assignments?.some((a: any) => !a.returnedAt) && (
                  <SurfaceCard className="mt-4 p-6">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" /> Currently Assigned
                    </h2>
                    {item.assignments.filter((a: any) => !a.returnedAt).map((a: any) => (
                      <div key={a.id} className="mt-3">
                        <p className="text-sm font-medium text-foreground">
                          {a.user ? `${a.user.firstName} ${a.user.lastName}` : "Unknown"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Since {new Date(a.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </SurfaceCard>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
