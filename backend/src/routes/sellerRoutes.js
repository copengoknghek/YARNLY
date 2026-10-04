const { Router } = require('express');
const sellerProductController = require('../controllers/sellerProductController');
const auth = require('../middleware/auth');
const { requireSeller } = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const {
  createProductRules,
  updateProductRules,
  updateStockRules,
} = require('../validators/sellerProductValidator');

const router = Router();

router.use(auth, requireSeller);

router.get('/stats', sellerProductController.getStats);
router.get('/products', sellerProductController.listProducts);
router.post('/products', validate(createProductRules), sellerProductController.createProduct);
router.patch('/products/:id', validate(updateProductRules), sellerProductController.updateProduct);
router.patch('/products/:id/stock', validate(updateStockRules), sellerProductController.updateStock);

module.exports = router;
