const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth-middleware');
const { 
  teachSubtopicController, 
  regenerateContentController 
} = require('../../controllers/content-controllers/teach-subtopic-controller');
const { 
  getContentHistoryController 
} = require('../../controllers/content-controllers/history-controller');
const { 
  clearContentCacheController 
} = require('../../controllers/content-controllers/content-cache-controller');
const { 
  generateMermaidMapController, 
  fixMermaidSyntaxController 
} = require('../../controllers/content-controllers/mermaid-controller');
const { 
  updateSubtopicProgressController 
} = require('../../controllers/progress-controllers/subtopic-progress');

// Content teaching
router.post('/teach', authMiddleware, teachSubtopicController);
router.post('/regenerate', authMiddleware, regenerateContentController);

// Content history and cache
router.get('/history', authMiddleware, getContentHistoryController);
router.delete('/cache', authMiddleware, clearContentCacheController);

// Mindmap generation
router.post('/mindmaps', authMiddleware, generateMermaidMapController);
router.post('/mindmaps/fix-syntax', authMiddleware, fixMermaidSyntaxController);

// Subtopic progress (moved from learning routes as it's progress-related)
router.put('/subtopics/progress', authMiddleware, updateSubtopicProgressController);

module.exports = router;