// file: regenerate-controller.js
const User = require("../../../models/User");
const callAIAPI = require("../../../utils/call-AI");
const generateSpecificPrompts = require("../../../utils/prompt/specific-prompt-generator");
const {
  saveComponentToCache,
  saveToCache,
} = require("../../../utils/cache/save-cache");
const { getCachedContent } = require("../../../utils/cache/get-cache");
const ContentCache = require("../../../models/Content-cache");
const {
  DAILY_REGEN_LIMIT,
  ensureDailyRegenWindow,
  getDailyRegenRemaining,
} = require("../../../utils/daily-regen");

// IMPORT THE UTILITY FUNCTIONS
const {
  cleanComponentData,
  extractComponentFromAIResponse
} = require("../../../utils/content/component/parse-component"); 


/**
 * Regenerate a single specific component for a subtopic
 * Uses the new utility functions for better parsing
 */
exports.regenerateComponentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component } = req.body;
    
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

    ensureDailyRegenWindow(user);
    const dailyRemaining = getDailyRegenRemaining(user);
    if (dailyRemaining <= 0) {
      return res.status(429).json({
        message: "Daily regeneration limit reached (max 6 per day)",
        limit: DAILY_REGEN_LIMIT,
        dailyRemaining: 0,
        dailyResetAt: user.regenDailyResetAt,
      });
    }

    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    })
      .select("content.versions content.componentVersionCounters")
      .lean();

    const existingVersions = Array.isArray(cacheDoc?.content?.versions)
      ? cacheDoc.content.versions
      : [];

    const counterValue = Number(
      cacheDoc?.content?.componentVersionCounters?.[component] || 0
    );

    const arrayCount = existingVersions.filter(
      (v) =>
        v.contentType === "component" &&
        (v.componentName === component || v.data?.componentName === component)
    ).length;

    const componentVersionCount = Math.max(counterValue, arrayCount);

    console.log(
      `✅ [COMPONENT REGEN COUNT] ${topic} / ${subtopic} / ${component} -> ${componentVersionCount}`
    );

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
      console.error(`❌ Error regenerating ${component}:`, error);
      return res.status(500).json({
        message: `Failed to regenerate ${component}`,
        error: error.message,
      });
    }

    // Extract clean content from AI response using new utility
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
      `✅ [COMPONENT REGENERATED] ${topic} / ${subtopic} / ${component} -> v${versionEntry.versionNumber}`
    );

    const cachedContentDoc = await getCachedContent(userId, topic, subtopic);
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
    user.regenDailyCount = Number(user.regenDailyCount || 0) + 1;
    await user.save();

    const response = {
      message: `${
        component.charAt(0).toUpperCase() + component.slice(1)
      } regenerated for "${subtopic}"`,
      topic,
      subtopic,
      component,
      learningStyle: user.learningStyle,
      cached: false,
      regenerated: true,
      version: versionEntry.versionNumber,
      dailyLimit: DAILY_REGEN_LIMIT,
      dailyRemaining: Math.max(
        0,
        DAILY_REGEN_LIMIT - Number(user.regenDailyCount || 0)
      ),
      dailyResetAt: user.regenDailyResetAt,
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
    console.error("Error in regenerateComponentController:", error);
    res.status(500).json({
      message: "Failed to regenerate component",
      error: error.message,
    });
  }
};
