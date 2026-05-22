import { create } from "zustand";
import { toast } from "sonner";
import { auditService, type Audit, type ListAuditsParams, type CreateAuditPayload } from "@/lib/api/services/audit.service";
import type { ApiError } from "@/lib/types/api.types";
import { toApiError } from "./_helpers";

export type { Audit } from "@/lib/api/services/audit.service";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type AuditState = {
  audits: Audit[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ApiError | null;
  initialized: boolean;
  params: ListAuditsParams;
  fetchAudits: (params?: ListAuditsParams) => Promise<void>;
  createAudit: (payload: CreateAuditPayload) => Promise<Audit>;
  updateAudit: (id: string, payload: Partial<CreateAuditPayload>) => Promise<void>;
  removeAudit: (id: string) => Promise<void>;
  setParams: (params: Partial<ListAuditsParams>) => void;
};

export const useAuditStore = create<AuditState>((set, get) => ({
  audits: [],
  meta: null,
  loading: false,
  error: null,
  initialized: false,
  params: { page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" },

  setParams: (params) => {
    set((s) => ({ params: { ...s.params, ...params } }));
  },

  fetchAudits: async (params) => {
    const merged = { ...get().params, ...params };
    set({ loading: true, error: null, params: merged });
    try {
      const res = await auditService.list(merged);
      set({ audits: res.data, meta: res.meta, loading: false, initialized: true });
    } catch (e) {
      const err = toApiError(e);
      set({ loading: false, error: err });
      toast.error("Failed to load audits");
    }
  },

  createAudit: async (payload) => {
    try {
      const created = await auditService.create(payload);
      toast.success(`Audit ${created.refNumber} created`);
      await get().fetchAudits();
      return created;
    } catch (e) {
      const err = toApiError(e);
      set({ error: err });
      toast.error(err.message);
      throw err;
    }
  },

  updateAudit: async (id, payload) => {
    try {
      await auditService.update(id, payload);
      toast.success("Audit updated");
      await get().fetchAudits();
    } catch (e) {
      const err = toApiError(e);
      toast.error(err.message);
      set({ error: err });
    }
  },

  removeAudit: async (id) => {
    try {
      await auditService.remove(id);
      set((s) => ({ audits: s.audits.filter((a) => a.id !== id) }));
      toast("Audit removed");
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },
}));
