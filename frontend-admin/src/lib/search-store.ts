export type SearchCategory = "Audits" | "Incidents" | "Facilities" | "Companies";

export type SearchItem = {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  to: string;
  params?: Record<string, string>;
};

export const indexedData: SearchItem[] = [
  { id: "a1", category: "Audits", title: "AUD-2049 · Hamburg DC-04", subtitle: "Northwind Logistics · Completed", to: "/audits" },
  { id: "a2", category: "Audits", title: "AUD-2050 · Plant 7", subtitle: "Acme Manufacturing · In Progress", to: "/audits" },
  { id: "a3", category: "Audits", title: "AUD-2051 · Boston Lab", subtitle: "Helix Biotech · Scheduled", to: "/audits" },
  { id: "a4", category: "Audits", title: "AUD-2052 · Refinery South", subtitle: "Vantage Energy · Overdue", to: "/audits" },
  { id: "a5", category: "Audits", title: "AUD-2053 · Warehouse 12", subtitle: "Meridian Retail · Completed", to: "/audits" },

  { id: "i1", category: "Incidents", title: "INC-118 · Equipment failure", subtitle: "Plant 7 · Escalated", to: "/incidents" },
  { id: "i2", category: "Incidents", title: "INC-119 · Slip and fall", subtitle: "Hamburg DC-04 · Open", to: "/incidents" },
  { id: "i3", category: "Incidents", title: "INC-120 · Chemical spill", subtitle: "Refinery South · In Progress", to: "/incidents" },
  { id: "i4", category: "Incidents", title: "INC-121 · Power outage", subtitle: "Warehouse 12 · Resolved", to: "/incidents" },

  { id: "f1", category: "Facilities", title: "Hamburg DC-04", subtitle: "Warehouse · Active", to: "/facilities" },
  { id: "f2", category: "Facilities", title: "Plant 7", subtitle: "Plant · Under Maintenance", to: "/facilities" },
  { id: "f3", category: "Facilities", title: "Boston Lab", subtitle: "Office · Active", to: "/facilities" },
  { id: "f4", category: "Facilities", title: "Refinery South", subtitle: "Plant · Active", to: "/facilities" },

  { id: "c1", category: "Companies", title: "Northwind Logistics", subtitle: "Logistics · Enterprise", to: "/companies" },
  { id: "c2", category: "Companies", title: "Acme Manufacturing", subtitle: "Manufacturing · Pro", to: "/companies" },
  { id: "c3", category: "Companies", title: "Helix Biotech", subtitle: "Biotech · Enterprise", to: "/companies" },
];

export function searchIndex(query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return indexedData.filter(
    (i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q),
  );
}

export function groupByCategory(items: SearchItem[]): Record<SearchCategory, SearchItem[]> {
  const out: Record<SearchCategory, SearchItem[]> = {
    Audits: [], Incidents: [], Facilities: [], Companies: [],
  };
  for (const it of items) out[it.category].push(it);
  (Object.keys(out) as SearchCategory[]).forEach((k) => { out[k] = out[k].slice(0, 5); });
  return out;
}
