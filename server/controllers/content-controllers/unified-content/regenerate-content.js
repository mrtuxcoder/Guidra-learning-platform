const User = require("../../../models/User");
const handleRegenerateContent = require('./handle-regeneration')
const {
  DAILY_REGEN_LIMIT,
  ensureDailyRegenWindow,
  getDailyRegenRemaining,
} = require("../../../utils/daily-regen");


exports.regenerateContentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, componentName } = req.body;

    if (!topic || !subtopic)
      return res
        .status(400)
        .json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

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

    await handleRegenerateContent(
      userId,
      user,
      topic,
      subtopic,
      res,
      componentName,
      {
        dailyLimit: DAILY_REGEN_LIMIT,
      }
    );
  } catch (error) {
    console.error("Error in regenerateContentController:", error);
    res.status(500).json({ message: "Failed to regenerate content" });
  }
};
