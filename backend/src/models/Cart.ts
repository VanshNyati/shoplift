import { Schema, model, Types } from 'mongoose';

const cartItemSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const cartSchema = new Schema({
  userId: { type: String, required: true, index: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
}, { timestamps: true });

export const Cart = model('Cart', cartSchema);
