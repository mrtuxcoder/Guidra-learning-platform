const ContentCache = require("../../models/Content-cache");


async function saveToCache({
  userId,
  topic,
  subtopic,
  user,
  content,
  aiPrompt,
  crypto,
}) {
  // Deactivate previous versions
  await ContentCache.updateMany(
    {
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
      isActive: true,
    },
    { isActive: false }
  );

  // Get next version
  const latestVersion = await ContentCache.findOne({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
    learningStyle: user.learningStyle,
  }).sort({ version: -1 });

  const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

  // Save the ENTIRE content structure as-is
  const cacheEntry = await ContentCache.create({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
    learningStyle: user.learningStyle,
    learningMotivation: user.reasonForLearning,
    difficultyLevel: user.difficultyPreference || "beginner",
    contentFormat: "comprehensive",
    content: content,
    aiModelUsed: "gemini-huggingface-fallback",
    aiPromptHash: crypto.createHash("md5").update(aiPrompt).digest("hex"),
    version: nextVersion,
    isActive: true,
    timesAccessed: 0,
    lastAccessed: new Date(),
  });

  return cacheEntry;
}

module.exports = saveToCache
