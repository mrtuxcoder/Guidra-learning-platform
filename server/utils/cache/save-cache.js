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

  let cacheDoc;
  try {
    cacheDoc = await ContentCache.findOneAndUpdate(
      query,
      {
        $setOnInsert: {
          userId,
          topic: query.topic,
          subtopic: query.subtopic,
          content: {
            versions: [],
            latestVersion: 0,
            components: {},
            componentVersionCounters: {},
          },
        },
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    if (error?.code === 11000) {
      cacheDoc = await ContentCache.findOne(query);
    } else {
      throw error;
    }
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

  let cacheDoc;
  try {
    cacheDoc = await ContentCache.findOneAndUpdate(
      query,
      {
        $setOnInsert: {
          userId,
          topic: query.topic,
          subtopic: query.subtopic,
          content: {
            versions: [],
            latestVersion: 0,
            components: {},
            componentVersionCounters: {},
          },
        },
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    if (error?.code === 11000) {
      cacheDoc = await ContentCache.findOne(query);
    } else {
      throw error;
    }
  }

  if (!cacheDoc.content.components) {
    cacheDoc.content.components = {};
  }

  if (!cacheDoc.content.componentVersionCounters) {
    cacheDoc.content.componentVersionCounters = {};
  }

  const existingComponentVersions = (cacheDoc.content.versions || [])
    .filter(
      (v) =>
        v.contentType === "component" &&
        (v.componentName === componentName ||
          v.data?.componentName === componentName)
    )
    .map((v) => Number(v.version))
    .filter((v) => Number.isFinite(v));

  const maxExistingComponentVersion = existingComponentVersions.length
    ? Math.max(...existingComponentVersions)
    : 0;

  // Keep version numbers per component to avoid ambiguity
  const baseComponentVersion = Math.max(
    Number(cacheDoc.content.componentVersionCounters[componentName] || 0),
    maxExistingComponentVersion
  );

  const currentComponentVersion = baseComponentVersion + 1;

  // Update component content
  cacheDoc.content.components[componentName] = componentContent;

  cacheDoc.content.componentVersionCounters[componentName] =
    currentComponentVersion;

  // Add new version entry
  cacheDoc.content.versions.push({
    version: currentComponentVersion,
    contentType: "component",
    componentName,
    data: { componentName, componentContent },
  });

  // Do NOT update latestVersion here

  await cacheDoc.save();

  console.log(
    `✅ [CACHE] Saved component ${componentName} v${currentComponentVersion} for ${topic} / ${subtopic}`
  );

  return { cacheDoc, versionEntry: { versionNumber: currentComponentVersion, contentType: "component", componentName } };
} 


module.exports = {
  saveToCache,
  saveComponentToCache,
}