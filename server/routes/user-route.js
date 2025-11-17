const express = require('express')
const router = express.Router()

const {loginController, registerController,logoutController, profileController, checkUserExists, googleAuthController,googleSuccessController,googleCallbackController} = require('../controllers/auth-controller')
const authMiddleware = require('../middlewares/authMiddleware')


router.post('/login',loginController)
router.post('/register',registerController)
router.post('/logout',logoutController)
router.get('/profile',authMiddleware, profileController)




// Google OAuth routes
router.get('/google', googleAuthController);
router.get('/google/callback', googleCallbackController);
router.get('/google/success', googleSuccessController);


// Utility route
router.get('/check-user', checkUserExists);

module.exports = router;