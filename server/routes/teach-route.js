

const express = require("express");
const router = express.Router();
const {
  subtopicGenerateController,
   getSubtopicsController,
  updateLearningPreferencesController,
  updateSubtopicProgressController,
  validateTopicController
} = require("../controllers/learn-controller");

const {
  teachSubtopicController,
  regenerateContentController,
  getContentHistoryController,
  clearContentCacheController,
    generateMermaidMapController,
    fixMermaidSyntaxController
} = require('../controllers/content-controller')

const authMiddleware = require("../middlewares/auth-middleware");

// Learning & Progress Routes
router.post("/new", authMiddleware, subtopicGenerateController )
router.put("/update", authMiddleware, updateLearningPreferencesController);
router.get("/subtopics/:topic", authMiddleware, getSubtopicsController);
router.put("/progress", authMiddleware, updateSubtopicProgressController);

// Content Generation & Cache Routes
router.post("/teach", authMiddleware, teachSubtopicController); // Main teaching with caching
router.post("/regenerate", authMiddleware, regenerateContentController); // Force regenerate content
router.get("/content-history", authMiddleware, getContentHistoryController); // Get cache history
router.delete("/clear-cache", authMiddleware, clearContentCacheController); // Clear user cache
router.post("/validate-topic", authMiddleware, validateTopicController); // validate topic
router.post('/generate-mindmap', authMiddleware, generateMermaidMapController);
router.post('/fix-mindmap-syntax', authMiddleware, fixMermaidSyntaxController);


module.exports = router;