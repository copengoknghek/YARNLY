const CustomDesign = require('../models/CustomDesign');
const Order = require('../models/Order');
const Product = require('../models/Product');
const customDesignService = require('./customDesignService');
const { AppError, notImplemented } = require('../utils/helpers');

// Keep in sync with frontend/src/utils/shipping.ts
const LOCAL_PROVINCE = 'Đà Nẵng';
const LOCAL_SHIPPING_FEE = 12000;
const DEFAULT_SHIPPING_FEE = 30000;
const DEFAULT_LEAD_WEEKS = 2;
const CUSTOM_LEAD_WEEKS = 3;

const calculateShippingFee = (province) =>
  province === LOCAL_PROVINCE ? LOCAL_SHIPPING_FEE : DEFAULT_SHIPPING_FEE;

const parseWeeks = (leadTime) => Number.parseInt(leadTime, 10) || DEFAULT_LEAD_WEEKS;

const validateOptions = (product, selectedOptions = {}) => {
  const checks = [
    ['color', product.options?.colors],
    ['size', product.options?.sizes],
    ['leadTime', product.options?.leadTimes],
  ];
  for (const [key, allowed] of checks) {
    const value = selectedOptions[key];
    if (value !== undefined && !allowed?.includes(value)) {
      throw new AppError(400, `Lựa chọn "${value}" không hợp lệ cho sản phẩm "${product.name}"`);
    }
  }
};

const buildItem = async ({ productId, quantity, selectedOptions, customDesign }) => {
  if (productId === CustomDesign.PRODUCT_ID) {
    const { price, product } = await customDesignService.quote(customDesign);
    return { product, quantity, unitPrice: price, customDesign, leadWeeks: CUSTOM_LEAD_WEEKS };
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(400, `Sản phẩm ${productId} không tồn tại`);
  }
  if (quantity > product.stock) {
    throw new AppError(400, `Sản phẩm "${product.name}" không đủ hàng`);
  }
  validateOptions(product, selectedOptions);

  const { id, name, price, category, images } = product;
  return {
    product: { id, name, price, category, images },
    quantity,
    unitPrice: price,
    selectedOptions,
    leadWeeks: selectedOptions?.leadTime ? parseWeeks(selectedOptions.leadTime) : DEFAULT_LEAD_WEEKS,
  };
};

const createOrder = async ({ items, shipping, note, paymentMethod }) => {
  const builtItems = await Promise.all(items.map(buildItem));

  const subtotal = builtItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = calculateShippingFee(shipping.province);
  const leadWeeks = Math.max(...builtItems.map((item) => item.leadWeeks));
  const estimatedDelivery = new Date(Date.now() + leadWeeks * 7 * 24 * 60 * 60 * 1000).toISOString();

  return Order.create({
    items: builtItems.map(({ leadWeeks: _leadWeeks, ...item }) => item),
    shipping,
    note: note ?? '',
    paymentMethod,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    estimatedDelivery,
  });
};

const getOrderById = async (id) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(404, 'Không tìm thấy đơn hàng');
  }
  return order;
};

const lookupOrders = ({ phone, email }) => Order.findByContact({ phone, email });

const listUserOrders = async () => {
  throw notImplemented('lịch sử đơn hàng');
};

module.exports = { calculateShippingFee, createOrder, getOrderById, lookupOrders, listUserOrders };
