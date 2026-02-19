const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const {
  updateUnderstandingLevel,
} = require("../../controllers/progress-controllers/understand-level-controller");
const {
  incrementGenerationCount,
  getGenerationCount,
  getGenerationCounts,
} = require("../../controllers/progress-controllers/gen-count-controller");
const {
  updateQuizMarks,
  getQuizMarks,
  clearQuizMarks,
} = require("../../controllers/progress-controllers/quiz-mark-controller");
const {
  markTopicComplete,
  getUserProgress,
} = require("../../controllers/progress-controllers/topic-controller");
const {
  markSubtopicComplete,
} = require("../../controllers/progress-controllers/subtopic-progress");
const {
  recordTimeSpent,
} = require("../../controllers/progress-controllers/time-controller");
const {
  analyzeQuizAnswers,
  getTopicAnalysis,
  getAllAnalysis,
} = require("../../controllers/progress-controllers/quiz-analysis-controller");

// Overall progress
router.get("/", authMiddleware, getUserProgress);

// Topic progress

router.put("/topics/:topic/complete", authMiddleware, markTopicComplete);

// Subtopic progress
router.put("/subtopics/complete", authMiddleware, markSubtopicComplete);

// Time tracking
router.put("/time", authMiddleware, recordTimeSpent);

// Understanding level
router.put("/understanding", authMiddleware, updateUnderstandingLevel);

// Generation count
router.get("/generation-count", authMiddleware, getGenerationCount);
router.get("/generation-counts", authMiddleware, getGenerationCounts);
router.put(
  "/generation-count/increment",
  authMiddleware,
  incrementGenerationCount
);

// Quiz management
router.get("/quizzes", authMiddleware, getQuizMarks);
router.put("/quizzes", authMiddleware, updateQuizMarks);
router.delete("/quizzes", authMiddleware, clearQuizMarks);

// Quiz analysis - AI-powered strengths & weaknesses tracking
router.post("/quizzes/analyze", authMiddleware, analyzeQuizAnswers);
router.get("/analysis/topic", authMiddleware, getTopicAnalysis);
router.get("/analysis/all", authMiddleware, getAllAnalysis);

module.exports = router;