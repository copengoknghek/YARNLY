const { body, oneOf, query } = require('express-validator');
const { PAYMENT_METHODS } = require('../models/Order');

const PHONE_PATTERN = /^(0|\+84)\d{9}$/;

const createOrderRules = [
  body('items').isArray({ min: 1 }).withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  body('items.*.productId').isString().notEmpty().withMessage('Mã sản phẩm không hợp lệ'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0').toInt(),
  body('items.*.selectedOptions').optional().isObject().withMessage('Tùy chọn sản phẩm không hợp lệ'),
  body('items.*.customDesign').optional().isObject().withMessage('Thiết kế riêng không hợp lệ'),
  body('shipping.email').isEmail().withMessage('Email không hợp lệ'),
  body('shipping.fullName').trim().notEmpty().withMessage('Vui lòng nhập họ tên'),
  body('shipping.phone').matches(PHONE_PATTERN).withMessage('Số điện thoại không hợp lệ'),
  body('shipping.address').trim().notEmpty().withMessage('Vui lòng nhập địa chỉ'),
  body('shipping.province').trim().notEmpty().withMessage('Vui lòng chọn tỉnh thành'),
  body('shipping.district').trim().notEmpty().withMessage('Vui lòng chọn quận huyện'),
  body('shipping.ward').trim().notEmpty().withMessage('Vui lòng chọn phường xã'),
  body('note').optional().isString().isLength({ max: 500 }).withMessage('Ghi chú tối đa 500 ký tự'),
  body('paymentMethod')
    .isIn(PAYMENT_METHODS)
    .withMessage(`Phương thức thanh toán phải là một trong: ${PAYMENT_METHODS.join(', ')}`),
];

const lookupOrderRules = [
  oneOf(
    [
      query('phone').matches(PHONE_PATTERN),
      query('email').isEmail(),
    ],
    { message: 'Vui lòng nhập số điện thoại hoặc email hợp lệ' },
  ),
];

module.exports = { createOrderRules, lookupOrderRules };
