const { getPool } = require('../config/db');
const { AppError, generateId } = require('../utils/helpers');

const MAX_COLORS_PER_SELLER = 10;

const mapColor = (row) => ({
  id: row.id,
  sellerId: row.seller_id,
  name: row.name,
  hex: row.hex,
  stock: row.stock,
  createdAt: row.created_at.toISOString(),
});

const findBySeller = async (sellerId) => {
  const { rows } = await getPool().query(
    `SELECT * FROM yarn_colors WHERE seller_id = $1 ORDER BY created_at ASC`,
    [sellerId],
  );
  return rows.map(mapColor);
};

const countBySeller = async (sellerId) => {
  const { rows } = await getPool().query(`SELECT COUNT(*)::int AS count FROM yarn_colors WHERE seller_id = $1`, [
    sellerId,
  ]);
  return rows[0].count;
};

const findByIdForSeller = async (id, sellerId) => {
  const { rows } = await getPool().query(`SELECT * FROM yarn_colors WHERE id = $1 AND seller_id = $2 LIMIT 1`, [
    id,
    sellerId,
  ]);
  return rows[0] ? mapColor(rows[0]) : null;
};

const findByIdAndSeller = async (id, sellerId) => findByIdForSeller(id, sellerId);

const create = async (sellerId, { name, hex, stock }) => {
  const count = await countBySeller(sellerId);
  if (count >= MAX_COLORS_PER_SELLER) {
    throw new AppError(400, 'Mỗi xưởng chỉ được thêm tối đa 10 màu len');
  }
  const id = `yc-${generateId()}`;
  const { rows } = await getPool().query(
    `INSERT INTO yarn_colors (id, seller_id, name, hex, stock)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, sellerId, name.trim(), hex.toLowerCase(), stock],
  );
  return mapColor(rows[0]);
};

const update = async (id, sellerId, patch) => {
  const current = await findByIdForSeller(id, sellerId);
  if (!current) return null;

  const next = {
    name: patch.name !== undefined ? patch.name.trim() : current.name,
    hex: patch.hex !== undefined ? patch.hex.toLowerCase() : current.hex,
    stock: patch.stock !== undefined ? patch.stock : current.stock,
  };

  const { rows } = await getPool().query(
    `UPDATE yarn_colors SET name = $3, hex = $4, stock = $5 WHERE id = $1 AND seller_id = $2 RETURNING *`,
    [id, sellerId, next.name, next.hex, next.stock],
  );
  return mapColor(rows[0]);
};

const remove = async (id, sellerId) => {
  const { rowCount } = await getPool().query(`DELETE FROM yarn_colors WHERE id = $1 AND seller_id = $2`, [
    id,
    sellerId,
  ]);
  return rowCount > 0;
};

const findSellersWithColors = async () => {
  const { rows } = await getPool().query(
    `SELECT u.id, u.name, u.province,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', yc.id,
                  'name', yc.name,
                  'hex', yc.hex,
                  'inStock', (yc.stock > 0)
                )
                ORDER BY yc.created_at
              ),
              '[]'::json
            ) AS colors
     FROM users u
     INNER JOIN yarn_colors yc ON yc.seller_id = u.id
     WHERE u.user_type = 'seller'
     GROUP BY u.id, u.name, u.province
     HAVING COUNT(yc.id) > 0
     ORDER BY u.name`,
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    province: row.province ?? '',
    colors: row.colors,
  }));
};

const decrementStock = async (client, colorId, sellerId, quantity) => {
  const { rowCount, rows } = await client.query(
    `UPDATE yarn_colors
     SET stock = stock - $3
     WHERE id = $1 AND seller_id = $2 AND stock >= $3
     RETURNING name`,
    [colorId, sellerId, quantity],
  );
  if (rowCount === 0) {
    const { rows: colorRows } = await client.query(`SELECT name FROM yarn_colors WHERE id = $1`, [colorId]);
    const label = colorRows[0]?.name ?? 'len';
    throw new AppError(400, `Màu "${label}" đã hết hàng`);
  }
  return rows[0];
};

const seedColorsForSeller = async (sellerId, colors) => {
  const existing = await countBySeller(sellerId);
  if (existing > 0) return;

  for (const color of colors) {
    await getPool().query(
      `INSERT INTO yarn_colors (id, seller_id, name, hex, stock)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [color.id, sellerId, color.name, color.hex.toLowerCase(), color.stock],
    );
  }
};

module.exports = {
  MAX_COLORS_PER_SELLER,
  findBySeller,
  countBySeller,
  findByIdForSeller,
  findByIdAndSeller,
  create,
  update,
  remove,
  findSellersWithColors,
  decrementStock,
  seedColorsForSeller,
};
