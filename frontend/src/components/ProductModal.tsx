"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUIStore } from "@/stores/useUIStore";
import { inr } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import Spinner from "./Spinner";

export default function ProductModal() {
  const { productId, closeProduct } = useUIStore();
  const { add } = useCart();

  const { data, isFetching } = useQuery({
    queryKey: ["product", productId],
    enabled: !!productId,
    queryFn: async () => (await api.get(`/api/products/${productId}`)).data,
  });

  if (!productId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={closeProduct}>
      <div className="bg-white rounded-2xl max-w-xl w-full p-4" onClick={(e) => e.stopPropagation()}>
        {isFetching ? (
          <div className="p-10 flex justify-center"><Spinner /></div>
        ) : (
          <>
            <img src={data.imageUrl} alt={data.title} className="h-64 w-full object-cover rounded-xl" />
            <h3 className="mt-3 text-xl font-semibold">{data.title}</h3>
            <p className="text-gray-700 mt-1">{data.description}</p>
            <div className="mt-2 font-semibold">{inr.format(data.price)}</div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-md border px-3 py-1.5" onClick={closeProduct}>Close</button>
              <button
                className="rounded-md bg-black text-white px-3 py-1.5"
                onClick={() => add.mutate({ productId: data._id, quantity: 1 })}
              >
                Add to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
