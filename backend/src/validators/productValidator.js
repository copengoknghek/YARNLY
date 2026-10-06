const { query } = require('express-validator');
const { CATEGORIES, SORT_OPTIONS } = require('../models/Product');

const listProductsRules = [
  query('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Danh mục phải là một trong: ${CATEGORIES.join(', ')}`),
  query('search').optional().isString().withMessage('Từ khóa tìm kiếm không hợp lệ'),
  query('status')
    .optional()
    .isIn(['in-stock', 'out-of-stock'])
    .withMessage('Tình trạng phải là in-stock hoặc out-of-stock'),
  query('sort')
    .optional()
    .isIn(SORT_OPTIONS)
    .withMessage(`Sắp xếp phải là một trong: ${SORT_OPTIONS.join(', ')}`),
  query('bestSeller').optional().isBoolean().withMessage('bestSeller phải là true hoặc false').toBoolean(),
  query('page').optional().isInt({ min: 1 }).withMessage('Trang phải là số nguyên dương').toInt(),
  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Số sản phẩm mỗi trang từ 1 đến 50')
    .toInt(),
];

module.exports = { listProductsRules };
