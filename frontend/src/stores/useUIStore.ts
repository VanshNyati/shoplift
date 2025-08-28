import { create } from "zustand";

type UIState = {
  productId?: string;
  cartOpen: boolean;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  setCartOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  productId: undefined,
  cartOpen: false,
  openProduct: (id) => set({ productId: id }),
  closeProduct: () => set({ productId: undefined }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
}));
