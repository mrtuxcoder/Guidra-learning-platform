const User = require("../../models/User");

// Mark topic as completed or incomplete
exports.markTopicComplete = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, completed = true } = req.body;

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

    const topicIndex = user.progress.findIndex(
      (progress) => progress.topic.toLowerCase() === topic.toLowerCase()
    );

    if (topicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Topic "${topic}" not found in user progress`,
      });
    }

    // Update topic completion status
    user.progress[topicIndex].completed = completed;
    user.progress[topicIndex].lastAccessed = new Date();

    // If marking as completed, also mark all subtopics as completed
    if (completed) {
      user.progress[topicIndex].subTopics.forEach((subtopic) => {
        subtopic.completed = true;
        subtopic.lastReviewed = new Date();
      });

      // Calculate overall understanding based on completed subtopics
      const completedSubtopics = user.progress[topicIndex].subTopics.filter(
        (sub) => sub.completed
      );
      if (completedSubtopics.length > 0) {
        const totalUnderstanding = completedSubtopics.reduce(
          (sum, sub) => sum + (sub.understandingLevel || 3),
          0
        );
        user.progress[topicIndex].overallUnderstanding = Math.round(
          totalUnderstanding / completedSubtopics.length
        );
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Topic "${topic}" ${
        completed ? "marked as completed" : "marked as incomplete"
      }`,
      data: {
        topic,
        completed,
        overallUnderstanding: user.progress[topicIndex].overallUnderstanding,
        completedSubtopics: user.progress[topicIndex].subTopics.filter(
          (sub) => sub.completed
        ).length,
        totalSubtopics: user.progress[topicIndex].subTopics.length,
      },
    });
  } catch (error) {
    console.error("Error marking topic complete:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update topic completion status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all progress data for the user (dashboard overview)
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("progress appTimeMs");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate progress statistics
    const totalSubtopics = user.progress.reduce(
      (total, topic) => total + topic.subTopics.length,
      0
    );
    const completedSubtopics = user.progress.reduce(
      (total, topic) =>
        total + topic.subTopics.filter((sub) => sub.completed).length,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        progress: user.progress,
        totalTopics: user.progress.length,
        totalSubtopics,
        completedSubtopics,
        appTimeMs: user.appTimeMs || 0,
      },
    });
  } catch (error) {
    console.error("Error getting user progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user progress",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
