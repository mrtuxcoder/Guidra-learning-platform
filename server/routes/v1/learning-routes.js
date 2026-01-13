const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const {
  getSubtopicsController,
  subtopicGenerateController,
} = require("../../controllers/curriculum-controllers/subtopic-controller");
const {
  updateLearningPreferencesController,
} = require("../../controllers/curriculum-controllers/preference-controller");
const {
  validateTopicController,
} = require("../../controllers/curriculum-controllers/topic-controller");

// Topic and subtopic management
router.post("/topics", authMiddleware, subtopicGenerateController);
router.get("/topics/:topic/subtopics", authMiddleware, getSubtopicsController);
router.post("/topics/validate", authMiddleware, validateTopicController);

// Learning preferences
router.put("/preferences", authMiddleware, updateLearningPreferencesController);

module.exports = router;
