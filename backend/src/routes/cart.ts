import { Router } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { upsertCartItemSchema } from '../schemas/cart.schema';
import { validateBody } from '../middlewares/validate';

const router = Router();

async function getCart(userId: string) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

router.get('/:userId', asyncHandler(async (req, res) => {
  const cart = await getCart(req.params.userId);
  const productIds = cart.items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }, { title: 1, price: 1, imageUrl: 1 });
  const items = cart.items.map(i => ({
    product: products.find(p => p._id.equals(i.productId)),
    quantity: i.quantity
  }));
  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  res.json({ items, total });
}));

router.post('/:userId', validateBody(upsertCartItemSchema), asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body as { productId: string; quantity: number };
  const cart = await getCart(req.params.userId);

  const idx = cart.items.findIndex(i => String(i.productId) === productId);
  if (idx >= 0) {
    cart.items[idx].quantity += quantity;
    if (cart.items[idx].quantity <= 0) cart.items.splice(idx, 1);
  } else if (quantity > 0) {
    cart.items.push({ productId, quantity } as any);
  }
  await cart.save();
  res.status(200).json(cart);
}));

router.put('/:userId/:productId', validateBody(upsertCartItemSchema.pick({ quantity: true })), asyncHandler(async (req, res) => {
  const { quantity } = req.body as { quantity: number };
  const { userId, productId } = req.params;
  const cart = await getCart(userId);
  const idx = cart.items.findIndex(i => String(i.productId) === productId);
  if (idx < 0 && quantity > 0) cart.items.push({ productId, quantity } as any);
  else if (idx >= 0) {
    if (quantity <= 0) cart.items.splice(idx, 1);
    else cart.items[idx].quantity = quantity;
  }
  await cart.save();
  res.json(cart);
}));

router.delete('/:userId/:productId', asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const cart = await getCart(userId);
  cart.items = cart.items.filter(i => String(i.productId) !== productId);
  await cart.save();
  res.json(cart);
}));

export default router;
