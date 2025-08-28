"use client";
import { useCategories } from "@/hooks/useCategories";
import { useFilterStore } from "@/stores/useFilterStore";

export default function CategoryFilter() {
  const { data } = useCategories();
  const { categoryId, setCategory } = useFilterStore();

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setCategory(undefined)}
        className={`px-3 py-1 rounded border ${!categoryId ? "bg-black text-white" : ""}`}
      >
        All
      </button>
      {data?.map((c) => (
        <button
          key={c._id}
          onClick={() => setCategory(c._id)}
          className={`px-3 py-1 rounded border ${categoryId === c._id ? "bg-black text-white" : ""}`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
