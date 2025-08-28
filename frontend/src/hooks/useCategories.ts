"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category } from "@/types/api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => (await api.get("/api/categories")).data,
    staleTime: 1000 * 60 * 5,
  });
}
