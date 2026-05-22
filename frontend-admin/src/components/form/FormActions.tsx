import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormActionsProps = {
  submitLabel?: string;
  submittingLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  icon?: React.ReactNode;
  align?: "end" | "between";
  className?: string;
  disabled?: boolean;
};

export function FormActions({
  submitLabel = "Save",
  submittingLabel,
  cancelLabel = "Cancel",
  onCancel,
  icon,
  align = "end",
  className,
  disabled,
}: FormActionsProps) {
  const { formState } = useFormContext();
  const submitting = formState.isSubmitting;
  const isDisabled = disabled || submitting;

  return (
    <div
      className={cn(
        "flex flex-col-reverse items-stretch gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center",
        align === "between" ? "sm:justify-between" : "sm:justify-end",
        className,
      )}
    >
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border/60 px-4 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground disabled:opacity-60"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        disabled={isDisabled}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg [background:var(--gradient-primary)] px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110 disabled:opacity-70"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {submitting ? submittingLabel ?? `${submitLabel}…` : submitLabel}
      </button>
    </div>
  );
}
