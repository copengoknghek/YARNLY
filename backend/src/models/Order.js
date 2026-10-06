const { getPool } = require('../config/db');
const { generateId } = require('../utils/helpers');

const ORDER_STATUSES = ['placed', 'crafting', 'shipping', 'delivered', 'cancelled'];
const PAYMENT_METHODS = ['momo', 'zalopay', 'cod'];

const mapItem = (row) => ({
  product: {
    id: row.product_id,
    name: row.product_name,
    price: row.product_price,
    category: row.product_category,
    images: row.product_images,
    sellerId: row.seller_id ?? undefined,
    sellerName: row.seller_name ?? undefined,
  },
  quantity: row.quantity,
  unitPrice: row.unit_price,
  selectedOptions: row.selected_options ?? undefined,
  customDesign: row.custom_design ?? undefined,
});

const mapOrder = (row, items) => ({
  id: row.id,
  code: row.code,
  status: row.status,
  buyerId: row.buyer_id ?? undefined,
  carrierId: row.carrier_id,
  carrierName: row.carrier_name,
  items,
  shipping: {
    email: row.shipping_email,
    fullName: row.shipping_full_name,
    phone: row.shipping_phone,
    address: row.shipping_address,
    province: row.shipping_province,
    district: row.shipping_district,
    ward: row.shipping_ward,
  },
  note: row.note,
  paymentMethod: row.payment_method,
  subtotal: row.subtotal,
  shippingFee: row.shipping_fee,
  total: row.total,
  estimatedDelivery: row.estimated_delivery.toISOString(),
  trackingCode: row.tracking_code,
  createdAt: row.created_at.toISOString(),
});

const loadItems = async (orderIds) => {
  if (orderIds.length === 0) return new Map();
  const { rows } = await getPool().query(
    `SELECT * FROM order_items WHERE order_id = ANY($1::text[]) ORDER BY id ASC`,
    [orderIds],
  );
  const grouped = new Map();
  for (const row of rows) {
    const items = grouped.get(row.order_id) ?? [];
    items.push(mapItem(row));
    grouped.set(row.order_id, items);
  }
  return grouped;
};

const findById = async (id) => {
  const { rows } = await getPool().query(
    `SELECT o.*, c.name AS carrier_name
     FROM orders o
     JOIN carriers c ON c.id = o.carrier_id
     WHERE o.id = $1
     LIMIT 1`,
    [id],
  );
  if (!rows[0]) return null;
  const itemsByOrder = await loadItems([id]);
  return mapOrder(rows[0], itemsByOrder.get(id) ?? []);
};

const findAll = async () => {
  const { rows } = await getPool().query(
    `SELECT o.*, c.name AS carrier_name
     FROM orders o
     JOIN carriers c ON c.id = o.carrier_id
     ORDER BY o.created_at DESC`,
  );
  const itemsByOrder = await loadItems(rows.map((row) => row.id));
  return rows.map((row) => mapOrder(row, itemsByOrder.get(row.id) ?? []));
};

const findByBuyerId = async (buyerId) => {
  const { rows } = await getPool().query(
    `SELECT o.*, c.name AS carrier_name
     FROM orders o
     JOIN carriers c ON c.id = o.carrier_id
     WHERE o.buyer_id = $1
     ORDER BY o.created_at DESC`,
    [buyerId],
  );
  const itemsByOrder = await loadItems(rows.map((row) => row.id));
  return rows.map((row) => mapOrder(row, itemsByOrder.get(row.id) ?? []));
};

const findBySellerId = async (sellerId) => {
  const { rows } = await getPool().query(
    `SELECT DISTINCT o.*, c.name AS carrier_name
     FROM orders o
     JOIN carriers c ON c.id = o.carrier_id
     JOIN order_items oi ON oi.order_id = o.id
     WHERE oi.seller_id = $1
     ORDER BY o.created_at DESC`,
    [sellerId],
  );
  const itemsByOrder = await loadItems(rows.map((row) => row.id));
  return rows.map((row) => mapOrder(row, itemsByOrder.get(row.id) ?? []));
};

const normalizePhone = (phone) => phone.replace(/\D/g, '').replace(/^84/, '0');

const findByContact = async ({ phone, email }) => {
  const params = [];
  let condition;

  if (phone) {
    const normalized = normalizePhone(phone);
    condition = `REGEXP_REPLACE(REGEXP_REPLACE(shipping_phone, '\\D', '', 'g'), '^84', '0') = $1`;
    params.push(normalized);
  } else {
    condition = 'LOWER(shipping_email) = LOWER($1)';
    params.push(email);
  }

  const { rows } = await getPool().query(
    `SELECT o.*, c.name AS carrier_name
     FROM orders o
     JOIN carriers c ON c.id = o.carrier_id
     WHERE ${condition}
     ORDER BY o.created_at DESC`,
    params,
  );
  const itemsByOrder = await loadItems(rows.map((row) => row.id));
  return rows.map((row) => mapOrder(row, itemsByOrder.get(row.id) ?? []));
};

const create = async (data) => {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: codeRows } = await client.query(`SELECT 'Y' || nextval('order_code_seq') AS code`);
    const code = codeRows[0].code;
    const id = generateId();

    const { rows } = await client.query(
      `INSERT INTO orders (
         id, code, status, buyer_id, carrier_id,
         shipping_email, shipping_full_name, shipping_phone, shipping_address,
         shipping_province, shipping_district, shipping_ward,
         note, payment_method, subtotal, shipping_fee, total, estimated_delivery, tracking_code
       ) VALUES (
         $1, $2, 'placed', $3, $4,
         $5, $6, $7, $8,
         $9, $10, $11,
         $12, $13, $14, $15, $16, $17, $18
       )
       RETURNING *, (SELECT name FROM carriers WHERE id = $4) AS carrier_name`,
      [
        id,
        code,
        data.buyerId ?? null,
        data.carrierId,
        data.shipping.email,
        data.shipping.fullName,
        data.shipping.phone,
        data.shipping.address,
        data.shipping.province,
        data.shipping.district,
        data.shipping.ward,
        data.note ?? '',
        data.paymentMethod,
        data.subtotal,
        data.shippingFee,
        data.total,
        data.estimatedDelivery,
        data.trackingCode ?? null,
      ],
    );

    for (const item of data.items) {
      await client.query(
        `INSERT INTO order_items (
           order_id, product_id, product_name, product_price, product_category, product_images,
           seller_id, seller_name, quantity, unit_price, selected_options, custom_design
         ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11::jsonb, $12::jsonb)`,
        [
          id,
          item.product.id,
          item.product.name,
          item.product.price,
          item.product.category,
          JSON.stringify(item.product.images ?? []),
          item.product.sellerId ?? null,
          item.product.sellerName ?? null,
          item.quantity,
          item.unitPrice,
          item.selectedOptions ? JSON.stringify(item.selectedOptions) : null,
          item.customDesign ? JSON.stringify(item.customDesign) : null,
        ],
      );
    }

    await client.query('COMMIT');
    return mapOrder(rows[0], data.items);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  create,
  findById,
  findAll,
  findByBuyerId,
  findBySellerId,
  findByContact,
};
