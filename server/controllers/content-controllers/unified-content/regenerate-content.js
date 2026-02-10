const User = require("../../../models/User");
const crypto = require("crypto");
const handleRegenerateContent = require('./handle-regeneration')


exports.regenerateContentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic)
      return res
        .status(400)
        .json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await handleRegenerateContent(userId, user, topic, subtopic, res);
  } catch (error) {
    console.error("Error in regenerateContentController:", error);
    res.status(500).json({ message: "Failed to regenerate content" });
  }
};
