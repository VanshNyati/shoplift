"use client";
import { useProducts } from "@/hooks/useProducts";
import { useFilterStore } from "@/stores/useFilterStore";
import { useUIStore } from "@/stores/useUIStore";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CartSheet from "@/components/CartSheet";
import Spinner from "@/components/Spinner";

export default function Page() {
  const { data, isFetching } = useProducts();
  const { page, setPage, sort, order, setSort } = useFilterStore();
  const { productId } = useUIStore();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <CategoryFilter />
        <div className="flex items-center gap-2">
          <label className="text-sm">Sort:</label>
          <select
            className="border rounded px-2 py-1"
            value={`${sort}:${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split(":") as any;
              setSort(s, o);
            }}
          >
            <option value="createdAt:desc">Newest</option>
            <option value="price:asc">Price: Low → High</option>
            <option value="price:desc">Price: High → Low</option>
            <option value="title:asc">Title: A → Z</option>
          </select>
        </div>
      </div>

      {isFetching ? (
        <div className="w-full flex justify-center py-10"><Spinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.data.map((p) => <ProductCard key={p._id} p={p} />)}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <button className="border rounded px-3 py-1.5" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span className="text-sm">Page {data?.page} of {data?.pages}</span>
            <button
              className="border rounded px-3 py-1.5"
              disabled={(data?.page ?? 1) >= (data?.pages ?? 1)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {productId && <ProductModal />}
      <CartSheet />
    </>
  );
}
