const User = require("../../models/User");
const ContentCache = require("../../models/Content-cache");
const { getCachedContent } = require("../../utils/cache-utils");
const crypto = require("crypto");

/**
 * Debug: Check what's actually stored in cache
 */
exports.debugCacheComponentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component } = req.query;

    if (!topic || !subtopic) {
      return res.status(400).json({
        message: "Topic and subtopic query parameters are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all cache entries
    const cacheEntries = await ContentCache.find({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
    }).sort({ version: -1 });

    const debugInfo = cacheEntries.map((entry) => {
      const componentData = entry.content?.[component];
      return {
        id: entry._id,
        version: entry.version,
        isActive: entry.isActive,
        componentExists: !!componentData,
        componentType: componentData ? typeof componentData : "none",
        componentLength: componentData
          ? typeof componentData === "string"
            ? componentData.length
            : Array.isArray(componentData)
            ? componentData.length
            : Object.keys(componentData || {}).length
          : 0,
        componentPreview: componentData
          ? typeof componentData === "string"
            ? componentData.length > 100
              ? componentData.substring(0, 100) + "..."
              : componentData
            : Array.isArray(componentData)
            ? `[Array: ${componentData.length} items]`
            : `[Object: ${Object.keys(componentData).join(", ")}]`
          : "none",
        storedAsStringified:
          componentData &&
          typeof componentData === "string" &&
          componentData.trim().startsWith("{")
            ? "YES"
            : "NO",
      };
    });

    res.status(200).json({
      message: `Cache debug for ${
        component || "all components"
      } in "${subtopic}"`,
      topic,
      subtopic,
      component,
      debugInfo,
      totalEntries: cacheEntries.length,
    });
  } catch (error) {
    console.error("Error in debugCacheComponentController:", error);
    res.status(500).json({
      message: "Failed to debug cache",
      error: error.message,
    });
  }
};

/**
 * Get all cached components for a topic/subtopic
 */
exports.getAllCachedComponentsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    if (!topic || !subtopic) {
      return res.status(400).json({
        message: "Topic and subtopic query parameters are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use existing cache utility
    const cachedContent = await getCachedContent(
      userId,
      topic,
      subtopic,
      user.learningStyle
    );

    if (!cachedContent || !cachedContent.content) {
      return res.status(404).json({
        message: `No cached content found for "${subtopic}"`,
        topic,
        subtopic,
        suggestion:
          "Try generating components first using POST /api/component/generate",
      });
    }

    // List available components with previews
    const availableComponents = [];
    const componentTypes = {
      title: "Title",
      concept: "Concept",
      explanation: "Explanation",
      keyConcepts: "Key Concepts",
      coreExample: "Core Example",
      practice: "Practice",
      mindmap: "Mindmap",
      learningActions: "Learning Actions",
      quiz: "Quiz",
      examples: "Examples",
    };

    for (const [compKey, compName] of Object.entries(componentTypes)) {
      if (cachedContent.content[compKey]) {
        const content = cachedContent.content[compKey];
        const cleanedContent = cleanComponentData(content, compKey);

        let preview;
        let type;

        if (Array.isArray(cleanedContent)) {
          type = "array";
          preview = `${cleanedContent.length} item${
            cleanedContent.length !== 1 ? "s" : ""
          }`;
          if (
            cleanedContent.length > 0 &&
            typeof cleanedContent[0] === "string"
          ) {
            preview += `: "${cleanedContent[0].substring(0, 30)}${
              cleanedContent[0].length > 30 ? "..." : ""
            }"`;
          }
        } else if (typeof cleanedContent === "string") {
          type = "string";
          preview =
            cleanedContent.substring(0, 50) +
            (cleanedContent.length > 50 ? "..." : "");
        } else if (
          typeof cleanedContent === "object" &&
          cleanedContent !== null
        ) {
          type = "object";
          preview = `Object with keys: ${Object.keys(cleanedContent).join(
            ", "
          )}`;
        } else {
          type = typeof cleanedContent;
          preview = String(cleanedContent);
        }

        availableComponents.push({
          component: compKey,
          name: compName,
          hasContent: true,
          type,
          preview,
          length: Array.isArray(cleanedContent)
            ? cleanedContent.length
            : typeof cleanedContent === "string"
            ? cleanedContent.length
            : 1,
        });
      }
    }

    res.status(200).json({
      message: `Cached components for "${subtopic}"`,
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      version: cachedContent.version,
      totalComponents: availableComponents.length,
      components: availableComponents,
      metadata: {
        cachedAt: cachedContent.createdAt,
        lastAccessed: cachedContent.lastAccessed,
        timesAccessed: cachedContent.timesAccessed,
        contentFormat: cachedContent.contentFormat,
      },
    });
  } catch (error) {
    console.error("Error in getAllCachedComponentsController:", error);
    res.status(500).json({
      message: "Failed to retrieve cached components",
      error: error.message,
    });
  }
};

/**
 * Get component history (all versions)
 */
exports.getComponentHistoryController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component } = req.query;

    if (!topic || !subtopic || !component) {
      return res.status(400).json({
        message:
          "Topic, subtopic, and component query parameters are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all versions of cache for this topic/subtopic
    const cacheEntries = await ContentCache.find({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
      [`content.${component}`]: { $exists: true },
    }).sort({ version: -1 });

    if (cacheEntries.length === 0) {
      return res.status(404).json({
        message: `No history found for ${component} in "${subtopic}"`,
        topic,
        subtopic,
        component,
      });
    }

    const history = cacheEntries.map((entry) => {
      const componentData = entry.content[component];
      const cleanedData = cleanComponentData(componentData, component);

      let preview;
      if (Array.isArray(cleanedData)) {
        preview = `Array with ${cleanedData.length} items`;
      } else if (typeof cleanedData === "string") {
        preview =
          cleanedData.substring(0, 80) + (cleanedData.length > 80 ? "..." : "");
      } else {
        preview = typeof cleanedData;
      }

      return {
        version: entry.version,
        isActive: entry.isActive,
        createdAt: entry.createdAt,
        lastAccessed: entry.lastAccessed,
        timesAccessed: entry.timesAccessed,
        componentType: typeof cleanedData,
        preview,
        length: Array.isArray(cleanedData)
          ? cleanedData.length
          : typeof cleanedData === "string"
          ? cleanedData.length
          : 1,
        storedAsStringified:
          typeof componentData === "string" &&
          componentData.trim().startsWith("{")
            ? true
            : false,
      };
    });

    res.status(200).json({
      message: `History for ${component} in "${subtopic}"`,
      topic,
      subtopic,
      component,
      totalVersions: history.length,
      history,
      currentVersion:
        cacheEntries.find((e) => e.isActive)?.version || history[0]?.version,
    });
  } catch (error) {
    console.error("Error in getComponentHistoryController:", error);
    res.status(500).json({
      message: "Failed to retrieve component history",
      error: error.message,
    });
  }
};

/**
 * Compare component between cache versions
 */
exports.compareComponentVersionsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component, version1, version2 } = req.query;

    if (!topic || !subtopic || !component) {
      return res.status(400).json({
        message: "Topic, subtopic, and component are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build query
    const query = {
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
      [`content.${component}`]: { $exists: true },
    };

    // Get specific versions or all versions
    const cacheEntries = await ContentCache.find(query).sort({ version: -1 });

    if (cacheEntries.length === 0) {
      return res.status(404).json({
        message: `No versions found for ${component} in "${subtopic}"`,
        topic,
        subtopic,
        component,
      });
    }

    // Get specific versions if requested
    let entry1, entry2;

    if (version1 && version2) {
      entry1 = cacheEntries.find((e) => e.version === parseInt(version1));
      entry2 = cacheEntries.find((e) => e.version === parseInt(version2));

      if (!entry1 || !entry2) {
        return res.status(404).json({
          message: `One or both versions not found`,
          requestedVersions: { version1, version2 },
          availableVersions: cacheEntries.map((e) => e.version),
        });
      }
    } else {
      // Compare latest two versions
      entry1 = cacheEntries[0];
      entry2 = cacheEntries[1] || cacheEntries[0];
    }

    // Extract and clean component data
    const data1 = cleanComponentData(entry1.content[component], component);
    const data2 = cleanComponentData(entry2.content[component], component);

    // Calculate similarity
    const similarity = calculateTextSimilarity(
      typeof data1 === "string" ? data1 : JSON.stringify(data1),
      typeof data2 === "string" ? data2 : JSON.stringify(data2)
    );

    res.status(200).json({
      message: `Comparison for ${component} in "${subtopic}"`,
      topic,
      subtopic,
      component,
      comparison: {
        version1: {
          version: entry1.version,
          isActive: entry1.isActive,
          createdAt: entry1.createdAt,
          data: data1,
          dataType: typeof data1,
          length:
            typeof data1 === "string"
              ? data1.length
              : Array.isArray(data1)
              ? data1.length
              : 1,
        },
        version2: {
          version: entry2.version,
          isActive: entry2.isActive,
          createdAt: entry2.createdAt,
          data: data2,
          dataType: typeof data2,
          length:
            typeof data2 === "string"
              ? data2.length
              : Array.isArray(data2)
              ? data2.length
              : 1,
        },
        similarity: `${Math.round(similarity * 100)}%`,
        changesDetected: similarity < 0.9,
      },
    });
  } catch (error) {
    console.error("Error in compareComponentVersionsController:", error);
    res.status(500).json({
      message: "Failed to compare component versions",
      error: error.message,
    });
  }
};

/**
 * Get component statistics
 */
exports.getComponentStatsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    if (!topic || !subtopic) {
      return res.status(400).json({
        message: "Topic and subtopic query parameters are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all cache entries for this topic/subtopic
    const cacheEntries = await ContentCache.find({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
    });

    if (cacheEntries.length === 0) {
      return res.status(404).json({
        message: `No cache entries found for "${subtopic}"`,
        topic,
        subtopic,
      });
    }

    // Get active cache
    const activeCache = cacheEntries.find((e) => e.isActive) || cacheEntries[0];

    // Calculate statistics
    const componentStats = {};
    const allComponents = new Set();

    // Collect all components across versions
    cacheEntries.forEach((entry) => {
      if (entry.content) {
        Object.keys(entry.content).forEach((comp) => {
          allComponents.add(comp);
        });
      }
    });

    // Calculate stats for each component
    for (const component of allComponents) {
      const versionsWithComponent = cacheEntries.filter(
        (e) => e.content?.[component]
      );

      componentStats[component] = {
        totalVersions: versionsWithComponent.length,
        firstVersion: Math.min(...versionsWithComponent.map((e) => e.version)),
        latestVersion: Math.max(...versionsWithComponent.map((e) => e.version)),
        inActiveCache: !!activeCache.content?.[component],
        lastUpdated: versionsWithComponent[0]?.createdAt, // Latest version
        versions: versionsWithComponent.map((e) => ({
          version: e.version,
          isActive: e.isActive,
          createdAt: e.createdAt,
        })),
      };
    }

    // General stats
    const stats = {
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      totalCacheVersions: cacheEntries.length,
      activeCacheVersion: activeCache.version,
      totalComponents: allComponents.size,
      componentStats,
      cacheActivity: {
        totalAccesses: cacheEntries.reduce(
          (sum, e) => sum + (e.timesAccessed || 0),
          0
        ),
        firstCreated: cacheEntries[cacheEntries.length - 1]?.createdAt,
        lastAccessed: activeCache.lastAccessed,
        mostAccessedVersion: cacheEntries.reduce((max, e) =>
          e.timesAccessed > (max?.timesAccessed || 0) ? e : max
        )?.version,
      },
    };

    res.status(200).json({
      message: `Component statistics for "${subtopic}"`,
      ...stats,
    });
  } catch (error) {
    console.error("Error in getComponentStatsController:", error);
    res.status(500).json({
      message: "Failed to get component statistics",
      error: error.message,
    });
  }
};

/**
 * Merge multiple cache entries (for debugging/cleanup)
 */
exports.mergeCacheComponentsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    if (!topic || !subtopic) {
      return res.status(400).json({
        message: "Topic and subtopic are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all cache entries
    const cacheEntries = await ContentCache.find({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
    }).sort({ version: -1 });

    if (cacheEntries.length === 0) {
      return res.status(404).json({
        message: `No cache entries found for "${subtopic}"`,
        topic,
        subtopic,
      });
    }

    // Merge all components from all versions
    const mergedContent = {};
    const mergedFromVersions = [];

    for (const entry of cacheEntries) {
      if (entry.content) {
        Object.entries(entry.content).forEach(([component, data]) => {
          // Only add if not already present (prefer newer versions)
          if (!mergedContent[component]) {
            mergedContent[component] = cleanComponentData(data, component);
            mergedFromVersions.push({
              component,
              fromVersion: entry.version,
              createdAt: entry.createdAt,
            });
          }
        });
      }
    }

    // Create new merged cache entry
    const latestVersion = cacheEntries[0].version;

    // Deactivate all old versions
    await ContentCache.updateMany(
      {
        userId,
        topic: topic.toLowerCase(),
        subtopic: subtopic.toLowerCase(),
        learningStyle: user.learningStyle,
      },
      { isActive: false }
    );

    const mergedCacheEntry = new ContentCache({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
      learningMotivation: cacheEntries[0].learningMotivation,
      difficultyLevel: cacheEntries[0].difficultyLevel,
      contentFormat: "comprehensive",
      content: mergedContent,
      aiModelUsed: cacheEntries[0].aiModelUsed,
      aiPromptHash: crypto
        .createHash("md5")
        .update("merged-cache")
        .digest("hex"),
      version: latestVersion + 1,
      isActive: true,
      timesAccessed: cacheEntries.reduce(
        (sum, e) => sum + (e.timesAccessed || 0),
        0
      ),
      lastAccessed: new Date(),
    });

    await mergedCacheEntry.save();

    res.status(200).json({
      message: `Cache merged successfully for "${subtopic}"`,
      topic,
      subtopic,
      oldVersions: cacheEntries.length,
      newVersion: mergedCacheEntry.version,
      mergedComponents: Object.keys(mergedContent),
      mergedComponentCount: Object.keys(mergedContent).length,
      mergedFromVersions,
      preview: Object.entries(mergedContent).reduce((acc, [key, value]) => {
        acc[key] =
          typeof value === "string"
            ? value.substring(0, 30) + (value.length > 30 ? "..." : "")
            : Array.isArray(value)
            ? `[Array: ${value.length} items]`
            : typeof value;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Error in mergeCacheComponentsController:", error);
    res.status(500).json({
      message: "Failed to merge cache components",
      error: error.message,
    });
  }
};

/**
 * Clear all component cache for user
 */
exports.clearAllComponentCacheController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    const query = { userId };
    if (topic) query.topic = topic.toLowerCase();
    if (subtopic) query.subtopic = subtopic.toLowerCase();

    const result = await ContentCache.deleteMany(query);

    res.status(200).json({
      message: "Component cache cleared successfully",
      deletedCount: result.deletedCount,
      scope:
        topic && subtopic
          ? `"${subtopic}" under "${topic}"`
          : topic
          ? `all subtopics under "${topic}"`
          : "all topics",
    });
  } catch (error) {
    console.error("Error in clearAllComponentCacheController:", error);
    res.status(500).json({
      message: "Failed to clear component cache",
      error: error.message,
    });
  }
};

// Helper functions from component-controller.js (needed here)
function cleanComponentData(cachedData, component) {
  if (!cachedData) return null;

  if (typeof cachedData === "string" || Array.isArray(cachedData)) {
    return cachedData;
  }

  if (typeof cachedData === "object") {
    if (cachedData[component]) {
      return cachedData[component];
    }
    if (cachedData.content) {
      return cachedData.content;
    }

    for (const [key, value] of Object.entries(cachedData)) {
      if (typeof value === "string" && value.length > 10) {
        return value;
      }
      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  return typeof cachedData === "object"
    ? JSON.stringify(cachedData)
    : cachedData;
}

function calculateTextSimilarity(text1, text2) {
  if (text1 === text2) return 1.0;

  const longer = text1.length > text2.length ? text1 : text2;
  const shorter = text1.length > text2.length ? text2 : text1;

  if (longer.length === 0) return 1.0;

  let matches = 0;
  const maxCheck = Math.min(shorter.length, 200);

  for (let i = 0; i < maxCheck; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }

  return matches / maxCheck;
}

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

    const debugInfo = cacheEntries.map((entry) => ({
      id: entry._id,
      topic: entry.topic,
      subtopic: entry.subtopic,
      version: entry.version,
      hasContent: !!entry.content,
      contentType: typeof entry.content,
      contentKeys: entry.content ? Object.keys(entry.content) : [],
      hasMindmap: entry.content ? !!entry.content.mindmap : false,
      mindmapLength:
        entry.content && entry.content.mindmap
          ? entry.content.mindmap.length
          : 0,
      isActive: entry.isActive,
      lastAccessed: entry.lastAccessed,
      explanationSample:
        entry.content && entry.content.explanation
          ? entry.content.explanation.substring(0, 100) + "..."
          : "MISSING",
    }));

    res.status(200).json({
      message: "Cache debug information",
      data: debugInfo,
    });
  } catch (error) {
    console.error("Error in debugCacheController:", error);
    res.status(500).json({ message: "Failed to get cache debug info" });
  }
};
