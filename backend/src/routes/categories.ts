import { Router } from 'express';
import { Category } from '../models/Category';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middlewares/validate';
import { categoryCreateSchema, categoryUpdateSchema } from '../schemas/category.schema';
import { Types } from 'mongoose';

const router = Router();
const isId = (id: string) => Types.ObjectId.isValid(id);

router.get('/', asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
}));

router.post('/', validateBody(categoryCreateSchema), asyncHandler(async (req, res) => {
  const exists = await Category.findOne({ slug: req.body.slug });
  if (exists) return res.status(409).json({ error: 'Slug already exists' });
  const created = await Category.create(req.body);
  res.status(201).json(created);
}));

router.put('/:id', validateBody(categoryUpdateSchema), asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Category not found' });
  res.json({ ok: true });
}));

export default router;
