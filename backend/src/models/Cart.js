/**
 * Cart: { userId, items: [{ productId, quantity }] }
 */
const carts = new Map();

const findByUserId = async (userId) => carts.get(userId) ?? { userId, items: [] };

const save = async (cart) => {
  carts.set(cart.userId, cart);
  return cart;
};

module.exports = { findByUserId, save };
