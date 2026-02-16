const User = require("../models/User");

exports.updateLearningPreferences = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const { reasonForLearning, tonePreference } = req.body || {};
    const updates = {};

    if (reasonForLearning !== undefined) {
      updates.reasonForLearning = reasonForLearning;
    }

    if (tonePreference !== undefined) {
      updates.tonePreference = tonePreference;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No updates provided",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Preferences updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error("error in updateLearningPreferences:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
