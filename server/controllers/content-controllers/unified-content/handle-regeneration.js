
const callAIAPI = require("../../../utils/call-AI");
const generateUnifiedPrompt = require("../../../utils/prompt/unified-prompt-generator");
const buildContentFromAI = require('../../../utils/content/response/buildContentFromAI');
const crypto = require("crypto");
const validateContentStructure = require("../../../utils/content/validation/validate-content-structure");
const { saveToCache, saveComponentToCache } = require("../../../utils/cache/save-cache");

async function handleRegeneration(req, res) {
  try {
    const { userId, topic, subtopic, componentName } = req.body;

    // Generate prompt for regeneration
    const prompt = await generateUnifiedPrompt({
      userId,
      topic,
      subtopic,
      componentName,
      isRegeneration: true,
    });

    // Call AI API with regeneration prompt
    const aiResponse = await callAIAPI(prompt);

    // Build content from AI response
    const contentData = buildContentFromAI(aiResponse);

    // Validate content structure
    const validationErrors = validateContentStructure(contentData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: "Invalid content structure", details: validationErrors });
    }

    // Save regenerated content to cache
    if (componentName) {
      await saveComponentToCache({
        userId,
        topic,
        subtopic,
        componentName,
        componentContent: contentData,
      });
    } else {
      await saveToCache({
        userId,
        topic,
        subtopic,
        content: contentData,
      });
    }

    res.json({ message: "Content regenerated and saved to cache successfully" });
  } catch (error) {
    console.error("Error during content regeneration:", error);
    res.status(500).json({ error: "An error occurred during content regeneration" });
  }
}

module.exports = handleRegeneration;  