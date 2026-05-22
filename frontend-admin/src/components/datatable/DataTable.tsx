import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { SurfaceCard } from "@/components/shared/Card";
import { cn } from "@/lib/utils";
import {
  exportToCsv,
  filterData,
  paginateData,
  sortData,
  type SortState,
} from "@/lib/table-utils";
import { DataTableToolbar, type BulkAction } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import type { FilterDef } from "./DataTableFilters";

export type ColumnDef<T> = {
  id: string;
  header: string;
  accessor?: (row: T) => unknown;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  enableHiding?: boolean;
  width?: number;
  minWidth?: number;
  align?: "left" | "right";
  className?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
  loading?: boolean;
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  filters?: FilterDef[];
  filterPredicates?: Record<string, (row: T, value: string) => boolean>;
  bulkActions?: BulkAction<T>[];
  enableSelection?: boolean;
  enableExport?: boolean;
  exportFilename?: string;
  initialPageSize?: number;
  initialSort?: SortState;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  emptyIcon?: ReactNode;
  storageKey?: string;
};

export function DataTable<T>({
  data,
  columns,
  getRowId,
  loading,
  searchPlaceholder = "Search…",
  searchAccessor,
  filters = [],
  filterPredicates = {},
  bulkActions,
  enableSelection = false,
  enableExport = true,
  exportFilename = "export",
  initialPageSize = 10,
  initialSort = null,
  emptyTitle = "No records found",
  emptyDescription = "Adjust your filters or add new data to populate this view.",
  emptyAction,
  emptyIcon,
  storageKey,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState>(initialSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [widths, setWidths] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  // Restore saved view
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(`360crd.view.${storageKey}`);
      if (!raw) return;
      const v = JSON.parse(raw) as { hidden?: string[]; widths?: Record<string, number>; pageSize?: number };
      if (v.hidden) setHidden(new Set(v.hidden));
      if (v.widths) setWidths(v.widths);
      if (v.pageSize) setPageSize(v.pageSize);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const saveView = () => {
    if (!storageKey || typeof window === "undefined") return;
    window.localStorage.setItem(
      `360crd.view.${storageKey}`,
      JSON.stringify({ hidden: Array.from(hidden), widths, pageSize }),
    );
  };

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hidden.has(c.id)),
    [columns, hidden],
  );

  const accessor = (row: T, id: string): unknown => {
    const col = columns.find((c) => c.id === id);
    if (col?.accessor) return col.accessor(row);
    return (row as Record<string, unknown>)[id];
  };

  const filtered = useMemo(
    () =>
      filterData(
        data,
        search,
        searchAccessor ?? (() => ""),
        filterValues,
        filterPredicates,
      ),
    [data, search, filterValues, searchAccessor, filterPredicates],
  );

  const sorted = useMemo(
    () => sortData(filtered, sort, accessor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered, sort],
  );

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = paginateData(sorted, safePage, pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, filterValues, pageSize]);

  const toggleSort = (id: string) => {
    setSort((s) => {
      if (!s || s.id !== id) return { id, dir: "asc" };
      if (s.dir === "asc") return { id, dir: "desc" };
      return null;
    });
  };

  const toggleHidden = (id: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Selection helpers (operate over filtered+sorted set, not just current page)
  const allPageIds = paged.map(getRowId);
  const allPageSelected = allPageIds.length > 0 && allPageIds.every((id) => selected.has(id));
  const togglePageAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) allPageIds.forEach((id) => next.delete(id));
      else allPageIds.forEach((id) => next.add(id));
      return next;
    });
  };
  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectedRows = useMemo(
    () => sorted.filter((r) => selected.has(getRowId(r))),
    [sorted, selected, getRowId],
  );

  const handleExport = () => {
    const cols = visibleColumns
      .filter((c) => c.id !== "actions")
      .map((c) => ({
        id: c.id,
        header: c.header,
        accessor: (row: T) => (c.accessor ? c.accessor(row) : (row as Record<string, unknown>)[c.id]),
      }));
    exportToCsv(exportFilename, sorted, cols);
  };

  const setFilterValue = (id: string, value: string) =>
    setFilterValues((p) => ({ ...p, [id]: value }));

  const clearFilters = () => setFilterValues({});

  // Column resizing
  const startResize = (id: string, startX: number, startWidth: number) => {
    const onMove = (e: MouseEvent) => {
      const next = Math.max(60, startWidth + (e.clientX - startX));
      setWidths((p) => ({ ...p, [id]: next }));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="space-y-3">
      <DataTableToolbar<T>
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={setFilterValue}
        onClearFilters={clearFilters}
        viewColumns={columns.map((c) => ({
          id: c.id,
          header: c.header,
          canHide: c.enableHiding !== false && c.id !== "actions",
        }))}
        hiddenColumns={hidden}
        onToggleColumn={toggleHidden}
        onExport={enableExport ? handleExport : undefined}
        selectedRows={selectedRows}
        bulkActions={bulkActions}
        onClearSelection={() => setSelected(new Set())}
      />

      {loading ? (
        <SurfaceCard className="p-4">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </SurfaceCard>
      ) : total === 0 ? (
        <SurfaceCard className="flex flex-col items-center justify-center px-6 py-16 text-center">
          {emptyIcon && (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
              {emptyIcon}
            </div>
          )}
          <p className="mt-5 text-base font-semibold text-foreground">{emptyTitle}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
          {emptyAction && <div className="mt-6">{emptyAction}</div>}
        </SurfaceCard>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 [background:var(--gradient-card)]">
          <div className="max-h-[640px] overflow-auto">
            <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
              <colgroup>
                {enableSelection && <col style={{ width: 44 }} />}
                {visibleColumns.map((c) => (
                  <col
                    key={c.id}
                    style={{ width: widths[c.id] ?? c.width ?? undefined, minWidth: c.minWidth }}
                  />
                ))}
              </colgroup>
              <thead className="sticky top-0 z-10 [background:var(--gradient-card)]">
                <tr className="border-b border-border/60 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {enableSelection && (
                    <th className="px-4 py-3">
                      <Checkbox
                        checked={allPageSelected}
                        onCheckedChange={togglePageAll}
                        aria-label="Select all rows on this page"
                      />
                    </th>
                  )}
                  {visibleColumns.map((c) => {
                    const active = sort?.id === c.id;
                    const Icon = !active ? ArrowUpDown : sort?.dir === "asc" ? ArrowUp : ArrowDown;
                    return (
                      <th
                        key={c.id}
                        className={cn(
                          "relative px-5 py-3",
                          c.align === "right" && "text-right",
                          c.className,
                        )}
                      >
                        {c.sortable ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(c.id)}
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors hover:text-foreground",
                              active ? "text-foreground" : "text-muted-foreground",
                              c.align === "right" && "ml-auto",
                            )}
                          >
                            {c.header}
                            <Icon className="h-3 w-3 opacity-80" />
                          </button>
                        ) : (
                          <span className={cn(c.align === "right" && "block w-full text-right")}>{c.header}</span>
                        )}
                        <ResizeHandle
                          onStart={(x) => {
                            const cur = widths[c.id] ?? c.width ?? 160;
                            startResize(c.id, x, cur);
                          }}
                        />
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => {
                  const id = getRowId(row);
                  const isSelected = selected.has(id);
                  return (
                    <tr
                      key={id}
                      className={cn(
                        "border-b border-border/40 last:border-0 transition-colors hover:bg-accent/40",
                        isSelected && "bg-primary/5",
                      )}
                    >
                      {enableSelection && (
                        <td className="px-4 py-3.5">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(id)}
                            aria-label="Select row"
                          />
                        </td>
                      )}
                      {visibleColumns.map((c) => (
                        <td
                          key={c.id}
                          className={cn(
                            "truncate px-5 py-3.5 text-foreground/90",
                            c.align === "right" && "text-right",
                            c.className,
                          )}
                        >
                          {c.cell
                            ? c.cell(row)
                            : (c.accessor
                                ? String(c.accessor(row) ?? "")
                                : String((row as Record<string, unknown>)[c.id] ?? ""))}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && total > 0 && (
        <DataTablePagination
          page={safePage}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(n) => {
            setPageSize(n);
            if (storageKey) setTimeout(saveView, 0);
          }}
        />
      )}
    </div>
  );
}

function ResizeHandle({ onStart }: { onStart: (x: number) => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      onMouseDown={(e) => {
        e.preventDefault();
        onStart(e.clientX);
      }}
      className="absolute right-0 top-0 z-10 h-full w-1.5 cursor-col-resize select-none opacity-0 transition-opacity hover:bg-primary/40 hover:opacity-100"
      aria-hidden
    />
  );
}
