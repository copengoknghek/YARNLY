const { Router } = require('express');
const productController = require('../controllers/productController');
const validate = require('../middleware/validate');
const { listProductsRules } = require('../validators/productValidator');

const router = Router();

router.get('/', validate(listProductsRules), productController.listProducts);
router.get('/:id', productController.getProduct);

module.exports = router;
