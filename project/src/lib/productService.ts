import { supabase } from '@/lib/supabase';
import { WATCH_CATEGORIES, type Product, type ProductSpecification, type WatchCategory } from '@/types/product';

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  price: number | string;
  category: string;
  description: string;
  image_url: string;
  stock: number;
  specifications: unknown;
}

const PRODUCT_COLUMNS = 'id, name, brand, price, category, description, image_url, stock, specifications';

function isWatchCategory(value: string): value is WatchCategory {
  return (WATCH_CATEGORIES as readonly string[]).includes(value);
}

function parseSpecifications(value: unknown): ProductSpecification[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is ProductSpecification =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as ProductSpecification).label === 'string' &&
      typeof (item as ProductSpecification).value === 'string',
  );
}

function toProduct(row: ProductRow): Product {
  if (!isWatchCategory(row.category)) {
    throw new Error(`Unknown watch category "${row.category}"`);
  }
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    category: row.category,
    description: row.description,
    imageUrl: row.image_url,
    stock: row.stock,
    specifications: parseSpecifications(row.specifications),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('name', { ascending: true });

  if (error) throw new Error('Could not load watches. Please try again.');
  if (!Array.isArray(data)) throw new Error('Unexpected response while loading watches.');

  return (data as ProductRow[]).map(toProduct);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error('Could not load this watch. Please try again.');
  if (!data) return null;

  return toProduct(data as ProductRow);
}
