"use client";
import { useEffect } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { useCart } from "@/hooks/useCart";
import { inr } from "@/lib/format";

export default function CartSheet() {
  const { cartOpen, setCartOpen } = useUIStore();
  const { cart, setQty, remove } = useCart();

  // ESC closes
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={() => setCartOpen(false)}
    >
      <aside
        className="relative h-full w-[380px] max-w-[90vw] translate-x-0 bg-white shadow-xl transition-transform duration-300 sm:rounded-l-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button
            className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
            onClick={() => setCartOpen(false)}
          >
            Close
          </button>
        </div>

        {/* Items */}
        <div className="max-h-[calc(100vh-160px)] overflow-y-auto p-4">
          <div className="space-y-3">
            {cart.data?.items.map((i) => (
              <div key={i.product._id} className="flex items-center gap-3 rounded-xl border p-2">
                <img
                  src={i.product.imageUrl}
                  alt={i.product.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{i.product.title}</div>
                  <div className="text-sm text-gray-600">{inr(i.product.price)}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      className="rounded-lg border px-2 hover:bg-gray-50"
                      onClick={() =>
                        setQty.mutate({ productId: i.product._id, quantity: Math.max(0, i.quantity - 1) })
                      }
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{i.quantity}</span>
                    <button
                      className="rounded-lg border px-2 hover:bg-gray-50"
                      onClick={() => setQty.mutate({ productId: i.product._id, quantity: i.quantity + 1 })}
                    >
                      +
                    </button>
                    <button
                      className="ml-auto text-sm text-red-600 hover:underline"
                      onClick={() => remove.mutate(i.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {cart.data?.items.length === 0 && (
              <div className="rounded-xl border p-6 text-center text-sm text-gray-600">
                Cart is empty
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="absolute inset-x-0 bottom-0 border-t bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-lg font-semibold">{inr(cart.data?.total ?? 0)}</span>
          </div>
          <button
            className="mt-3 w-full rounded-xl bg-black py-2.5 text-white shadow hover:bg-gray-900 active:translate-y-px disabled:opacity-60"
            disabled={!cart.data || cart.data.items.length === 0}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
