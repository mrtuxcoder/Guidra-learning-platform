const express = require('express');
const router = express.Router();
const userProgressController = require('../controllers/user-progress-controller');
const authMiddleware = require('../middlewares/auth-middleware');

// Generation count routes - track how many times content was regenerated (max 3)
router.put('/generation-count', authMiddleware, userProgressController.updateGenerationCount);
router.get('/generation-count', authMiddleware, userProgressController.getGenerationCount);
router.put('/increment-generation', authMiddleware, userProgressController.incrementGenerationCount);

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