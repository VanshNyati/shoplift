export type Category = { _id: string; name: string; slug: string };

export type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  createdAt: string;
};

export type Paged<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type CartItem = {
  product: Pick<Product, "_id" | "title" | "price" | "imageUrl">;
  quantity: number;
};
export type Cart = { items: CartItem[]; total: number };
