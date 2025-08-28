import { Router } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middlewares/validate';
import { cartAddSchema, cartQtySchema } from '../schemas/cart.schema';
import { Types } from 'mongoose';

const router = Router();
const isId = (id: string) => Types.ObjectId.isValid(id);

router.get('/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  const productIds = cart.items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds } })
    .select('_id title price imageUrl')
    .lean();

  const items = cart.items.map(i => {
    const p = products.find(pp => String(pp._id) === String(i.productId));
    // if product was deleted, skip that line item
    if (!p) return null;
    return { product: p, quantity: i.quantity };
  }).filter(Boolean) as { product: any; quantity: number }[];

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  res.json({ items, total });
}));

router.post('/:userId', validateBody(cartAddSchema), asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (!isId(productId)) return res.status(400).json({ error: 'Invalid product id' });

  // ensure product exists
  const exists = await Product.exists({ _id: new Types.ObjectId(productId) });
  if (!exists) return res.status(404).json({ error: 'Product not found' });

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  const idx = cart.items.findIndex(i => String(i.productId) === productId);
  if (idx === -1) cart.items.push({ productId: new Types.ObjectId(productId), quantity });
  else cart.items[idx].quantity += quantity;

  await cart.save();
  res.json({ ok: true });
}));

router.put('/:userId/:productId', validateBody(cartQtySchema), asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!isId(productId)) return res.status(400).json({ error: 'Invalid product id' });

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  const idx = cart.items.findIndex(i => String(i.productId) === productId);
  if (idx === -1) return res.status(404).json({ error: 'Item not in cart' });

  if (quantity <= 0) cart.items.splice(idx, 1);
  else cart.items[idx].quantity = quantity;

  await cart.save();
  res.json({ ok: true });
}));

router.delete('/:userId/:productId', asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  if (!isId(productId)) return res.status(400).json({ error: 'Invalid product id' });

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.json({ ok: true });

  cart.items = cart.items.filter(i => String(i.productId) !== productId);
  await cart.save();
  res.json({ ok: true });
}));

export default router;
