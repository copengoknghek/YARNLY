const { body } = require('express-validator');

const updateProfileRules = [
  body('name').optional().trim().notEmpty().withMessage('Vui lòng nhập họ tên'),
  body('phone')
    .optional()
    .trim()
    .matches(/^(0|\+84)\d{9}$/)
    .withMessage('Số điện thoại không hợp lệ'),
];

module.exports = { updateProfileRules };
