const User = require("../../models/User");
const ContentCache = require("../../models/Content-cache");
const callAIAPI = require("../../utils/call-AI");
const {
  generateSpecificPrompts,
} = require("../../utils/content-prompt-builder");
const crypto = require("crypto");
const { generateFallbackMindmap } = require("../../utils/content-utils");
const { getCachedContent, saveToCache } = require("../../utils/cache-utils");

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
          "keyConcepts",
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
      "keyConcepts",
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
    if (!regenerate) {
      const cachedContent = await getCachedContent(
        userId,
        topic,
        subtopic,
        user.learningStyle
      );

      if (
        cachedContent &&
        cachedContent.content &&
        cachedContent.content[component]
      ) {
        console.log(`📂 Loading "${component}" from existing cache`);

        // Get and clean component data
        let componentData = cleanComponentData(
          cachedContent.content[component],
          component
        );

        // Update cache access
        cachedContent.timesAccessed += 1;
        cachedContent.lastAccessed = new Date();
        await cachedContent.save();

        // Build response
        const response = {
          message: `Cached ${component} retrieved for "${subtopic}"`,
          topic,
          subtopic,
          component,
          learningStyle: user.learningStyle,
          cached: true,
          version: cachedContent.version,
          [component]: componentData, // Dynamic key with clean data
        };

        response.metadata = {
          generatedAt: cachedContent.createdAt,
          timesAccessed: cachedContent.timesAccessed,
        };

        return res.status(200).json(response);
      }
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

    // CRITICAL: Extract clean content from AI response
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
        [component]: componentContent, // Store clean content
      };

      // Create new cache entry with updated content
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
        [component]: componentContent, // Store clean content
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
      } generated for "${subtopic}"`,
      topic,
      subtopic,
      component,
      learningStyle: user.learningStyle,
      cached: false,
      version: newVersion,
      [component]: componentContent, // Dynamic key with clean data
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

/**
 * Get specific component from cache
 */
exports.getComponentFromCacheController = async (req, res) => {
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

    // Use existing cache utility
    const cachedContent = await getCachedContent(
      userId,
      topic,
      subtopic,
      user.learningStyle
    );

    if (
      !cachedContent ||
      !cachedContent.content ||
      !cachedContent.content[component]
    ) {
      return res.status(404).json({
        message: `No cached ${component} found for "${subtopic}"`,
        topic,
        subtopic,
        component,
        suggestion:
          "Try generating it first using POST /api/component/generate",
      });
    }

    // Get and clean component data
    let componentData = cleanComponentData(
      cachedContent.content[component],
      component
    );

    // Update access tracking
    cachedContent.timesAccessed += 1;
    cachedContent.lastAccessed = new Date();
    await cachedContent.save();

    // Build response
    const response = {
      message: `Cached ${component} retrieved`,
      topic,
      subtopic,
      component,
      learningStyle: user.learningStyle,
      cached: true,
      version: cachedContent.version,
      [component]: componentData, // Dynamic key
    };

    response.metadata = {
      cachedAt: cachedContent.createdAt,
      lastAccessed: cachedContent.lastAccessed,
      timesAccessed: cachedContent.timesAccessed,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getComponentFromCacheController:", error);
    res.status(500).json({
      message: "Failed to retrieve component from cache",
      error: error.message,
    });
  }
};

/**
 * Fix cached component that's stored as stringified JSON
 */
exports.fixCachedComponentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component } = req.body;

    if (!topic || !subtopic || !component) {
      return res.status(400).json({
        message: "Topic, subtopic, and component are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get active cache entry
    const cachedContent = await getCachedContent(
      userId,
      topic,
      subtopic,
      user.learningStyle
    );

    if (
      !cachedContent ||
      !cachedContent.content ||
      !cachedContent.content[component]
    ) {
      return res.status(404).json({
        message: `No ${component} found in cache to fix`,
        topic,
        subtopic,
        component,
      });
    }

    const oldData = cachedContent.content[component];
    const newData = cleanComponentData(oldData, component);

    let fixed = false;

    // Check if data needs fixing
    if (
      typeof oldData === "string" &&
      oldData.trim().startsWith("{") &&
      JSON.stringify(oldData) !== JSON.stringify(newData)
    ) {
      // Create new cache version with fixed data
      const updatedContent = {
        ...cachedContent.content,
        [component]: newData,
      };

      // Deactivate old version
      cachedContent.isActive = false;
      await cachedContent.save();

      // Create new version
      const newCacheEntry = new ContentCache({
        userId,
        topic: topic.toLowerCase(),
        subtopic: subtopic.toLowerCase(),
        learningStyle: user.learningStyle,
        learningMotivation: cachedContent.learningMotivation,
        difficultyLevel: cachedContent.difficultyLevel,
        contentFormat: cachedContent.contentFormat,
        content: updatedContent,
        aiModelUsed: cachedContent.aiModelUsed,
        aiPromptHash: cachedContent.aiPromptHash,
        version: cachedContent.version + 1,
        isActive: true,
        timesAccessed: cachedContent.timesAccessed,
        lastAccessed: new Date(),
      });

      await newCacheEntry.save();
      fixed = true;

      console.log(
        `✅ Fixed ${component} in cache: v${cachedContent.version} → v${newCacheEntry.version}`
      );
    }

    res.status(200).json({
      message: fixed
        ? `Fixed ${component} in cache`
        : `No fix needed for ${component}`,
      topic,
      subtopic,
      component,
      fixed,
      oldDataPreview:
        typeof oldData === "string"
          ? oldData.substring(0, 100) + (oldData.length > 100 ? "..." : "")
          : typeof oldData,
      newDataPreview:
        typeof newData === "string"
          ? newData.substring(0, 100) + (newData.length > 100 ? "..." : "")
          : Array.isArray(newData)
          ? `[Array: ${newData.length} items]`
          : typeof newData,
    });
  } catch (error) {
    console.error("Error in fixCachedComponentController:", error);
    res.status(500).json({
      message: "Failed to fix cached component",
      error: error.message,
    });
  }
};

/**
 * Delete specific component from cache
 */
exports.deleteComponentFromCacheController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, component } = req.body;

    if (!topic || !subtopic || !component) {
      return res.status(400).json({
        message: "Topic, subtopic, and component are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get active cache entry
    const activeCache = await getCachedContent(
      userId,
      topic,
      subtopic,
      user.learningStyle
    );

    if (!activeCache || !activeCache.content) {
      return res.status(404).json({
        message: `No cache found for "${subtopic}"`,
        topic,
        subtopic,
      });
    }

    if (!activeCache.content[component]) {
      return res.status(404).json({
        message: `Component "${component}" not found in cache`,
        topic,
        subtopic,
        component,
        availableComponents: Object.keys(activeCache.content),
      });
    }

    // Create new version without the component
    const newContent = { ...activeCache.content };
    delete newContent[component];

    // Deactivate old version
    activeCache.isActive = false;
    await activeCache.save();

    // Create new version
    const newCacheEntry = new ContentCache({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
      learningMotivation: activeCache.learningMotivation,
      difficultyLevel: activeCache.difficultyLevel,
      contentFormat: activeCache.contentFormat,
      content: newContent,
      aiModelUsed: activeCache.aiModelUsed,
      aiPromptHash: activeCache.aiPromptHash,
      version: activeCache.version + 1,
      isActive: true,
      timesAccessed: activeCache.timesAccessed,
      lastAccessed: new Date(),
    });

    await newCacheEntry.save();

    res.status(200).json({
      message: `Component "${component}" deleted from cache`,
      topic,
      subtopic,
      component,
      oldVersion: activeCache.version,
      newVersion: newCacheEntry.version,
      remainingComponents: Object.keys(newContent),
      remainingCount: Object.keys(newContent).length,
    });
  } catch (error) {
    console.error("Error in deleteComponentFromCacheController:", error);
    res.status(500).json({
      message: "Failed to delete component from cache",
      error: error.message,
    });
  }
};

/**
 * Batch generate multiple components at once
 */
exports.batchGenerateComponentsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, components } = req.body;

    if (
      !topic ||
      !subtopic ||
      !components ||
      !Array.isArray(components) ||
      components.length === 0
    ) {
      return res.status(400).json({
        message: "Topic, subtopic, and components array are required.",
        maxBatchSize: 5,
        componentOptions: [
          "title",
          "concept",
          "explanation",
          "keyConcepts",
          "coreExample",
          "practice",
          "learningActions",
          "mindmap",
          "quiz",
          "examples",
        ],
      });
    }

    // Limit batch size
    if (components.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 components per batch request",
        requested: components.length,
        maxAllowed: 5,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validComponents = [
      "title",
      "concept",
      "explanation",
      "keyConcepts",
      "coreExample",
      "practice",
      "learningActions",
      "mindmap",
      "quiz",
      "examples",
    ];

    const invalidComponents = components.filter(
      (comp) => !validComponents.includes(comp)
    );
    if (invalidComponents.length > 0) {
      return res.status(400).json({
        message: "Invalid components requested",
        invalidComponents,
        validComponents,
      });
    }

    // Get existing cache
    const existingCache = await getCachedContent(
      userId,
      topic,
      subtopic,
      user.learningStyle
    );

    let cacheContent = existingCache?.content || {};
    const results = {};
    const errors = [];

    // Process each component
    for (const component of components) {
      try {
        // Check if already in cache and not needing regeneration
        if (cacheContent[component] && !req.body.regenerate) {
          results[component] = {
            status: "cached",
            data: cleanComponentData(cacheContent[component], component),
          };
          continue;
        }

        // Generate new component
        const promptResult = generateSpecificPrompts(
          user,
          topic,
          subtopic,
          component
        );

        if (!promptResult.success) {
          errors.push(`${component}: ${promptResult.errors?.join(", ")}`);
          results[component] = {
            status: "error",
            error: "Prompt generation failed",
          };
          continue;
        }

        const componentPrompt = promptResult.prompts[component];

        if (componentPrompt.error) {
          errors.push(`${component}: ${componentPrompt.error}`);
          results[component] = {
            status: "error",
            error: componentPrompt.error,
          };
          continue;
        }

        const aiResponse = await callAIAPI(componentPrompt.prompt);
        const componentContent = extractComponentFromAIResponse(
          aiResponse,
          component
        );

        // Update cache content
        cacheContent[component] = componentContent;

        results[component] = {
          status: "generated",
          data: componentContent,
        };
      } catch (error) {
        console.error(`❌ Error processing ${component}:`, error.message);
        errors.push(`${component}: ${error.message}`);
        results[component] = {
          status: "error",
          error: error.message,
        };
      }
    }

    // Update cache if any components were generated
    const generatedComponents = Object.values(results).filter(
      (r) => r.status === "generated"
    );
    if (generatedComponents.length > 0) {
      const newCacheEntry = await saveToCache({
        userId: userId.toString(),
        topic,
        subtopic,
        user,
        content: cacheContent,
        aiPrompt: `Batch generation for: ${components.join(", ")}`,
        crypto,
      });

      console.log(
        `✅ Batch generated ${generatedComponents.length} components, cache v${newCacheEntry.version}`
      );
    }

    // Build response
    const response = {
      message: `Batch generation completed for "${subtopic}"`,
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      componentsRequested: components,
      results,
      errors: errors.length > 0 ? errors : undefined,
      generatedCount: generatedComponents.length,
      cachedCount: Object.values(results).filter((r) => r.status === "cached")
        .length,
      errorCount: errors.length,
    };

    if (existingCache) {
      response.version = existingCache.version;
      response.cacheUpdated = generatedComponents.length > 0;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in batchGenerateComponentsController:", error);
    res.status(500).json({
      message: "Failed to batch generate components",
      error: error.message,
    });
  }
};

/**
 * Regenerate a single component
 */
exports.regenerateComponentController = async (req, res) => {
  try {
    const { topic, subtopic, component } = req.body;
    if (!topic || !subtopic || !component) {
      return res.status(400).json({
        message: "Topic, subtopic, and component are required.",
      });
    }
    req.body.regenerate = true;
    return exports.generateComponentController(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CRITICAL FUNCTION: Extract component content from AI response
 */
function extractComponentFromAIResponse(aiResponse, component) {
  const rawResponse = aiResponse.trim();

  // Remove code blocks
  let cleanResponse = rawResponse
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "");

  // Check if response is JSON
  const trimmed = cleanResponse.trim();

  // Try to parse as JSON
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      const parsed = JSON.parse(trimmed);

      // If AI returned {"explanation": "text..."}, extract just the text
      if (parsed[component]) {
        return parsed[component];
      }

      // Try other common field names
      if (parsed.content) {
        return parsed.content;
      }

      // For quiz questions
      if (parsed.questions && component === "quiz") {
        return parsed.questions;
      }

      // For key concepts
      if (parsed.keyConcepts && component === "keyConcepts") {
        return parsed.keyConcepts;
      }

      // For learning actions
      if (parsed.learningActions && component === "learningActions") {
        return parsed.learningActions;
      }

      // For examples
      if (parsed.examples && component === "examples") {
        return parsed.examples;
      }

      // For mindmap
      if (parsed.mindmap && component === "mindmap") {
        return parsed.mindmap;
      }

      // If it's an array, return it
      if (Array.isArray(parsed)) {
        return parsed;
      }

      // Try to find any text content
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "string" && value.length > 10) {
          return value;
        }
        if (Array.isArray(value)) {
          return value;
        }
      }

      // If nothing else works, stringify the object
      return JSON.stringify(parsed);
    } catch (error) {
      // If JSON parsing fails, treat as plain text
      console.log(
        `⚠️ JSON parse failed for ${component}, treating as text:`,
        error.message
      );
      return cleanResponse;
    }
  }

  // If not JSON, check if it contains stringified JSON
  if (
    cleanResponse.includes(`\\"${component}\\"`) ||
    cleanResponse.includes(`"${component}"`)
  ) {
    try {
      // Try to extract JSON-like structure
      const jsonMatch = cleanResponse.match(
        new RegExp(`"${component}"\\s*:\\s*"([^"]+)"`)
      );
      if (jsonMatch && jsonMatch[1]) {
        return jsonMatch[1].replace(/\\"/g, '"');
      }

      // Try for array content
      const arrayMatch = cleanResponse.match(
        new RegExp(`"${component}"\\s*:\\s*\\[([^\\]]+)\\]`)
      );
      if (arrayMatch && arrayMatch[1]) {
        try {
          return JSON.parse(`[${arrayMatch[1]}]`);
        } catch {
          return arrayMatch[1]
            .split(",")
            .map((item) => item.trim().replace(/['"]/g, ""));
        }
      }
    } catch (error) {
      // Continue with original text
    }
  }

  // For mindmap, ensure proper format
  if (component === "mindmap" && !cleanResponse.startsWith("graph")) {
    return generateFallbackMindmap(component);
  }

  // Return as-is
  return cleanResponse;
}

/**
 * Clean component data from cache (in case it's stored incorrectly)
 */
function cleanComponentData(cachedData, component) {
  if (!cachedData) return null;

  // If it's already a string or array, return as-is
  if (typeof cachedData === "string" || Array.isArray(cachedData)) {
    return cachedData;
  }

  // If it's an object, try to extract the component
  if (typeof cachedData === "object") {
    if (cachedData[component]) {
      return cachedData[component];
    }
    if (cachedData.content) {
      return cachedData.content;
    }

    // Try to extract any text or array
    for (const [key, value] of Object.entries(cachedData)) {
      if (typeof value === "string" && value.length > 10) {
        return value;
      }
      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  // Fallback: stringify
  return typeof cachedData === "object"
    ? JSON.stringify(cachedData)
    : cachedData;
}

/**
 * Calculate text similarity (simple version)
 */
function calculateTextSimilarity(text1, text2) {
  if (text1 === text2) return 1.0;

  const longer = text1.length > text2.length ? text1 : text2;
  const shorter = text1.length > text2.length ? text2 : text1;

  if (longer.length === 0) return 1.0;

  // Simple character similarity
  let matches = 0;
  const maxCheck = Math.min(shorter.length, 200); // Check first 200 chars

  for (let i = 0; i < maxCheck; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }

  return matches / maxCheck;
}
