const User = require('../../models/User');
const { buildPrompt, cleanSubtopicOutput } = require("../../utils/build-prompt");
const { isNonsense, normalizeInput, isSupportedTopic } = require('../../utils/simple-validator');
const callAI = require("../../utils/call-AI");

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
