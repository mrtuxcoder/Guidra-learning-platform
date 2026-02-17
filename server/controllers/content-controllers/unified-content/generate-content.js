
const User = require("../../../models/User");
const ContentCache = require("../../../models/Content-cache");
const callAIAPI = require("../../../utils/call-AI");
const generateUnifiedPrompt = require("../../../utils/prompt/unified-prompt-generator");
const buildContentFromAI = require('../../../utils/content/response/buildContentFromAI');
const crypto = require("crypto");
const validateContentStructure = require("../../../utils/content/validation/validate-content-structure");
const { saveToCache, saveComponentToCache } = require("../../../utils/cache/save-cache");
const {
  DAILY_REGEN_LIMIT,
  ensureDailyRegenWindow,
  getDailyRegenRemaining,
} = require("../../../utils/daily-regen");



exports.generateContentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({ message: "Topic and subtopic are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const topicProgress = user.progress?.find(
      (progress) => progress.topic?.toLowerCase() === topic.toLowerCase()
    );

    const subtopicProgress = topicProgress?.subTopics?.find(
      (sub) => sub.name?.toLowerCase() === subtopic.toLowerCase()
    );

    if (!subtopicProgress) {
      return res.status(404).json({
        message: `Subtopic "${subtopic}" not found in topic "${topic}"`,
      });
    }

    // Check cache first
    const cacheDoc = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
    });

    if (cacheDoc?.content?.latestVersion) {
      const versionEntry = cacheDoc.content.versions.find(
        (v) => v.version === cacheDoc.content.latestVersion && v.contentType === "full"
      );

      if (versionEntry) {
        cacheDoc.timesAccessed += 1;
        cacheDoc.lastAccessed = new Date();
        await cacheDoc.save();

        console.log(
          `📦 [CONTENT] Cache hit for ${topic} / ${subtopic} (v${versionEntry.version})`
        );

        return res.status(200).json({
          message: `Cached teaching content for "${subtopic}"`,
          topic,
          subtopic,
          cached: true,
          version: versionEntry.version,
          data: versionEntry.data,
        });
      }
    }

    if (subtopicProgress.generationCount >= 3) {
      return res.status(429).json({
        message: "Generation limit reached for this subtopic (max 3)",
        topic,
        subtopic,
        limit: 3,
      });
    }

    // Check daily regeneration limit for new content generation
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

    // Generate prompt for content generation
    const prompt = generateUnifiedPrompt(user, topic, subtopic);

    // Call AI API with generation prompt
    const aiResponse = await callAIAPI(prompt);

    console.log(`🤖 [CONTENT] Generated from AI for ${topic} / ${subtopic}`);

    // Count this generation (first generation included)
    subtopicProgress.generationCount += 1;
    subtopicProgress.lastReviewed = new Date();
    if (topicProgress) {
      topicProgress.lastAccessed = new Date();
    }
    
    // Increment daily regeneration count
    user.regenDailyCount = Number(user.regenDailyCount || 0) + 1;
    await user.save();
    
    const newDailyRemaining = getDailyRegenRemaining(user);

    // Build content from AI response
    const contentData = await buildContentFromAI(
      aiResponse,
      topic,
      subtopic,
      user
    );

    // Validate and normalize content structure
    const validatedContent = validateContentStructure(
      contentData,
      topic,
      subtopic
    );

    // Save generated content to cache
    const { versionEntry } = await saveToCache({
      userId,
      topic,
      subtopic,
      content: validatedContent,
    });

    return res.status(200).json({
      message: `Cached teaching content for "${subtopic}"`,
      topic,
      subtopic,
      cached: false,
      version: versionEntry.versionNumber,
      data: validatedContent,
      dailyLimit: DAILY_REGEN_LIMIT,
      dailyRemaining: newDailyRemaining,
      dailyResetAt: user.regenDailyResetAt,
    });
  } catch (error) {
    console.error("Error in generateContentController:", error);
    res.status(500).json({ message: "Failed to generate content" });
  }
}

  exports.getVersionContentController = async (req, res) => {
    try {
      const userId = req.user._id;
      const { topic, subtopic, versionNumber } = req.body;
      const parsedVersion = Number(versionNumber);
  
      if (!topic || !subtopic || !Number.isFinite(parsedVersion)) {
        return res.status(400).json({
          message: "Topic, subtopic, and a valid version number are required.",
        });
      }
  
      const cacheDoc = await ContentCache.findOne({
        userId,
        topic: topic.toLowerCase(),
        subtopic: subtopic.toLowerCase(),
      });
  
      if (!cacheDoc) {
        return res.status(404).json({ message: "No cached content found for the specified topic and subtopic." });
      }
  
      const versionEntry = cacheDoc.content.versions.find(
        (v) => v.version === parsedVersion && v.contentType === "full"
      );
  
      if (!versionEntry) {
        return res.status(404).json({ message: "Specified version not found in cache." });
      }
  
      res.json({
        message: `Retrieved version ${parsedVersion} for "${subtopic}"`,
        topic,
        subtopic,
        version: parsedVersion,
        data: versionEntry.data,
      });
    } catch (error) {
      console.error("Error in getVersionContentController:", error);
      res.status(500).json({ message: "Failed to retrieve content version" });
    }
  };

