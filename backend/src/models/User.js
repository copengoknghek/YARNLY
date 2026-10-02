const { generateId } = require('../utils/helpers');

/**
 * User: { id, name, email, phone, passwordHash, role: 'admin' | 'user',
 *         userType?: 'buyer' | 'seller' (only for role 'user'), createdAt }
 */
const ROLES = ['admin', 'user'];
const USER_TYPES = ['buyer', 'seller'];

const users = [];

const findByEmail = async (email) => users.find((user) => user.email === email) ?? null;

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

module.exports = { ROLES, USER_TYPES, findByEmail, findById, create };
