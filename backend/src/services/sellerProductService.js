const Product = require('../models/Product');
const { AppError } = require('../utils/helpers');

const PLACEHOLDER_IMAGE = '/images/products/moc-khoa-huou-cao-co.jpg';

const listProducts = async (sellerId) => Product.findAll({ sellerId });

const createProduct = async (seller, input) => {
  return Product.create({
    sellerId: seller.id,
    sellerName: seller.name,
    name: input.name.trim(),
    description: input.description.trim(),
    price: input.price,
    category: input.category,
    stock: input.stock,
    images: input.imageUrl?.trim() ? [input.imageUrl.trim()] : [PLACEHOLDER_IMAGE],
    approvalStatus: 'pending',
  });
};

const updateProduct = async (sellerId, productId, input) => {
  const existing = await Product.findById(productId);
  if (!existing || existing.sellerId !== sellerId) {
    throw new AppError(404, 'Không tìm thấy sản phẩm');
  }
  if (existing.approvalStatus !== 'rejected') {
    throw new AppError(400, 'Chỉ có thể sửa sản phẩm bị từ chối');
  }
  const updated = await Product.update(productId, sellerId, {
    name: input.name.trim(),
    description: input.description.trim(),
    price: input.price,
    category: input.category,
    stock: input.stock,
    images: input.imageUrl?.trim() ? [input.imageUrl.trim()] : existing.images,
  });
  return updated;
};

const updateStock = async (sellerId, productId, stock) => {
  const updated = await Product.updateStock(productId, sellerId, stock);
  if (!updated) {
    throw new AppError(404, 'Không tìm thấy sản phẩm');
  }
  return updated;
};

const getStats = async (sellerId) => Product.countBySeller(sellerId);

module.exports = { listProducts, createProduct, updateProduct, updateStock, getStats };
