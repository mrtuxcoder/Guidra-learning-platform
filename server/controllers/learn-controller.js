const User = require("../models/User");
const callAI = require("../utils/call-AI");
const { buildPrompt, cleanSubtopicOutput } = require("../utils/build-prompt");
const { isNonsense, normalizeInput, isSupportedTopic } = require('../utils/simple-validator');
const { buildTopicValidatorPrompt } = require("../prompts/topic-validator");

// Get all subtopics for a specific topic from user progress
exports.getSubtopicsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find progress for the requested topic
    const progress = user.progress.find(
      (p) => p.topic.toLowerCase() === topic.toLowerCase()
    );

    if (!progress) return res.status(404).json({ message: "Topic not found" });

    res.status(200).json({
      message: `Subtopics for "${topic}"`,
      topic,
      subTopics: progress.subTopics,
    });
  } catch (error) {
    console.error("Error in getSubtopicsController:", error);
    res.status(500).json({ message: "Failed to fetch subtopics" });
  }
};

exports.updateSubtopicProgressController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopicName, completed, understandingLevel } = req.body;

    if (!topic || !subtopicName)
      return res.status(400).json({ message: "Topic and subtopicName are required." });

    // Validate understanding level range
    if (understandingLevel && (understandingLevel < 1 || understandingLevel > 5))
      return res.status(400).json({ message: "understandingLevel must be between 1 and 5." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the topic progress
    const topicProgress = user.progress.find((p) => p.topic === topic);
    if (!topicProgress)
      return res.status(404).json({ message: "Topic not found in progress." });

    // Find the specific subtopic
    const subtopic = topicProgress.subTopics.find(
      (s) => s.name.toLowerCase() === subtopicName.toLowerCase()
    );

    if (!subtopic)
      return res.status(404).json({ message: "Subtopic not found under this topic." });

    // Update subtopic properties if provided
    if (completed !== undefined) subtopic.completed = completed;
    if (understandingLevel !== undefined) subtopic.understandingLevel = understandingLevel;

    subtopic.lastReviewed = new Date();

    // Mark topic as completed if all subtopics are completed
    if (topicProgress.subTopics.every((s) => s.completed)) topicProgress.completed = true;

    await user.save();

    res.status(200).json({
      message: `Subtopic "${subtopic.name}" updated successfully.`,
      data: {
        topic: topicProgress.topic,
        subtopic: subtopic.name,
        completed: subtopic.completed,
        understandingLevel: subtopic.understandingLevel,
      },
    });
  } catch (error) {
    console.error("Error in updateSubtopicProgressController:", error);
    res.status(500).json({ message: "Failed to update subtopic progress" });
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

// Main endpoint: Generate personalized learning path with subtopics for a new topic
exports.subtopicGenerateController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic } = req.body;

    // Basic validation - topic is required
    if (!topic) {
      return res.status(400).json({ message: "Topic is required." });
    }

    // Validate topic input quality
    const normalizedTopic = normalizeInput(topic);

    if (isNonsense(normalizedTopic)) {
      return res.status(400).json({
        message: "Please enter a valid topic to learn.",
      });
    }

    // // Check if topic is supported by the system
    // if (!isSupportedTopic(topic)) {
    //   return res.status(400).json({
    //     message: "This topic isn't supported yet. Try topics like: HTML, CSS, JavaScript, React, Node.js, Git, or other web development topics.",
    //   });
    // }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent starting new topics while others are incomplete
    const incompleteTopic = user.progress.find(
      (p) => p.subTopics?.some((s) => !s.completed)
    );

    if (incompleteTopic && incompleteTopic.topic !== topic) {
      return res.status(400).json({
        message: `Please complete all subtopics in "${incompleteTopic.topic}" before starting a new one.`,
      });
    }

    // Generate subtopics using the unified buildPrompt function
    const aiPrompt = buildPrompt(user, { 
      topic, 
      taskType: "generateSubtopic" 
    });
    const aiResponse = await callAI(aiPrompt);

    // Use the cleanSubtopicOutput function from the unified buildPrompt
    const subtopicNames = cleanSubtopicOutput(aiResponse);

    // Format subtopics with proper initial values (using 1 instead of 0 for validation)
    const formattedSubtopics = subtopicNames.map((name) => ({
      name,
      completed: false,
      understandingLevel: 1, // Minimum allowed value for model validation
      lastReviewed: new Date(),
      generationCount: 0,
      quizMark: {
        correct: 0,
        wrong: 0,
        total: 0,
        percentage: 0,
        submittedAt: new Date()
      }
    }));

    // Update or create topic progress
    const existingTopic = user.progress.find((p) => p.topic === topic);
    if (existingTopic) {
      existingTopic.subTopics = formattedSubtopics;
      existingTopic.lastAccessed = new Date();
      existingTopic.overallUnderstanding = 1; // Minimum allowed value
    } else {
      user.progress.push({
        topic,
        subTopics: formattedSubtopics,
        overallUnderstanding: 1, // Minimum allowed value
        lastAccessed: new Date(),
      });
    }

    await user.save();

    res.status(200).json({
      message: "Learning path generated successfully!",
      data: { 
        topic, 
        subTopics: formattedSubtopics,
      },
    });
  } catch (error) {
    console.error("Error in personalizeAndGenerateController:", error);
    res.status(500).json({ message: "Failed to generate learning path" });
  }
};


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
        message: "Topic is required and should be at least 2 characters long." 
      });
    }

    const cleanTopic = topic.trim();
    
    // Quick client-side validation for obvious cases
    if (isObviouslyInvalid(cleanTopic)) {
      return res.status(200).json({
        valid: false,
        message: "Topic is too vague or not suitable for structured learning.",
        topic: cleanTopic
      });
    }

    console.log(`🔍 Validating topic: "${cleanTopic}"`);

    // Build the validation prompt
    const validatorPrompt = buildTopicValidatorPrompt(cleanTopic);
    
    // Call AI API (uses your existing fallback system)
    const aiResponse = await callAI(validatorPrompt);
    
    // Clean and parse response
    const cleanResponse = aiResponse.trim().toUpperCase();
    const isValid = cleanResponse.startsWith('YES');

    console.log(`✅ Topic validation result: ${isValid ? 'VALID' : 'INVALID'}`);

    res.status(200).json({
      valid: isValid,
      message: isValid 
        ? "Topic is suitable for structured learning with 10-15 subtopics." 
        : "Topic is not suitable for structured learning. Please provide a more specific topic.",
      topic: cleanTopic,
      aiResponse: cleanResponse
    });

  } catch (error) {
    console.error("❌ Error in validateTopicController:", error);
    
    // Fallback: assume invalid if AI services are down
    res.status(200).json({
      valid: false,
      message: "Unable to validate topic at this time. Please try a different topic.",
      topic: req.body.topic || 'unknown',
      error: "AI service unavailable"
    });
  }
};

/**
 * Quick client-side validation for obvious cases
 */
function isObviouslyInvalid(topic) {
  const invalidPatterns = [
    // Too short
    topic.length < 3,
    
    // Single common words without context
    /^(cat|dog|car|book|food|water|hello|hi|test|ok|yes|no)$/i.test(topic),
    
    // Mostly special characters
    /^[^a-zA-Z0-9]+$/.test(topic),
    
    // Too broad fields
    /^(math|mathematics|science|history|biology|physics|chemistry|art|music|sports)$/i.test(topic),
    
    // Personal/gibberish
    /^(asdf|qwerty|xyz|abc|123|lol|haha|hehe)$/i.test(topic)
  ];

  return invalidPatterns.some(pattern => pattern === true);
}
