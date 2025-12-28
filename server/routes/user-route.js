const express = require('express')
const router = express.Router()

const { profileController, checkUserExists} = require('../controllers/auth-controllers/auth-profile-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const {loginController, registerController,logoutController} = require('../controllers/auth-controllers/local-auth-controller')
const { googleAuthController,googleSuccessController,googleCallbackController} = require('../controllers/auth-controllers/google-auth-controller')

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