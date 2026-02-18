const ContentCache = require("../../../models/Content-cache");

/**
 * Get all available versions for a subtopic
 * Returns metadata about all versions (creation date, content type, size, etc)
 */
exports.getAvailableVersionsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({
        message: "Topic and subtopic are required.",
      });
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    });

    if (!cacheDoc || !cacheDoc.content.versions.length) {
      return res.status(404).json({
        message: "No versions found for the specified topic and subtopic.",
      });
    }

    // Filter and format full content versions
    const fullVersions = cacheDoc.content.versions
      .filter((v) => v.contentType === "full")
      .map((v) => ({
        version: v.version,
        contentType: v.contentType,
        createdAt: v.createdAt,
        dataSize: JSON.stringify(v.data).length,
        hasFullContent: !!v.data,
      }))
      .sort((a, b) => b.version - a.version);

    if (fullVersions.length === 0) {
      return res.status(404).json({
        message: "No full content versions found.",
      });
    }

    return res.status(200).json({
      message: "Available content versions retrieved",
      topic,
      subtopic,
      totalVersions: fullVersions.length,
      latestVersion: cacheDoc.content.latestVersion,
      versions: fullVersions,
    });
  } catch (error) {
    console.error("Error in getAvailableVersionsController:", error);
    res.status(500).json({
      message: "Failed to retrieve available versions",
    });
  }
};

/**
 * Retrieve full content from a specific version
 * Returns complete generated content for the requested version
 */
exports.getFullContentByVersionController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, versionNumber } = req.body;
    const parsedVersion = Number(versionNumber);

    if (!topic || !subtopic || !Number.isFinite(parsedVersion)) {
      return res.status(400).json({
        message:
          "Topic, subtopic, and a valid version number are required.",
      });
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    });

    if (!cacheDoc) {
      return res.status(404).json({
        message:
          "No cached content found for the specified topic and subtopic.",
      });
    }

    const versionEntry = cacheDoc.content.versions.find(
      (v) => v.version === parsedVersion && v.contentType === "full"
    );

    if (!versionEntry) {
      return res.status(404).json({
        message: `Full content version ${parsedVersion} not found.`,
        availableVersions: cacheDoc.content.versions
          .filter((v) => v.contentType === "full")
          .map((v) => v.version),
      });
    }

    // Update access stats
    cacheDoc.timesAccessed += 1;
    cacheDoc.lastAccessed = new Date();
    await cacheDoc.save();

    return res.status(200).json({
      message: `Retrieved full content for version ${parsedVersion}`,
      topic,
      subtopic,
      version: parsedVersion,
      createdAt: versionEntry.createdAt,
      contentType: versionEntry.contentType,
      dataSize: JSON.stringify(versionEntry.data).length,
      data: versionEntry.data,
    });
  } catch (error) {
    console.error("Error in getFullContentByVersionController:", error);
    res.status(500).json({
      message: "Failed to retrieve full content",
    });
  }
};

/**
 * Get version comparison
 * Returns metadata and key differences between two versions
 */
exports.compareVersionsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, version1, version2 } = req.body;
    const v1 = Number(version1);
    const v2 = Number(version2);

    if (!topic || !subtopic || !Number.isFinite(v1) || !Number.isFinite(v2)) {
      return res.status(400).json({
        message:
          "Topic, subtopic, and two valid version numbers are required.",
      });
    }

    if (v1 === v2) {
      return res.status(400).json({
        message: "Version numbers must be different for comparison.",
      });
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    });

    if (!cacheDoc) {
      return res.status(404).json({
        message: "No cached content found.",
      });
    }

    const versionEntry1 = cacheDoc.content.versions.find(
      (v) => v.version === v1 && v.contentType === "full"
    );
    const versionEntry2 = cacheDoc.content.versions.find(
      (v) => v.version === v2 && v.contentType === "full"
    );

    if (!versionEntry1 || !versionEntry2) {
      return res.status(404).json({
        message: "One or both versions not found.",
        availableVersions: cacheDoc.content.versions
          .filter((v) => v.contentType === "full")
          .map((v) => v.version),
      });
    }

    // Create comparison metadata
    const compare = {
      version1: {
        version: versionEntry1.version,
        createdAt: versionEntry1.createdAt,
        dataSize: JSON.stringify(versionEntry1.data).length,
        components: Object.keys(versionEntry1.data).length,
      },
      version2: {
        version: versionEntry2.version,
        createdAt: versionEntry2.createdAt,
        dataSize: JSON.stringify(versionEntry2.data).length,
        components: Object.keys(versionEntry2.data).length,
      },
      difference: {
        dataSizeDiff:
          JSON.stringify(versionEntry2.data).length -
          JSON.stringify(versionEntry1.data).length,
        timeDiff:
          new Date(versionEntry2.createdAt) -
          new Date(versionEntry1.createdAt),
      },
    };

    return res.status(200).json({
      message: `Version comparison between ${v1} and ${v2}`,
      topic,
      subtopic,
      comparison: compare,
    });
  } catch (error) {
    console.error("Error in compareVersionsController:", error);
    res.status(500).json({
      message: "Failed to compare versions",
    });
  }
};

/**
 * Get latest full content version
 * Convenience wrapper for retrieving the most recent version
 */
exports.getLatestFullContentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({
        message: "Topic and subtopic are required.",
      });
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    });

    if (!cacheDoc || !cacheDoc.content.latestVersion) {
      return res.status(404).json({
        message: "No content versions found.",
      });
    }

    const latestVersion = cacheDoc.content.latestVersion;
    const versionEntry = cacheDoc.content.versions.find(
      (v) => v.version === latestVersion && v.contentType === "full"
    );

    if (!versionEntry) {
      return res.status(404).json({
        message: "Latest version does not contain full content.",
      });
    }

    // Update access stats
    cacheDoc.timesAccessed += 1;
    cacheDoc.lastAccessed = new Date();
    await cacheDoc.save();

    return res.status(200).json({
      message: `Retrieved latest full content (v${latestVersion})`,
      topic,
      subtopic,
      version: latestVersion,
      createdAt: versionEntry.createdAt,
      contentType: versionEntry.contentType,
      dataSize: JSON.stringify(versionEntry.data).length,
      data: versionEntry.data,
    });
  } catch (error) {
    console.error("Error in getLatestFullContentController:", error);
    res.status(500).json({
      message: "Failed to retrieve latest content",
    });
  }
};

/**
 * Get version history
 * Returns timeline of all version creations
 */
exports.getVersionHistoryController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({
        message: "Topic and subtopic are required.",
      });
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    });

    if (!cacheDoc || !cacheDoc.content.versions.length) {
      return res.status(404).json({
        message: "No version history found.",
      });
    }

    const history = cacheDoc.content.versions
      .filter((v) => v.contentType === "full")
      .map((v) => ({
        version: v.version,
        createdAt: v.createdAt,
        contentType: v.contentType,
        dataSize: JSON.stringify(v.data).length,
        isLatest: v.version === cacheDoc.content.latestVersion,
      }))
      .sort((a, b) => b.version - a.version);

    return res.status(200).json({
      message: "Version history retrieved",
      topic,
      subtopic,
      totalVersions: history.length,
      history,
      timesAccessedTotal: cacheDoc.timesAccessed,
      lastAccessedAt: cacheDoc.lastAccessed,
    });
  } catch (error) {
    console.error("Error in getVersionHistoryController:", error);
    res.status(500).json({
      message: "Failed to retrieve version history",
    });
  }
};
