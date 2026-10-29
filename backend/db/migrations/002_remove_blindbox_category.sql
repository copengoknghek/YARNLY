-- One-time: drop blindbox category and rows (run once via schema_migrations)

DELETE FROM products WHERE category NOT IN ('decoration', 'fashion', 'combo');
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN ('decoration', 'fashion', 'combo'));
