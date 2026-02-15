
const User = require("../../../models/User");
const ContentCache = require("../../../models/Content-cache");
const callAIAPI = require("../../../utils/call-AI");
const generateUnifiedPrompt = require("../../../utils/prompt/unified-prompt-generator");
const buildContentFromAI = require('../../../utils/content/response/buildContentFromAI');
const crypto = require("crypto");
const validateContentStructure = require("../../../utils/content/validation/validate-content-structure");
const { saveToCache, saveComponentToCache } = require("../../../utils/cache/save-cache");

exports.generateContentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic)
      return res
        .status(400)
        .json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate prompt for content generation
    const prompt = await generateUnifiedPrompt({
      userId,
      topic,
      subtopic,
      isRegeneration: false,
    });

    // Call AI API with generation prompt
    const aiResponse = await callAIAPI(prompt);

    // Build content from AI response
    const contentData = buildContentFromAI(aiResponse);

    // Validate content structure
    const validationErrors = validateContentStructure(contentData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: "Invalid content structure", details: validationErrors });
    }

    // Save generated content to cache
    await saveToCache({
      userId,
      topic,
      subtopic,
      content: contentData,
    });

    res.json({ message: "Content generated and saved to cache successfully" });
  } catch (error) {
    console.error("Error in generateContentController:", error);
    res.status(500).json({ message: "Failed to generate content" });
  }
};    



  exports.getVersionContentController = async (req, res) => {
    try {
      const userId = req.user._id;
      const { topic, subtopic, versionNumber } = req.body;
  
      if (!topic || !subtopic || !versionNumber) {
        return res.status(400).json({ message: "Topic, subtopic, and version number are required." });
      }
  
      const cacheDoc = await ContentCache.findOne({
        userId,
        topic: topic.toLowerCase(),
        subtopic: subtopic.toLowerCase(),
        isActive: true,
      });
  
      if (!cacheDoc) {
        return res.status(404).json({ message: "No cached content found for the specified topic and subtopic." });
      }
  
      const versionEntry = cacheDoc.content.versions.find(v => v.version === versionNumber);
  
      if (!versionEntry) {
        return res.status(404).json({ message: "Specified version not found in cache." });
      }
  
      res.json({ content: versionEntry.data });
    } catch (error) {
      console.error("Error in getVersionContentController:", error);
      res.status(500).json({ message: "Failed to retrieve content version" });
    }
  };

