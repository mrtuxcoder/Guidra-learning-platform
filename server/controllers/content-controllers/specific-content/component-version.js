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
      isActive: true,
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
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((v, index) => ({
        version: v.version,
        displayVersion: index + 1,
        createdAt: v.createdAt,
        source: "component",
      }));

    if (componentVersions.length === 0) {
      componentVersions = allVersions
        .filter(
          (v) =>
            v.contentType === "full" &&
            v.data &&
            Object.prototype.hasOwnProperty.call(v.data, component)
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((v, index) => ({
          version: v.version,
          displayVersion: index + 1,
          createdAt: v.createdAt,
          source: "full",
        }));
    }

    if (
      componentVersions.length === 0 &&
      cacheDoc.content?.components?.[component]
    ) {
      const fallbackVersion = cacheDoc.content?.latestVersion || 1;
      componentVersions = [
        {
          version: fallbackVersion,
          displayVersion: 1,
          createdAt: cacheDoc.updatedAt,
          source: "components",
        },
      ];
    }

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
      isActive: true,
    });

    if (!cacheDoc) {
      return res.status(404).json({
        message: "No cached content found for the specified topic and subtopic.",
      });
    }

    const allVersions = Array.isArray(cacheDoc.content?.versions)
      ? cacheDoc.content.versions
      : [];

    let versionEntry = allVersions.find(
      (v) =>
        v.version === parsedVersion &&
        v.contentType === "component" &&
        (v.componentName === component || v.data?.componentName === component)
    );

    let responseData = versionEntry?.data?.componentContent;

    if (!versionEntry) {
      const fullEntry = allVersions.find(
        (v) =>
          v.version === parsedVersion &&
          v.contentType === "full" &&
          v.data &&
          Object.prototype.hasOwnProperty.call(v.data, component)
      );

      if (fullEntry) {
        versionEntry = fullEntry;
        responseData = fullEntry.data[component];
      }
    }

    if (!versionEntry && cacheDoc.content?.components?.[component]) {
      const fallbackVersion = cacheDoc.content?.latestVersion || 1;
      if (parsedVersion === fallbackVersion) {
        responseData = cacheDoc.content.components[component];
      }
    }

    if (!versionEntry && responseData === undefined) {
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
