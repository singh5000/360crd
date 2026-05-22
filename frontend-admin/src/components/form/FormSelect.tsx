import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { FormFieldShell, useFieldError } from "./FormField";
import { cn } from "@/lib/utils";

export type FormSelectOption = { label: string; value: string };

export type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  options: readonly FormSelectOption[] | readonly string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function normalize(opts: readonly FormSelectOption[] | readonly string[]): FormSelectOption[] {
  return opts.map((o) => (typeof o === "string" ? { label: o, value: o } : o));
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  description,
  options,
  placeholder = "Select…",
  disabled,
  className,
}: FormSelectProps<T>) {
  const { register } = useFormContext<T>();
  const error = useFieldError<T>(name);
  const opts = normalize(options);

  return (
    <FormFieldShell name={name} label={label} description={description} error={error} className={className}>
      <select
        id={name}
        disabled={disabled}
        aria-invalid={!!error}
        {...register(name)}
        className={cn(
          "h-12 w-full rounded-xl border bg-card/40 px-3.5 text-sm text-foreground transition-all duration-200",
          "border-border/70 focus:border-primary/70 focus:outline-none focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]",
          error && "border-destructive/70",
        )}
      >
        <option value="">{placeholder}</option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FormFieldShell>
  );
}
