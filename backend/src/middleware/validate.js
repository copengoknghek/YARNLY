const { validationResult } = require('express-validator');

const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: result.array().map((error) => ({ field: error.path, message: error.msg })),
    });
  },
];

module.exports = validate;
