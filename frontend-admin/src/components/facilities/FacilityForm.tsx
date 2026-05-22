import { Send } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form";
import { facilitySchema, type FacilitySchema } from "@/lib/form-schemas";
import {
  FACILITY_STATUSES,
  FACILITY_TYPES,
  MANAGERS,
  type FacilityType,
} from "@/lib/facility-store";
import { cn } from "@/lib/utils";

export type FacilityFormValues = FacilitySchema;

export function FacilityForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: FacilityFormValues & { type: FacilityType }) => Promise<void> | void;
  onCancel?: () => void;
}) {
  return (
    <Form<FacilityFormValues>
      schema={facilitySchema}
      defaultValues={{
        name: "",
        type: "Office",
        location: "",
        manager: "",
        status: "Active",
        notes: "",
      }}
      onSubmit={async (v) => onSubmit({ ...v, type: v.type as FacilityType })}
    >
      {(form) => {
        const control = form.control as Control<FacilityFormValues>;
        return (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormInput<FacilityFormValues> name="name" label="Facility Name" autoComplete="off" />
              </div>
              <FormSelect<FacilityFormValues>
                name="type"
                label="Type"
                options={FACILITY_TYPES as readonly string[]}
                placeholder="Select type"
              />
              <FormInput<FacilityFormValues> name="location" label="Location" autoComplete="off" />
              <FormSelect<FacilityFormValues>
                name="manager"
                label="Manager"
                options={MANAGERS as readonly string[]}
                placeholder="Select manager"
              />
              <div>
                <label className="mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {FACILITY_STATUSES.map((s) => {
                        const active = field.value === s;
                        const tone = s === "Active" ? "border-success/50 text-success" : "border-warning/50 text-warning";
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => field.onChange(s)}
                            className={cn(
                              "h-12 rounded-xl border text-sm font-medium transition-all",
                              active
                                ? cn(tone, "bg-foreground/[0.03] shadow-[0_0_0_4px_color-mix(in_oklab,currentColor_12%,transparent)]")
                                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                            )}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <FormTextarea<FacilityFormValues>
                  name="notes"
                  label="Notes"
                  placeholder="Operational notes, certifications, or context for this facility."
                />
              </div>
            </div>

            <FormActions
              submitLabel="Add Facility"
              submittingLabel="Saving…"
              onCancel={onCancel}
              icon={<Send className="h-4 w-4" />}
            />
          </>
        );
      }}
    </Form>
  );
}
