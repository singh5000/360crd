import { useSyncExternalStore } from "react";
import type { ActivityAction, ActivityFilters, ActivityLog, ActivityModule } from "./activity.types";
import { auditStore, type Audit } from "./audit-store";
import { incidentStore, type Incident } from "./incident-store";
import { facilityStore, type Facility } from "./facility-store";
import { companyStore, type Company } from "./company-store";
import { userStore, type AppUser } from "./user-store";
import { settingsStore, type SettingsState } from "./settings-store";
import { authStore } from "./auth-store";

const STORAGE_KEY = "360crd.activity";
const MAX_LOGS = 500;

const seedNow = () => new Date().toISOString();

const SEED_LOGS: ActivityLog[] = [
  {
    id: "log-seed-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    user: "Elena Marchetti",
    userEmail: "elena@northwind.io",
    module: "Audits",
    action: "created",
    targetId: "a-2049",
    targetLabel: "AUD-2049",
    companyId: "c-9001",
    companyName: "Northwind Industries",
    summary: "Created audit AUD-2049 — Quarterly compliance — Hamburg DC-04",
    after: { status: "Planned", priority: "Medium" },
    metadata: { ip: "10.42.18.2", device: "MacBook Pro · Chrome" },
  },
  {
    id: "log-seed-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user: "Priya Raman",
    userEmail: "priya@meridian.health",
    module: "Incidents",
    action: "escalated",
    targetId: "i-3002",
    targetLabel: "INC-3002",
    companyId: "c-9003",
    companyName: "Meridian Health Group",
    summary: "Escalated incident INC-3002 — Cold storage temperature excursion",
    before: { status: "In Progress" },
    after: { status: "Escalated" },
    metadata: { ip: "10.42.19.5", device: "iPhone 15 · Safari" },
  },
  {
    id: "log-seed-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    user: "Sara Bennett",
    userEmail: "sara@helios.energy",
    module: "Facilities",
    action: "updated",
    targetId: "f-7001",
    targetLabel: "FAC-7001",
    companyId: "c-9002",
    companyName: "Helios Energy",
    summary: "Updated facility FAC-7001 — capacity revised",
    before: { capacity: 1200 },
    after: { capacity: 1450 },
    metadata: { ip: "10.42.21.9", device: "Windows · Edge" },
  },
  {
    id: "log-seed-4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    user: "Carlos Ruiz",
    userEmail: "carlos@vanta.co",
    module: "Users",
    action: "disabled",
    targetId: "u-10",
    targetLabel: "USR-1010",
    companyId: "c-9004",
    companyName: "Vanta Logistics",
    summary: "Disabled user Carlos Ruiz",
    before: { status: "Active" },
    after: { status: "Disabled" },
    metadata: { ip: "10.42.22.4", device: "MacBook Pro · Safari" },
  },
  {
    id: "log-seed-5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user: "Alex Morgan",
    userEmail: "alex.morgan@360crd.io",
    module: "Settings",
    action: "updated",
    targetId: "settings.notifications",
    targetLabel: "Notification preferences",
    companyId: "c-9001",
    companyName: "Northwind Industries",
    summary: "Updated notification preferences",
    before: { incidentAlerts: false },
    after: { incidentAlerts: true },
    metadata: { ip: "10.42.18.2", device: "MacBook Pro · Chrome" },
  },
];

function read(): ActivityLog[] {
  if (typeof window === "undefined") return SEED_LOGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_LOGS;
    const parsed = JSON.parse(raw) as ActivityLog[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_LOGS;
  } catch {
    return SEED_LOGS;
  }
}

let state: ActivityLog[] = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.slice(0, MAX_LOGS)));
    } catch {
      // ignore quota errors
    }
  }
  listeners.forEach((l) => l());
}

function currentActor(): { user: string; userEmail?: string } {
  const auth = authStore.getState();
  if (auth.user) return { user: auth.user.name, userEmail: auth.user.email };
  return { user: "System" };
}

function currentCompany(): { companyId?: string; companyName?: string } {
  const id = companyStore.getActiveId();
  const c = companyStore.getCompanyById(id);
  return c ? { companyId: c.id, companyName: c.name } : {};
}

function mockMeta() {
  const devices = ["MacBook Pro · Chrome", "iPhone 15 · Safari", "Windows · Edge", "Linux · Firefox"];
  const ip = `10.42.${Math.floor(Math.random() * 30) + 10}.${Math.floor(Math.random() * 250) + 1}`;
  return { ip, device: devices[Math.floor(Math.random() * devices.length)] };
}

let logCounter = 0;

export const activityStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  addLog: (input: Omit<ActivityLog, "id" | "timestamp" | "user" | "userEmail" | "metadata"> & {
    user?: string;
    userEmail?: string;
    metadata?: ActivityLog["metadata"];
    companyId?: string;
    companyName?: string;
  }) => {
    const actor = currentActor();
    const company = input.companyId ? { companyId: input.companyId, companyName: input.companyName } : currentCompany();
    logCounter += 1;
    const log: ActivityLog = {
      id: `log-${Date.now()}-${logCounter}`,
      timestamp: seedNow(),
      user: input.user ?? actor.user,
      userEmail: input.userEmail ?? actor.userEmail,
      metadata: input.metadata ?? mockMeta(),
      ...input,
      ...company,
    };
    state = [log, ...state].slice(0, MAX_LOGS);
    emit();
    return log;
  },
  getById: (id: string) => state.find((l) => l.id === id),
  clear: () => {
    state = [];
    emit();
  },
};

export function filterLogs(logs: ActivityLog[], f: ActivityFilters): ActivityLog[] {
  return logs.filter((l) => {
    if (f.module !== "All" && l.module !== f.module) return false;
    if (f.user !== "All" && l.user !== f.user) return false;
    if (f.companyId !== "All" && l.companyId !== f.companyId) return false;
    if (f.action !== "All" && l.action !== f.action) return false;
    if (f.from && l.timestamp.slice(0, 10) < f.from) return false;
    if (f.to && l.timestamp.slice(0, 10) > f.to) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      const hay = `${l.summary} ${l.targetLabel} ${l.user}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function useActivityLogs() {
  return useSyncExternalStore(activityStore.subscribe, activityStore.getState, () => SEED_LOGS);
}

// ─── Auto-logging bridges ──────────────────────────────────────────────────
// Diff store snapshots and emit logs on change. Runs once on first import.

let bridged = false;

function diffEntity<T extends Record<string, unknown>>(prev: T | undefined, next: T) {
  if (!prev) return { before: null, after: next, kind: "create" as const };
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  Object.keys(next).forEach((k) => {
    if (JSON.stringify((prev as Record<string, unknown>)[k]) !== JSON.stringify(next[k])) {
      before[k] = (prev as Record<string, unknown>)[k];
      after[k] = next[k];
    }
  });
  return { before, after, kind: Object.keys(after).length > 0 ? ("update" as const) : ("noop" as const) };
}

function bridge<TItem extends { id: string }>(
  module: ActivityModule,
  store: { getState: () => TItem[]; subscribe: (l: () => void) => () => void },
  options: {
    label: (item: TItem) => string;
    statusKey?: keyof TItem;
    skipInitial?: boolean;
  },
) {
  let prev = new Map(store.getState().map((i) => [i.id, i] as const));
  store.subscribe(() => {
    const next = new Map(store.getState().map((i) => [i.id, i] as const));
    // additions
    next.forEach((item, id) => {
      if (!prev.has(id)) {
        activityStore.addLog({
          module,
          action: "created",
          targetId: id,
          targetLabel: options.label(item),
          summary: `Created ${module.slice(0, -1).toLowerCase()} ${options.label(item)}`,
          after: item as unknown as Record<string, unknown>,
        });
      } else {
        const p = prev.get(id)!;
        const d = diffEntity(p as unknown as Record<string, unknown>, item as unknown as Record<string, unknown>);
        if (d.kind === "update") {
          const statusChanged = options.statusKey && (p as Record<string, unknown>)[options.statusKey as string] !== (item as Record<string, unknown>)[options.statusKey as string];
          let action: ActivityAction = "updated";
          let summary = `Updated ${module.slice(0, -1).toLowerCase()} ${options.label(item)}`;
          if (statusChanged) {
            const newStatus = String((item as Record<string, unknown>)[options.statusKey as string]);
            if (module === "Incidents" && newStatus === "Escalated") {
              action = "escalated";
              summary = `Escalated incident ${options.label(item)}`;
            } else if (module === "Users" && newStatus === "Disabled") {
              action = "disabled";
              summary = `Disabled user ${options.label(item)}`;
            } else if (module === "Users" && newStatus === "Active") {
              action = "enabled";
              summary = `Enabled user ${options.label(item)}`;
            } else {
              action = "status_changed";
              summary = `Status changed to ${newStatus} on ${options.label(item)}`;
            }
          }
          activityStore.addLog({
            module,
            action,
            targetId: id,
            targetLabel: options.label(item),
            before: d.before,
            after: d.after,
            summary,
          });
        }
      }
    });
    // deletions
    prev.forEach((item, id) => {
      if (!next.has(id)) {
        activityStore.addLog({
          module,
          action: "deleted",
          targetId: id,
          targetLabel: options.label(item),
          before: item as unknown as Record<string, unknown>,
          summary: `Deleted ${module.slice(0, -1).toLowerCase()} ${options.label(item)}`,
        });
      }
    });
    prev = next;
  });
}

export function initActivityBridges() {
  if (bridged || typeof window === "undefined") return;
  bridged = true;

  bridge<Audit>("Audits", auditStore, {
    label: (a) => a.reference,
    statusKey: "status",
  });
  bridge<Incident>("Incidents", incidentStore, {
    label: (i) => i.reference,
    statusKey: "status",
  });
  bridge<Facility>("Facilities", facilityStore, {
    label: (f) => f.reference,
    statusKey: "status" as keyof Facility,
  });
  bridge<Company>("Companies", companyStore, {
    label: (c) => c.name,
    statusKey: "status",
  });
  bridge<AppUser>("Users", userStore, {
    label: (u) => u.name,
    statusKey: "status",
  });

  // Settings bridge
  let prevSettings: SettingsState | undefined = settingsStore.getState();
  settingsStore.subscribe(() => {
    const next = settingsStore.getState();
    if (!prevSettings) {
      prevSettings = next;
      return;
    }
    (Object.keys(next) as (keyof SettingsState)[]).forEach((section) => {
      const before = prevSettings![section] as unknown as Record<string, unknown>;
      const after = next[section] as unknown as Record<string, unknown>;
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        const d = diffEntity(before, after);
        if (d.kind === "update") {
          activityStore.addLog({
            module: "Settings",
            action: "updated",
            targetId: `settings.${String(section)}`,
            targetLabel: `${String(section)} settings`,
            before: d.before,
            after: d.after,
            summary: `Updated ${String(section)} settings`,
          });
        }
      }
    });
    prevSettings = next;
  });

  // Auth bridge
  let prevAuth = authStore.getState().isAuthenticated;
  authStore.subscribe(() => {
    const cur = authStore.getState();
    if (cur.isAuthenticated && !prevAuth && cur.user) {
      activityStore.addLog({
        module: "Auth",
        action: "login",
        targetId: cur.user.email,
        targetLabel: cur.user.name,
        summary: `${cur.user.name} signed in`,
        user: cur.user.name,
        userEmail: cur.user.email,
      });
    } else if (!cur.isAuthenticated && prevAuth) {
      activityStore.addLog({
        module: "Auth",
        action: "logout",
        targetId: "session",
        targetLabel: "Session ended",
        summary: "User signed out",
      });
    }
    prevAuth = cur.isAuthenticated;
  });
}
