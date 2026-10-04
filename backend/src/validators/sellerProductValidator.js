const { body } = require('express-validator');
const { CATEGORIES } = require('../models/Product');

const createProductRules = [
  body('name').trim().notEmpty().withMessage('Vui lòng nhập tên sản phẩm'),
  body('description').trim().notEmpty().withMessage('Vui lòng nhập mô tả'),
  body('price').isInt({ min: 1000 }).withMessage('Giá sản phẩm không hợp lệ').toInt(),
  body('category').isIn(CATEGORIES).withMessage('Danh mục không hợp lệ'),
  body('stock').isInt({ min: 0 }).withMessage('Tồn kho không hợp lệ').toInt(),
  body('imageUrl').optional().isString(),
];

const updateProductRules = createProductRules;

const updateStockRules = [
  body('stock').isInt({ min: 0 }).withMessage('Tồn kho không hợp lệ').toInt(),
];

module.exports = { createProductRules, updateProductRules, updateStockRules };
