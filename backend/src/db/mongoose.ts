import mongoose from 'mongoose';
import { ENV } from '../env';

export async function connectDB() {
  if (!ENV.MONGODB_URI) throw new Error('MONGODB_URI missing');
  await mongoose.connect(ENV.MONGODB_URI, {
    // If you didn't append /dbname in the URI, you could use: dbName: 'shoplift'
  } as any);
  console.log('✅ MongoDB connected');
}
