"use client";
import { Product } from "@/types/api";
import { inr } from "@/lib/format";
import { useUIStore } from "@/stores/useUIStore";
import { useCart } from "@/hooks/useCart";

export default function ProductCard({ p }: { p: Product }) {
  const { openProduct } = useUIStore();
  const { add } = useCart();

  return (
    <div className="rounded-2xl border p-3 flex flex-col">
      <img src={p.imageUrl} alt={p.title} className="h-40 w-full object-cover rounded-xl" />
      <div className="mt-3 font-medium">{p.title}</div>
      <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
      <div className="mt-2 font-semibold">{inr.format(p.price)}</div>
      <div className="mt-auto flex gap-2 pt-3">
        <button className="flex-1 rounded-md border px-3 py-1.5" onClick={() => openProduct(p._id)}>
          Details
        </button>
        <button
          className="flex-1 rounded-md bg-black text-white px-3 py-1.5"
          onClick={() => add.mutate({ productId: p._id, quantity: 1 })}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
