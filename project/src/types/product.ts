export const WATCH_CATEGORIES = ['Analog', 'Digital', 'Smartwatch'] as const;

export type WatchCategory = (typeof WATCH_CATEGORIES)[number];

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: WatchCategory;
  description: string;
  imageUrl: string;
  stock: number;
  specifications: ProductSpecification[];
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  stock: number;
  quantity: number;
}
