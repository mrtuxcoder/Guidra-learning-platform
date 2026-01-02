const express = require('express');
const router = express.Router();
const {updateUnderstandingLevel}= require('../controllers/progress-controllers/understand-level-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const {incrementGenerationCount, getGenerationCount,updateGenerationCount} = require('../controllers/progress-controllers/gen-count-controller')
const {updateQuizMarks,getQuizMarks,clearQuizMarks} = require('../controllers/progress-controllers/quiz-mark-controller')
const {markTopicComplete,addOrUpdateTopic,getUserProgress} = require('../controllers/progress-controllers/topic-controller')
const {markSubtopicComplete} = require('../controllers/progress-controllers/subtopic-progress')

// Generation count routes - track how many times content was regenerated (max 3)
router.put('/generation-count', authMiddleware, updateGenerationCount);
router.get('/generation-count', authMiddleware, getGenerationCount);
router.put('/increment-generation', authMiddleware, incrementGenerationCount);

// Topic and progress management
router.post('/topic', authMiddleware, addOrUpdateTopic);
router.get('/', authMiddleware, getUserProgress);

// Learning progress tracking
router.put('/understanding', authMiddleware, updateUnderstandingLevel);
router.put('/complete', authMiddleware, markSubtopicComplete);
router.put('/topic/complete', authMiddleware, markTopicComplete);

// Quiz results management
router.put('/quiz-marks', authMiddleware,updateQuizMarks);
router.get('/quiz-marks', authMiddleware, getQuizMarks);
router.delete('/quiz-marks', authMiddleware, clearQuizMarks);

module.exports = router;