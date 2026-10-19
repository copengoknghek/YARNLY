require('dotenv').config();
const { connectDB, closeDB, getPool, migrate } = require('../src/config/db');
const Product = require('../src/models/Product');
const products = require('./data/imported-products.json');

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const randomStock = () => 10 + Math.floor(Math.random() * 21);

const run = async () => {
  await migrate();
  await connectDB();

  const { rows: sellers } = await getPool().query(
    "SELECT id, name FROM users WHERE user_type = 'seller' ORDER BY id",
  );
  if (sellers.length === 0) throw new Error('No seller accounts found');

  const now = Date.now();
  for (const [index, product] of products.entries()) {
    if (await Product.findById(product.id)) {
      console.log(`skip   ${product.id} (already exists)`);
      continue;
    }
    const seller = pick(sellers);
    await Product.seedProduct({
      ...product,
      sellerId: seller.id,
      stock: randomStock(),
      approvalStatus: product.images.length > 0 ? 'approved' : 'pending',
      createdAt: new Date(now - index * 1000).toISOString(),
    });
    console.log(`insert ${product.id} -> ${seller.name}`);
  }
  await Product.backfillTranslations(products);

  await closeDB();
};

run().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
