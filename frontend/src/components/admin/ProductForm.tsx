"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { inr } from "@/lib/format";

const schema = z.object({
  title: z.string().min(2),
  imageUrl: z.string().url(),
  // expect a number (no coerce)
  price: z.number().nonnegative(),
  categoryId: z.string().min(1, "Select a category"),
  description: z.string().min(3),
});

export type ProductFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: Partial<ProductFormValues>;
  submitLabel: string;
  onSubmit: (vals: ProductFormValues) => Promise<void> | void;
};

export default function ProductForm({ defaultValues, submitLabel, onSubmit }: Props) {
  const { data: categories } = useCategories();
  const createCat = useCreateCategory();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<ProductFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: "",
        imageUrl: "",
        price: 0,
        categoryId: "",
        description: "",
        ...defaultValues,
      },
    });

  useEffect(() => {
    if (defaultValues?.categoryId) setValue("categoryId", defaultValues.categoryId);
  }, [defaultValues?.categoryId, setValue]);

  const catId = watch("categoryId");

  const handleCreateCategory = async () => {
    const name = prompt("New category name");
    if (!name) return;
    const newCat = await createCat.mutateAsync(name);
    setValue("categoryId", newCat._id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-3">
      <input className="w-full rounded border p-2" placeholder="Title" {...register("title")} />
      {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}

      <input className="w-full rounded border p-2" placeholder="Image URL" {...register("imageUrl")} />
      {errors.imageUrl && <p className="text-sm text-red-600">{errors.imageUrl.message}</p>}

      {/* Tell RHF to store a number */}
      <input
        className="w-full rounded border p-2"
        placeholder="Price"
        type="number"
        step="0.01"
        {...register("price", { valueAsNumber: true })}
      />
      {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}

      <div className="flex items-center gap-2">
        <select className="w-full rounded border p-2" {...register("categoryId")}>
          <option value="">Select category</option>
          {categories?.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <button type="button" onClick={handleCreateCategory} className="rounded border px-3 py-2">
          Add
        </button>
      </div>
      {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId.message}</p>}

      <textarea className="w-full rounded border p-2" rows={4} placeholder="Description" {...register("description")} />
      {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}

      <button disabled={isSubmitting} className="w-full rounded bg-black py-2 text-white disabled:opacity-60">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
