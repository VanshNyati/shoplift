"use client";
import { useCategories } from "@/hooks/useCategories";
import { useFilterStore } from "@/stores/useFilterStore";

export default function CategoryFilter() {
  const { data } = useCategories();
  const { categoryId, setCategory } = useFilterStore();

  const base =
    "rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-gray-50";
  const active = "bg-black text-white border-black hover:bg-black";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(undefined)}
        className={`${base} ${!categoryId ? active : ""}`}
      >
        All
      </button>
      {data?.map((c) => (
        <button
          key={c._id}
          onClick={() => setCategory(c._id)}
          className={`${base} ${categoryId === c._id ? active : ""}`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
