import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterDef = {
  id: string;
  label: string;
  options: { label: string; value: string }[];
};

export function DataTableFilters({
  filters,
  values,
  onChange,
  onClear,
}: {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onClear: () => void;
}) {
  if (filters.length === 0) return null;
  const hasActive = filters.some((f) => values[f.id] && values[f.id] !== "All");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) => (
        <FilterDropdown
          key={f.id}
          filter={f}
          value={values[f.id] ?? "All"}
          onChange={(v) => onChange(f.id, v)}
        />
      ))}
      {hasActive && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>
      )}
    </div>
  );
}

function FilterDropdown({
  filter,
  value,
  onChange,
}: {
  filter: FilterDef;
  value: string;
  onChange: (v: string) => void;
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

  const active = value && value !== "All";
  const selectedLabel = filter.options.find((o) => o.value === value)?.label ?? "All";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
          active
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border/60 bg-background/60 text-foreground/80 hover:border-border hover:bg-accent hover:text-foreground",
        )}
      >
        <span className="text-muted-foreground">{filter.label}:</span>
        <span>{selectedLabel}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>
      {open && (
        <div className="absolute left-0 z-30 mt-2 w-52 rounded-xl border border-border/60 bg-popover p-1.5 shadow-lg animate-in fade-in zoom-in-95">
          {filter.options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-foreground/90 transition-colors hover:bg-accent"
            >
              <span>{o.label}</span>
              {value === o.value && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
