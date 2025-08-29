// src/components/Header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import { useUIStore } from "@/stores/useUIStore";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const { setCartOpen } = useUIStore();
  const { cart } = useCart();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  const totalQty =
    cart.data?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="container flex items-center gap-4 py-3">
        <h1 className="text-xl font-bold">Shoplift</h1>
        <SearchBar />

        <div className="ml-auto flex gap-2">
          {isAdminPage ? (
            <Link href="/" className="rounded-md border px-3 py-1.5 hover:bg-gray-100">
              Products
            </Link>
          ) : (
            <Link href="/admin" className="rounded-md border px-3 py-1.5 hover:bg-gray-100">
              Admin
            </Link>
          )}

          <button
            className="relative rounded-md border px-3 py-1.5"
            onClick={() => setCartOpen(true)}
          >
            Cart{totalQty > 0 ? ` • ${totalQty}` : ""}
          </button>
        </div>
      </div>
    </header>
  );
}
