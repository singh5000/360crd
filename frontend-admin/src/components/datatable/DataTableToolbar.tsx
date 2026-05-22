import { useEffect, useState } from "react";
import { Download, Search, X } from "lucide-react";
import { DataTableFilters, type FilterDef } from "./DataTableFilters";
import { DataTableViewOptions, type ViewColumn } from "./DataTableViewOptions";

export type BulkAction<T> = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  onClick: (rows: T[]) => void;
};

export function DataTableToolbar<T>({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  viewColumns,
  hiddenColumns,
  onToggleColumn,
  onExport,
  selectedRows,
  bulkActions,
  onClearSelection,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters: FilterDef[];
  filterValues: Record<string, string>;
  onFilterChange: (id: string, value: string) => void;
  onClearFilters: () => void;
  viewColumns: ViewColumn[];
  hiddenColumns: Set<string>;
  onToggleColumn: (id: string) => void;
  onExport?: () => void;
  selectedRows: T[];
  bulkActions?: BulkAction<T>[];
  onClearSelection: () => void;
}) {
  // Debounced search
  const [local, setLocal] = useState(search);
  useEffect(() => setLocal(search), [search]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== search) onSearchChange(local);
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 [background:var(--gradient-card)] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-border/60 bg-background/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <DataTableFilters
            filters={filters}
            values={filterValues}
            onChange={onFilterChange}
            onClear={onClearFilters}
          />
          <DataTableViewOptions
            columns={viewColumns}
            hidden={hiddenColumns}
            onToggle={onToggleColumn}
          />
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-3 text-xs font-medium text-foreground/80 transition-colors hover:border-border hover:bg-accent hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          )}
        </div>
      </div>

      {hasSelection && bulkActions && bulkActions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 animate-in fade-in slide-in-from-top-1">
          <span className="text-xs font-medium text-foreground">
            {selectedRows.length} selected
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            {bulkActions.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => a.onClick(selectedRows)}
                className={
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors " +
                  (a.variant === "destructive"
                    ? "border border-destructive/40 text-destructive hover:bg-destructive/10"
                    : "border border-border/60 text-foreground/80 hover:bg-accent hover:text-foreground")
                }
              >
                {a.icon}
                {a.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
