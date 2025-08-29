"use client";

import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";

export default function AdminNew() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onSubmit = async (vals: ProductFormValues) => {
    await api.post("/api/products", vals);
    router.push("/admin");
  };

  return (
    <div
      className={[
        "mx-auto max-w-3xl transition-all duration-300",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <p className="text-sm text-gray-500">Fill the details below to create a product.</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <ProductForm submitLabel="Create" onSubmit={onSubmit} />
      </div>
    </div>
  );
}
