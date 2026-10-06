const CustomDesign = require('../models/CustomDesign');
const Carrier = require('../models/Carrier');
const Order = require('../models/Order');
const Product = require('../models/Product');
const customDesignService = require('./customDesignService');
const { sendOrderConfirmation } = require('./emailService');
const { getShippingZone } = require('../utils/shippingZones');
const { AppError } = require('../utils/helpers');

const DEFAULT_LEAD_WEEKS = 2;
const CUSTOM_LEAD_WEEKS = 3;

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
  if (!Product.isApproved(product)) {
    throw new AppError(400, `Sản phẩm "${product.name}" chưa được duyệt`);
  }
  if (quantity > product.stock) {
    throw new AppError(400, `Sản phẩm "${product.name}" không đủ hàng`);
  }
  validateOptions(product, selectedOptions);

  const { id, name, price, category, images, sellerId, sellerName } = product;
  return {
    product: { id, name, price, category, images, sellerId, sellerName },
    quantity,
    unitPrice: price,
    selectedOptions,
    leadWeeks: selectedOptions?.leadTime ? parseWeeks(selectedOptions.leadTime) : DEFAULT_LEAD_WEEKS,
  };
};

const calculateShippingFee = async (carrierId, province) => {
  const carrier = await Carrier.findById(carrierId);
  if (!carrier?.isActive) {
    throw new AppError(400, 'Đơn vị vận chuyển không hợp lệ');
  }
  const zone = getShippingZone(province);
  const fee = await Carrier.getFee(carrierId, zone);
  if (fee === null) {
    throw new AppError(400, 'Không tìm thấy bảng giá vận chuyển cho khu vực này');
  }
  return fee;
};

const createOrder = async ({ items, shipping, note, paymentMethod, carrierId, buyerId }) => {
  const builtItems = await Promise.all(items.map(buildItem));
  const subtotal = builtItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = await calculateShippingFee(carrierId, shipping.province);
  const leadWeeks = Math.max(...builtItems.map((item) => item.leadWeeks));
  const estimatedDelivery = new Date(Date.now() + leadWeeks * 7 * 24 * 60 * 60 * 1000).toISOString();

  const orderItems = builtItems.map(({ leadWeeks: _leadWeeks, ...item }) => item);
  const order = await Order.create({
    buyerId: buyerId ?? null,
    carrierId,
    items: orderItems,
    shipping,
    note: note ?? '',
    paymentMethod,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    estimatedDelivery,
  });

  await sendOrderConfirmation(order);
  return order;
};

const getOrderById = async (id) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(404, 'Không tìm thấy đơn hàng');
  }
  return order;
};

const lookupOrders = ({ phone, email }) => Order.findByContact({ phone, email });

const listUserOrders = async (buyerId) => Order.findByBuyerId(buyerId);

const listSellerOrders = async (sellerId) => Order.findBySellerId(sellerId);

module.exports = {
  calculateShippingFee,
  createOrder,
  getOrderById,
  lookupOrders,
  listUserOrders,
  listSellerOrders,
};
