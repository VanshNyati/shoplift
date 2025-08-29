"use client";
import { useEffect, useState } from "react";
import { useFilterStore } from "@/stores/useFilterStore";

export default function SearchBar() {
  const { setSearch } = useFilterStore();
  const [value, setValue] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(value.trim()), 350);
    return () => clearTimeout(t);
  }, [value, setSearch]);

  return (
    <div className="relative w-full max-w-md">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="11" cy="11" r="7" strokeWidth="2" />
        <path d="M20 20l-2-2" strokeWidth="2" />
      </svg>
      <input
        className="w-full rounded-xl border bg-white pl-9 pr-3 py-2 outline-none transition-shadow focus:ring-4 focus:ring-black/5"
        placeholder="Search products…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
