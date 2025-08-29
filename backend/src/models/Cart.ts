import { Schema, model, Types, Document } from 'mongoose';

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface CartDoc extends Document {
  userId: string;        // or ObjectId if you want
  items: CartItem[];     // <-- plain array in TS, not DocumentArray
}

const cartItemSchema = new Schema<CartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const cartSchema = new Schema<CartDoc>(
  {
    userId: { type: String, required: true, index: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Cart = model<CartDoc>('Cart', cartSchema);
