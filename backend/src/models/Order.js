const { generateId } = require('../utils/helpers');

/**
 * Order: {
 *   id, code: 'Y1', status: 'placed' | 'crafting' | 'shipping' | 'delivered' | 'cancelled',
 *   items: [{ product, quantity, unitPrice, selectedOptions?, customDesign? }],
 *   shipping: { email, fullName, phone, address, province, district, ward },
 *   note, paymentMethod: 'momo' | 'zalopay' | 'cod',
 *   subtotal, shippingFee, total, estimatedDelivery, trackingCode, createdAt
 * }
 */
const ORDER_STATUSES = ['placed', 'crafting', 'shipping', 'delivered', 'cancelled'];
const PAYMENT_METHODS = ['momo', 'zalopay', 'cod'];

const orders = [];

const create = async (data) => {
  const order = {
    id: generateId(),
    code: `Y${orders.length + 1}`,
    status: 'placed',
    trackingCode: null,
    createdAt: new Date().toISOString(),
    ...data,
  };
  orders.push(order);
  return order;
};

const findById = async (id) => orders.find((order) => order.id === id) ?? null;

const normalizePhone = (phone) => phone.replace(/\D/g, '').replace(/^84/, '0');

const findByContact = async ({ phone, email }) =>
  orders
    .filter((order) =>
      phone
        ? normalizePhone(order.shipping.phone) === normalizePhone(phone)
        : order.shipping.email?.toLowerCase() === email.toLowerCase(),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

module.exports = { ORDER_STATUSES, PAYMENT_METHODS, create, findById, findByContact };
