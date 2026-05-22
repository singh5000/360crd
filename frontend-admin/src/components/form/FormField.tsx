import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";

export type FormFieldShellProps = {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormFieldShell({ name, label, description, error, children, className }: FormFieldShellProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="px-1 text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="px-1 text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}

export function useFieldError<T extends FieldValues>(name: Path<T>): string | undefined {
  const { formState } = useFormContext<T>();
  const err = name.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, formState.errors);
  if (err && typeof err === "object" && "message" in err) {
    return (err as { message?: string }).message;
  }
  return undefined;
}
