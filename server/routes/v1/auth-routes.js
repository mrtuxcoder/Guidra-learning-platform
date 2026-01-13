const express = require("express");
const router = express.Router();
const {
  loginController,
  registerController,
  logoutController,
} = require("../../controllers/auth-controllers/local-auth-controller");
const {
  googleAuthController,
  googleCallbackController,
  googleSuccessController,
} = require("../../controllers/auth-controllers/google-auth-controller");

// Local authentication
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/logout", logoutController);

// Google OAuth
router.get("/google", googleAuthController);
router.get("/google/callback", googleCallbackController);
router.get("/google/success", googleSuccessController);

module.exports = router;
