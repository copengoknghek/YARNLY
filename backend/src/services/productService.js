const Product = require('../models/Product');
const { AppError } = require('../utils/helpers');

const DEFAULT_PAGE_SIZE = 12;

const listProducts = async ({ page = 1, pageSize = DEFAULT_PAGE_SIZE, ...filters } = {}) => {
  const all = await Product.findAll(filters);
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  const start = (page - 1) * pageSize;
  return {
    items: all.slice(start, start + pageSize),
    total: all.length,
    page,
    pageSize,
    totalPages,
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(404, 'Không tìm thấy sản phẩm');
  }
  return product;
};

module.exports = { listProducts, getProductById };
