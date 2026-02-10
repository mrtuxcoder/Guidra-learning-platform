const callAIAPI = require("../../../utils/call-AI");
const generateUnifiedPrompt = require("../../../utils/prompt/unified-prompt-generator");
const buildContentFromAI = require('../../../utils/content/response/buildContentFromAI')
const crypto = require("crypto");
const validateContentStructure = require("../../../utils/content/validation/validate-content-structure");
const saveToCache = require("../../../utils/cache/save-cache");






const handleRegenerateContent = async (userId, user, topic, subtopic, res) => {
  try {
    const aiPrompt = generateUnifiedPrompt(user, topic, subtopic);
    console.log("📝 New Unified Prompt length:", aiPrompt.length);
    console.log("📝 First 200 chars:", aiPrompt.substring(0, 200));

    const aiResponse = await callAIAPI(aiPrompt);
    console.log("🤖 AI response length:", aiResponse.length);
    console.log(aiResponse);
    
    // Process using new unified function
    const structuredContent = await  buildContentFromAI(aiResponse, topic, subtopic, user);
    console.log(structuredContent)
    // Enhanced validation - PRESERVES AI CONTENT
    const validatedContent = validateContentStructure(
      structuredContent,
      topic,
      subtopic
    );
    console.log(validatedContent)
    // Save to cache
    const newCacheEntry = await saveToCache({
      userId,
      topic,
      subtopic,
      user,
      content: validatedContent,
      aiPrompt,
      crypto,
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


module.exports = handleRegenerateContent