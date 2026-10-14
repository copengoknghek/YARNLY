const { Router } = require('express');
const env = require('../config/env');
const { cleanupGuestOrders } = require('../services/guestOrderCleanupService');

const router = Router();

router.get('/cleanup-guest-orders', async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!env.cronSecret || auth !== `Bearer ${env.cronSecret}`) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const result = await cleanupGuestOrders();
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
