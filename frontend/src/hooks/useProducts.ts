"use client";
import {
  useQuery,
  keepPreviousData,           // ✅ import this helper in v5
  type UseQueryResult,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useFilterStore } from "@/stores/useFilterStore";
import type { Product, Paged } from "@/type/api";

export function useProducts(): UseQueryResult<Paged<Product>, Error> {
  const { search, categoryId, page, limit, sort, order } = useFilterStore();

  return useQuery<Paged<Product>, Error, Paged<Product>>({
    queryKey: ["products", { search, categoryId, page, limit, sort, order }] as const,
    queryFn: async (): Promise<Paged<Product>> => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryId) params.set("category", categoryId);
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sort", sort);
      params.set("order", order);

      const { data } = await api.get<Paged<Product>>(
        `/api/products?${params.toString()}`
      );
      return data;
    },
    placeholderData: keepPreviousData,  // ✅ v5 replacement
    // optional polish:
    // staleTime: 30_000,
  });
}
