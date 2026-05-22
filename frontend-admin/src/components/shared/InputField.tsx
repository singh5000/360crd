import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, type = "text", className, id, value, defaultValue, onChange, onFocus, onBlur, ...props }, ref) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const [focused, setFocused] = useState(false);
    const [internal, setInternal] = useState(defaultValue ?? "");
    const isPassword = type === "password";
    const [showPwd, setShowPwd] = useState(false);
    const effectiveType = isPassword && showPwd ? "text" : type;

    const currentValue = value !== undefined ? String(value) : String(internal);
    const hasValue = currentValue.length > 0;
    const floated = focused || hasValue;

    return (
      <div className={cn("group", className)}>
        <div
          className={cn(
            "relative flex h-14 items-center rounded-xl border bg-input/60 transition-all duration-200",
            "border-border/70",
            focused && "border-primary/70 shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]",
            error && "border-destructive/70 shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-destructive)_15%,transparent)]",
          )}
        >
          {icon && (
            <span className={cn("pl-3.5 text-muted-foreground transition-colors", focused && "text-primary")}>
              {icon}
            </span>
          )}
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-0 px-3.5 text-sm text-muted-foreground transition-all duration-200",
              icon && "left-9",
              floated
                ? "top-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                : "top-1/2 -translate-y-1/2",
              focused && "text-primary",
              error && "text-destructive",
            )}
          >
            {label}
          </label>
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            value={value as string | number | readonly string[] | undefined}
            defaultValue={value === undefined ? (defaultValue as string | number | readonly string[] | undefined) : undefined}
            onChange={(e) => {
              if (value === undefined) setInternal(e.target.value);
              onChange?.(e);
            }}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            className={cn(
              "peer h-full w-full bg-transparent px-3.5 pt-4 text-sm text-foreground placeholder-transparent outline-none",
              icon && "pl-1",
              isPassword && "pr-10",
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPwd ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 px-1 text-xs font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
);
InputField.displayName = "InputField";
