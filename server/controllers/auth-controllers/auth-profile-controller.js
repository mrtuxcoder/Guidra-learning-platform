const User = require("../../models/User");
const {
  ensureDailyRegenWindow,
} = require("../../utils/daily-regen");

// ===== PROFILE & UTILITY CONTROLLERS =====

/**
 * Get user profile with auth info (unified endpoint)
 * Returns both user data and password/auth status to avoid multiple API calls
 */
exports.profileController = async (req, res) => {
  try {
    const userId =
      req.user && (req.user.id || req.user._id)
        ? req.user.id || req.user._id
        : null;
    if (!userId) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    ensureDailyRegenWindow(userData);
    if (
      userData.isModified("regenDailyCount") ||
      userData.isModified("regenDailyResetAt")
    ) {
      await userData.save({ validateBeforeSave: false });
    }

    // Include password/auth status info to avoid separate API calls
    const authInfo = {
      hasPassword: userData.hasPassword?.() || false,
      authProvider: userData.authProvider,
      needsPasswordSetup: userData.needsPasswordSetup?.() || false,
    };

    return res.status(200).json({ 
      user: userData,
      authInfo: authInfo
    });
  } catch (err) {
    console.error("error in profileController:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Check if user exists (for Google OAuth flow)
 */
exports.checkUserExists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );

    if (user) {
      const hasPassword =
        !!user.password && !user.password.startsWith("google-oauth-");

      return res.status(200).json({
        exists: true,
        user: user,
        hasPassword: hasPassword,
      });
    }

    return res.status(200).json({
      exists: false,
    });
  } catch (error) {
    console.error("❌ [USER CHECK] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
