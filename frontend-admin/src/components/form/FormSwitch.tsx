import { Controller, useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useFieldError } from "./FormField";
import { cn } from "@/lib/utils";

export type FormSwitchProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  description?: string;
  className?: string;
};

export function FormSwitch<T extends FieldValues>({ name, label, description, className }: FormSwitchProps<T>) {
  const { control } = useFormContext<T>();
  const error = useFieldError<T>(name);

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        {error && <p className="mt-0.5 text-xs font-medium text-destructive">{error}</p>}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Switch checked={!!field.value} onCheckedChange={(v) => field.onChange(v)} />
        )}
      />
    </div>
  );
}
