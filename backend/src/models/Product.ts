import { Schema, model, Types } from 'mongoose';

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  categoryId: { type: Types.ObjectId, ref: 'Category', required: true, index: true },
}, { timestamps: true });

// text search across title + description
productSchema.index({ title: 'text', description: 'text' });
// helpful for sorting/filtering
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

export const Product = model('Product', productSchema);
