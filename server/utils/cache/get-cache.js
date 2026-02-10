const ContentCache = require("../../models/Content-cache");

/* Get cached content*/

async function getCachedContent(userId, topic, subtopic, learningStyle) {
  return await ContentCache.findOne({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
    learningStyle,
    isActive: true,
  }).sort({ version: -1 });
}

module.exports = getCachedContent