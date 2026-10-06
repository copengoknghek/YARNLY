const { body } = require('express-validator');

const rejectProductRules = [body('note').optional().isString().withMessage('Ghi chú không hợp lệ')];

module.exports = { rejectProductRules };
