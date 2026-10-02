const { Router } = require('express');
const authRoutes = require('./authRoutes');
const cartRoutes = require('./cartRoutes');
const customDesignRoutes = require('./customDesignRoutes');
const orderRoutes = require('./orderRoutes');
const productRoutes = require('./productRoutes');
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
router.use('/users', userRoutes);

module.exports = router;
