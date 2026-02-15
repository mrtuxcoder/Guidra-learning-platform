const User = require("../../../models/User");
const callAIAPI = require("../../../utils/call-AI");
const generateSpecificPrompts = require("../../../utils/prompt/specific-prompt-generator");
const {
  getCachedContent,
  getCachedComponent,
} = require("../../../utils/cache/get-cache");
const {
  saveComponentToCache,
  saveToCache,
} = require("../../../utils/cache/save-cache");
const ContentCache = require("../../../models/Content-cache");
const {
  cleanComponentData,
  extractComponentFromAIResponse
} = require("../../../utils/content/component/parse-component"); // Adjust path as needed

/**
 * Generate a single specific component for a subtopic
 */
exports.generateComponentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component, regenerate = false } = req.body;

    // Validate required fields
    if (!topic || !subtopic || !component) {
      return res.status(400).json({
        message: "Topic, subtopic, and component are required.",
        componentOptions: [
          "title",
          "concept",
          "explanation",
          "coreExample",
          "practice",
          "learningActions",
          "mindmap",
          "quiz",
          "examples",
        ],
      });
    }

    // Validate component
    const validComponents = [
      "title",
      "concept",
      "explanation",
      "coreExample",
      "practice",
      "learningActions",
      "mindmap",
      "quiz",
      "examples",
    ];

    if (!validComponents.includes(component)) {
      return res.status(400).json({
        message: "Invalid component requested",
        invalidComponent: component,
        validComponents,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check existing cache
    let cachedContentDoc = null;
    if (!regenerate) {
      const cachedComponent = await getCachedComponent(
        userId,
        topic,
        subtopic,
        component
      );

      if (cachedComponent?.componentContent !== undefined) {
        console.log(`📂 Loading "${component}" from component cache`);

        const componentData = cleanComponentData(
          cachedComponent.componentContent,
          component
        );

        return res.status(200).json({
          message: `Cached ${component} retrieved for "${subtopic}"`,
          topic,
          subtopic,
          component,
          learningStyle: user.learningStyle,
          cached: true,
          version: cachedComponent.version,
          [component]: componentData,
        });
      }

      cachedContentDoc = await getCachedContent(userId, topic, subtopic);
      if (cachedContentDoc?.content?.latestVersion) {
        const versionEntry = cachedContentDoc.content.versions.find(
          (v) =>
            v.version === cachedContentDoc.content.latestVersion &&
            v.contentType === "full"
        );

        if (versionEntry?.data?.[component]) {
          console.log(`📂 Loading "${component}" from full cache`);

          const componentData = cleanComponentData(
            versionEntry.data[component],
            component
          );

          return res.status(200).json({
            message: `Cached ${component} retrieved for "${subtopic}"`,
            topic,
            subtopic,
            component,
            learningStyle: user.learningStyle,
            cached: true,
            version: versionEntry.version,
            [component]: componentData,
          });
        }
      }
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      isActive: true,
    });

    const existingVersions = Array.isArray(cacheDoc?.content?.versions)
      ? cacheDoc.content.versions
      : [];

    const componentVersionCount = existingVersions.filter(
      (v) =>
        v.contentType === "component" &&
        (v.componentName === component || v.data?.componentName === component)
    ).length;

    if (componentVersionCount >= 3) {
      return res.status(429).json({
        message: "Generation limit reached for this component (max 3)",
        topic,
        subtopic,
        component,
        limit: 3,
      });
    }

    // Generate prompt for the single component
    const promptResult = generateSpecificPrompts(
      user,
      topic,
      subtopic,
      component
    );

    if (!promptResult.success) {
      return res.status(500).json({
        message: "Failed to generate component prompt",
        errors: promptResult.errors,
      });
    }

    const componentPrompt = promptResult.prompts[component];

    if (componentPrompt.error) {
      return res.status(500).json({
        message: "Failed to generate component prompt",
        error: componentPrompt.error,
      });
    }

    // Call AI API
    let aiResponse;
    try {
      aiResponse = await callAIAPI(componentPrompt.prompt);
    } catch (error) {
      console.error(`❌ Error generating ${component}:`, error);
      return res.status(500).json({
        message: `Failed to generate ${component}`,
        error: error.message,
      });
    }

    // Extract clean content from AI response
    const componentContent = extractComponentFromAIResponse(
      aiResponse,
      component
    );

    const { versionEntry } = await saveComponentToCache({
      userId: userId.toString(),
      topic,
      subtopic,
      componentName: component,
      componentContent,
    });

    console.log(
      `✅ [COMPONENT GENERATED] ${topic} / ${subtopic} / ${component} -> v${versionEntry.versionNumber}`
    );

    if (cachedContentDoc?.content?.latestVersion) {
      const latestFullEntry = cachedContentDoc.content.versions.find(
        (v) =>
          v.version === cachedContentDoc.content.latestVersion &&
          v.contentType === "full"
      );

      if (latestFullEntry?.data) {
        const updatedFullContent = {
          ...latestFullEntry.data,
          [component]: componentContent,
        };

        await saveToCache({
          userId: userId.toString(),
          topic,
          subtopic,
          content: updatedFullContent,
        });
      }
    }

    // Build response
    const response = {
      message: `${
        component.charAt(0).toUpperCase() + component.slice(1)
      } generated for "${subtopic}"`,
      topic,
      subtopic,
      component,
      learningStyle: user.learningStyle,
      cached: false,
      version: versionEntry.versionNumber,
      [component]: componentContent,
    };

    response.metadata = {
      user: user.name,
      difficultyPreference: user.difficultyPreference,
      generatedAt: new Date().toISOString(),
      cacheUpdated: true,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in generateComponentController:", error);
    res.status(500).json({
      message: "Failed to generate component",
      error: error.message,
    });
  }
};