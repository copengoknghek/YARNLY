const { Router } = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = Router();

router.use(auth);
router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);

module.exports = router;
