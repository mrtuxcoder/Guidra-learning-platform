const ContentCache = require("../../../models/Content-cache");

const parseVersionNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

exports.getComponentVersionsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component, limit } = req.body;
    const parsedLimit = Number(limit);

    if (!topic || !subtopic || !component) {
      return res.status(400).json({
        message: "Topic, subtopic, and component are required.",
      });
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    });

    if (!cacheDoc) {
      return res.status(404).json({
        message: "No cached content found for the specified topic and subtopic.",
      });
    }

    const allVersions = Array.isArray(cacheDoc.content?.versions)
      ? cacheDoc.content.versions
      : [];

    let componentVersions = allVersions
      .filter(
        (v) =>
          v.contentType === "component" &&
          (v.componentName === component || v.data?.componentName === component)
      )
      .sort((a, b) => a.version - b.version)
      .map((v) => ({
        version: v.version,
        displayVersion: v.version,
        createdAt: v.createdAt,
        source: "component",
      }));

    if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
      componentVersions = componentVersions.slice(-parsedLimit);
    }

    console.log(
      `📦 [COMPONENT VERSIONS] ${topic} / ${subtopic} / ${component} -> ` +
        componentVersions
          .map((v) => `v${v.displayVersion}(#${v.version}):${v.source}`)
          .join(", ") +
        ` (total=${allVersions.length})`
    );

    return res.status(200).json({
      topic,
      subtopic,
      component,
      versions: componentVersions,
    });
  } catch (error) {
    console.error("Error in getComponentVersionsController:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve component versions" });
  }
};

exports.getComponentVersionController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component, versionNumber } = req.body;
    const parsedVersion = parseVersionNumber(versionNumber);

    if (!topic || !subtopic || !component || parsedVersion === null) {
      return res.status(400).json({
        message:
          "Topic, subtopic, component, and a valid version number are required.",
      });
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    });

    if (!cacheDoc) {
      return res.status(404).json({
        message: "No cached content found for the specified topic and subtopic.",
      });
    }

    const allVersions = Array.isArray(cacheDoc.content?.versions)
      ? cacheDoc.content.versions
      : [];

    const versionEntry = allVersions.find(
      (v) =>
        v.version === parsedVersion &&
        v.contentType === "component" &&
        (v.componentName === component || v.data?.componentName === component)
    );

    const responseData = versionEntry?.data?.componentContent;

    if (!versionEntry || responseData === undefined) {
      return res.status(404).json({
        message: "Specified component version not found in cache.",
      });
    }

    console.log(
      `📦 [COMPONENT VERSION] ${topic} / ${subtopic} / ${component} v${parsedVersion} -> ${
        responseData ? "found" : "empty"
      } (total=${allVersions.length})`
    );

    return res.status(200).json({
      topic,
      subtopic,
      component,
      version: parsedVersion,
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getComponentVersionController:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve component version" });
  }
};
