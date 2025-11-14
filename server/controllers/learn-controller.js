const User = require("../models/User");
const callAI = require("../utils/callAIAPI");
const { buildPrompt, cleanSubtopicOutput } = require("../utils/buildPrompt");
const { isNonsense, normalizeInput, isSupportedTopic } = require('../utils/simpleValidator');

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

// Generate teaching content for a specific subtopic (legacy version without caching)
exports.teachSubtopicController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic)
      return res.status(400).json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const aiPrompt = buildPrompt(user, { topic, subtopic, taskType: "teachSubtopic" });
    const aiResponse = await callAI(aiPrompt);

    let structuredContent;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      structuredContent = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    } catch {
      structuredContent = { explanation: aiResponse };
    }

    res.status(200).json({
      message: `Teaching content generated for "${subtopic}"`,
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      data: structuredContent,
    });
  } catch (error) {
    console.error("Error in teachSubtopicController:", error);
    res.status(500).json({ message: "Failed to generate teaching content" });
  }
};

// Update progress for a specific subtopic (completion status and understanding level)
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

// Generate structured teaching content with strict JSON validation
exports.generateTeachingContentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic)
      return res.status(400).json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const aiPrompt = buildPrompt(user, { topic, subtopic, taskType: "teachSubtopic" });
    const aiResponse = await callAI(aiPrompt);

    let structuredContent;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      structuredContent = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    } catch (err) {
      console.error("JSON parse error:", err);
      return res.status(500).json({ message: "AI returned unstructured data.", raw: aiResponse });
    }

    res.status(200).json({
      message: `Structured teaching content generated for "${subtopic}"`,
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      data: structuredContent,
    });
  } catch (error) {
    console.error("Error in generateTeachingContentController:", error);
    res.status(500).json({ message: "Failed to generate structured teaching content" });
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
exports.personalizeAndGenerateController = async (req, res) => {
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

    // Check if topic is supported by the system
    if (!isSupportedTopic(topic)) {
      return res.status(400).json({
        message: "This topic isn't supported yet. Try topics like: HTML, CSS, JavaScript, React, Node.js, Git, or other web development topics.",
      });
    }

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