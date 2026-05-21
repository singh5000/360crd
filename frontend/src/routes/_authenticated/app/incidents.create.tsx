import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/shared/Card";
import { useIncidentStore } from "@/lib/stores/incident.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/incidents/create")({
  head: () => ({
    meta: [
      { title: "Report Incident · 360CRD" },
      { name: "description", content: "Report a new operational incident." },
    ],
  }),
  component: CreateIncidentPage,
});

const INCIDENT_TYPES = ["SAFETY", "ENVIRONMENTAL", "QUALITY", "SECURITY", "NEAR_MISS", "PROPERTY_DAMAGE", "OTHER"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

const SEVERITY_COLOR: Record<string, string> = {
  LOW: "border-muted-foreground/40 text-muted-foreground",
  MEDIUM: "border-blue-500/50 text-blue-600",
  HIGH: "border-yellow-500/50 text-yellow-600",
  CRITICAL: "border-red-500/50 text-red-600",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
      {children}
    </Label>
  );
}

function CreateIncidentPage() {
  const navigate = useNavigate();
  const { createIncident } = useIncidentStore();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("SAFETY");
  const [severity, setSeverity] = useState("MEDIUM");
  const [priority, setPriority] = useState("MEDIUM");
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createIncident({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        severity,
        priority,
        occurredAt: new Date(occurredAt).toISOString(),
        location: location.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate({ to: "/app/incidents" }), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6 animate-in fade-in duration-300">
        <div>
          <Link
            to="/app/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to incidents
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Report Incident</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Document what happened, classify severity, and notify the right team.
          </p>
        </div>

        {success ? (
          <SurfaceCard className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15 text-green-600 ring-1 ring-inset ring-green-500/25">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">Incident reported</p>
            <p className="mt-1 text-sm text-muted-foreground">Redirecting to incidents listâ€¦</p>
          </SurfaceCard>
        ) : (
          <SurfaceCard className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel>Incident Title *</FieldLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief description of the incident"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened, where and when. Include any immediate actions taken."
                    rows={4}
                  />
                </div>

                <div>
                  <FieldLabel>Type *</FieldLabel>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INCIDENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <FieldLabel>Date &amp; Time Occurred *</FieldLabel>
                  <Input
                    type="datetime-local"
                    value={occurredAt}
                    onChange={(e) => setOccurredAt(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <FieldLabel>Location</FieldLabel>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Building, area or coordinates"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Severity</FieldLabel>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SEVERITIES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSeverity(s)}
                        className={cn(
                          "h-11 rounded-xl border text-sm font-medium transition-all",
                          severity === s
                            ? cn(SEVERITY_COLOR[s], "bg-foreground/[0.03] shadow-[0_0_0_4px_color-mix(in_oklab,currentColor_12%,transparent)]")
                            : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Priority</FieldLabel>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          "h-11 rounded-xl border text-sm font-medium transition-all",
                          priority === p
                            ? "border-primary/60 bg-primary/10 text-foreground shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]"
                            : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-5">
                <Button type="button" variant="outline" onClick={() => navigate({ to: "/app/incidents" })}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !title.trim()}
                  className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Submittingâ€¦" : "Report Incident"}
                </Button>
              </div>
            </form>
          </SurfaceCard>
        )}
      </div>
    </AppShell>
  );
}

