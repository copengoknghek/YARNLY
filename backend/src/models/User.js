const { getPool } = require('../config/db');
const { generateId } = require('../utils/helpers');

const ROLES = ['admin', 'user'];
const USER_TYPES = ['buyer', 'seller'];

const mapUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  passwordHash: row.password_hash,
  role: row.role,
  userType: row.user_type ?? undefined,
  address: row.address ?? undefined,
  province: row.province ?? undefined,
  district: row.district ?? undefined,
  ward: row.ward ?? undefined,
  createdAt: row.created_at.toISOString(),
});

const findByEmail = async (email) => {
  const { rows } = await getPool().query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
  return rows[0] ? mapUser(rows[0]) : null;
};

const findById = async (id) => {
  const { rows } = await getPool().query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return rows[0] ? mapUser(rows[0]) : null;
};

const create = async (data) => {
  const user = {
    id: generateId(),
    role: 'user',
    userType: 'buyer',
    ...data,
  };
  const { rows } = await getPool().query(
    `INSERT INTO users (id, name, email, phone, password_hash, role, user_type, address, province, district, ward)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      user.id,
      user.name,
      user.email,
      user.phone ?? null,
      user.passwordHash,
      user.role,
      user.userType ?? null,
      user.address ?? null,
      user.province ?? null,
      user.district ?? null,
      user.ward ?? null,
    ],
  );
  return mapUser(rows[0]);
};

const update = async (id, patch) => {
  const current = await findById(id);
  if (!current) return null;

  const next = { ...current, ...patch };
  const { rows } = await getPool().query(
    `UPDATE users
     SET name = $2, email = $3, phone = $4, password_hash = $5, role = $6, user_type = $7,
         address = $8, province = $9, district = $10, ward = $11
     WHERE id = $1
     RETURNING *`,
    [
      id,
      next.name,
      next.email,
      next.phone ?? null,
      next.passwordHash,
      next.role,
      next.userType ?? null,
      next.address ?? null,
      next.province ?? null,
      next.district ?? null,
      next.ward ?? null,
    ],
  );
  return mapUser(rows[0]);
};

const seedUser = async (data) => {
  const existing = await findByEmail(data.email);
  if (existing) return existing;

  const user = {
    id: data.id ?? generateId(),
    role: data.role ?? 'user',
    userType: data.userType ?? 'buyer',
    ...data,
  };

  const { rows } = await getPool().query(
    `INSERT INTO users (id, name, email, phone, password_hash, role, user_type, address, province, district, ward, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($12::timestamptz, NOW()))
     RETURNING *`,
    [
      user.id,
      user.name,
      user.email,
      user.phone ?? null,
      user.passwordHash,
      user.role,
      user.userType ?? null,
      user.address ?? null,
      user.province ?? null,
      user.district ?? null,
      user.ward ?? null,
      user.createdAt ?? null,
    ],
  );
  return mapUser(rows[0]);
};

/** Fill missing seller addresses (runs on every server start). */
const backfillSellerAddresses = async (sellerEntries, fallback) => {
  const pool = getPool();
  for (const entry of sellerEntries) {
    await pool.query(
      `UPDATE users
       SET address = COALESCE(address, $2),
           province = COALESCE(province, $3),
           district = COALESCE(district, $4),
           ward = COALESCE(ward, $5)
       WHERE id = $1 AND user_type = 'seller'`,
      [entry.id, entry.address, entry.province, entry.district, entry.ward],
    );
  }
  await pool.query(
    `UPDATE users
     SET address = $1, province = $2, district = $3, ward = $4
     WHERE user_type = 'seller' AND province IS NULL`,
    [fallback.address, fallback.province, fallback.district, fallback.ward],
  );
};

module.exports = {
  ROLES,
  USER_TYPES,
  findByEmail,
  findById,
  create,
  update,
  seedUser,
  backfillSellerAddresses,
};
