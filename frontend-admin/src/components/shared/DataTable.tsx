import { cn } from "@/lib/utils";

export type Column<T> = {
  key: keyof T | string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
}: {
  columns: Column<T>[];
  data: T[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 [background:var(--gradient-card)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {columns.map((col) => (
                <th key={String(col.key)} className={cn("px-5 py-3", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 last:border-0 transition-colors hover:bg-accent/40"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={cn("px-5 py-3.5 text-foreground/90", col.className)}>
                    {col.render ? col.render(row) : (row as Record<string, React.ReactNode>)[col.key as string]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
