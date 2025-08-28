"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Cart } from "@/types/api";

const USER_ID = "demo-user"; // mock user

export function useCart() {
  const qc = useQueryClient();
  const key = ["cart", USER_ID];

  const cart = useQuery({
    queryKey: key,
    queryFn: async (): Promise<Cart> => (await api.get(`/api/cart/${USER_ID}`)).data,
  });

  const add = useMutation({
    mutationFn: async (payload: { productId: string; quantity: number }) =>
      (await api.post(`/api/cart/${USER_ID}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const setQty = useMutation({
    mutationFn: async (p: { productId: string; quantity: number }) =>
      (await api.put(`/api/cart/${USER_ID}/${p.productId}`, { quantity: p.quantity })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: async (productId: string) =>
      (await api.delete(`/api/cart/${USER_ID}/${productId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { cart, add, setQty, remove };
}
