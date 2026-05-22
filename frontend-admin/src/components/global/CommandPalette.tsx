import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  ClipboardCheck,
  CornerDownLeft,
  FileText,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { groupByCategory, indexedData, searchIndex, type SearchCategory } from "@/lib/search-store";

type Action = {
  id: string;
  label: string;
  hint: string;
  icon: typeof Plus;
  to: string;
};

const QUICK_ACTIONS: Action[] = [
  { id: "qa-audit", label: "Create Audit", hint: "Start a new audit", icon: ClipboardCheck, to: "/audits/create" },
  { id: "qa-incident", label: "Report Incident", hint: "Log a new incident", icon: ShieldAlert, to: "/incidents/create" },
  { id: "qa-facility", label: "Add Facility", hint: "Onboard a new facility", icon: Building2, to: "/facilities/create" },
  { id: "qa-company", label: "Add Company", hint: "Create a new tenant", icon: Users, to: "/companies/create" },
];

const CATEGORY_ICON: Record<SearchCategory, typeof FileText> = {
  Audits: ClipboardCheck,
  Incidents: ShieldAlert,
  Facilities: Building2,
  Companies: Users,
};

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="rounded bg-primary/20 text-primary">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
}

type Row = { kind: "action"; action: Action } | { kind: "result"; item: (typeof indexedData)[number] };

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const rows: Row[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const actions = QUICK_ACTIONS.filter((a) => !q || a.label.toLowerCase().includes(q));
    const results = q ? searchIndex(query) : [];
    return [
      ...actions.map<Row>((a) => ({ kind: "action", action: a })),
      ...results.map<Row>((item) => ({ kind: "result", item })),
    ];
  }, [query]);

  useEffect(() => { setActive(0); }, [query]);

  if (!open) return null;

  const exec = (row: Row) => {
    onClose();
    navigate({ to: row.kind === "action" ? row.action.to : row.item.to });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, rows.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && rows[active]) { e.preventDefault(); exec(rows[active]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  const grouped = groupByCategory(rows.filter((r) => r.kind === "result").map((r) => (r as Extract<Row, { kind: "result" }>).item));
  const actionRows = rows.filter((r) => r.kind === "action") as Extract<Row, { kind: "action" }>[];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/60 px-4 pt-[10vh] backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 slide-in-from-top-2 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="flex items-center gap-3 border-b border-border/60 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or run a command…"
            className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="hidden h-5 items-center rounded border border-border/60 bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:flex">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {actionRows.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</p>
              {actionRows.map((r, idx) => {
                const Icon = r.action.icon;
                const isActive = rows.indexOf(r) === active;
                return (
                  <button
                    key={r.action.id}
                    type="button"
                    onMouseEnter={() => setActive(rows.indexOf(r))}
                    onClick={() => exec(r)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      isActive ? "bg-accent text-foreground" : "text-foreground/90 hover:bg-accent/60",
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{highlight(r.action.label, query)}</p>
                      <p className="truncate text-xs text-muted-foreground">{r.action.hint}</p>
                    </div>
                    {isActive && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />}
                    {idx === 0 && !query && <span className="text-[10px] text-muted-foreground">Quick action</span>}
                  </button>
                );
              })}
            </div>
          )}

          {(Object.keys(grouped) as SearchCategory[]).map((cat) => {
            const items = grouped[cat];
            if (!items.length) return null;
            const Icon = CATEGORY_ICON[cat];
            return (
              <div key={cat} className="mb-2">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{cat}</p>
                {items.map((item) => {
                  const row: Row = { kind: "result", item };
                  const idx = rows.findIndex((r) => r.kind === "result" && r.item.id === item.id);
                  const isActive = idx === active;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => exec(row)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        isActive ? "bg-accent text-foreground" : "text-foreground/90 hover:bg-accent/60",
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground ring-1 ring-inset ring-border">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{highlight(item.title, query)}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                      {isActive && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {rows.length === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">No results</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different keyword or action.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="rounded border border-border/60 bg-muted px-1">↑</kbd><kbd className="rounded border border-border/60 bg-muted px-1">↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="rounded border border-border/60 bg-muted px-1">↵</kbd> open</span>
          </div>
          <span>360CRD · Command Palette</span>
        </div>
      </div>
    </div>
  );
}
