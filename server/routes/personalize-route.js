

const express = require("express");
const router = express.Router();
const {
  personalizeAndGenerateController,
  getSubtopicsController,
  updateLearningPreferencesController,
  updateSubtopicProgressController,
  generateTeachingContentController,
  validateTopicController
} = require("../controllers/learn-controller");

const {
  teachSubtopicController,
  regenerateContentController,
  getContentHistoryController,
  clearContentCacheController
} = require('../controllers/content-controller')

const authMiddleware = require("../middlewares/authMiddleware");

// Learning & Progress Routes
router.post("/new", authMiddleware, personalizeAndGenerateController)
router.put("/update", authMiddleware, updateLearningPreferencesController);
router.get("/subtopics/:topic", authMiddleware, getSubtopicsController);
router.put("/progress", authMiddleware, updateSubtopicProgressController);

// Content Generation & Cache Routes
router.post("/teach", authMiddleware, teachSubtopicController); // Main teaching with caching
router.post("/regenerate", authMiddleware, regenerateContentController); // Force regenerate content
router.get("/content-history", authMiddleware, getContentHistoryController); // Get cache history
router.delete("/clear-cache", authMiddleware, clearContentCacheController); // Clear user cache
router.post("/validate-topic", authMiddleware, validateTopicController); // validate topic

// Legacy endpoint (optional - keep if needed)
router.post("/teach-legacy", authMiddleware, generateTeachingContentController);

module.exports = router;