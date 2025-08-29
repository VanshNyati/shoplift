// src/components/ProductCard.tsx
"use client";
import { inr } from "@/lib/format";
import { useUIStore } from "@/stores/useUIStore";
import { useCart } from "@/hooks/useCart";
import type { Product, CartItem } from "@/type/api"; // ⬅︎ import CartItem too

export default function ProductCard({ p }: { p: Product }) {
  const { openProduct } = useUIStore();
  const { cart, add, setQty, remove } = useCart();

  // Keep a strongly-typed array so the callback param isn't 'any'
  const items: CartItem[] = cart.data?.items ?? [];
  const line = items.find((i) => i.product._id === p._id);
  const qty = line?.quantity ?? 0;

  return (
    <div className="rounded-2xl border p-3 flex flex-col">
      <div className="relative">
        <img src={p.imageUrl} alt={p.title} className="h-40 w-full object-cover rounded-xl" />
        {qty > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-0.5 text-xs text-white">
            In cart • {qty}
          </span>
        )}
      </div>

      <div className="mt-3 font-medium">{p.title}</div>
      <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
      <div className="mt-2 font-semibold">{inr(p.price)}</div>

      <div className="mt-auto flex gap-2 pt-3">
        <button className="flex-1 rounded-md border px-3 py-1.5" onClick={() => openProduct(p._id)}>
          Details
        </button>

        {qty === 0 ? (
          <button
            className="flex-1 rounded-md bg-black text-white px-3 py-1.5"
            onClick={() => add.mutate({ productId: p._id, quantity: 1 })}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex flex-1 items-center justify-between rounded-md border px-2">
            <button
              className="px-2 py-1"
              onClick={() =>
                qty - 1 <= 0
                  ? remove.mutate(p._id)
                  : setQty.mutate({ productId: p._id, quantity: qty - 1 })
              }
            >
              –
            </button>
            <span className="text-sm">{qty}</span>
            <button
              className="px-2 py-1"
              onClick={() => setQty.mutate({ productId: p._id, quantity: qty + 1 })}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
