const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const {
  profileController,
  checkUserExists,
} = require("../../controllers/auth-controllers/auth-profile-controller");
const passwordController = require("../../controllers/password-controller");

// User profile
router.get("/me", authMiddleware, profileController);

// Check user existence (public)
router.get("/check", checkUserExists);

// Password management
router.get(
  "/me/password/status",
  authMiddleware,
  passwordController.checkPasswordStatus
);
router.post("/me/password/set", authMiddleware, passwordController.setPassword);
router.put(
  "/me/password/change",
  authMiddleware,
  passwordController.changePassword
);

module.exports = router;
