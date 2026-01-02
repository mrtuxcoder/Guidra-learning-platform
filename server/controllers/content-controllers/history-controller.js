const ContentCache = require("../../models/Content-cache");

/**
 * Get Content History
 */
exports.getContentHistoryController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    const query = { userId };
    if (topic) query.topic = topic.toLowerCase();
    if (subtopic) query.subtopic = subtopic.toLowerCase();

    const history = await ContentCache.find(query)
      .sort({ createdAt: -1 })
      .select('topic subtopic learningStyle version createdAt timesAccessed userRating contentFormat')
      .limit(50);

    res.status(200).json({
      message: "Content history retrieved from cache",
      data: history
    });
  } catch (error) {
    console.error("Error in getContentHistoryController:", error);
    res.status(500).json({ message: "Failed to get content history" });
  }
};