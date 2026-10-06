require('dotenv').config();
const { connectDB, closeDB, getPool } = require('../src/config/db');

const cleanupGuestOrders = async () => {
  await connectDB();

  const { rows } = await getPool().query(
    `DELETE FROM orders
     WHERE buyer_id IS NULL
        OR buyer_id NOT IN (SELECT id FROM users)
     RETURNING code`,
  );

  const codes = rows.map((row) => row.code);
  console.log(`Removed ${codes.length} guest order(s): ${codes.length > 0 ? codes.join(', ') : '(none)'}`);

  await closeDB();
};

cleanupGuestOrders().catch((error) => {
  console.error('Failed to remove guest orders:', error);
  process.exit(1);
});
