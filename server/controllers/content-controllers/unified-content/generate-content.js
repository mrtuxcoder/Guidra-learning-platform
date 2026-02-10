const User = require("../../../models/User");
const ContentCache = require("../../../models/Content-cache");
const callAIAPI = require("../../../utils/call-AI");
const generateUnifiedPrompt = require("../../../utils/prompt/unified-prompt-generator");
const buildContentFromAI = require('../../../utils/content/response/buildContentFromAI')
const crypto = require("crypto");
const validateContentStructure = require("../../../utils/content/validation/validate-content-structure");
const saveToCache = require("../../../utils/cache/save-cache");
const getCachedContent = require('../../../utils/cache/get-cache');
const handleRegenerateContent = require('./handle-regeneration')

/**
 * 🧠 Personalized Teaching for a Subtopic WITH CACHING - UPDATED
 */
exports.teachSubtopicController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, regenerate = false } = req.body;

    if (!topic || !subtopic)
      return res
        .status(400)
        .json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (regenerate) {
      return await handleRegenerateContent(userId, user, topic, subtopic, res);
    }

    // Check cache first using utility
    const cachedContent = await getCachedContent(
      userId,
      topic,
      subtopic,
      user.learningStyle
    );

    if (cachedContent) {
      console.log("📂 Loading from cache - Checking mindmap...");

      // Enhanced validation - specifically check for mindmap
      if (!cachedContent.content || typeof cachedContent.content !== "object") {
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

    // Generate and process content with new system
    const aiPrompt = generateUnifiedPrompt(user, topic, subtopic);
    console.log("📝 Generated prompt:", aiPrompt.substring(0, 200) + "...");

    const aiResponse = await callAIAPI(aiPrompt);
    console.log("🤖 AI response length:", aiResponse.length);
    
    // Process using new unified function
    const structuredContent = await  buildContentFromAI(aiResponse, topic, subtopic, user);

    // Enhanced validation - PRESERVES AI CONTENT
    const validatedContent = validateContentStructure(
      structuredContent,
      topic,
      subtopic
    );

    // Save to cache with FULL content
    const newCacheEntry = await saveToCache({
      userId: String(userId),
      topic,
      subtopic,
      user,
      content: validatedContent,
      aiPrompt,
      crypto,
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
    res
      .status(500)
      .json({ message: "Failed to generate personalized teaching content" });
  }
};