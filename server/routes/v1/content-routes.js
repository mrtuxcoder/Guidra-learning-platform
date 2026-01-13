const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const {
  getContentHistoryController,
} = require("../../controllers/content-controllers/history-controller");
const {
  clearContentCacheController,
} = require("../../controllers/content-controllers/content-cache-controller");

const {
  teachSubtopicController,
  regenerateContentController,
} = require("../../controllers/content-controllers/content-generator");
const {
  generateComponentController,
  regenerateComponentController,
} = require("../../controllers/content-controllers/component-controller");
// Content teaching
router.post("/teach", authMiddleware, teachSubtopicController);
router.post("/regenerate", authMiddleware, regenerateContentController);
router.post("/component", authMiddleware, generateComponentController);
router.post(
  "/component/regenerate",
  authMiddleware,
  regenerateComponentController
);

// Content history and cache
router.get("/history", authMiddleware, getContentHistoryController);
router.delete("/clear", authMiddleware, clearContentCacheController);

module.exports = router;
