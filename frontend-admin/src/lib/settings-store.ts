import { useSyncExternalStore } from "react";

export type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
};

export type Preferences = {
  language: "en" | "es" | "fr" | "de" | "pt";
  timezone: string;
};

export type Session = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export type SecurityState = {
  sessions: Session[];
};

export type NotificationPrefs = {
  auditUpdates: boolean;
  incidentAlerts: boolean;
  maintenanceReminders: boolean;
  emailNotifications: boolean;
};

export type SettingsState = {
  userProfile: UserProfile;
  preferences: Preferences;
  security: SecurityState;
  notifications: NotificationPrefs;
};

const STORAGE_KEY = "sentinel.settings";

const DEFAULT: SettingsState = {
  userProfile: {
    fullName: "Alex Morgan",
    email: "alex.morgan@360crd.io",
    phone: "+1 (555) 240-9981",
    avatarUrl: null,
  },
  preferences: {
    language: "en",
    timezone: "Europe/Madrid",
  },
  security: {
    sessions: [
      { id: "s1", device: "MacBook Pro · Chrome", location: "Madrid, ES", lastActive: "Just now", current: true },
      { id: "s2", device: "iPhone 15 · Safari", location: "Madrid, ES", lastActive: "2h ago", current: false },
      { id: "s3", device: "Windows · Edge", location: "Lisbon, PT", lastActive: "Yesterday", current: false },
    ],
  },
  notifications: {
    auditUpdates: true,
    incidentAlerts: true,
    maintenanceReminders: false,
    emailNotifications: true,
  },
};

function read(): SettingsState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...(JSON.parse(raw) as SettingsState) };
  } catch {
    return DEFAULT;
  }
}

let state: SettingsState = read();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

export const settingsStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  updateProfile: (patch: Partial<UserProfile>) => {
    state = { ...state, userProfile: { ...state.userProfile, ...patch } };
    emit();
  },
  updatePreferences: (patch: Partial<Preferences>) => {
    state = { ...state, preferences: { ...state.preferences, ...patch } };
    emit();
  },
  updateNotifications: (patch: Partial<NotificationPrefs>) => {
    state = { ...state, notifications: { ...state.notifications, ...patch } };
    emit();
  },
  revokeSession: (id: string) => {
    state = {
      ...state,
      security: { ...state.security, sessions: state.security.sessions.filter((s) => s.id !== id) },
    };
    emit();
  },
  logoutAllSessions: () => {
    state = {
      ...state,
      security: { ...state.security, sessions: state.security.sessions.filter((s) => s.current) },
    };
    emit();
  },
};

export function useSettings() {
  return useSyncExternalStore(settingsStore.subscribe, settingsStore.getState, () => DEFAULT);
}
