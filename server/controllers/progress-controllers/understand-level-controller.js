const User = require("../../models/User");

// Update understanding level (1-5 scale) for self-assessment
exports.updateUnderstandingLevel = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, understandingLevel } = req.body;

    if (!topic || !subtopic || understandingLevel === undefined) {
      return res.status(400).json({
        success: false,
        message: "Topic, subtopic, and understanding level are required",
      });
    }

    if (understandingLevel < 1 || understandingLevel > 5) {
      return res.status(400).json({
        success: false,
        message: "Understanding level must be between 1 and 5",
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

    user.progress[topicIndex].subTopics[subtopicIndex].understandingLevel =
      understandingLevel;
    user.progress[topicIndex].subTopics[subtopicIndex].lastReviewed =
      new Date();
    user.progress[topicIndex].lastAccessed = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `Understanding level updated to ${understandingLevel} for "${subtopic}"`,
      data: {
        topic,
        subtopic,
        understandingLevel,
      },
    });
  } catch (error) {
    console.error("Error updating understanding level:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update understanding level",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
