import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  price: z.number().min(0),
  imageUrl: z.string().url(),
  categoryId: z.string().min(1),
});

export const updateProductSchema = createProductSchema.partial();
