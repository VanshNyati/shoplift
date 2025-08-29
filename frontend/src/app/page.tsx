"use client";
import { useProducts } from "@/hooks/useProducts";
import { useFilterStore } from "@/stores/useFilterStore";
import { useUIStore } from "@/stores/useUIStore";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CartSheet from "@/components/CartSheet";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";

export default function Page() {
  const { data, isFetching } = useProducts();
  const { page, setPage, sort, order, setSort } = useFilterStore();
  const { productId } = useUIStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter />
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sort</label>
          <select
            id="sort"
            className="rounded-xl border bg-white px-3 py-1.5 text-sm outline-none transition-shadow focus:ring-4 focus:ring-black/5"
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

      {/* Grid */}
      {isFetching ? (
        <div className="flex w-full justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div
            className={[
              "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
              "transition-all duration-300",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            ].join(" ")}
          >
            {data?.data.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span className="rounded-xl bg-white px-3 py-1.5 text-sm shadow-sm">
              Page {data?.page} of {data?.pages}
            </span>
            <button
              className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
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
