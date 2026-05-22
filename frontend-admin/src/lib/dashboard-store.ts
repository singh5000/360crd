import { useSyncExternalStore } from "react";

export type Trend = "up" | "down" | "flat";

export type KpiMetric = {
  id: "audits" | "incidents" | "facilities" | "actions";
  label: string;
  value: number;
  delta: number; // percent
  trend: Trend;
  hint: string;
  spark: number[];
};

export type ActivityLog = {
  id: string;
  title: string;
  meta: string;
  time: string;
  tone: "success" | "warning" | "info" | "danger";
};

export type AuditTrendPoint = { date: string; completed: number; scheduled: number };
export type IncidentBreakdown = { name: "Open" | "In Progress" | "Resolved" | "Escalated"; value: number };
export type FacilityStatusSlice = { name: "Active" | "Maintenance"; value: number };

type State = {
  metrics: KpiMetric[];
  auditTrend: AuditTrendPoint[];
  incidentBreakdown: IncidentBreakdown[];
  facilityStatus: FacilityStatusSlice[];
  activityLogs: ActivityLog[];
};

const seedSpark = (base: number) =>
  Array.from({ length: 12 }, (_, i) =>
    Math.max(1, Math.round(base + Math.sin(i / 1.7) * (base * 0.12) + (Math.random() - 0.5) * (base * 0.08))),
  );

const days = ["Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26", "Apr 27", "Apr 28", "Apr 29", "Apr 30", "May 01", "May 02"];

let state: State = {
  metrics: [
    { id: "audits", label: "Total Audits", value: 1284, delta: 12.4, trend: "up", hint: "vs. last quarter", spark: seedSpark(40) },
    { id: "incidents", label: "Open Incidents", value: 37, delta: -8.1, trend: "down", hint: "9 high severity", spark: seedSpark(20) },
    { id: "facilities", label: "Active Facilities", value: 62, delta: 3, trend: "up", hint: "across 14 regions", spark: seedSpark(28) },
    { id: "actions", label: "Pending Actions", value: 148, delta: 5.2, trend: "up", hint: "23 overdue", spark: seedSpark(34) },
  ],
  auditTrend: days.map((d, i) => ({
    date: d,
    completed: 18 + Math.round(Math.sin(i / 1.5) * 6 + Math.random() * 5),
    scheduled: 10 + Math.round(Math.cos(i / 1.8) * 4 + Math.random() * 4),
  })),
  incidentBreakdown: [
    { name: "Open", value: 14 },
    { name: "In Progress", value: 11 },
    { name: "Resolved", value: 28 },
    { name: "Escalated", value: 5 },
  ],
  facilityStatus: [
    { name: "Active", value: 54 },
    { name: "Maintenance", value: 8 },
  ],
  activityLogs: [
    { id: "l1", title: "Audit AUD-2049 completed", meta: "Hamburg DC-04 · M. Lindqvist", time: "just now", tone: "success" },
    { id: "l2", title: "Incident INC-118 escalated", meta: "Plant 7 · Acme Manufacturing", time: "2m ago", tone: "danger" },
    { id: "l3", title: "Facility maintenance logged", meta: "Refinery South · Vantage Energy", time: "8m ago", tone: "warning" },
    { id: "l4", title: "New facility onboarded", meta: "Boston Lab · Helix Biotech", time: "21m ago", tone: "info" },
  ],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

const SAMPLE_EVENTS: Omit<ActivityLog, "id" | "time">[] = [
  { title: "Audit AUD-2071 completed", meta: "Warehouse 12 · K. Tanaka", tone: "success" },
  { title: "Incident INC-204 reported", meta: "Plant 3 · Northwind", tone: "danger" },
  { title: "Maintenance log added", meta: "Boston Lab · Helix Biotech", tone: "warning" },
  { title: "Auditor invited", meta: "P. Raman · Senior Inspector", tone: "info" },
  { title: "Corrective action submitted", meta: "Refinery South · Vantage", tone: "warning" },
  { title: "Audit AUD-2073 closed", meta: "Hamburg DC-04 · M. Lindqvist", tone: "success" },
];

let started = false;
let timer: ReturnType<typeof setInterval> | null = null;

export const dashboardStore = {
  subscribe,
  getSnapshot,
  start() {
    if (started) return;
    started = true;
    timer = setInterval(() => {
      const newLog: ActivityLog = {
        ...SAMPLE_EVENTS[Math.floor(Math.random() * SAMPLE_EVENTS.length)],
        id: `l-${Date.now()}`,
        time: "just now",
      };
      const bumped = state.activityLogs.map((l, i) => ({ ...l, time: i === 0 ? "30s ago" : l.time }));
      state = {
        ...state,
        metrics: state.metrics.map((m) => {
          const drift = Math.round((Math.random() - 0.45) * 2);
          const next = Math.max(0, m.value + drift);
          return { ...m, value: next, spark: [...m.spark.slice(1), Math.max(1, next * 0.05 + Math.random() * 4)] };
        }),
        incidentBreakdown: state.incidentBreakdown.map((b) => ({
          ...b,
          value: Math.max(0, b.value + Math.round((Math.random() - 0.5) * 2)),
        })),
        activityLogs: [newLog, ...bumped].slice(0, 8),
      };
      emit();
    }, 4000);
  },
  stop() {
    started = false;
    if (timer) clearInterval(timer);
    timer = null;
  },
};

export function useDashboard() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
