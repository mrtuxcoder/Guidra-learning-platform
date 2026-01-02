

const express = require("express");
const router = express.Router();

const { getSubtopicsController, subtopicGenerateController} = require('../controllers/curriculum-controllers/subtopic-controller')
const {updateLearningPreferencesController} = require('../controllers/curriculum-controllers/preference-controller')
const {validateTopicController} = require('../controllers/curriculum-controllers/topic-controller')
const {updateSubtopicProgressController} = require('../controllers/progress-controllers/subtopic-progress')

const {
  teachSubtopicController,
  regenerateContentController,
} = require('../controllers/content-controllers/teach-subtopic-controller')

const {fixMindmapCacheController, clearContentCacheController,debugCacheController} = require('../controllers/content-controllers/content-cache-controller')
const {  getContentHistoryController} = require('../controllers/content-controllers/history-controller')
const {generateMermaidMapController, fixMermaidSyntaxController} = require('../controllers/content-controllers/mermaid-controller')

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