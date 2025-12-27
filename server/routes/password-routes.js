const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password-controller');
const authMiddleware = require('../middlewares/auth-middleware')

// Password management routes
router.post('/set', authMiddleware, passwordController.setPassword);
router.post('/change', authMiddleware, passwordController.changePassword);
router.get('/status', authMiddleware, passwordController.checkPasswordStatus);

module.exports = router;