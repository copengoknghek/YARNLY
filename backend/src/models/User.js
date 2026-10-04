const { generateId } = require('../utils/helpers');

/**
 * User: { id, name, email, phone, passwordHash, role: 'admin' | 'user',
 *         userType?: 'buyer' | 'seller' (only for role 'user'), createdAt }
 */
const ROLES = ['admin', 'user'];
const USER_TYPES = ['buyer', 'seller'];

const users = [];

const findByEmail = async (email) =>
  users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;

const findById = async (id) => users.find((user) => user.id === id) ?? null;

const create = async (data) => {
  const user = {
    id: generateId(),
    role: 'user',
    userType: 'buyer',
    createdAt: new Date().toISOString(),
    ...data,
  };
  users.push(user);
  return user;
};

const update = async (id, patch) => {
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) return null;
  users[index] = { ...users[index], ...patch };
  return users[index];
};

const seedUser = (data) => {
  const existing = users.find((user) => user.email.toLowerCase() === data.email.toLowerCase());
  if (existing) return existing;
  const user = {
    id: data.id ?? generateId(),
    role: data.role ?? 'user',
    userType: data.userType ?? 'buyer',
    createdAt: new Date().toISOString(),
    ...data,
  };
  users.push(user);
  return user;
};

module.exports = { ROLES, USER_TYPES, users, findByEmail, findById, create, update, seedUser };
