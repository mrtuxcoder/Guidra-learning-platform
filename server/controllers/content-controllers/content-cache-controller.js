const ContentCache = require("../../models/Content-cache");
const { generateFallbackMindmap } = require("../../utils/content-utils");

/**
 * Fix Mindmap Cache - Specifically for mindmap issues
 */
exports.fixMindmapCacheController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({ message: "Topic and subtopic are required." });
    }

    // Find cache entries missing mindmaps
    const brokenEntries = await ContentCache.find({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      $or: [
        { 'content.mindmap': { $exists: false } },
        { 'content.mindmap': null },
        { 'content.mindmap': '' },
        { 'content.mindmap': { $eq: undefined } }
      ]
    });

    // Add mindmaps to broken entries
    let fixedCount = 0;
    for (const entry of brokenEntries) {
      if (entry.content && typeof entry.content === 'object') {
        entry.content.mindmap = generateFallbackMindmap(subtopic);
        entry.markModified('content');
        await entry.save();
        fixedCount++;
      }
    }

    res.status(200).json({
      message: "Mindmap cache fixed successfully",
      fixedCount,
      brokenEntriesFound: brokenEntries.length,
      topic,
      subtopic
    });
  } catch (error) {
    console.error("Error in fixMindmapCacheController:", error);
    res.status(500).json({ message: "Failed to fix mindmap cache" });
  }
};

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
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error in clearContentCacheController:", error);
    res.status(500).json({ message: "Failed to clear content cache" });
  }
};

/**
 * Debug Cache - Check what's actually in cache
 */
exports.debugCacheController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    const query = { userId };
    if (topic) query.topic = topic.toLowerCase();
    if (subtopic) query.subtopic = subtopic.toLowerCase();

    const cacheEntries = await ContentCache.find(query)
      .sort({ version: -1 })
      .limit(10);

    const debugInfo = cacheEntries.map(entry => ({
      id: entry._id,
      topic: entry.topic,
      subtopic: entry.subtopic,
      version: entry.version,
      hasContent: !!entry.content,
      contentType: typeof entry.content,
      contentKeys: entry.content ? Object.keys(entry.content) : [],
      hasMindmap: entry.content ? !!entry.content.mindmap : false,
      mindmapLength: entry.content && entry.content.mindmap ? entry.content.mindmap.length : 0,
      isActive: entry.isActive,
      lastAccessed: entry.lastAccessed,
      explanationSample: entry.content && entry.content.explanation ? 
        entry.content.explanation.substring(0, 100) + '...' : 'MISSING'
    }));

    res.status(200).json({
      message: "Cache debug information",
      data: debugInfo
    });
  } catch (error) {
    console.error("Error in debugCacheController:", error);
    res.status(500).json({ message: "Failed to get cache debug info" });
  }
};