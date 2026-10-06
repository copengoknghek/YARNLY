const Order = require('../models/Order');
const Product = require('../models/Product');
const { AppError } = require('../utils/helpers');

const listPendingProducts = async () => Product.findAll({ approvalStatus: 'pending' });

const approveProduct = async (productId) => {
  const product = await Product.approve(productId);
  if (!product) {
    throw new AppError(404, 'Không tìm thấy sản phẩm');
  }
  return product;
};

const rejectProduct = async (productId, note) => {
  const product = await Product.reject(productId, note);
  if (!product) {
    throw new AppError(404, 'Không tìm thấy sản phẩm');
  }
  return product;
};

const toAdminOrder = (order) => {
  const sellerIds = [...new Set(order.items.map((item) => item.product.sellerId).filter(Boolean))];
  const sellerNames = [...new Set(order.items.map((item) => item.product.sellerName).filter(Boolean))];
  return {
    id: order.id,
    code: order.code,
    status: order.status,
    buyerName: order.shipping.fullName,
    buyerEmail: order.shipping.email,
    buyerPhone: order.shipping.phone,
    sellerId: sellerIds[0] ?? '',
    sellerName: sellerNames.length > 1 ? sellerNames.join(', ') : sellerNames[0] ?? 'Yarnly',
    items: order.items.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    total: order.total,
    createdAt: order.createdAt,
  };
};

const listOrders = async () => {
  const orders = await Order.findAll();
  return orders.map(toAdminOrder);
};

const getStats = async () => {
  const orders = await Order.findAll();
  const pendingProducts = await Product.findAll({ approvalStatus: 'pending' });
  const byStatus = Order.ORDER_STATUSES.reduce(
    (acc, status) => ({
      ...acc,
      [status]: orders.filter((order) => order.status === status).length,
    }),
    {},
  );
  return {
    totalOrders: orders.length,
    pendingProducts: pendingProducts.length,
    byStatus,
  };
};

module.exports = { listPendingProducts, approveProduct, rejectProduct, listOrders, getStats };
