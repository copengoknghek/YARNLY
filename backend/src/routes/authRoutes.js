const { Router } = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginRules, registerRules } = require('../validators/authValidator');

const router = Router();

router.post('/register', validate(registerRules), authController.register);
router.post('/register/seller', validate(registerRules), authController.registerSeller);
router.post('/login', validate(loginRules), authController.login);
router.post('/logout', authController.logout);

module.exports = router;
