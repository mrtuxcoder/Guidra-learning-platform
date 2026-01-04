const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth-middleware');
const { 
  updateUnderstandingLevel 
} = require('../../controllers/progress-controllers/understand-level-controller');
const { 
  incrementGenerationCount, 
  getGenerationCount, 
  updateGenerationCount 
} = require('../../controllers/progress-controllers/gen-count-controller');
const { 
  updateQuizMarks, 
  getQuizMarks, 
  clearQuizMarks 
} = require('../../controllers/progress-controllers/quiz-mark-controller');
const { 
  markTopicComplete, 
  addOrUpdateTopic, 
  getUserProgress 
} = require('../../controllers/progress-controllers/topic-controller');
const { 
  markSubtopicComplete 
} = require('../../controllers/progress-controllers/subtopic-progress');

// Overall progress
router.get('/', authMiddleware, getUserProgress);

// Topic progress
router.post('/topics', authMiddleware, addOrUpdateTopic);
router.put('/topics/:topic/complete', authMiddleware, markTopicComplete);

// Subtopic progress
router.put('/subtopics/:subtopic/complete', authMiddleware, markSubtopicComplete);

// Understanding level
router.put('/understanding', authMiddleware, updateUnderstandingLevel);

// Generation count
router.get('/generation-count', authMiddleware, getGenerationCount);
router.put('/generation-count', authMiddleware, updateGenerationCount);
router.put('/generation-count/increment', authMiddleware, incrementGenerationCount);

// Quiz management
router.get('/quizzes', authMiddleware, getQuizMarks);
router.put('/quizzes', authMiddleware, updateQuizMarks);
router.delete('/quizzes', authMiddleware, clearQuizMarks);

module.exports = router;