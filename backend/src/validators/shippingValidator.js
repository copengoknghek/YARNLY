const { query } = require('express-validator');

const shippingQuoteRules = [
  query('province').trim().notEmpty().withMessage('Vui lòng chọn tỉnh thành'),
];

module.exports = { shippingQuoteRules };
