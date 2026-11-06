# Member 1 drop-in files (copy into your project root, keeping the folder paths)

1. Run the migration: paste supabase/migrations/20261106000000_member1_product_discovery.sql into
   Supabase SQL editor (or `supabase db push`). FIRST compare your products table columns - if you already
   have e.g. `stock_quantity` or `image` the `add column if not exists` lines will add duplicates; edit those lines.
2. Admin access: in Supabase set an admin user's app_metadata to {"role":"admin"}
   (Dashboard > Authentication > Users > user > Raw app meta data). Confirm this with Member 2.
3. Add routes (react-router-dom v6):
   <Route path="/products" element={<CatalogPage />} />
   <Route path="/products/:id" element={<CatalogProductDetailsPage />} />
   <Route path="/admin/products" element={<AdminProductsPage />} />
   (If you already have these routes pointing to ProductsPage/ProductDetailsPage, swap the element or merge.)
4. In src/pages/CatalogProductDetailsPage.tsx wire handleAddToCart to Member 2's cart function.
5. In ProductReviews.tsx / RequireAdmin.tsx change "/login" if Member 2 uses a different route.
6. `import { supabase } from './supabase'` assumes a named export - adjust if yours is default.
7. Run: npx tsc --noEmit && npm run build
