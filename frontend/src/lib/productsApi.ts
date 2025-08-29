// simple wrappers around your existing REST API
import { api } from '@/lib/api';
import type { Product } from '@/types/api';

export type UpsertProductDto = {
  title: string;
  price: number;
  description: string;
  categoryId: string;
  imageUrl: string;
};

export const productsApi = {
  list: async (params?: { page?: number; limit?: number }) =>
    (await api.get('/api/products', { params })).data as {
      data: Product[]; page: number; pages: number; total: number;
    },

  get: async (id: string) => (await api.get(`/api/products/${id}`)).data as Product,

  create: async (b: UpsertProductDto) => (await api.post('/api/products', b)).data as Product,

  update: async (id: string, b: UpsertProductDto) =>
    (await api.put(`/api/products/${id}`, b)).data as Product,

  remove: async (id: string) => (await api.delete(`/api/products/${id}`)).data as { ok: true },
};
