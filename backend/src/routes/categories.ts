import { Router, Request, Response } from "express";
import { Category } from "../models/Category";
import { asyncHandler } from "../utils/asyncHandler";
import { validateBody } from "../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

const router = Router();

// list all
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  })
);

// create
router.post(
  "/",
  validateBody(createCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body as { name: string };
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(409).json({ error: "Category already exists" });
    const cat = await Category.create({ name: name.trim(), slug });
    res.status(201).json(cat);
  })
);

// update by id
router.put(
  "/:id",
  validateBody(updateCategorySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body as { name: string };
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), slug },
      { new: true }
    );
    res.json(updated);
  })
);

// delete by id
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  })
);

export default router;
