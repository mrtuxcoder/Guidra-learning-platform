const User = require("../../models/User");
const callAI = require("../../utils/call-AI");
const { buildTopicValidatorPrompt } = require("../../prompts/topic-validator");
const { isObviouslyInvalid } = require("../../utils/curriculum/simple-topic-validator");

// new feature
/**
 * 🎯 Validate Topic Controller
 * Checks if a topic is suitable for learning (10-15 subtopics scope)
 */
exports.validateTopicController = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || topic.trim().length < 2) {
      return res.status(400).json({
        valid: false,
        message: "Topic is required and should be at least 2 characters long.",
      });
    }

    const cleanTopic = topic.trim();

    // Quick client-side validation for obvious cases
    if (isObviouslyInvalid(cleanTopic)) {
      return res.status(200).json({
        valid: false,
        message: "Topic is too vague or not suitable for structured learning.",
        topic: cleanTopic,
      });
    }

    console.log(`🔍 Validating topic: "${cleanTopic}"`);

    // Build the validation prompt
    const validatorPrompt = buildTopicValidatorPrompt(cleanTopic);

    // Call AI API (uses your existing fallback system)
    const aiResponse = await callAI(validatorPrompt);

    // Clean and parse response
    const cleanResponse = aiResponse.trim().toUpperCase();
    const isValid = cleanResponse.startsWith("YES");

    console.log(`✅ Topic validation result: ${isValid ? "VALID" : "INVALID"}`);

    res.status(200).json({
      valid: isValid,
      message: isValid
        ? "Topic is suitable for structured learning with 10-15 subtopics."
        : "Topic is not suitable for structured learning. Please provide a more specific topic.",
      topic: cleanTopic,
      aiResponse: cleanResponse,
    });
  } catch (error) {
    console.error("❌ Error in validateTopicController:", error);

    // Fallback: assume invalid if AI services are down
    res.status(200).json({
      valid: false,
      message:
        "Unable to validate topic at this time. Please try a different topic.",
      topic: req.body.topic || "unknown",
      error: "AI service unavailable",
    });
  }
};

// Update user's learning preferences (style and motivation)
exports.updateLearningPreferencesController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { learningStyle, reasonForLearning } = req.body;

    if (!learningStyle && !reasonForLearning) {
      return res.status(400).json({ message: "At least one field required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update provided fields
    if (learningStyle) user.learningStyle = learningStyle;
    if (reasonForLearning) user.reasonForLearning = reasonForLearning;

    await user.save();

    res.status(200).json({
      message: "Learning preferences updated successfully",
      data: {
        learningStyle: user.learningStyle,
        reasonForLearning: user.reasonForLearning,
      },
    });
  } catch (error) {
    console.error("Error in updateLearningPreferencesController:", error);
    res.status(500).json({ message: "Failed to update learning preferences" });
  }
};
