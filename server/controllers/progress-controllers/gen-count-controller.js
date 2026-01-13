const User = require("../../models/User");

// Get current generation count for a subtopic
exports.getGenerationCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    if (!topic || !subtopic) {
      return res.status(400).json({
        success: false,
        message: "Topic and subtopic query parameters are required",
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

    const subtopicProgress = topicProgress.subTopics.find(
      (sub) => sub.name.toLowerCase() === subtopic.toLowerCase()
    );

    if (!subtopicProgress) {
      return res.status(404).json({
        success: false,
        message: `Subtopic "${subtopic}" not found in topic "${topic}"`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        topic,
        subtopic,
        generationCount: subtopicProgress.generationCount,
        completed: subtopicProgress.completed,
        understandingLevel: subtopicProgress.understandingLevel,
        lastReviewed: subtopicProgress.lastReviewed,
      },
    });
  } catch (error) {
    console.error("Error getting generation count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get generation count",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Increment generation count by 1 (used when user requests content regeneration)
exports.incrementGenerationCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({
        success: false,
        message: "Topic and subtopic are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const topicIndex = user.progress.findIndex(
      (progress) => progress.topic.toLowerCase() === topic.toLowerCase()
    );

    if (topicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Topic "${topic}" not found in user progress`,
      });
    }

    const subtopicIndex = user.progress[topicIndex].subTopics.findIndex(
      (sub) => sub.name.toLowerCase() === subtopic.toLowerCase()
    );

    if (subtopicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Subtopic "${subtopic}" not found in topic "${topic}"`,
      });
    }

    const currentCount =
      user.progress[topicIndex].subTopics[subtopicIndex].generationCount;

    // Only increment if below maximum limit (3 regenerations allowed)
    if (currentCount < 3) {
      user.progress[topicIndex].subTopics[subtopicIndex].generationCount =
        currentCount + 1;
    }

    user.progress[topicIndex].lastAccessed = new Date();
    user.progress[topicIndex].subTopics[subtopicIndex].lastReviewed =
      new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `Generation count incremented for "${subtopic}"`,
      data: {
        topic,
        subtopic,
        previousGenerationCount: currentCount,
        currentGenerationCount:
          user.progress[topicIndex].subTopics[subtopicIndex].generationCount,
        wasIncremented: currentCount < 3,
        isAtMax:
          user.progress[topicIndex].subTopics[subtopicIndex].generationCount ===
          3,
      },
    });
  } catch (error) {
    console.error("Error incrementing generation count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to increment generation count",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
