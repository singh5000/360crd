import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "info" | "danger" | "neutral";

const toneStyles: Record<Tone, string> = {
  success: "bg-success/15 text-success ring-success/25",
  warning: "bg-warning/15 text-warning ring-warning/25",
  info: "bg-info/15 text-info ring-info/25",
  danger: "bg-destructive/15 text-destructive ring-destructive/25",
  neutral: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneStyles[tone],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": tone === "success",
        "bg-warning": tone === "warning",
        "bg-info": tone === "info",
        "bg-destructive": tone === "danger",
        "bg-muted-foreground": tone === "neutral",
      })} />
      {children}
    </span>
  );
}
