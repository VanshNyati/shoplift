"use client";
import { useEffect, useState } from "react";
import { useFilterStore } from "@/stores/useFilterStore";

export default function SearchBar() {
  const { setSearch } = useFilterStore();
  const [value, setValue] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(value.trim()), 350); // debounce to backend
    return () => clearTimeout(t);
  }, [value, setSearch]);

  return (
    <input
      className="border rounded-md px-3 py-2 w-full max-w-md"
      placeholder="Search products…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
