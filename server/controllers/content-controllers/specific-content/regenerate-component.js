// file: regenerate-controller.js
const User = require("../../../models/User");
const callAIAPI = require("../../../utils/call-AI");
const generateSpecificPrompts = require("../../../utils/prompt/specific-prompt-generator");
const crypto = require("crypto");
const getCachedContent = require("../../../utils/cache/get-cache");
const saveToCache = require("../../../utils/cache/save-cache");

// IMPORT THE UTILITY FUNCTIONS
const {
  cleanComponentData,
  parseSingleComponent,
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

    // Get existing cache to update it
    const existingCache = await getCachedContent(
      userId,
      topic,
      subtopic,
      user.learningStyle
    );

    let updatedContent;
    let newVersion;

    if (existingCache) {
      // Update existing cache content
      updatedContent = {
        ...existingCache.content,
        [component]: componentContent,
      };

      // Create new cache entry
      const newCacheEntry = await saveToCache({
        userId: userId.toString(),
        topic,
        subtopic,
        user,
        content: updatedContent,
        aiPrompt: componentPrompt.prompt,
        crypto,
      });

      newVersion = newCacheEntry.version;
    } else {
      // Create new cache with just this component
      updatedContent = {
        [component]: componentContent,
      };

      const newCacheEntry = await saveToCache({
        userId: userId.toString(),
        topic,
        subtopic,
        user,
        content: updatedContent,
        aiPrompt: componentPrompt.prompt,
        crypto,
      });

      newVersion = newCacheEntry.version;
    }

    // Build response
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
      version: newVersion,
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
