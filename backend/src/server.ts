import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV } from './env';
import { connectDB } from './db/mongoose';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import cartRouter from './routes/cart';
import { errorHandler, notFound } from './middlewares/error';

async function main() {
  await connectDB();

  const app = express();
  app.use(cors({
    origin: process.env.FRONTEND_URL ?? "*", // don’t wrap in array
    credentials: true,
  }));

  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/products', productsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/cart', cartRouter);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
