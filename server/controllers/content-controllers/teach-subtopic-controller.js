const User = require("../../models/User");
const ContentCache = require("../../models/Content-cache");
const callAIAPI = require("../../utils/call-AI");
const { buildPrompt } = require("../../utils/build-prompt");
const crypto = require('crypto');
const {
  createStructuredContentFromText,
  extractKeyConceptsFromText,
  extractExampleFromText,
  generatePracticeFromTopic,
  generateFallbackMindmap
} = require("../../utils/content-utils");
const {
  validateContentStructure
} = require("../../utils/validation-utils");
const {
  validateAndFixMermaidSyntax,
  validateMermaidSyntax,
  isFallbackMindmap
} = require("../../utils/mermaid-utils");
const {
  saveToCache,
  getCachedContent
} = require("../../utils/cache-utils");

/**
 * 🧠 Personalized Teaching for a Subtopic WITH CACHING - CONTENT PRESERVED
 */
exports.teachSubtopicController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, regenerate = false } = req.body;

    if (!topic || !subtopic)
      return res.status(400).json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (regenerate) {
      return await handleRegenerateContent(userId, user, topic, subtopic, res);
    }

    // Check cache first using utility
    const cachedContent = await getCachedContent(userId, topic, subtopic, user.learningStyle);

    if (cachedContent) {
      console.log("📂 Loading from cache - Checking mindmap...");
      
      // Enhanced validation - specifically check for mindmap
      if (!cachedContent.content || typeof cachedContent.content !== 'object') {
        console.error("❌ Invalid cache content structure, regenerating...");
        await ContentCache.deleteOne({ _id: cachedContent._id });
      } else if (!cachedContent.content.mindmap) {
        console.error("❌ Cache missing mindmap, regenerating...");
        await ContentCache.deleteOne({ _id: cachedContent._id });
      } else {
        cachedContent.timesAccessed += 1;
        cachedContent.lastAccessed = new Date();
        await cachedContent.save();

        return res.status(200).json({
          message: `Cached teaching content for "${subtopic}"`,
          topic,
          subtopic,
          learningStyle: user.learningStyle,
          cached: true,
          version: cachedContent.version,
          data: cachedContent.content,
        });
      }
    }

    // Generate new content
    const aiPrompt = buildPrompt(user, {
      topic,
      subtopic,
      taskType: "teachSubtopic",
    });


    const aiResponse = await callAIAPI(aiPrompt);

    let structuredContent;
    try {
      let jsonString = aiResponse.trim();
      jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      try {
        structuredContent = JSON.parse(jsonString);
      } catch (directError) {
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in response");
        }
      }
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      structuredContent = createStructuredContentFromText(aiResponse, topic, subtopic);
    }

    // Enhanced validation - PRESERVES AI CONTENT
    const validatedContent = validateContentStructure(structuredContent, topic, subtopic);

    // Save to cache with FULL content
    const newCacheEntry = await saveToCache({
      userId,
      topic,
      subtopic,
      user,
      content: validatedContent,
      aiPrompt,
      crypto
    });

    res.status(200).json({
      message: `Personalized teaching content generated for "${subtopic}"`,
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      cached: false,
      version: newCacheEntry.version,
      data: validatedContent,
    });
  } catch (error) {
    console.error("Error in teachSubtopicController:", error);
    res.status(500).json({ message: "Failed to generate personalized teaching content" });
  }
};

/**
 * Regenerate Content Controller
 */
exports.regenerateContentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic)
      return res.status(400).json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await handleRegenerateContent(userId, user, topic, subtopic, res);
  } catch (error) {
    console.error("Error in regenerateContentController:", error);
    res.status(500).json({ message: "Failed to regenerate content" });
  }
};

const handleRegenerateContent = async (userId, user, topic, subtopic, res) => {
  try {
    const aiPrompt = buildPrompt(user, {
      topic,
      subtopic,
      taskType: "teachSubtopic",
    });

    const aiResponse = await callAIAPI(aiPrompt);

    let structuredContent;
    try {
      let jsonString = aiResponse.trim();
      jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      try {
        structuredContent = JSON.parse(jsonString);
      } catch (directError) {
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in response");
        }
      }
    } catch (parseError) {
      structuredContent = createStructuredContentFromText(aiResponse, topic, subtopic);
    }

    // Enhanced validation - PRESERVES AI CONTENT
    const validatedContent = validateContentStructure(structuredContent, topic, subtopic);

    const newCacheEntry = await saveToCache({
      userId,
      topic,
      subtopic,
      user,
      content: validatedContent,
      aiPrompt,
      crypto
    });

    res.status(200).json({
      message: `Content regenerated successfully for "${subtopic}"`,
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      cached: false,
      version: newCacheEntry.version,
      data: validatedContent,
    });
  } catch (error) {
    console.error("Error in handleRegenerateContent:", error);
    res.status(500).json({ message: "Failed to regenerate content" });
  }
};