export interface CatalogProduct {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  price: number;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  stock: number | null;
  is_featured: boolean;
  is_active: boolean;
  specifications: Record<string, string> | null;
  created_at: string;
  avg_rating?: number;
  review_count?: number;
}

export interface ProductFilters {
  search: string;
  categories: string[];
  brands: string[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  reviewer_name: string | null;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
  specifications: Record<string, string>;
  is_featured: boolean;
  is_active: boolean;
}
