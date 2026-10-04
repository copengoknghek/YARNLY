const { generateId } = require('../utils/helpers');

/**
 * Order: {
 *   id, code: 'Y1', status: 'placed' | 'crafting' | 'shipping' | 'delivered' | 'cancelled',
 *   buyerId?,
 *   items: [{ product: { id, name, price, category, images, sellerId?, sellerName? }, quantity, unitPrice, ... }],
 *   shipping, note, paymentMethod, subtotal, shippingFee, total, estimatedDelivery, trackingCode, createdAt
 * }
 */
const ORDER_STATUSES = ['placed', 'crafting', 'shipping', 'delivered', 'cancelled'];
const PAYMENT_METHODS = ['momo', 'zalopay', 'cod'];

const orders = [];

const create = async (data) => {
  const order = {
    id: generateId(),
    code: `Y${orders.length + 1001}`,
    status: 'placed',
    trackingCode: null,
    createdAt: new Date().toISOString(),
    ...data,
  };
  orders.push(order);
  return order;
};

const findById = async (id) => orders.find((order) => order.id === id) ?? null;

const findAll = async () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const findByBuyerId = async (buyerId) =>
  orders
    .filter((order) => order.buyerId === buyerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const findBySellerId = async (sellerId) =>
  orders
    .filter((order) => order.items.some((item) => item.product.sellerId === sellerId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const normalizePhone = (phone) => phone.replace(/\D/g, '').replace(/^84/, '0');

const findByContact = async ({ phone, email }) =>
  orders
    .filter((order) =>
      phone
        ? normalizePhone(order.shipping.phone) === normalizePhone(phone)
        : order.shipping.email?.toLowerCase() === email.toLowerCase(),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

module.exports = {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  orders,
  create,
  findById,
  findAll,
  findByBuyerId,
  findBySellerId,
  findByContact,
};
