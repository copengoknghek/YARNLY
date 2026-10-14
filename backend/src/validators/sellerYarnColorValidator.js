const { body, param } = require('express-validator');

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

const createColorRules = [
  body('name').trim().notEmpty().withMessage('Vui lòng nhập tên màu'),
  body('hex').matches(HEX_PATTERN).withMessage('Mã màu phải đúng định dạng #rrggbb'),
  body('stock').isInt({ min: 0 }).withMessage('Tồn kho phải là số không âm'),
];

const updateColorRules = [
  param('id').notEmpty(),
  body('name').optional().trim().notEmpty().withMessage('Tên màu không được để trống'),
  body('hex').optional().matches(HEX_PATTERN).withMessage('Mã màu phải đúng định dạng #rrggbb'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Tồn kho phải là số không âm'),
];

const deleteColorRules = [param('id').notEmpty()];

module.exports = { createColorRules, updateColorRules, deleteColorRules };
