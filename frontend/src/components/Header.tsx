"use client";
import SearchBar from "./SearchBar";
import { useUIStore } from "@/stores/useUIStore";

export default function Header() {
  const { setCartOpen } = useUIStore();
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="container flex items-center gap-4 py-3">
        <h1 className="text-xl font-bold">Shoplift</h1>
        <SearchBar />
        <button
          className="ml-auto rounded-md border px-3 py-1.5"
          onClick={() => setCartOpen(true)}
        >
          Cart
        </button>
      </div>
    </header>
  );
}
