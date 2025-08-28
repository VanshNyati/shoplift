import { create } from "zustand";

type SortKey = "createdAt" | "price" | "title";
type Order = "asc" | "desc";

type FilterState = {
  search: string;
  categoryId?: string;
  page: number;
  limit: number;
  sort: SortKey;
  order: Order;
  setSearch: (s: string) => void;
  setCategory: (id?: string) => void;
  setPage: (p: number) => void;
  setSort: (sort: SortKey, order?: Order) => void;
  reset: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  categoryId: undefined,
  page: 1,
  limit: 12,
  sort: "createdAt",
  order: "desc",
  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (categoryId) => set({ categoryId, page: 1 }),
  setPage: (page) => set({ page }),
  setSort: (sort, order) => set((s) => ({ sort, order: order ?? s.order, page: 1 })),
  reset: () =>
    set({ search: "", categoryId: undefined, page: 1, limit: 12, sort: "createdAt", order: "desc" }),
}));
