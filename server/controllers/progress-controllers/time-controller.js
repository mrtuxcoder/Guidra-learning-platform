const User = require("../../models/User");

const MAX_DURATION_MS = 6 * 60 * 60 * 1000;

exports.recordTimeSpent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { durationMs, topic, subtopicName } = req.body;

    if (typeof durationMs !== "number" || Number.isNaN(durationMs)) {
      return res.status(400).json({ message: "durationMs must be a number." });
    }

    if (durationMs <= 0) {
      return res.status(400).json({ message: "durationMs must be positive." });
    }

    if (durationMs > MAX_DURATION_MS) {
      return res.status(400).json({
        message: "durationMs is too large for a single update.",
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.appTimeMs = (user.appTimeMs || 0) + durationMs;

    if (topic) {
      const topicProgress = user.progress.find(
        (p) => p.topic.toLowerCase() === String(topic).toLowerCase()
      );

      if (topicProgress) {
        topicProgress.timeSpentMs =
          (topicProgress.timeSpentMs || 0) + durationMs;
        topicProgress.lastAccessed = new Date();

        if (subtopicName) {
          const subtopic = topicProgress.subTopics.find(
            (s) => s.name.toLowerCase() === String(subtopicName).toLowerCase()
          );

          if (subtopic) {
            subtopic.timeSpentMs = (subtopic.timeSpentMs || 0) + durationMs;
            subtopic.lastReviewed = new Date();
          }
        }
      }
    }

    await user.save();

    res.status(200).json({
      message: "Time recorded successfully.",
      data: {
        appTimeMs: user.appTimeMs,
      },
    });
  } catch (error) {
    console.error("Error in recordTimeSpent:", error);
    res.status(500).json({ message: "Failed to record time." });
  }
};
