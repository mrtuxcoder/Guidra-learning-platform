const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const authMiddleware = require('../middlewares/authMiddleware')

// Password management routes
router.post('/set', authMiddleware, passwordController.setPassword);
router.post('/change', authMiddleware, passwordController.changePassword);
router.get('/status', authMiddleware, passwordController.checkPasswordStatus);

module.exports = router;