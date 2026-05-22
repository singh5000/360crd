import { create } from "zustand";
import { toast } from "sonner";
import { customerService, type Customer, type ListCustomersParams, type CreateCustomerPayload } from "@/lib/api/services/customer.service";
import type { ApiError } from "@/lib/types/api.types";
import { toApiError } from "./_helpers";

export type { Customer } from "@/lib/api/services/customer.service";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type CompanyState = {
  companies: Customer[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ApiError | null;
  initialized: boolean;
  params: ListCustomersParams;
  fetchCompanies: (params?: ListCustomersParams) => Promise<void>;
  createCompany: (payload: CreateCustomerPayload) => Promise<Customer>;
  updateCompany: (id: string, payload: Partial<CreateCustomerPayload>) => Promise<void>;
  removeCompany: (id: string) => Promise<void>;
  setParams: (params: Partial<ListCustomersParams>) => void;
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  meta: null,
  loading: false,
  error: null,
  initialized: false,
  params: { page: 1, limit: 20, sortBy: "name", sortOrder: "asc" },

  setParams: (params) => {
    set((s) => ({ params: { ...s.params, ...params } }));
  },

  fetchCompanies: async (params) => {
    const merged = { ...get().params, ...params };
    set({ loading: true, error: null, params: merged });
    try {
      const res = await customerService.list(merged);
      set({ companies: res.data, meta: res.meta, loading: false, initialized: true });
    } catch (e) {
      const err = toApiError(e);
      set({ loading: false, error: err });
      toast.error("Failed to load customers");
    }
  },

  createCompany: async (payload) => {
    try {
      const created = await customerService.create(payload);
      toast.success(`Customer "${created.name}" added`);
      await get().fetchCompanies();
      return created;
    } catch (e) {
      const err = toApiError(e);
      toast.error(err.message);
      throw err;
    }
  },

  updateCompany: async (id, payload) => {
    try {
      await customerService.update(id, payload);
      toast.success("Customer updated");
      await get().fetchCompanies();
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },

  removeCompany: async (id) => {
    try {
      await customerService.remove(id);
      set((s) => ({ companies: s.companies.filter((c) => c.id !== id) }));
      toast("Customer removed");
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  },
}));
