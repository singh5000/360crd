import { cn } from "@/lib/utils";

export function SurfaceCard({
  className,
  children,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 p-5 transition-all duration-300",
        "[background:var(--gradient-card)] [box-shadow:var(--shadow-card)]",
        interactive && "hover:border-border hover:-translate-y-0.5 hover:[box-shadow:var(--shadow-elevated)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
