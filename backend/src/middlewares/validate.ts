import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }
    req.body = parsed.data;
    next();
  };
