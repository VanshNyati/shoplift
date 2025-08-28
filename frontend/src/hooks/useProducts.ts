"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useFilterStore } from "@/stores/useFilterStore";
import type { Product, Paged } from "@/types/api";

export function useProducts() {
  const { search, categoryId, page, limit, sort, order } = useFilterStore();
  return useQuery({
    queryKey: ["products", { search, categoryId, page, limit, sort, order }],
    queryFn: async (): Promise<Paged<Product>> => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryId) params.set("category", categoryId);
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sort", sort);
      params.set("order", order);
      const { data } = await api.get(`/api/products?${params.toString()}`);
      return data;
    },
    keepPreviousData: true,
  });
}
