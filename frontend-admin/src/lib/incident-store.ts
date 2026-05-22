import { useSyncExternalStore } from "react";

export type IncidentStatus = "Open" | "In Progress" | "Resolved" | "Escalated";
export type IncidentPriority = "Low" | "Medium" | "High" | "Critical";

export type TimelineEntry = {
  id: string;
  type: "created" | "status" | "comment" | "escalated";
  message: string;
  author: string;
  at: string;
};

export type Incident = {
  id: string;
  reference: string;
  title: string;
  description: string;
  facility: string;
  reportedBy: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  createdAt: string;
  attachments: string[];
  timeline: TimelineEntry[];
};

export const FACILITIES = [
  "Hamburg DC-04",
  "Plant 7",
  "Boston Lab",
  "Refinery South",
  "Warehouse 12",
  "Helsinki HQ",
] as const;

export const REPORTERS = [
  "M. Lindqvist",
  "P. Raman",
  "J. Okafor",
  "S. Martinez",
  "K. Tanaka",
  "E. Rodriguez",
] as const;

const seed: Incident[] = [
  {
    id: "i-3001",
    reference: "INC-3001",
    title: "Unplanned shutdown on packaging line 3",
    description:
      "Line 3 stopped after a sensor fault triggered the safety interlock. Production halted for 42 minutes.",
    facility: "Plant 7",
    reportedBy: "P. Raman",
    priority: "High",
    status: "In Progress",
    createdAt: "2026-04-26",
    attachments: ["incident-photo.jpg", "shift-log.pdf"],
    timeline: [
      { id: "t1", type: "created", message: "Incident reported", author: "P. Raman", at: "2026-04-26 09:12" },
      { id: "t2", type: "status", message: "Status changed to In Progress", author: "Operations", at: "2026-04-26 09:40" },
      { id: "t3", type: "comment", message: "Maintenance dispatched, ETA 30 min.", author: "M. Lindqvist", at: "2026-04-26 10:05" },
    ],
  },
  {
    id: "i-3002",
    reference: "INC-3002",
    title: "Cold storage temperature excursion",
    description: "Cold room CR-2 exceeded 8°C for 18 minutes overnight. Stock under quarantine pending review.",
    facility: "Boston Lab",
    reportedBy: "J. Okafor",
    priority: "Critical",
    status: "Escalated",
    createdAt: "2026-04-25",
    attachments: ["temperature-log.csv"],
    timeline: [
      { id: "t1", type: "created", message: "Incident reported", author: "J. Okafor", at: "2026-04-25 06:48" },
      { id: "t2", type: "escalated", message: "Escalated to QA Director", author: "Compliance", at: "2026-04-25 07:30" },
    ],
  },
  {
    id: "i-3003",
    reference: "INC-3003",
    title: "Forklift near-miss incident",
    description: "Operator reported a near-miss involving a pedestrian in zone B. No injuries.",
    facility: "Warehouse 12",
    reportedBy: "K. Tanaka",
    priority: "Medium",
    status: "Open",
    createdAt: "2026-04-27",
    attachments: [],
    timeline: [
      { id: "t1", type: "created", message: "Incident reported", author: "K. Tanaka", at: "2026-04-27 14:22" },
    ],
  },
  {
    id: "i-3004",
    reference: "INC-3004",
    title: "Effluent pH out of spec",
    description: "Outlet pH dropped to 5.2 for 8 minutes. Neutralization restored within tolerance.",
    facility: "Refinery South",
    reportedBy: "S. Martinez",
    priority: "High",
    status: "Resolved",
    createdAt: "2026-04-21",
    attachments: ["lab-results.pdf"],
    timeline: [
      { id: "t1", type: "created", message: "Incident reported", author: "S. Martinez", at: "2026-04-21 11:02" },
      { id: "t2", type: "status", message: "Marked as Resolved", author: "S. Martinez", at: "2026-04-22 09:10" },
    ],
  },
  {
    id: "i-3005",
    reference: "INC-3005",
    title: "Loading dock door malfunction",
    description: "Dock door 4 stuck in open position. Security and weather exposure mitigated.",
    facility: "Hamburg DC-04",
    reportedBy: "M. Lindqvist",
    priority: "Low",
    status: "Open",
    createdAt: "2026-04-28",
    attachments: [],
    timeline: [
      { id: "t1", type: "created", message: "Incident reported", author: "M. Lindqvist", at: "2026-04-28 08:30" },
    ],
  },
];

const STORAGE_KEY = "360crd.incidents";

function read(): Incident[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as Incident[];
  } catch {
    return seed;
  }
}

let state: Incident[] = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function nextRef(): string {
  const max = state.reduce((acc, i) => {
    const n = parseInt(i.reference.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 3000);
  return `INC-${max + 1}`;
}

function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const incidentStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  addIncident: (
    input: Omit<Incident, "id" | "reference" | "createdAt" | "status" | "timeline">,
  ) => {
    const incident: Incident = {
      id: `i-${Date.now()}`,
      reference: nextRef(),
      createdAt: new Date().toISOString().slice(0, 10),
      status: "Open",
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: "created",
          message: "Incident reported",
          author: input.reportedBy,
          at: nowStamp(),
        },
      ],
      ...input,
    };
    state = [incident, ...state];
    emit();
    return incident;
  },
  updateIncidentStatus: (id: string, status: IncidentStatus, author = "Operations") => {
    state = state.map((i) =>
      i.id === id
        ? {
            ...i,
            status,
            timeline: [
              ...i.timeline,
              {
                id: `t-${Date.now()}`,
                type: status === "Escalated" ? "escalated" : "status",
                message:
                  status === "Resolved"
                    ? "Marked as Resolved"
                    : status === "Escalated"
                      ? "Escalated to senior management"
                      : `Status changed to ${status}`,
                author,
                at: nowStamp(),
              },
            ],
          }
        : i,
    );
    emit();
  },
  updateIncident: (id: string, patch: Partial<Incident>) => {
    state = state.map((i) => (i.id === id ? { ...i, ...patch } : i));
    emit();
  },
  removeIncident: (id: string) => {
    state = state.filter((i) => i.id !== id);
    emit();
  },
  getIncidentById: (id: string): Incident | undefined => state.find((i) => i.id === id),
};

export type IncidentFilters = {
  search: string;
  status: "All" | IncidentStatus;
  priority: "All" | IncidentPriority;
  from: string;
  to: string;
};

export function filterIncidents(items: Incident[], f: IncidentFilters): Incident[] {
  return items.filter((i) => {
    if (f.status !== "All" && i.status !== f.status) return false;
    if (f.priority !== "All" && i.priority !== f.priority) return false;
    if (f.from && i.createdAt < f.from) return false;
    if (f.to && i.createdAt > f.to) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      if (
        !i.title.toLowerCase().includes(q) &&
        !i.reference.toLowerCase().includes(q) &&
        !i.facility.toLowerCase().includes(q) &&
        !i.reportedBy.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function useIncidents() {
  return useSyncExternalStore(incidentStore.subscribe, incidentStore.getState, () => seed);
}

export const statusTone: Record<IncidentStatus, "warning" | "info" | "success" | "danger"> = {
  Open: "warning",
  "In Progress": "info",
  Resolved: "success",
  Escalated: "danger",
};

export const priorityTone: Record<IncidentPriority, "neutral" | "info" | "warning" | "danger"> = {
  Low: "neutral",
  Medium: "info",
  High: "warning",
  Critical: "danger",
};
