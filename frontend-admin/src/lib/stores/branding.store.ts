import { useSyncExternalStore } from "react";
import { http } from "@/lib/api/axios";

export type TenantBranding = {
  tenantName: string;
  appName: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  loginBgUrl: string | null;
  supportEmail: string | null;
  footerText: string | null;
  customCss: string | null;
  locale: string;
  timezone: string;
};

type BrandingState = { data: TenantBranding | null; loaded: boolean };

let _state: BrandingState = { data: null, loaded: false };
const _listeners = new Set<() => void>();
const _notify = () => _listeners.forEach((l) => l());

function applyCssVars(b: TenantBranding) {
  const root = document.documentElement;
  // Override Tailwind's --color-primary / --color-secondary with tenant brand colors
  if (b.primaryColor) root.style.setProperty("--color-primary", b.primaryColor);
  if (b.secondaryColor) root.style.setProperty("--color-secondary", b.secondaryColor);
  if (b.accentColor) root.style.setProperty("--color-accent", b.accentColor);

  // Favicon
  if (b.faviconUrl) {
    const existing = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    const link = existing ?? document.createElement("link");
    if (!existing) { link.rel = "icon"; document.head.appendChild(link); }
    (link as HTMLLinkElement).href = b.faviconUrl;
  }

  // Inject tenant custom CSS (last so it wins over everything)
  if (b.customCss) {
    const existing = document.getElementById("tenant-custom-css");
    const el = existing ?? document.createElement("style");
    if (!existing) { el.id = "tenant-custom-css"; document.head.appendChild(el); }
    el.textContent = b.customCss;
  }
}

export const brandingStore = {
  getState: () => _state,

  subscribe: (l: () => void) => {
    _listeners.add(l);
    return () => _listeners.delete(l);
  },

  async fetch() {
    if (_state.loaded) return;
    try {
      const res = await http.get<{ success: boolean; data: TenantBranding }>("/public/branding");
      _state = { data: res.data.data, loaded: true };
      applyCssVars(res.data.data);
    } catch {
      _state = { data: null, loaded: true };
    }
    _notify();
  },

  // Call after tenant changes (e.g. login to a different org)
  invalidate() {
    _state = { data: null, loaded: false };
    _notify();
  },
};

export function useBranding() {
  return useSyncExternalStore(
    brandingStore.subscribe,
    brandingStore.getState,
    () => ({ data: null, loaded: false } as BrandingState),
  );
}

export function useAppName(fallback = "360CRD") {
  const { data } = useBranding();
  return data?.appName || fallback;
}
