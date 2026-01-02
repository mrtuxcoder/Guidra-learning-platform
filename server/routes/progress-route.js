const express = require('express');
const router = express.Router();
const userProgressController = require('../controllers/user-progress-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const {incrementGenerationCount, getGenerationCount,updateGenerationCount} = require('../controllers/progress-controllers/gen-count-controller')

// Generation count routes - track how many times content was regenerated (max 3)
router.put('/generation-count', authMiddleware, updateGenerationCount);
router.get('/generation-count', authMiddleware, getGenerationCount);
router.put('/increment-generation', authMiddleware, incrementGenerationCount);

// Topic and progress management
router.post('/topic', authMiddleware, userProgressController.addOrUpdateTopic);
router.get('/', authMiddleware, userProgressController.getUserProgress);

// Learning progress tracking
router.put('/understanding', authMiddleware, userProgressController.updateUnderstandingLevel);
router.put('/complete', authMiddleware, userProgressController.markSubtopicComplete);
router.put('/topic/complete', authMiddleware, userProgressController.markTopicComplete);

// Quiz results management
router.put('/quiz-marks', authMiddleware, userProgressController.updateQuizMarks);
router.get('/quiz-marks', authMiddleware, userProgressController.getQuizMarks);
router.delete('/quiz-marks', authMiddleware, userProgressController.clearQuizMarks);

module.exports = router;