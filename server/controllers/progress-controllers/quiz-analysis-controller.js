const User = require("../../models/User");
const callAI = require("../../utils/call-AI");
const { generateQuizAnalysisPrompt } = require("../../prompts/quiz-analysis-prompt");

/**
 * Analyze quiz answers and update user's strengths and weaknesses for a specific topic
 * This should be called after a quiz submission
 */
exports.analyzeQuizAnswers = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, quizAnswers } = req.body;

    // Validation
    if (!topic || !subtopic) {
      return res.status(400).json({
        success: false,
        message: "Topic and subtopic are required",
      });
    }

    if (!Array.isArray(quizAnswers) || quizAnswers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz answers array is required and must not be empty",
      });
    }

    // Validate quizAnswers structure
    const isValidStructure = quizAnswers.every(
      (q) =>
        q.question &&
        q.userAnswer !== undefined &&
        q.correctAnswer !== undefined &&
        typeof q.isCorrect === "boolean"
    );

    if (!isValidStructure) {
      return res.status(400).json({
        success: false,
        message:
          "Each quiz answer must have: question, userAnswer, correctAnswer, isCorrect, and optional explanation",
      });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the topic in user's progress
    const topicIndex = user.progress.findIndex(
      (progress) => progress.topic.toLowerCase() === topic.toLowerCase()
    );

    if (topicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Topic "${topic}" not found in user progress`,
      });
    }

    // Generate AI analysis prompt
    const prompt = generateQuizAnalysisPrompt(
      user,
      topic,
      subtopic,
      quizAnswers
    );

    console.log("🤖 Analyzing quiz answers with AI...");

    // Call AI to analyze the quiz
    const aiResponse = await callAI(prompt);

    if (!aiResponse) {
      return res.status(500).json({
        success: false,
        message: "AI analysis failed. Please try again.",
      });
    }

    // Parse AI response
    let analysis;
    try {
      // Remove any markdown code blocks if present
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI analysis",
        error:
          process.env.NODE_ENV === "development" ? parseError.message : undefined,
      });
    }

    // Validate analysis structure
    if (!analysis.weaknesses || !analysis.strengths) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI analysis format",
      });
    }

    // Update user's topic-specific strengths and weaknesses
    const currentStrengths = user.progress[topicIndex].strengths || [];
    const currentWeaknesses = user.progress[topicIndex].weaknesses || [];

    // Add new weaknesses (avoid duplicates)
    const newWeaknesses = analysis.weaknesses.filter(
      (weakness) =>
        !currentWeaknesses.some(
          (w) => w.toLowerCase() === weakness.toLowerCase()
        )
    );

    // Add new strengths (avoid duplicates)
    const newStrengths = analysis.strengths.filter(
      (strength) =>
        !currentStrengths.some(
          (s) => s.toLowerCase() === strength.toLowerCase()
        )
    );

    // Update arrays - keep max 10 items each to prevent bloat
    user.progress[topicIndex].weaknesses = [
      ...currentWeaknesses,
      ...newWeaknesses,
    ].slice(-10);

    user.progress[topicIndex].strengths = [
      ...currentStrengths,
      ...newStrengths,
    ].slice(-10);

    // Remove weaknesses that are now strengths (student improved!)
    user.progress[topicIndex].weaknesses = user.progress[
      topicIndex
    ].weaknesses.filter(
      (weakness) =>
        !user.progress[topicIndex].strengths.some(
          (s) => s.toLowerCase() === weakness.toLowerCase()
        )
    );

    user.progress[topicIndex].lastAccessed = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Quiz analysis completed successfully",
      data: {
        topic,
        subtopic,
        weaknesses: user.progress[topicIndex].weaknesses,
        strengths: user.progress[topicIndex].strengths,
        newWeaknesses,
        newStrengths,
        recommendations: analysis.recommendations || "",
      },
    });
  } catch (error) {
    console.error("Error analyzing quiz answers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze quiz answers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get strengths and weaknesses for a specific topic
 */
exports.getTopicAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic } = req.query;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const topicProgress = user.progress.find(
      (progress) => progress.topic.toLowerCase() === topic.toLowerCase()
    );

    if (!topicProgress) {
      return res.status(404).json({
        success: false,
        message: `Topic "${topic}" not found in user progress`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        topic: topicProgress.topic,
        strengths: topicProgress.strengths || [],
        weaknesses: topicProgress.weaknesses || [],
      },
    });
  } catch (error) {
    console.error("Error fetching topic analysis:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch topic analysis",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get all strengths and weaknesses across all topics
 */
exports.getAllAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const analysisData = user.progress
      .filter((p) => p.strengths?.length > 0 || p.weaknesses?.length > 0)
      .map((p) => ({
        topic: p.topic,
        strengths: p.strengths || [],
        weaknesses: p.weaknesses || [],
      }));

    res.status(200).json({
      success: true,
      data: analysisData,
    });
  } catch (error) {
    console.error("Error fetching all analysis:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analysis data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
