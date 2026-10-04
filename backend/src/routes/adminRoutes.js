const { Router } = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const { rejectProductRules } = require('../validators/adminProductValidator');

const router = Router();

router.use(auth, requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/products/pending', adminController.listPendingProducts);
router.post('/products/:id/approve', adminController.approveProduct);
router.post('/products/:id/reject', validate(rejectProductRules), adminController.rejectProduct);
router.get('/orders', adminController.listOrders);

module.exports = router;
