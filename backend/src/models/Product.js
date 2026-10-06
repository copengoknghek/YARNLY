const { getPool } = require('../config/db');
const { generateId } = require('../utils/helpers');

const CATEGORIES = ['decoration', 'fashion', 'combo', 'blindbox'];
const APPROVAL_STATUSES = ['pending', 'approved', 'rejected'];
const LOW_STOCK_THRESHOLD = 5;

const DEFAULT_DETAILS = {
  care: 'Giặt tay nhẹ nhàng với nước lạnh, không vắt mạnh. Phơi khô ở nơi thoáng mát, tránh ánh nắng trực tiếp.',
  shipping:
    'Giao hàng toàn quốc từ 2–5 ngày sau khi hoàn thành sản phẩm. Phí vận chuyển được tính ở bước thanh toán.',
};

const SORTERS = {
  newest: 'p.created_at DESC',
  'price-asc': 'p.price ASC',
  'price-desc': 'p.price DESC',
  name: 'p.name ASC',
};

const mapProduct = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  category: row.category,
  images: row.images,
  stock: row.stock,
  isBestSeller: row.is_best_seller,
  createdAt: row.created_at.toISOString(),
  approvalStatus: row.approval_status,
  rejectionNote: row.rejection_note ?? undefined,
  options: row.options ?? undefined,
  details: row.details,
  sellerId: row.seller_id,
  sellerName: row.seller_name,
});

const isApproved = (product) => product.approvalStatus === 'approved';

const findAll = async ({ category, search, status, bestSeller, sort, sellerId, approvalStatus } = {}) => {
  const conditions = ['1=1'];
  const params = [];
  let index = 1;

  if (category) {
    conditions.push(`p.category = $${index++}`);
    params.push(category);
  }
  if (search?.trim()) {
    conditions.push(`LOWER(p.name) LIKE $${index++}`);
    params.push(`%${search.trim().toLowerCase()}%`);
  }
  if (status === 'in-stock') {
    conditions.push('p.stock > 0');
  } else if (status === 'out-of-stock') {
    conditions.push('p.stock = 0');
  }
  if (bestSeller) {
    conditions.push('p.is_best_seller = TRUE');
  }
  if (sellerId) {
    conditions.push(`p.seller_id = $${index++}`);
    params.push(sellerId);
  }
  if (approvalStatus) {
    conditions.push(`p.approval_status = $${index++}`);
    params.push(approvalStatus);
  }

  const orderBy = sort && SORTERS[sort] ? SORTERS[sort] : 'p.created_at DESC';
  const { rows } = await getPool().query(
    `SELECT p.*, u.name AS seller_name
     FROM products p
     JOIN users u ON u.id = p.seller_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY ${orderBy}`,
    params,
  );
  return rows.map(mapProduct);
};

const findById = async (id) => {
  const { rows } = await getPool().query(
    `SELECT p.*, u.name AS seller_name
     FROM products p
     JOIN users u ON u.id = p.seller_id
     WHERE p.id = $1
     LIMIT 1`,
    [id],
  );
  return rows[0] ? mapProduct(rows[0]) : null;
};

const create = async (data) => {
  const product = {
    id: `sp-${generateId()}`,
    isBestSeller: false,
    approvalStatus: 'pending',
    details: { material: 'Sợi Milk Cotton', ...DEFAULT_DETAILS },
    ...data,
  };

  const { rows } = await getPool().query(
    `INSERT INTO products (
       id, seller_id, name, description, price, category, images, stock,
       is_best_seller, approval_status, options, details
     ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11::jsonb, $12::jsonb)
     RETURNING *, (SELECT name FROM users WHERE id = $2) AS seller_name`,
    [
      product.id,
      product.sellerId,
      product.name,
      product.description,
      product.price,
      product.category,
      JSON.stringify(product.images ?? []),
      product.stock,
      product.isBestSeller,
      product.approvalStatus,
      product.options ? JSON.stringify(product.options) : null,
      JSON.stringify(product.details),
    ],
  );
  return mapProduct(rows[0]);
};

const update = async (id, sellerId, patch) => {
  const { rows } = await getPool().query(
    `UPDATE products
     SET name = COALESCE($3, name),
         description = COALESCE($4, description),
         price = COALESCE($5, price),
         category = COALESCE($6, category),
         images = COALESCE($7::jsonb, images),
         stock = COALESCE($8, stock),
         approval_status = 'pending',
         rejection_note = NULL
     WHERE id = $1 AND seller_id = $2
     RETURNING *, (SELECT name FROM users WHERE id = seller_id) AS seller_name`,
    [
      id,
      sellerId,
      patch.name ?? null,
      patch.description ?? null,
      patch.price ?? null,
      patch.category ?? null,
      patch.images ? JSON.stringify(patch.images) : null,
      patch.stock ?? null,
    ],
  );
  return rows[0] ? mapProduct(rows[0]) : null;
};

const updateStock = async (id, sellerId, stock) => {
  const { rows } = await getPool().query(
    `UPDATE products SET stock = $3
     WHERE id = $1 AND seller_id = $2
     RETURNING *, (SELECT name FROM users WHERE id = seller_id) AS seller_name`,
    [id, sellerId, stock],
  );
  return rows[0] ? mapProduct(rows[0]) : null;
};

const approve = async (id) => {
  const { rows } = await getPool().query(
    `UPDATE products
     SET approval_status = 'approved', rejection_note = NULL
     WHERE id = $1
     RETURNING *, (SELECT name FROM users WHERE id = seller_id) AS seller_name`,
    [id],
  );
  return rows[0] ? mapProduct(rows[0]) : null;
};

const reject = async (id, note) => {
  const { rows } = await getPool().query(
    `UPDATE products
     SET approval_status = 'rejected', rejection_note = $2
     WHERE id = $1
     RETURNING *, (SELECT name FROM users WHERE id = seller_id) AS seller_name`,
    [id, note?.trim() || 'Sản phẩm chưa đạt yêu cầu.'],
  );
  return rows[0] ? mapProduct(rows[0]) : null;
};

const countBySeller = async (sellerId) => {
  const { rows } = await getPool().query(
    `SELECT
       COUNT(*) FILTER (WHERE approval_status = 'pending')::int AS pending,
       COUNT(*) FILTER (WHERE approval_status = 'approved')::int AS approved,
       COUNT(*) FILTER (WHERE approval_status = 'rejected')::int AS rejected,
       COUNT(*) FILTER (WHERE stock > 0 AND stock <= $2)::int AS low_stock
     FROM products
     WHERE seller_id = $1`,
    [sellerId, LOW_STOCK_THRESHOLD],
  );
  return rows[0];
};

const seedProduct = async (product) => {
  const existing = await findById(product.id);
  if (existing) return existing;

  const { rows } = await getPool().query(
    `INSERT INTO products (
       id, seller_id, name, description, price, category, images, stock,
       is_best_seller, approval_status, options, details, created_at
     ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11::jsonb, $12::jsonb, $13::timestamptz)
     RETURNING *, (SELECT name FROM users WHERE id = $2) AS seller_name`,
    [
      product.id,
      product.sellerId,
      product.name,
      product.description,
      product.price,
      product.category,
      JSON.stringify(product.images ?? []),
      product.stock,
      product.isBestSeller ?? false,
      product.approvalStatus ?? 'approved',
      product.options ? JSON.stringify(product.options) : null,
      JSON.stringify(product.details ?? { material: 'Sợi Milk Cotton', ...DEFAULT_DETAILS }),
      product.createdAt,
    ],
  );
  return mapProduct(rows[0]);
};

module.exports = {
  CATEGORIES,
  APPROVAL_STATUSES,
  LOW_STOCK_THRESHOLD,
  SORT_OPTIONS: Object.keys(SORTERS),
  DEFAULT_DETAILS,
  isApproved,
  findAll,
  findById,
  create,
  update,
  updateStock,
  approve,
  reject,
  countBySeller,
  seedProduct,
};
