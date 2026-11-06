-- Member 1: product discovery. Safe to re-run. Does NOT create a second products table.
create extension if not exists pg_trgm;

alter table public.products
  add column if not exists brand text,
  add column if not exists category text,
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_active boolean not null default true,
  add column if not exists stock integer not null default 0,
  add column if not exists image_url text,
  add column if not exists images text[],
  add column if not exists specifications jsonb,
  add column if not exists created_at timestamptz not null default now();

create index if not exists products_name_trgm  on public.products using gin (name  gin_trgm_ops);
create index if not exists products_brand_trgm on public.products using gin (brand gin_trgm_ops);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_created_idx on public.products (is_active, created_at desc);

-- Admin check. Reads app_metadata.role (users cannot edit this themselves).
-- CONFIRM WITH MEMBER 2 that admins get app_metadata {"role":"admin"} (or change this function).
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

alter table public.products enable row level security;
drop policy if exists m1_products_read   on public.products;
drop policy if exists m1_products_insert on public.products;
drop policy if exists m1_products_update on public.products;
drop policy if exists m1_products_delete on public.products;
create policy m1_products_read   on public.products for select using (is_active or public.is_admin());
create policy m1_products_insert on public.products for insert to authenticated with check (public.is_admin());
create policy m1_products_update on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy m1_products_delete on public.products for delete to authenticated using (public.is_admin());

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reviewer_name text,
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 5 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists reviews_product_idx on public.reviews (product_id, created_at desc);

create or replace function public.reviews_before_insert() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  select coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1))
    into new.reviewer_name from auth.users u where u.id = new.user_id;
  return new;
end $$;
drop trigger if exists reviews_before_insert on public.reviews;
create trigger reviews_before_insert before insert on public.reviews
  for each row execute function public.reviews_before_insert();

create or replace function public.reviews_touch() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists reviews_touch on public.reviews;
create trigger reviews_touch before update on public.reviews
  for each row execute function public.reviews_touch();

alter table public.reviews enable row level security;
drop policy if exists m1_reviews_read   on public.reviews;
drop policy if exists m1_reviews_insert on public.reviews;
drop policy if exists m1_reviews_update on public.reviews;
drop policy if exists m1_reviews_delete on public.reviews;
create policy m1_reviews_read   on public.reviews for select using (true);
create policy m1_reviews_insert on public.reviews for insert to authenticated with check (auth.uid() = user_id);
create policy m1_reviews_update on public.reviews for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy m1_reviews_delete on public.reviews for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- Real averages computed from real reviews (no hardcoded ratings)
create or replace view public.product_rating_stats with (security_invoker = true) as
select product_id,
       round(avg(rating)::numeric, 2)::float8 as avg_rating,
       count(*)::int as review_count
from public.reviews group by product_id;
grant select on public.product_rating_stats to anon, authenticated;
