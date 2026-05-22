import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
  width?: string;
}

export interface FilterBarProps {
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  values?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onClear?: () => void;
  className?: string;
  extra?: React.ReactNode;
}

export function FilterBar({
  search = "",
  onSearchChange,
  searchPlaceholder = "Search…",
  filters = [],
  values = {},
  onFilterChange,
  onClear,
  className,
  extra,
}: FilterBarProps) {
  const activeCount =
    (search ? 1 : 0) +
    filters.filter((f) => values[f.key] && values[f.key] !== "ALL").length;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2.5",
        className,
      )}
    >
      <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />

      {/* Search */}
      {onSearchChange && (
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 border-0 bg-transparent pl-8 pr-3 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      )}

      {/* Divider */}
      {onSearchChange && filters.length > 0 && (
        <div className="hidden h-5 w-px bg-border/60 sm:block" />
      )}

      {/* Filter dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const val = values[filter.key] ?? "ALL";
          const isActive = val && val !== "ALL";
          return (
            <Select
              key={filter.key}
              value={val}
              onValueChange={(v) => onFilterChange?.(filter.key, v)}
            >
              <SelectTrigger
                className={cn(
                  "h-8 gap-1.5 border-0 bg-transparent text-xs shadow-none focus:ring-0 focus:ring-offset-0",
                  filter.width ?? "w-auto min-w-[100px]",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <SelectValue placeholder={filter.placeholder ?? filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{filter.label}: All</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })}
      </div>

      {/* Extra slot */}
      {extra && <>{extra}</>}

      {/* Clear */}
      {activeCount > 0 && onClear && (
        <>
          <div className="h-5 w-px bg-border/60" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
              {activeCount}
            </span>
          </Button>
        </>
      )}
    </div>
  );
}
