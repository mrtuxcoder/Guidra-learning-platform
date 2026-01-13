const {
  debugCacheComponentController,
  debugCacheController,
  compareComponentVersionsController,
  clearAllComponentCacheController,
  getComponentStatsController,
  mergeCacheComponentsController,
  getComponentHistoryController,
  getAllCachedComponentsController,
} = require("../../controllers/content-controllers/cache-analysis-controller");

const authMiddleware = require("../../middlewares/auth-middleware");
const express = require("express");
const router = express.Router();

router.get("/component/history", authMiddleware, getComponentHistoryController);
router.get("/component/stats", authMiddleware, getComponentStatsController);
router.get("/debug", authMiddleware, debugCacheController);
router.delete(
  "/component/clear",
  authMiddleware,
  clearAllComponentCacheController
);
router.put("/component/merge", authMiddleware, mergeCacheComponentsController);
router.put("/component/debug", authMiddleware, debugCacheComponentController);
router.get(
  "/component/compare",
  authMiddleware,
  compareComponentVersionsController
);
router.get("/component", authMiddleware, getAllCachedComponentsController);

module.exports = router;
