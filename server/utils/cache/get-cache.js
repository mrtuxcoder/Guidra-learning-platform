
const ContentCache = require("../../models/Content-cache");

/* Get cached content - flexible function */

async function getCachedContent(userId, topic, subtopic) {
  const cacheDoc = await ContentCache.findOne({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
  });

  if (!cacheDoc) {
    return null; // No cache found
  }

  void ContentCache.updateOne(
    { _id: cacheDoc._id },
    { $inc: { timesAccessed: 1 }, $set: { lastAccessed: new Date() } }
  ).catch((error) => console.warn("Failed to update cache metrics:", error.message));

  return cacheDoc;
}

async function getCachedComponent(userId, topic, subtopic, componentName) {
  const cacheDoc = await ContentCache.findOne({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
  });

  if (!cacheDoc) {
    return null; // No cache found
  }

  // Find the latest version of the specified component
  const componentVersions = cacheDoc.content.versions
    .filter(
      (v) =>
        v.contentType === "component" &&
        (v.componentName === componentName ||
          v.data?.componentName === componentName)
    )
    .sort((a, b) => b.version - a.version); // Sort by version descending

  if (componentVersions.length === 0) {
    return null; // No component versions found
  }

  const latestComponent = componentVersions[0];

  void ContentCache.updateOne(
    { _id: cacheDoc._id },
    { $inc: { timesAccessed: 1 }, $set: { lastAccessed: new Date() } }
  ).catch((error) => console.warn("Failed to update cache metrics:", error.message));

  return {
    version: latestComponent.version,
    componentContent: latestComponent.data?.componentContent,
  };
}

module.exports = { getCachedContent, getCachedComponent };