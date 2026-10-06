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
    `INSERT INTO users (id, name, email, phone, password_hash, role, user_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user.id, user.name, user.email, user.phone ?? null, user.passwordHash, user.role, user.userType ?? null],
  );
  return mapUser(rows[0]);
};

const update = async (id, patch) => {
  const current = await findById(id);
  if (!current) return null;

  const next = { ...current, ...patch };
  const { rows } = await getPool().query(
    `UPDATE users
     SET name = $2, email = $3, phone = $4, password_hash = $5, role = $6, user_type = $7
     WHERE id = $1
     RETURNING *`,
    [id, next.name, next.email, next.phone ?? null, next.passwordHash, next.role, next.userType ?? null],
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
    `INSERT INTO users (id, name, email, phone, password_hash, role, user_type, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8::timestamptz, NOW()))
     RETURNING *`,
    [
      user.id,
      user.name,
      user.email,
      user.phone ?? null,
      user.passwordHash,
      user.role,
      user.userType ?? null,
      user.createdAt ?? null,
    ],
  );
  return mapUser(rows[0]);
};

module.exports = { ROLES, USER_TYPES, findByEmail, findById, create, update, seedUser };
