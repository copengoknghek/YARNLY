const { Router } = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createOrderRules, lookupOrderRules } = require('../validators/orderValidator');

const router = Router();

router.post('/', validate(createOrderRules), orderController.createOrder);
router.get('/', auth, orderController.listMyOrders);
router.get('/lookup', validate(lookupOrderRules), orderController.lookupOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;
