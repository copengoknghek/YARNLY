const { Router } = require('express');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const cartRoutes = require('./cartRoutes');
const customDesignRoutes = require('./customDesignRoutes');
const orderRoutes = require('./orderRoutes');
const productRoutes = require('./productRoutes');
const sellerRoutes = require('./sellerRoutes');
const userRoutes = require('./userRoutes');

const router = Router();

router.get('/health', (req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/custom-designs', customDesignRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/seller', sellerRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

module.exports = router;
