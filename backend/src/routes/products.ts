import { Router } from 'express';
import { Product } from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { validateBody } from '../middlewares/validate';
import { Types } from 'mongoose';

const router = Router();
const isId = (id: string) => Types.ObjectId.isValid(id);

router.get('/', asyncHandler(async (req, res) => {
  const {
    search = '',
    category = '',
    page = '1',
    limit = '12',
    sort = 'createdAt',
    order = 'desc'
  } = req.query as Record<string, string>;

  const query: any = {};
  if (search) query.$text = { $search: search };
  if (category && isId(category)) query.categoryId = new Types.ObjectId(category);

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 12, 1), 100);

  const sortKey = ['price', 'createdAt', 'title'].includes(sort) ? sort : 'createdAt';
  const sortDir = order === 'asc' ? 1 : -1;
  const sortObj: Record<string, 1 | -1> = { [sortKey]: sortDir };

  const [data, total] = await Promise.all([
    Product.find(query)
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    data,
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  res.json(prod);
}));

router.post('/', validateBody(createProductSchema), asyncHandler(async (req, res) => {
  const created = await Product.create(req.body);
  res.status(201).json(created);
}));

router.put('/:id', validateBody(updateProductSchema), asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ ok: true });
}));

export default router;
