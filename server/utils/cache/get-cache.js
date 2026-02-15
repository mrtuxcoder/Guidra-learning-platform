
const ContentCache = require("../../models/Content-cache");

/* Get cached content - flexible function */

async function getCachedContent(userId, topic, subtopic) {
  const cacheDoc = await ContentCache.findOne({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
    isActive: true,
  });

  if (!cacheDoc) {
    return null; // No cache found
  }

  // Update access metrics
  cacheDoc.timesAccessed += 1;
  cacheDoc.lastAccessed = new Date();
  await cacheDoc.save();

  return cacheDoc;
}

module.exports = getCachedContent;

async function getCachedComponent(userId, topic, subtopic, componentName) {
  const cacheDoc = await ContentCache.findOne({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
    isActive: true,
  });

  if (!cacheDoc) {
    return null; // No cache found
  }

  // Find the latest version of the specified component
  const componentVersions = cacheDoc.content.versions
    .filter(v => v.contentType === "component" && v.componentName === componentName)
    .sort((a, b) => b.version - a.version); // Sort by version descending

  if (componentVersions.length === 0) {
    return null; // No component versions found
  }

  const latestComponent = componentVersions[0];

  // Update access metrics
  cacheDoc.timesAccessed += 1;
  cacheDoc.lastAccessed = new Date();
  await cacheDoc.save();

  return latestComponent.data; // Return the component content data
} 

module.exports = {  getCachedContent, getCachedComponent };