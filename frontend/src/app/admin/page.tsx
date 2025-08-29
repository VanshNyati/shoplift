"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { inr } from "@/lib/format";
import type { Product, Category } from "@/types/api";

export default function AdminIndex() {
  const qc = useQueryClient();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async (): Promise<Product[]> => (await api.get("/api/products")).data.data,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => (await api.get("/api/categories")).data,
  });

  const categoryName = (id?: string) =>
    categories?.find((c) => c._id === id)?.name ?? "—";

  const del = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/api/products/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  return (
    <div
      className={[
        "transition-all duration-300",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-gray-500">Create, edit or remove products and categories.</p>
        </div>
        <Link
          href="/admin/new"
          className="rounded-xl bg-black px-4 py-2 text-white shadow hover:bg-gray-900 active:translate-y-px"
        >
          + New
        </Link>
      </div>

      {/* Card container */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* Loading */}
        {isLoading && (
          <div className="p-8">
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
            <div className="mt-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!products || products.length === 0) && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-100" />
            <h3 className="text-lg font-medium">No products yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              Get started by creating your first product.
            </p>
            <Link
              href="/admin/new"
              className="mt-5 inline-flex rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Create product
            </Link>
          </div>
        )}

        {/* Table (sm and up) */}
        {!!products?.length && (
          <div className="hidden sm:block">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-left text-sm">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-600">Title</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Price</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Category</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map((p, idx) => (
                  <tr
                    key={p._id}
                    className={idx % 2 ? "bg-white" : "bg-gray-50/60"}
                  >
                    <td className="px-5 py-3">{p.title}</td>
                    <td className="px-5 py-3">{inr(p.price)}</td>
                    <td className="px-5 py-3">{categoryName(p.categoryId)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/${p._id}`}
                          className="rounded-lg border px-3 py-1.5 hover:bg-gray-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            if (!del.isPending && confirm("Delete this product?")) {
                              del.mutate(p._id);
                            }
                          }}
                          disabled={del.isPending}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          {del.isPending ? (
                            <span className="inline-flex items-center gap-2">
                              <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  d="M4 12a8 8 0 018-8"
                                  strokeWidth="4"
                                />
                              </svg>
                              Deleting…
                            </span>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cards (mobile) */}
        {!!products?.length && (
          <div className="sm:hidden">
            <ul className="divide-y">
              {products.map((p) => (
                <li key={p._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-sm text-gray-500">
                        {categoryName(p.categoryId)} · {inr(p.price)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/${p._id}`}
                        className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (!del.isPending && confirm("Delete this product?")) {
                            del.mutate(p._id);
                          }
                        }}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
