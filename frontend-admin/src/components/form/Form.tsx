import { FormProvider, useForm, type DefaultValues, type FieldValues, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { cn } from "@/lib/utils";

export type FormProps<T extends FieldValues> = {
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
  children: React.ReactNode | ((form: UseFormReturn<T>) => React.ReactNode);
  showSummary?: boolean;
};

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  className,
  children,
  showSummary = false,
}: FormProps<T>) {
  const form = useForm<T>({
    // @ts-expect-error - resolver typing across zod versions
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  const errors = form.formState.errors;
  const errorList = Object.entries(errors)
    .map(([k, v]) => ({ key: k, message: (v as { message?: string } | undefined)?.message }))
    .filter((e) => e.message);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)} noValidate>
        {showSummary && errorList.length > 0 && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-xs text-destructive">
            <p className="font-medium">Please fix the following:</p>
            <ul className="mt-1 list-disc pl-4">
              {errorList.map((e) => (
                <li key={e.key}>{e.message}</li>
              ))}
            </ul>
          </div>
        )}
        {typeof children === "function" ? children(form) : children}
      </form>
    </FormProvider>
  );
}
