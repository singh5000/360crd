import { Send } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Form, FormInput, FormSelect, FormActions } from "@/components/form";
import { companySchema, type CompanySchema } from "@/lib/form-schemas";
import {
  COMPANY_INDUSTRIES,
  COMPANY_PLANS,
  COMPANY_STATUSES,
  type CompanyIndustry,
} from "@/lib/company-store";
import { cn } from "@/lib/utils";

export type CompanyFormValues = CompanySchema;

export function CompanyForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: CompanyFormValues & { industry: CompanyIndustry }) => Promise<void> | void;
  onCancel?: () => void;
}) {
  return (
    <Form<CompanyFormValues>
      schema={companySchema}
      defaultValues={{ name: "", industry: "", plan: "Pro", status: "Active" }}
      onSubmit={async (v) => onSubmit({ ...v, industry: v.industry as CompanyIndustry })}
    >
      {(form) => {
        const control = form.control as Control<CompanyFormValues>;
        return (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormInput<CompanyFormValues> name="name" label="Company Name" autoComplete="off" />
              </div>
              <FormSelect<CompanyFormValues>
                name="industry"
                label="Industry"
                options={COMPANY_INDUSTRIES as readonly string[]}
                placeholder="Select industry"
              />
              <div>
                <label className="mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Subscription Plan
                </label>
                <Controller
                  control={control}
                  name="plan"
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-2">
                      {COMPANY_PLANS.map((p) => {
                        const active = field.value === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => field.onChange(p)}
                            className={cn(
                              "h-12 rounded-xl border text-sm font-medium transition-all",
                              active
                                ? "border-primary/60 bg-primary/10 text-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]"
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
                  Status
                </label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {COMPANY_STATUSES.map((s) => {
                        const active = field.value === s;
                        const tone =
                          s === "Active" ? "border-success/50 text-success" : "border-destructive/50 text-destructive";
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
            </div>

            <FormActions
              submitLabel="Add Company"
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
