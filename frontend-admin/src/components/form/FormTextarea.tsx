import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { FormFieldShell, useFieldError } from "./FormField";
import { cn } from "@/lib/utils";

export type FormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
};

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  rows = 4,
  className,
}: FormTextareaProps<T>) {
  const { register } = useFormContext<T>();
  const error = useFieldError<T>(name);
  return (
    <FormFieldShell name={name} label={label} description={description} error={error} className={className}>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!error}
        {...register(name)}
        className={cn(
          "w-full rounded-xl border bg-card/40 px-3.5 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground",
          "border-border/70 focus:border-primary/70 focus:outline-none focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]",
          error && "border-destructive/70",
        )}
      />
    </FormFieldShell>
  );
}
