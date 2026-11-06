import { supabase } from './supabase'; // adjust if your client is a default export
import type { CatalogProduct, ProductFilters, ProductInput, Review } from '../types/catalog';

const COLUMNS =
  'id,name,brand,category,price,description,image_url,images,stock,is_featured,is_active,specifications,created_at';

interface RatingRow { product_id: string; avg_rating: number; review_count: number }

/** Remove characters that would break a PostgREST ilike/or filter. */
const cleanTerm = (s: string) => s.replace(/[%_\\,()*]/g, ' ').replace(/\s+/g, ' ').trim();

async function attachRatings(products: CatalogProduct[]): Promise<CatalogProduct[]> {
  if (products.length === 0) return products;
  const { data } = await supabase
    .from('product_rating_stats')
    .select('product_id,avg_rating,review_count')
    .in('product_id', products.map((p) => p.id));
  const map = new Map(((data ?? []) as RatingRow[]).map((r) => [r.product_id, r]));
  return products.map((p) => ({
    ...p,
    avg_rating: map.get(p.id)?.avg_rating ?? 0,
    review_count: map.get(p.id)?.review_count ?? 0,
  }));
}

export async function searchProducts(f: ProductFilters): Promise<CatalogProduct[]> {
  let q = supabase.from('products').select(COLUMNS).eq('is_active', true)
    .order('created_at', { ascending: false });
  const term = cleanTerm(f.search);
  if (term) q = q.or(`name.ilike.%${term}%,brand.ilike.%${term}%`);
  if (f.categories.length) q = q.in('category', f.categories);
  if (f.brands.length) q = q.in('brand', f.brands);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return attachRatings((data ?? []) as CatalogProduct[]);
}

export async function getFilterOptions(): Promise<{ categories: string[]; brands: string[] }> {
  const { data, error } = await supabase.from('products').select('category,brand').eq('is_active', true);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as { category: string | null; brand: string | null }[];
  const uniq = (v: (string | null)[]) =>
    [...new Set(v.filter((x): x is string => !!x))].sort((a, b) => a.localeCompare(b));
  return { categories: uniq(rows.map((r) => r.category)), brands: uniq(rows.map((r) => r.brand)) };
}

/** Returns null for invalid, missing, deleted or inactive products (RLS hides inactive from non-admins). */
export async function getProductById(id: string): Promise<CatalogProduct | null> {
  if (!id || id.length < 8) return null;
  const { data, error } = await supabase.from('products').select(COLUMNS).eq('id', id).maybeSingle();
  if (error) {
    if (error.code === '22P02') return null; // invalid uuid format
    throw new Error(error.message);
  }
  if (!data) return null;
  const [withRating] = await attachRatings([data as CatalogProduct]);
  return withRating;
}

/* ---------- Reviews ---------- */
export function validateReview(rating: number, comment: string): string | null {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Please choose a rating from 1 to 5.';
  const c = comment.trim();
  if (c.length < 5) return 'Comment must be at least 5 characters.';
  if (c.length > 1000) return 'Comment must be 1000 characters or fewer.';
  return null;
}

export async function getReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase.from('reviews').select('*')
    .eq('product_id', productId).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
}

export async function submitReview(productId: string, userId: string, rating: number, comment: string) {
  const err = validateReview(rating, comment);
  if (err) throw new Error(err);
  const { error } = await supabase.from('reviews')
    .insert({ product_id: productId, user_id: userId, rating, comment: comment.trim() });
  if (error) throw new Error(error.code === '23505' ? 'You have already reviewed this product. Edit your review instead.' : error.message);
}

export async function updateReview(id: string, rating: number, comment: string) {
  const err = validateReview(rating, comment);
  if (err) throw new Error(err);
  const { error } = await supabase.from('reviews').update({ rating, comment: comment.trim() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteReview(id: string) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ---------- Admin (enforced by RLS public.is_admin(); UI guard is only cosmetic) ---------- */
export function validateProduct(p: ProductInput): string | null {
  if (p.name.trim().length < 2) return 'Name is required.';
  if (!p.brand.trim()) return 'Brand is required.';
  if (!p.category.trim()) return 'Category is required.';
  if (!Number.isFinite(p.price) || p.price < 0) return 'Price must be 0 or more.';
  if (!Number.isInteger(p.stock) || p.stock < 0) return 'Stock must be a whole number, 0 or more.';
  if (p.image_url && !/^https?:\/\//i.test(p.image_url)) return 'Image URL must start with http:// or https://';
  return null;
}

export async function adminListProducts(): Promise<CatalogProduct[]> {
  const { data, error } = await supabase.from('products').select(COLUMNS).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CatalogProduct[];
}

const toRow = (p: ProductInput) => ({
  ...p, name: p.name.trim(), brand: p.brand.trim(), category: p.category.trim(),
  description: p.description.trim() || null, image_url: p.image_url.trim() || null,
});

export async function adminCreateProduct(p: ProductInput) {
  const err = validateProduct(p); if (err) throw new Error(err);
  const { error } = await supabase.from('products').insert(toRow(p));
  if (error) throw new Error(error.message);
}

export async function adminUpdateProduct(id: string, p: ProductInput) {
  const err = validateProduct(p); if (err) throw new Error(err);
  const { error } = await supabase.from('products').update(toRow(p)).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function adminDeleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.code === '23503'
    ? 'This product is referenced by orders/cart. Set it to inactive instead of deleting.' : error.message);
}
