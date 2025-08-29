import { api } from "./api";

export type Category = { _id: string; name: string; slug: string };

export const categoriesApi = {
  list: (): Promise<Category[]> => api.get("/api/categories").then(r => r.data),
  create: (b: { name: string }): Promise<Category> =>
    api.post("/api/categories", b).then(r => r.data),
};
