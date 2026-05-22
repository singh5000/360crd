import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TenantContextState {
  selectedTenantId: string | null;
  selectedTenantName: string | null;
  setSelectedTenant: (id: string | null, name: string | null) => void;
  clearSelectedTenant: () => void;
}

export const useTenantContext = create<TenantContextState>()(
  persist(
    (set) => ({
      selectedTenantId: null,
      selectedTenantName: null,
      setSelectedTenant: (id, name) => set({ selectedTenantId: id, selectedTenantName: name }),
      clearSelectedTenant: () => set({ selectedTenantId: null, selectedTenantName: null }),
    }),
    { name: "360crd.tenantContext" },
  ),
);
