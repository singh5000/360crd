import { UserPlus } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { Form, FormInput, FormActions } from "@/components/form";
import { userSchema, type UserSchema } from "@/lib/form-schemas";
import { USER_ROLES, USER_STATUSES } from "@/lib/user-store";
import { cn } from "@/lib/utils";

export type UserFormValues = UserSchema;

export function UserForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  return (
    <Form<UserFormValues>
      schema={userSchema}
      defaultValues={{ name: "", email: "", role: "User", status: "Active" }}
      onSubmit={async (v) => onSubmit(v)}
      className="space-y-5"
    >
      {(form) => {
        const control = form.control as Control<UserFormValues>;
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput<UserFormValues> name="name" label="Full Name" autoComplete="off" />
              <FormInput<UserFormValues> name="email" type="email" label="Email" autoComplete="off" />

              <div>
                <label className="mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Role
                </label>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-2">
                      {USER_ROLES.map((r) => {
                        const active = field.value === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => field.onChange(r)}
                            className={cn(
                              "h-11 rounded-xl border text-sm font-medium transition-all",
                              active
                                ? "border-primary/60 bg-primary/10 text-primary"
                                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                            )}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {USER_STATUSES.map((s) => {
                        const active = field.value === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => field.onChange(s)}
                            className={cn(
                              "h-11 rounded-xl border text-sm font-medium transition-all",
                              active
                                ? s === "Active"
                                  ? "border-success/50 bg-success/10 text-success"
                                  : "border-border bg-muted text-foreground"
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
              submitLabel="Add User"
              submittingLabel="Adding…"
              onCancel={onCancel}
              icon={<UserPlus className="h-4 w-4" />}
              className="border-t-0 pt-0"
            />
          </>
        );
      }}
    </Form>
  );
}
