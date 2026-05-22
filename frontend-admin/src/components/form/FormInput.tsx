import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { FormFieldShell, useFieldError } from "./FormField";
import { cn } from "@/lib/utils";

export type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
};

export function FormInput<T extends FieldValues>({
  name,
  label,
  description,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
  className,
}: FormInputProps<T>) {
  const { register } = useFormContext<T>();
  const error = useFieldError<T>(name);

  return (
    <FormFieldShell name={name} label={label} description={description} error={error} className={className}>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={!!error}
        {...register(name)}
        className={cn(
          "h-12 w-full rounded-xl border bg-card/40 px-3.5 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground",
          "border-border/70 focus:border-primary/70 focus:outline-none focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]",
          error && "border-destructive/70",
          disabled && "opacity-60",
        )}
      />
    </FormFieldShell>
  );
}
