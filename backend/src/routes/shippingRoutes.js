const { Router } = require('express');
const shippingController = require('../controllers/shippingController');
const validate = require('../middleware/validate');
const { shippingQuoteRules } = require('../validators/shippingValidator');

const router = Router();

router.get('/quotes', validate(shippingQuoteRules), shippingController.getQuotes);

module.exports = router;
