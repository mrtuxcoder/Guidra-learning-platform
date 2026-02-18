const { setTokenCookie, getTokenCookieOptions } = require("./set-token-cookie");
const User = require("../../models/User");
const { signJwt } = require("../../configs/jwt");

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 [BACKEND LOGIN] Request received for email:", email);

    if (!email || !password) {
      console.log("❌ [BACKEND LOGIN] Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ [BACKEND LOGIN] User not found for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is a Google OAuth user without password
    if (user.authProvider === "google" && !user.password) {
      console.log(
        "❌ [BACKEND LOGIN] Google OAuth user trying email/password login:",
        user._id
      );
      return res.status(401).json({
        error:
          "This account uses Google login. Please sign in with Google or set a password first.",
        authProvider: "google",
        needsPasswordSetup: true,
      });
    }

    // Check if user is a Google OAuth user WITH password (converted user)
    if (user.authProvider === "google" && user.password) {
      console.log(
        "⚠️ [BACKEND LOGIN] Google OAuth user with password:",
        user._id
      );
      // Allow login with password (they set it up)
    }

    // Check if user has no password at all (shouldn't happen for local users)
    if (!user.password) {
      console.log("❌ [BACKEND LOGIN] User has no password:", user._id);
      return res.status(401).json({
        error: "Account setup incomplete. Please contact support.",
        authProvider: user.authProvider,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ [BACKEND LOGIN] Password mismatch for user:", user._id);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signJwt({
      id: user._id,
      email: user.email,
      name: user.name,
      authProvider: user.authProvider,
    });

    // Set backend cookie
    setTokenCookie(res, user);

    const userObj = user.toObject();
    delete userObj.password;

    console.log("✅ [BACKEND LOGIN] Login successful for user:", user.email);

    res.status(200).json({
      message: "Login successful",
      user: userObj,
      token: token,
      authProvider: user.authProvider,
    });
  } catch (err) {
    console.error("❌ [BACKEND LOGIN] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: "Email already registered",
        // Add helpful info about auth provider
        existingAuthProvider: existing.authProvider,
      });
    }

    // Create user with authProvider explicitly set to 'local'
    const user = await User.create({
      name,
      email,
      password,
      authProvider: "local", // This ensures proper validation
    });

    const token = signJwt({
      id: user._id,
      email: user.email,
      name: user.name,
      authProvider: user.authProvider, // Include in token
    });

    // Set backend cookie
    setTokenCookie(res, user);

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "Registration successful",
      user: userObj,
      token: token,
      authProvider: user.authProvider, // Send to frontend
    });
  } catch (err) {
    console.error("error in registerController:", err);

    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate email detected" });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);

      // Check for password validation errors specifically
      const passwordError = err.errors.password;
      if (passwordError) {
        return res.status(400).json({
          error: "Password validation failed",
          details: passwordError.message,
        });
      }

      return res
        .status(400)
        .json({ error: "Validation error", details: messages });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * User logout
 */
exports.logoutController = async (req, res) => {
  try {
    console.log("🚀 [BACKEND] Fast logout initiated");

    // Clear backend cookie immediately
    res.clearCookie("token", getTokenCookieOptions());

    // Send immediate response - don't wait for anything
    return res.status(200).json({
      message: "Logout successful",
      clearFrontendCookie: true,
    });
  } catch (err) {
    console.error("error in logoutController:", err);
    // Even on error, send success response to ensure frontend clears cookies
    return res.status(200).json({
      message: "Logout completed",
      clearFrontendCookie: true,
    });
  }
};
