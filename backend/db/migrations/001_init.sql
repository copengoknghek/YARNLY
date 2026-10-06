-- YARNLY initial schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  user_type TEXT CHECK (user_type IN ('buyer', 'seller')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES users (id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL CHECK (category IN ('decoration', 'fashion', 'combo', 'blindbox')),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rejection_note TEXT,
  options JSONB,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_seller ON products (seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_approval ON products (approval_status);

CREATE TABLE IF NOT EXISTS carriers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  eta_min_days INTEGER NOT NULL,
  eta_max_days INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shipping_rates (
  id SERIAL PRIMARY KEY,
  carrier_id TEXT NOT NULL REFERENCES carriers (id) ON DELETE CASCADE,
  zone TEXT NOT NULL CHECK (zone IN ('local', 'nearby', 'national')),
  fee INTEGER NOT NULL CHECK (fee >= 0),
  UNIQUE (carrier_id, zone)
);

CREATE SEQUENCE IF NOT EXISTS order_code_seq START 1001;

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'placed' CHECK (
    status IN ('placed', 'crafting', 'shipping', 'delivered', 'cancelled')
  ),
  buyer_id TEXT REFERENCES users (id),
  carrier_id TEXT NOT NULL REFERENCES carriers (id),
  shipping_email TEXT NOT NULL,
  shipping_full_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_province TEXT NOT NULL,
  shipping_district TEXT NOT NULL,
  shipping_ward TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('momo', 'zalopay', 'cod')),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  shipping_fee INTEGER NOT NULL CHECK (shipping_fee >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  estimated_delivery TIMESTAMPTZ NOT NULL,
  tracking_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders (buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders (shipping_phone);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (shipping_email);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  product_price INTEGER NOT NULL,
  product_category TEXT NOT NULL,
  product_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  seller_id TEXT,
  seller_name TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  selected_options JSONB,
  custom_design JSONB
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
