const { Router } = require('express');
const customDesignController = require('../controllers/customDesignController');

const router = Router();

router.get('/options', customDesignController.getOptions);

module.exports = router;
