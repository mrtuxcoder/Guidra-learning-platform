const passport = require("../../configs/passport");
const { setTokenCookie } = require("./set-token-cookie");

const getFrontendOrigin = () =>
  (
    process.env.CLIENT_URL ||
    process.env.CLIENT_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  )
    .trim()
    .replace(/\/$/, "");

// ===== GOOGLE OAUTH CONTROLLERS =====

/**
 * Initiate Google OAuth flow
 */
exports.googleAuthController = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

exports.googleCallbackController = (req, res, next) => {
  passport.authenticate(
    "google",
    {
      session: false,
    },
    (err, user) => {
      const frontendOrigin = getFrontendOrigin();

      if (err || !user) {
        console.error("[GOOGLE CALLBACK] Authentication failed", err);
        return res.redirect(`${frontendOrigin}/login?error=auth_failed`);
      }

      setTokenCookie(res, user);

      const redirectPath =
        !user.learningStyle ||
        user.learningStyle === "visual" ||
        !user.progress ||
        user.progress.length === 0
          ? "/explore"
          : "/learn";

      return res.redirect(`${frontendOrigin}${redirectPath}`);
    }
  )(req, res, next);
};
