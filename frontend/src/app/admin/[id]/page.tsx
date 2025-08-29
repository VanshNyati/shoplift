"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";

export default function AdminEdit() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data } = useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => (await api.get(`/api/products/${id}`)).data,
  });

  const onSubmit = async (vals: ProductFormValues) => {
    await api.put(`/api/products/${id}`, vals);
    router.push("/admin");
  };

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-3 h-10 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-3 h-10 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-3 h-24 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "mx-auto max-w-3xl transition-all duration-300",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-sm text-gray-500">Update details and save changes.</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <ProductForm
          submitLabel="Update"
          onSubmit={onSubmit}
          defaultValues={{
            title: data.title,
            imageUrl: data.imageUrl,
            price: data.price,
            categoryId: data.categoryId,
            description: data.description,
          }}
        />
      </div>
    </div>
  );
}
