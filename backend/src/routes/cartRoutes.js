const { Router } = require('express');
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = Router();

router.use(auth);
router.get('/', cartController.getCart);
router.post('/', cartController.addItem);
router.patch('/:productId', cartController.updateItem);
router.delete('/:productId', cartController.removeItem);

module.exports = router;
