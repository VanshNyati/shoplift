import { Router } from 'express';
import { Product } from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { validateBody } from '../middlewares/validate';
import { Types } from 'mongoose';

const router = Router();
const isId = (id: string) => Types.ObjectId.isValid(id);

// Utility
const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      search = '',
      category = '',
      page = '1',
      limit = '12',
      sort = 'createdAt',
      order = 'desc',
    } = req.query as Record<string, string>;

    // base filter (category)
    const baseFilter: any = {};
    if (category && isId(category)) {
      baseFilter.categoryId = new Types.ObjectId(category);
    }

    // paging & sorting
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 12, 1), 100);
    const sortKey: 'price' | 'createdAt' | 'title' =
      (['price', 'createdAt', 'title'] as const).includes(sort as any)
        ? (sort as any)
        : 'createdAt';
    const sortDir = order === 'asc' ? 1 : -1;

    const s = search.trim();

    // ---------- PASS 1: text search (if search provided) ----------
    if (s) {
      const textFilter = { ...baseFilter, $text: { $search: s } };
      const projection = { score: { $meta: 'textScore' } };

      const [data, total] = await Promise.all([
        Product.find(textFilter, projection)
          .sort({ score: { $meta: 'textScore' } })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum),
        Product.countDocuments(textFilter),
      ]);

      if (total > 0) {
        return res.json({
          data,
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
          mode: 'text', // optional debug flag
        });
      }
      // else fall through to regex
    }

    // ---------- PASS 2: regex fallback (partial/prefix) ----------
    const regexFilter = s
      ? {
          ...baseFilter,
          $or: [
            { title: { $regex: new RegExp(escapeRegExp(s), 'i') } },
            { description: { $regex: new RegExp(escapeRegExp(s), 'i') } },
          ],
        }
      : baseFilter;

    const [data, total] = await Promise.all([
      Product.find(regexFilter)
        .sort({ [sortKey]: sortDir })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(regexFilter),
    ]);

    res.json({
      data,
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
      mode: s ? 'regex' : 'none', // optional debug flag
    });
  })
);

// GET /api/products/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json(prod);
  })
);

// POST /api/products
router.post(
  '/',
  validateBody(createProductSchema),
  asyncHandler(async (req, res) => {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  })
);

// PUT /api/products/:id
router.put(
  '/:id',
  validateBody(updateProductSchema),
  asyncHandler(async (req, res) => {
    if (!isId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  })
);

// DELETE /api/products/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true });
  })
);

export default router;
