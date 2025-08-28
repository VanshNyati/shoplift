import 'dotenv/config';

export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  MONGODB_URI: process.env.MONGODB_URI ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};

if (!ENV.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI is not set. Create a .env file.');
}
