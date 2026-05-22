import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { FormFieldShell, useFieldError } from "./FormField";
import { cn } from "@/lib/utils";

export type FormDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  min?: string;
  max?: string;
  className?: string;
};

export function FormDatePicker<T extends FieldValues>({
  name,
  label,
  description,
  min,
  max,
  className,
}: FormDatePickerProps<T>) {
  const { register } = useFormContext<T>();
  const error = useFieldError<T>(name);
  return (
    <FormFieldShell name={name} label={label} description={description} error={error} className={className}>
      <input
        id={name}
        type="date"
        min={min}
        max={max}
        aria-invalid={!!error}
        {...register(name)}
        className={cn(
          "h-12 w-full rounded-xl border bg-card/40 px-3.5 text-sm text-foreground transition-all duration-200",
          "border-border/70 focus:border-primary/70 focus:outline-none focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]",
          error && "border-destructive/70",
        )}
      />
    </FormFieldShell>
  );
}
