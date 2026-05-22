import { useSyncExternalStore } from "react";

export type FacilityType = "Office" | "Plant" | "Warehouse";
export type FacilityStatus = "Active" | "Under Maintenance";
export type MaintenanceStatus = "Completed" | "Pending";

export type MaintenanceLogEntry = {
  id: string;
  date: string;
  description: string;
  status: MaintenanceStatus;
};

export type Facility = {
  id: string;
  reference: string;
  name: string;
  type: FacilityType;
  location: string;
  manager: string;
  status: FacilityStatus;
  notes: string;
  createdAt: string;
  lastMaintenance: string;
  logs: MaintenanceLogEntry[];
};

export const FACILITY_TYPES: FacilityType[] = ["Office", "Plant", "Warehouse"];
export const FACILITY_STATUSES: FacilityStatus[] = ["Active", "Under Maintenance"];

export const MANAGERS = [
  "M. Lindqvist",
  "P. Raman",
  "J. Okafor",
  "S. Martinez",
  "K. Tanaka",
  "E. Rodriguez",
] as const;

const seed: Facility[] = [
  {
    id: "f-4001",
    reference: "FAC-4001",
    name: "Hamburg Distribution Center",
    type: "Warehouse",
    location: "Hamburg, Germany",
    manager: "M. Lindqvist",
    status: "Active",
    notes: "Primary EU distribution hub. Cold-chain certified.",
    createdAt: "2024-08-12",
    lastMaintenance: "2026-04-10",
    logs: [
      { id: "ml1", date: "2026-04-10", description: "Quarterly HVAC inspection", status: "Completed" },
      { id: "ml2", date: "2026-02-22", description: "Loading dock door servicing", status: "Completed" },
    ],
  },
  {
    id: "f-4002",
    reference: "FAC-4002",
    name: "Plant 7",
    type: "Plant",
    location: "Lyon, France",
    manager: "P. Raman",
    status: "Under Maintenance",
    notes: "Packaging line 3 currently offline pending sensor replacement.",
    createdAt: "2023-03-04",
    lastMaintenance: "2026-04-26",
    logs: [
      { id: "ml1", date: "2026-04-26", description: "Sensor fault on line 3", status: "Pending" },
      { id: "ml2", date: "2026-03-15", description: "Annual safety interlock audit", status: "Completed" },
    ],
  },
  {
    id: "f-4003",
    reference: "FAC-4003",
    name: "Boston Lab",
    type: "Office",
    location: "Boston, USA",
    manager: "J. Okafor",
    status: "Active",
    notes: "R&D site with class 10,000 cleanroom.",
    createdAt: "2022-11-30",
    lastMaintenance: "2026-03-28",
    logs: [
      { id: "ml1", date: "2026-03-28", description: "Cleanroom HEPA filter change", status: "Completed" },
    ],
  },
  {
    id: "f-4004",
    reference: "FAC-4004",
    name: "Refinery South",
    type: "Plant",
    location: "Houston, USA",
    manager: "S. Martinez",
    status: "Active",
    notes: "Effluent system upgraded Q1 2026.",
    createdAt: "2021-06-18",
    lastMaintenance: "2026-04-02",
    logs: [
      { id: "ml1", date: "2026-04-02", description: "pH neutralization tank service", status: "Completed" },
    ],
  },
  {
    id: "f-4005",
    reference: "FAC-4005",
    name: "Warehouse 12",
    type: "Warehouse",
    location: "Rotterdam, Netherlands",
    manager: "K. Tanaka",
    status: "Active",
    notes: "Automated racking, 24/7 operations.",
    createdAt: "2024-01-09",
    lastMaintenance: "2026-03-19",
    logs: [
      { id: "ml1", date: "2026-03-19", description: "Forklift fleet inspection", status: "Completed" },
    ],
  },
  {
    id: "f-4006",
    reference: "FAC-4006",
    name: "Helsinki HQ",
    type: "Office",
    location: "Helsinki, Finland",
    manager: "E. Rodriguez",
    status: "Active",
    notes: "Global headquarters.",
    createdAt: "2020-02-01",
    lastMaintenance: "2026-01-15",
    logs: [
      { id: "ml1", date: "2026-01-15", description: "Building fire-alarm test", status: "Completed" },
    ],
  },
];

const STORAGE_KEY = "360crd.facilities";

function read(): Facility[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as Facility[];
  } catch {
    return seed;
  }
}

let state: Facility[] = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function nextRef(): string {
  const max = state.reduce((acc, f) => {
    const n = parseInt(f.reference.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 4000);
  return `FAC-${max + 1}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const facilityStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  addFacility: (
    input: Omit<Facility, "id" | "reference" | "createdAt" | "lastMaintenance" | "logs">,
  ) => {
    const facility: Facility = {
      id: `f-${Date.now()}`,
      reference: nextRef(),
      createdAt: today(),
      lastMaintenance: "—",
      logs: [],
      ...input,
    };
    state = [facility, ...state];
    emit();
    return facility;
  },
  updateFacility: (id: string, patch: Partial<Facility>) => {
    state = state.map((f) => (f.id === id ? { ...f, ...patch } : f));
    emit();
  },
  addMaintenanceLog: (
    id: string,
    log: Omit<MaintenanceLogEntry, "id">,
  ) => {
    state = state.map((f) =>
      f.id === id
        ? {
            ...f,
            lastMaintenance: log.date,
            status: log.status === "Pending" ? "Under Maintenance" : f.status,
            logs: [{ id: `ml-${Date.now()}`, ...log }, ...f.logs],
          }
        : f,
    );
    emit();
  },
  removeFacility: (id: string) => {
    state = state.filter((f) => f.id !== id);
    emit();
  },
  getFacilityById: (id: string): Facility | undefined => state.find((f) => f.id === id),
};

export type FacilityFilters = {
  search: string;
  type: "All" | FacilityType;
  status: "All" | FacilityStatus;
};

export function filterFacilities(items: Facility[], f: FacilityFilters): Facility[] {
  return items.filter((x) => {
    if (f.type !== "All" && x.type !== f.type) return false;
    if (f.status !== "All" && x.status !== f.status) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      if (
        !x.name.toLowerCase().includes(q) &&
        !x.reference.toLowerCase().includes(q) &&
        !x.location.toLowerCase().includes(q) &&
        !x.manager.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function useFacilities() {
  return useSyncExternalStore(facilityStore.subscribe, facilityStore.getState, () => seed);
}

export const facilityStatusTone: Record<FacilityStatus, "success" | "warning"> = {
  Active: "success",
  "Under Maintenance": "warning",
};

export const facilityTypeTone: Record<FacilityType, "info" | "neutral" | "warning"> = {
  Office: "info",
  Plant: "warning",
  Warehouse: "neutral",
};

export const maintenanceTone: Record<MaintenanceStatus, "success" | "warning"> = {
  Completed: "success",
  Pending: "warning",
};
