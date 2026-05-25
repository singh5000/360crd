import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Users, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/training/$id")({
  head: () => ({ meta: [{ title: "Training Detail · 360CRD" }] }),
  component: TrainingDetailPage,
});

const STATUS_COLOR: Record<string, string> = {
  DRAFT:     "bg-gray-500/10 text-gray-600 border-gray-500/20",
  PUBLISHED: "bg-green-500/10 text-green-600 border-green-500/20",
  ARCHIVED:  "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

function TrainingDetailPage() {
  const { id } = Route.useParams();
  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiClient.get<any>(ENDPOINTS.training.detail(id))
      .then((res) => setTraining(res?.data ?? res))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300">
        <Link to="/app/training"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to training
        </Link>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-36 rounded-xl" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Skeleton className="h-40 rounded-xl lg:col-span-2" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          </div>
        ) : notFound || !training ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-base font-semibold">Training not found</p>
            <p className="mt-1 text-sm text-muted-foreground">It may have been removed or the link is invalid.</p>
          </SurfaceCard>
        ) : (
          <div className="space-y-6">
            <SurfaceCard className="p-6 md:p-8">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{training.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR[training.status] ?? "bg-gray-500/10 text-gray-600")}>
                  {training.status}
                </span>
                {training.category && (
                  <span className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {training.category}
                  </span>
                )}
                {training.durationMinutes && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {training.durationMinutes} min
                  </span>
                )}
              </div>
            </SurfaceCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {training.description && (
                  <SurfaceCard className="p-6">
                    <h2 className="text-sm font-semibold text-foreground">Description</h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                      {training.description}
                    </p>
                  </SurfaceCard>
                )}
              </div>
              <div>
                <SurfaceCard className="p-6">
                  <h2 className="text-sm font-semibold text-foreground">Details</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{training.category ?? "—"}</span>
                    </div>
                    {training.durationMinutes != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Duration</span>
                        <span className="font-medium">{training.durationMinutes} min</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Enrollments</span>
                      <span className="font-medium">{training._count?.enrollments ?? 0}</span>
                    </div>
                    <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      Created {new Date(training.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </SurfaceCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
