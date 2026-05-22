import { useSyncExternalStore } from "react";

export type CompanyStatus = "Active" | "Suspended";
export type CompanyPlan = "Basic" | "Pro" | "Enterprise";
export type CompanyIndustry =
  | "Manufacturing"
  | "Energy"
  | "Healthcare"
  | "Logistics"
  | "Pharmaceutical"
  | "Technology"
  | "Retail";

export type Company = {
  id: string;
  reference: string;
  name: string;
  industry: CompanyIndustry;
  plan: CompanyPlan;
  status: CompanyStatus;
  createdAt: string;
};

export const COMPANY_STATUSES: CompanyStatus[] = ["Active", "Suspended"];
export const COMPANY_PLANS: CompanyPlan[] = ["Basic", "Pro", "Enterprise"];
export const COMPANY_INDUSTRIES: CompanyIndustry[] = [
  "Manufacturing",
  "Energy",
  "Healthcare",
  "Logistics",
  "Pharmaceutical",
  "Technology",
  "Retail",
];

const seed: Company[] = [
  {
    id: "c-9001",
    reference: "CMP-9001",
    name: "Northwind Industries",
    industry: "Manufacturing",
    plan: "Enterprise",
    status: "Active",
    createdAt: "2023-04-12",
  },
  {
    id: "c-9002",
    reference: "CMP-9002",
    name: "Helios Energy",
    industry: "Energy",
    plan: "Pro",
    status: "Active",
    createdAt: "2024-01-23",
  },
  {
    id: "c-9003",
    reference: "CMP-9003",
    name: "Meridian Health Group",
    industry: "Healthcare",
    plan: "Enterprise",
    status: "Active",
    createdAt: "2022-09-08",
  },
  {
    id: "c-9004",
    reference: "CMP-9004",
    name: "Vanta Logistics",
    industry: "Logistics",
    plan: "Pro",
    status: "Suspended",
    createdAt: "2024-06-01",
  },
  {
    id: "c-9005",
    reference: "CMP-9005",
    name: "Aurora Pharma",
    industry: "Pharmaceutical",
    plan: "Enterprise",
    status: "Active",
    createdAt: "2021-11-19",
  },
  {
    id: "c-9006",
    reference: "CMP-9006",
    name: "Lumen Retail",
    industry: "Retail",
    plan: "Basic",
    status: "Active",
    createdAt: "2025-02-14",
  },
];

const STORAGE_KEY = "360crd.companies";
const ACTIVE_KEY = "360crd.activeCompany";

function read(): Company[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as Company[];
  } catch {
    return seed;
  }
}

let state: Company[] = read();
let activeId: string =
  (typeof window !== "undefined" && window.localStorage.getItem(ACTIVE_KEY)) ||
  state[0]?.id ||
  "";

const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.localStorage.setItem(ACTIVE_KEY, activeId);
  }
  listeners.forEach((l) => l());
}

function nextRef(): string {
  const max = state.reduce((acc, c) => {
    const n = parseInt(c.reference.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 9000);
  return `CMP-${max + 1}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const companyStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  addCompany: (input: Omit<Company, "id" | "reference" | "createdAt">) => {
    const company: Company = {
      id: `c-${Date.now()}`,
      reference: nextRef(),
      createdAt: today(),
      ...input,
    };
    state = [company, ...state];
    emit();
    return company;
  },
  updateCompany: (id: string, patch: Partial<Company>) => {
    state = state.map((c) => (c.id === id ? { ...c, ...patch } : c));
    emit();
  },
  getCompanyById: (id: string): Company | undefined => state.find((c) => c.id === id),
  getActiveId: () => activeId,
  setActive: (id: string) => {
    activeId = id;
    emit();
  },
};

const activeListeners = new Set<() => void>();
companyStore.subscribe(() => activeListeners.forEach((l) => l()));

export function useCompanies() {
  return useSyncExternalStore(companyStore.subscribe, companyStore.getState, () => seed);
}

export function useActiveCompanyId() {
  return useSyncExternalStore(
    companyStore.subscribe,
    () => activeId,
    () => seed[0]?.id || "",
  );
}

export const companyStatusTone: Record<CompanyStatus, "success" | "danger"> = {
  Active: "success",
  Suspended: "danger",
};

export const planTone: Record<CompanyPlan, "neutral" | "info" | "warning"> = {
  Basic: "neutral",
  Pro: "info",
  Enterprise: "warning",
};
