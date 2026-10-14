const { body } = require('express-validator');

const loginRules = [
  body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
];

const registerRules = [
  body('name').trim().notEmpty().withMessage('Vui lòng nhập họ tên'),
  body('phone')
    .matches(/^(0|\+84)\d{9}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
];

const registerSellerRules = [
  ...registerRules,
  body('address').trim().notEmpty().withMessage('Vui lòng nhập địa chỉ'),
  body('province').trim().notEmpty().withMessage('Vui lòng chọn tỉnh/thành'),
  body('district').trim().notEmpty().withMessage('Vui lòng chọn quận/huyện'),
  body('ward').trim().notEmpty().withMessage('Vui lòng chọn phường/xã'),
];

module.exports = { loginRules, registerRules, registerSellerRules };
