const ContentCache = require("../../models/Content-cache");

/**
 * Clear Cache for User/Topic
 */
exports.clearContentCacheController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    const query = { userId };
    if (topic) query.topic = topic.toLowerCase();
    if (subtopic) query.subtopic = subtopic.toLowerCase();

    const result = await ContentCache.deleteMany(query);

    res.status(200).json({
      message: "Content cache cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error in clearContentCacheController:", error);
    res.status(500).json({ message: "Failed to clear content cache" });
  }
};

/**
 * Get cached subtopics for a user/topic
 */
exports.getCachedSubtopicsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic } = req.query;

    if (!topic) {
      return res.status(400).json({ message: "Topic query parameter is required" });
    }

    const cachedDocs = await ContentCache.find(
      {
        userId,
        topic: topic.toLowerCase(),
        "content.latestVersion": { $gt: 0 },
      },
      { subtopic: 1, _id: 0 }
    );

    const subtopics = cachedDocs
      .map((doc) => doc?.subtopic)
      .filter(Boolean);

    res.status(200).json({
      topic,
      count: subtopics.length,
      subtopics,
    });
  } catch (error) {
    console.error("Error in getCachedSubtopicsController:", error);
    res.status(500).json({ message: "Failed to fetch cached subtopics" });
  }
};
