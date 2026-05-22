import { useSyncExternalStore } from "react";

export type AuditStatus = "Planned" | "In Progress" | "Completed" | "Overdue";
export type AuditPriority = "Low" | "Medium" | "High";

export type Audit = {
  id: string;
  reference: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: AuditStatus;
  priority: AuditPriority;
  createdAt: string;
};

export const ASSIGNEES = [
  "M. Lindqvist",
  "P. Raman",
  "J. Okafor",
  "S. Martinez",
  "K. Tanaka",
  "E. Rodriguez",
] as const;

const seed: Audit[] = [
  {
    id: "a-2049",
    reference: "AUD-2049",
    title: "Quarterly compliance — Hamburg DC-04",
    description: "Routine quarterly compliance review across warehouse operations.",
    assignee: "M. Lindqvist",
    dueDate: "2026-04-22",
    status: "Completed",
    priority: "Medium",
    createdAt: "2026-03-12",
  },
  {
    id: "a-2050",
    reference: "AUD-2050",
    title: "Process safety audit — Plant 7",
    description: "Inspection of process safety controls and emergency systems.",
    assignee: "P. Raman",
    dueDate: "2026-04-24",
    status: "In Progress",
    priority: "High",
    createdAt: "2026-03-18",
  },
  {
    id: "a-2051",
    reference: "AUD-2051",
    title: "GMP review — Boston Lab",
    description: "Good manufacturing practice audit for biotech facility.",
    assignee: "J. Okafor",
    dueDate: "2026-05-02",
    status: "Planned",
    priority: "Medium",
    createdAt: "2026-04-01",
  },
  {
    id: "a-2052",
    reference: "AUD-2052",
    title: "Environmental compliance — Refinery South",
    description: "Air, water and waste compliance review.",
    assignee: "S. Martinez",
    dueDate: "2026-04-18",
    status: "Overdue",
    priority: "High",
    createdAt: "2026-03-05",
  },
  {
    id: "a-2053",
    reference: "AUD-2053",
    title: "Inventory controls — Warehouse 12",
    description: "Inventory accuracy and shrinkage controls audit.",
    assignee: "K. Tanaka",
    dueDate: "2026-04-20",
    status: "Completed",
    priority: "Low",
    createdAt: "2026-03-22",
  },
  {
    id: "a-2054",
    reference: "AUD-2054",
    title: "Cybersecurity posture review",
    description: "ISO 27001 alignment review across IT facilities.",
    assignee: "E. Rodriguez",
    dueDate: "2026-05-12",
    status: "Planned",
    priority: "High",
    createdAt: "2026-04-10",
  },
];

const STORAGE_KEY = "360crd.audits";

function read(): Audit[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as Audit[];
  } catch {
    return seed;
  }
}

let state: Audit[] = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function nextRef(): string {
  const max = state.reduce((acc, a) => {
    const n = parseInt(a.reference.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 2053);
  return `AUD-${max + 1}`;
}

export const auditStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  addAudit: (input: Omit<Audit, "id" | "reference" | "createdAt" | "status"> & { status?: AuditStatus }) => {
    const audit: Audit = {
      id: `a-${Date.now()}`,
      reference: nextRef(),
      createdAt: new Date().toISOString().slice(0, 10),
      status: input.status ?? "Planned",
      ...input,
    };
    state = [audit, ...state];
    emit();
    return audit;
  },
  updateAudit: (id: string, patch: Partial<Audit>) => {
    state = state.map((a) => (a.id === id ? { ...a, ...patch } : a));
    emit();
  },
  removeAudit: (id: string) => {
    state = state.filter((a) => a.id !== id);
    emit();
  },
};

export type AuditFilters = {
  search: string;
  status: "All" | AuditStatus;
  assignee: "All" | string;
  from: string;
  to: string;
};

export function filterAudits(audits: Audit[], f: AuditFilters): Audit[] {
  return audits.filter((a) => {
    if (f.status !== "All" && a.status !== f.status) return false;
    if (f.assignee !== "All" && a.assignee !== f.assignee) return false;
    if (f.from && a.dueDate < f.from) return false;
    if (f.to && a.dueDate > f.to) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      if (
        !a.title.toLowerCase().includes(q) &&
        !a.reference.toLowerCase().includes(q) &&
        !a.assignee.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function useAudits() {
  return useSyncExternalStore(auditStore.subscribe, auditStore.getState, () => seed);
}
