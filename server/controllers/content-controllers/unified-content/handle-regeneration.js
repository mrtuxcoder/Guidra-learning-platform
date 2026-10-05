
const callAIAPI = require("../../../utils/call-AI");
const generateUnifiedPrompt = require("../../../utils/prompt/unified-prompt-generator");
const buildContentFromAI = require('../../../utils/content/response/buildContentFromAI');
const validateContentStructure = require("../../../utils/content/validation/validate-content-structure");
const { saveToCache, saveComponentToCache } = require("../../../utils/cache/save-cache");

async function handleRegeneration(
  userId,
  user,
  topic,
  subtopic,
  res,
  componentName,
  options = {}
) {
  try {
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

    if (subtopicProgress.generationCount >= 3) {
      return res.status(429).json({
        message: "Generation limit reached for this subtopic (max 3)",
        topic,
        subtopic,
        limit: 3,
      });
    }

    // Generate prompt for regeneration
    const prompt = generateUnifiedPrompt(user, topic, subtopic);

    // Call AI API with regeneration prompt
    const aiResponse = await callAIAPI(prompt);

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

    // Save regenerated content to cache
    if (componentName) {
      const componentContent =
        validatedContent[componentName] ?? validatedContent;
      await saveComponentToCache({
        userId,
        topic,
        subtopic,
        componentName,
        componentContent,
      });

      subtopicProgress.generationCount += 1;
      console.log(
        `✅ [FULL REGEN COUNT] ${topic} / ${subtopic} -> ${subtopicProgress.generationCount}`
      );
      subtopicProgress.lastReviewed = new Date();
      if (topicProgress) {
        topicProgress.lastAccessed = new Date();
      }
      user.regenDailyCount = Number(user.regenDailyCount || 0) + 1;
      await user.save();

      const dailyLimit = options.dailyLimit || 6;
      const dailyRemaining = Math.max(
        0,
        dailyLimit - Number(user.regenDailyCount || 0)
      );

      return res.status(200).json({
        message: `${componentName} regenerated for "${subtopic}"`,
        topic,
        subtopic,
        component: componentName,
        cached: false,
        dailyLimit,
        dailyRemaining,
        dailyResetAt: user.regenDailyResetAt,
        [componentName]: componentContent,
      });
    }

    const { versionEntry } = await saveToCache({
      userId,
      topic,
      subtopic,
      content: validatedContent,
    });

    subtopicProgress.generationCount += 1;
    console.log(
      `✅ [FULL REGEN COUNT] ${topic} / ${subtopic} -> ${subtopicProgress.generationCount}`
    );
    subtopicProgress.lastReviewed = new Date();
    if (topicProgress) {
      topicProgress.lastAccessed = new Date();
    }
    user.regenDailyCount = Number(user.regenDailyCount || 0) + 1;
    await user.save();

    const dailyLimit = options.dailyLimit || 6;
    const dailyRemaining = Math.max(
      0,
      dailyLimit - Number(user.regenDailyCount || 0)
    );

    return res.status(200).json({
      message: `Regenerated teaching content for "${subtopic}"`,
      topic,
      subtopic,
      cached: false,
      version: versionEntry.versionNumber,
      dailyLimit,
      dailyRemaining,
      dailyResetAt: user.regenDailyResetAt,
      data: validatedContent,
    });
  } catch (error) {
    console.error("Error during content regeneration:", error);
    return res
      .status(error.statusCode || 500)
      .json({
        error:
          error.statusCode === 503
            ? "AI services are temporarily unavailable. Please try again shortly."
            : "An error occurred during content regeneration",
      });
  }
}

module.exports = handleRegeneration;  