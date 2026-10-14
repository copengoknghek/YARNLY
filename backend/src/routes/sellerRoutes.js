const { Router } = require('express');
const sellerProductController = require('../controllers/sellerProductController');
const sellerYarnColorController = require('../controllers/sellerYarnColorController');
const auth = require('../middleware/auth');
const { requireSeller } = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const {
  createProductRules,
  updateProductRules,
  updateStockRules,
} = require('../validators/sellerProductValidator');
const {
  createColorRules,
  updateColorRules,
  deleteColorRules,
} = require('../validators/sellerYarnColorValidator');

const router = Router();

router.use(auth, requireSeller);

router.get('/stats', sellerProductController.getStats);
router.get('/products', sellerProductController.listProducts);
router.post('/products', validate(createProductRules), sellerProductController.createProduct);
router.patch('/products/:id', validate(updateProductRules), sellerProductController.updateProduct);
router.patch('/products/:id/stock', validate(updateStockRules), sellerProductController.updateStock);

router.get('/colors', sellerYarnColorController.listColors);
router.post('/colors', validate(createColorRules), sellerYarnColorController.createColor);
router.patch('/colors/:id', validate(updateColorRules), sellerYarnColorController.updateColor);
router.delete('/colors/:id', validate(deleteColorRules), sellerYarnColorController.deleteColor);

module.exports = router;
