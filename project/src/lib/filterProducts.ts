import type { Product, WatchCategory } from '@/types/product';

export interface ProductFilters {
  query: string;
  category: WatchCategory | '';
  brand: string;
  minPrice: number;
  maxPrice: number;
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    if (normalizedQuery && !product.name.toLowerCase().includes(normalizedQuery)) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (product.price < filters.minPrice || product.price > filters.maxPrice) return false;
    return true;
  });
}
