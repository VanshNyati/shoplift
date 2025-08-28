import { z } from 'zod';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const cartAddSchema = z.object({
  productId: objectId,
  quantity: z.number().int().min(1).max(99),
});

export const cartQtySchema = z.object({
  quantity: z.number().int().min(0).max(99),
});
