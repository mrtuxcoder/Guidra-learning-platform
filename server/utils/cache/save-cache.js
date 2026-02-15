const mongoose = require("mongoose");
const ContentCache = require("../../models/Content-cache"); 


/* Save content to cache - flexible function */

async function saveToCache({
  userId,
  topic,
  subtopic,
  content,
}) {
  const query = {
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
  };

  let cacheDoc = await ContentCache.findOne(query);

  if (!cacheDoc) {
    // Create new cache document
    cacheDoc = new ContentCache({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      content: {
        versions: [],
        latestVersion: 0,
      },
    });
  }

  // Increment version number (full content only)
  const newVersionNumber = (cacheDoc.content.latestVersion || 0) + 1;

  // Add new version entry
  cacheDoc.content.versions.push({
    version: newVersionNumber,
    contentType: "full",
    data: content,
  });

  // Update latest version number (full content only)
  cacheDoc.content.latestVersion = newVersionNumber;

  await cacheDoc.save();

  return { cacheDoc, versionEntry: { versionNumber: newVersionNumber, contentType: "full" } };
}

async function saveComponentToCache({
  userId,
  topic,
  subtopic,
  componentName,
  componentContent,
}) {
  const query = {
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
  };

  let cacheDoc = await ContentCache.findOne(query);

  if (!cacheDoc) {
    // Create new cache document
    cacheDoc = new ContentCache({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      content: {
        versions: [],
        latestVersion: 0,
        components: {},
      },
    });
  }

  // Keep a separate version number for components (do not touch latestVersion)
  const newVersionNumber = (cacheDoc.content.versions?.length || 0) + 1;

  // Update component content
  cacheDoc.content.components[componentName] = componentContent;

  // Add new version entry
  cacheDoc.content.versions.push({
    version: newVersionNumber,
    contentType: "component",
    data: { componentName, componentContent },
  });

  // Do NOT update latestVersion here

  await cacheDoc.save();

  return { cacheDoc, versionEntry: { versionNumber: newVersionNumber, contentType: "component", componentName } };
} 


module.exports = {
  saveToCache,
  saveComponentToCache,
}