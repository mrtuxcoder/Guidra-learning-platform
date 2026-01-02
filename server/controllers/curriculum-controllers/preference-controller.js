const User = require("../../models/User");

// Update user's learning preferences (style and motivation)
exports.updateLearningPreferencesController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { learningStyle, reasonForLearning } = req.body;

    if (!learningStyle && !reasonForLearning) {
      return res.status(400).json({ message: "At least one field required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update provided fields
    if (learningStyle) user.learningStyle = learningStyle;
    if (reasonForLearning) user.reasonForLearning = reasonForLearning;

    await user.save();

    res.status(200).json({
      message: "Learning preferences updated successfully",
      data: {
        learningStyle: user.learningStyle,
        reasonForLearning: user.reasonForLearning,
      },
    });
  } catch (error) {
    console.error("Error in updateLearningPreferencesController:", error);
    res.status(500).json({ message: "Failed to update learning preferences" });
  }
};

