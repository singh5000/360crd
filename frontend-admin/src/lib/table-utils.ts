export type SortDir = "asc" | "desc";

export type SortState = { id: string; dir: SortDir } | null;

export function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const av = String(a).toLowerCase();
  const bv = String(b).toLowerCase();
  if (av < bv) return -1;
  if (av > bv) return 1;
  return 0;
}

export function sortData<T>(
  data: T[],
  sort: SortState,
  accessor: (row: T, id: string) => unknown,
): T[] {
  if (!sort) return data;
  const arr = [...data];
  arr.sort((a, b) => {
    const cmp = compareValues(accessor(a, sort.id), accessor(b, sort.id));
    return sort.dir === "asc" ? cmp : -cmp;
  });
  return arr;
}

export function filterData<T>(
  data: T[],
  search: string,
  searchAccessor: (row: T) => string,
  filters: Record<string, string>,
  predicates: Record<string, (row: T, value: string) => boolean>,
): T[] {
  const q = search.trim().toLowerCase();
  return data.filter((row) => {
    if (q && !searchAccessor(row).toLowerCase().includes(q)) return false;
    for (const [id, value] of Object.entries(filters)) {
      if (!value || value === "All") continue;
      const pred = predicates[id];
      if (pred && !pred(row, value)) return false;
    }
    return true;
  });
}

export function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
  return data.slice((page - 1) * pageSize, page * pageSize);
}

export function exportToCsv<T>(
  filename: string,
  rows: T[],
  columns: { id: string; header: string; accessor: (row: T) => unknown }[],
): void {
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    if (s.includes('"') || s.includes(",") || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const header = columns.map((c) => escape(c.header)).join(",");
  const body = rows
    .map((r) => columns.map((c) => escape(c.accessor(r))).join(","))
    .join("\n");
  const csv = `${header}\n${body}`;
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
