import { Save } from "lucide-react";
import { Form, FormInput, FormTextarea, FormSelect, FormDatePicker, FormActions } from "@/components/form";
import { auditSchema, type AuditSchema } from "@/lib/form-schemas";
import { ASSIGNEES, type AuditPriority } from "@/lib/audit-store";
import { cn } from "@/lib/utils";
import { Controller, type Control } from "react-hook-form";

export type AuditFormValues = AuditSchema;

const PRIORITIES: AuditPriority[] = ["Low", "Medium", "High"];

export function AuditForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: AuditFormValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  return (
    <Form<AuditFormValues>
      schema={auditSchema}
      defaultValues={{ title: "", description: "", assignee: "", dueDate: "", priority: "Medium" }}
      onSubmit={async (v) => onSubmit(v)}
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormInput<AuditFormValues> name="title" label="Audit Title" autoComplete="off" />
            </div>
            <div className="md:col-span-2">
              <FormTextarea<AuditFormValues>
                name="description"
                label="Description"
                placeholder="Describe scope, objectives, and reference standards"
              />
            </div>
            <FormSelect<AuditFormValues>
              name="assignee"
              label="Assigned To"
              options={ASSIGNEES as readonly string[]}
              placeholder="Select assignee"
            />
            <FormDatePicker<AuditFormValues> name="dueDate" label="Due Date" />
            <div className="md:col-span-2">
              <label className="mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Priority
              </label>
              <Controller
                control={form.control as Control<AuditFormValues>}
                name="priority"
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
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
                              ? "border-primary/60 bg-primary/10 text-foreground shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]"
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
          </div>
          <FormActions
            submitLabel="Create Audit"
            submittingLabel="Creating…"
            onCancel={onCancel}
            icon={<Save className="h-4 w-4" />}
          />
        </>
      )}
    </Form>
  );
}
