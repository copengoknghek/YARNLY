const { getPool } = require('../config/db');

const cleanupGuestOrders = async () => {
  const { rows } = await getPool().query(
    `DELETE FROM orders
     WHERE buyer_id IS NULL
        OR buyer_id NOT IN (SELECT id FROM users)
     RETURNING code`,
  );

  const codes = rows.map((row) => row.code);
  return { removed: codes.length, codes };
};

module.exports = { cleanupGuestOrders };
