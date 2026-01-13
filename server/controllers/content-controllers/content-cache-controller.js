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
