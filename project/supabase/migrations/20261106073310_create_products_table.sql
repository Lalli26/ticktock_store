/*
# Create products table and seed watch catalogue

1. New Tables
- `products`: one row per watch in the TickTock Store catalogue.
  - `id` (uuid, primary key)
  - `name` (text) watch model name
  - `brand` (text) manufacturer name
  - `price` (numeric) price in Indian Rupees
  - `category` (text) one of Analog, Digital, Smartwatch
  - `description` (text) marketing description
  - `image_url` (text) product photo
  - `stock` (integer) units available
  - `specifications` (jsonb) list of { label, value } pairs
  - `created_at` (timestamptz)
2. Seed data
- Inserts 8 sample watches with fixed ids so re-running is safe.
3. Security
- Row level security enabled.
- Read-only access for anonymous and signed-in visitors (the storefront has no sign-in).
- No insert, update or delete policies, so the public app cannot change the catalogue.
4. Notes
- Catalogue changes are made directly in the database for now.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  category text NOT NULL CHECK (category IN ('Analog', 'Digital', 'Smartwatch')),
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  specifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products (brand);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON products TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO products (id, name, brand, price, category, description, image_url, stock, specifications) VALUES
  ('a1000000-0000-4000-8000-000000000001', 'Heritage Gold Chronograph', 'Aurum', 45999, 'Analog',
   'A statement chronograph in brushed 18k gold tone with a cream dial and sapphire crystal. Built for those who appreciate craftsmanship that lasts for generations.',
   'https://images.pexels.com/photos/1136589/pexels-photo-1136589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 6,
   '[{"label":"Movement","value":"Automatic chronograph"},{"label":"Case","value":"40 mm gold-tone stainless steel"},{"label":"Crystal","value":"Sapphire, anti-reflective"},{"label":"Water resistance","value":"50 m"},{"label":"Strap","value":"Gold-tone link bracelet"}]'::jsonb),
  ('a1000000-0000-4000-8000-000000000002', 'Classic Noir Black', 'Noir', 18500, 'Analog',
   'A minimalist black dial with polished indices and a slim profile. The everyday dress watch that pairs effortlessly with a suit or a t-shirt.',
   'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 12,
   '[{"label":"Movement","value":"Quartz"},{"label":"Case","value":"38 mm black PVD steel"},{"label":"Crystal","value":"Mineral glass"},{"label":"Water resistance","value":"30 m"},{"label":"Strap","value":"Black calf leather"}]'::jsonb),
  ('a1000000-0000-4000-8000-000000000003', 'Meridian Gold Dress', 'Meridian', 32500, 'Analog',
   'An elegant gold dress watch with a warm champagne dial and a refined case. Designed to catch the light at every occasion.',
   'https://images.pexels.com/photos/4431871/pexels-photo-4431871.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4,
   '[{"label":"Movement","value":"Quartz"},{"label":"Case","value":"36 mm yellow gold-plated steel"},{"label":"Crystal","value":"Sapphire"},{"label":"Water resistance","value":"30 m"},{"label":"Strap","value":"Tan leather"}]'::jsonb),
  ('a1000000-0000-4000-8000-000000000004', 'Halden Leather Chrono', 'Halden', 14999, 'Analog',
   'A sporty chronograph with a bold dial, luminous hands and a durable leather strap. Stylish and reliable for daily wear.',
   'https://images.pexels.com/photos/6157408/pexels-photo-6157408.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 9,
   '[{"label":"Movement","value":"Quartz chronograph"},{"label":"Case","value":"42 mm stainless steel"},{"label":"Crystal","value":"Mineral glass"},{"label":"Water resistance","value":"100 m"},{"label":"Strap","value":"Brown leather"}]'::jsonb),
  ('a1000000-0000-4000-8000-000000000005', 'Obsidian Automatic Skeleton', 'Obsidian', 58999, 'Analog',
   'A skeleton automatic movement visible through the dial, finished with black rhodium and blued hands. A showpiece for watch enthusiasts.',
   'https://images.pexels.com/photos/3829441/pexels-photo-3829441.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3,
   '[{"label":"Movement","value":"Self-winding automatic, 42-hour power reserve"},{"label":"Case","value":"41 mm black PVD steel"},{"label":"Crystal","value":"Sapphire, domed"},{"label":"Water resistance","value":"50 m"},{"label":"Strap","value":"Black leather with steel clasp"}]'::jsonb),
  ('a1000000-0000-4000-8000-000000000006', 'Pulse X Smart', 'Vantage', 12999, 'Smartwatch',
   'A slim black smartwatch with heart rate, sleep and step tracking, plus notifications from your phone. Lightweight rubber strap for all-day comfort.',
   'https://images.pexels.com/photos/31541678/pexels-photo-31541678.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 25,
   '[{"label":"Display","value":"1.9 inch AMOLED"},{"label":"Battery","value":"Up to 7 days"},{"label":"Sensors","value":"Heart rate, SpO2, accelerometer"},{"label":"Connectivity","value":"Bluetooth 5.2"},{"label":"Water resistance","value":"5 ATM"}]'::jsonb),
  ('a1000000-0000-4000-8000-000000000007', 'Series 2 Smart Watch', 'Nova', 19999, 'Smartwatch',
   'A premium smartwatch with GPS, fitness coaching and a crisp always-on display. Track workouts and stay connected without reaching for your phone.',
   'https://images.pexels.com/photos/11677077/pexels-photo-11677077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 15,
   '[{"label":"Display","value":"1.4 inch AMOLED, always on"},{"label":"Battery","value":"Up to 14 days"},{"label":"Sensors","value":"GPS, heart rate, SpO2"},{"label":"Connectivity","value":"Bluetooth 5.3, Wi-Fi"},{"label":"Water resistance","value":"5 ATM"}]'::jsonb),
  ('a1000000-0000-4000-8000-000000000008', 'Lumen Digital Sport', 'Lumen', 4999, 'Digital',
   'A bold digital sports watch with a backlit display, stopwatch and alarm. Rugged and lightweight, built for training and the outdoors.',
   'https://images.pexels.com/photos/12564670/pexels-photo-12564670.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 30,
   '[{"label":"Display","value":"LCD digital with backlight"},{"label":"Battery","value":"5 years"},{"label":"Functions","value":"Stopwatch, alarm, countdown, dual time"},{"label":"Strap","value":"Resin"},{"label":"Water resistance","value":"100 m"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;
