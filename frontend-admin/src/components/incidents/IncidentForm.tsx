import { Paperclip, Send, X } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Form, FormInput, FormTextarea, FormSelect, FormActions } from "@/components/form";
import { incidentSchema, type IncidentSchema } from "@/lib/form-schemas";
import { FACILITIES, REPORTERS, type IncidentPriority } from "@/lib/incident-store";
import { cn } from "@/lib/utils";

export type IncidentFormValues = IncidentSchema;

const PRIORITIES: IncidentPriority[] = ["Low", "Medium", "High", "Critical"];

const priorityClasses: Record<IncidentPriority, string> = {
  Low: "border-muted-foreground/40 text-muted-foreground",
  Medium: "border-info/50 text-info",
  High: "border-warning/50 text-warning",
  Critical: "border-destructive/50 text-destructive",
};

export function IncidentForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: IncidentFormValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  return (
    <Form<IncidentFormValues>
      schema={incidentSchema}
      defaultValues={{
        title: "",
        description: "",
        facility: "",
        reportedBy: "",
        priority: "Medium",
        attachments: [],
      }}
      onSubmit={async (v) => onSubmit(v)}
    >
      {(form) => {
        const control = form.control as Control<IncidentFormValues>;
        return (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormInput<IncidentFormValues> name="title" label="Incident Title" autoComplete="off" />
              </div>
              <div className="md:col-span-2">
                <FormTextarea<IncidentFormValues>
                  name="description"
                  label="Description"
                  placeholder="What happened, where and when. Include any immediate actions taken."
                />
              </div>
              <FormSelect<IncidentFormValues>
                name="facility"
                label="Facility"
                options={FACILITIES as readonly string[]}
                placeholder="Select facility"
              />
              <FormSelect<IncidentFormValues>
                name="reportedBy"
                label="Reported By"
                options={REPORTERS as readonly string[]}
                placeholder="Select reporter"
              />

              <div className="md:col-span-2">
                <label className="mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Priority
                </label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {PRIORITIES.map((p) => {
                        const active = field.value === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => field.onChange(p)}
                            className={cn(
                              "h-12 rounded-xl border text-sm font-medium transition-all",
                              active
                                ? cn(priorityClasses[p], "bg-foreground/[0.03] shadow-[0_0_0_4px_color-mix(in_oklab,currentColor_12%,transparent)]")
                                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                            )}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Attachments
                </label>
                <Controller
                  control={control}
                  name="attachments"
                  render={({ field }) => {
                    const items = (field.value ?? []) as string[];
                    return (
                      <>
                        <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/30 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                          <Paperclip className="mb-1 h-4 w-4" />
                          Click to add files (UI only)
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files ?? []).map((f) => f.name);
                              if (files.length) field.onChange([...items, ...files]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        {items.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {items.map((a) => (
                              <li
                                key={a}
                                className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs"
                              >
                                <span className="truncate text-foreground">{a}</span>
                                <button
                                  type="button"
                                  onClick={() => field.onChange(items.filter((i) => i !== a))}
                                  className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                                  aria-label={`Remove ${a}`}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    );
                  }}
                />
              </div>
            </div>

            <FormActions
              submitLabel="Report Incident"
              submittingLabel="Submitting…"
              onCancel={onCancel}
              icon={<Send className="h-4 w-4" />}
            />
          </>
        );
      }}
    </Form>
  );
}
