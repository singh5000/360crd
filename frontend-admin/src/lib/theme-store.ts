import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "sentinel.theme";

function read(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  return saved === "light" || saved === "dark" ? saved : "dark";
}

let theme: Theme = read();
const listeners = new Set<() => void>();

function apply(t: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  root.classList.toggle("light", t === "light");
  root.style.colorScheme = t;
}

if (typeof document !== "undefined") apply(theme);

export const themeStore = {
  getState: () => theme,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  set: (t: Theme) => {
    theme = t;
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, t);
    apply(t);
    listeners.forEach((l) => l());
  },
  toggle: () => themeStore.set(theme === "dark" ? "light" : "dark"),
};

export function useTheme() {
  return useSyncExternalStore(themeStore.subscribe, themeStore.getState, () => "dark" as Theme);
}
