"use client";
import { useUIStore } from "@/stores/useUIStore";
import { useCart } from "@/hooks/useCart";
import { inr } from "@/lib/format";

export default function CartSheet() {
  const { cartOpen, setCartOpen } = useUIStore();
  const { cart, setQty, remove } = useCart();
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setCartOpen(false)}>
      <aside className="w-[360px] bg-white h-full p-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">Your Cart</h3>
        <div className="mt-4 space-y-3">
          {cart.data?.items.map((i) => (
            <div key={i.product._id} className="flex gap-3 items-center">
              <img src={i.product.imageUrl} className="h-14 w-14 object-cover rounded-md" />
              <div className="flex-1">
                <div className="font-medium">{i.product.title}</div>
                <div className="text-sm text-gray-600">{inr.format(i.product.price)}</div>
                <div className="mt-1 flex items-center gap-2">
                  <button className="px-2 border rounded"
                    onClick={() => setQty.mutate({ productId: i.product._id, quantity: Math.max(0, i.quantity - 1) })}>-</button>
                  <span>{i.quantity}</span>
                  <button className="px-2 border rounded"
                    onClick={() => setQty.mutate({ productId: i.product._id, quantity: i.quantity + 1 })}>+</button>
                  <button className="ml-auto text-red-600" onClick={() => remove.mutate(i.product._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          {cart.data?.items.length === 0 && <div className="text-sm text-gray-600">Cart is empty</div>}
        </div>
        <div className="mt-4 border-t pt-3 font-semibold">Total: {inr.format(cart.data?.total ?? 0)}</div>
      </aside>
    </div>
  );
}
