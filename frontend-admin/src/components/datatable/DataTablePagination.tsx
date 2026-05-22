import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const PAGE_SIZES = [10, 25, 50, 100];

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (n: number) => void;
  onPageSizeChange: (n: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  return (
    <div className="flex flex-col-reverse items-stretch gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}–{end}</span> of {total}
      </p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-border/60 bg-background/60 px-2 text-xs text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Rows per page"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <PageBtn onClick={() => onPageChange(1)} disabled={safePage === 1} aria-label="First page">
            <ChevronsLeft className="h-4 w-4" />
          </PageBtn>
          <PageBtn
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </PageBtn>
          <span className="px-2 text-xs text-muted-foreground">
            {safePage} / {totalPages}
          </span>
          <PageBtn
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </PageBtn>
          <PageBtn
            onClick={() => onPageChange(totalPages)}
            disabled={safePage === totalPages}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </PageBtn>
        </div>
      </div>
    </div>
  );
}

function PageBtn({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
}
