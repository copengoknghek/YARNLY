const { Router } = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileRules } = require('../validators/userValidator');

const router = Router();

router.use(auth);
router.get('/me', userController.getProfile);
router.patch('/me', validate(updateProfileRules), userController.updateProfile);

module.exports = router;
