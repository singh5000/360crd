import { useEffect, useRef, useState } from "react";
import { Check, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewColumn = { id: string; header: string; canHide?: boolean };

export function DataTableViewOptions({
  columns,
  hidden,
  onToggle,
  onSaveView,
}: {
  columns: ViewColumn[];
  hidden: Set<string>;
  onToggle: (id: string) => void;
  onSaveView?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-3 text-xs font-medium text-foreground/80 transition-colors hover:border-border hover:bg-accent hover:text-foreground"
      >
        <Settings2 className="h-3.5 w-3.5" /> View
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-60 rounded-xl border border-border/60 bg-popover p-1.5 shadow-lg animate-in fade-in zoom-in-95">
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Toggle columns
          </p>
          <div className="max-h-72 overflow-y-auto">
            {columns.map((c) => {
              const visible = !hidden.has(c.id);
              const disabled = c.canHide === false;
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onToggle(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent",
                    disabled && "opacity-50 pointer-events-none",
                  )}
                >
                  <span className="truncate text-foreground/90">{c.header}</span>
                  {visible && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
          {onSaveView && (
            <>
              <div className="my-1 h-px bg-border/60" />
              <button
                type="button"
                onClick={() => {
                  onSaveView();
                  setOpen(false);
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-xs font-medium text-primary hover:bg-primary/10"
              >
                Save view
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
