export type products = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
