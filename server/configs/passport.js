const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔐 [GOOGLE OAUTH] Profile received:", profile.id);
        console.log("📧 [GOOGLE OAUTH] Email:", profile.emails[0].value);

        const email = profile.emails[0].value.toLowerCase();
        let user = await User.findOne({ email });

        if (user) {
          console.log("🔐 [GOOGLE OAUTH] Existing user found:", user._id);
          console.log(
            "🔐 [GOOGLE OAUTH] Current auth provider:",
            user.authProvider
          );

          // CASE 1: User is already Google OAuth user - allow login
          if (user.authProvider === "google") {
            console.log("✅ [GOOGLE OAUTH] Google user logging in");
            return done(null, user);
          }

          // CASE 2: User is local user (email/password) - handle carefully
          if (user.authProvider === "local") {
            console.log("⚠️ [GOOGLE OAUTH] Local user trying Google login");

            // OPTION A: Allow login but keep local auth (recommended)
            // Don't change authProvider, just allow login
            console.log(
              "✅ [GOOGLE OAUTH] Allowing login for existing local user"
            );
            return done(null, user);
          }

          // CASE 3: No authProvider set (legacy users)
          if (!user.authProvider) {
            user.authProvider = "google";
            await user.save({ validateBeforeSave: false });
            console.log("🔄 [GOOGLE OAUTH] Set authProvider for legacy user");
            return done(null, user);
          }

          return done(null, user);
        }

        // CASE 4: New user - create Google OAuth user WITHOUT password
        console.log("🆕 [GOOGLE OAUTH] Creating new Google OAuth user");
        user = await User.create({
          name: profile.displayName,
          email: email,
          authProvider: "google",
          // NO PASSWORD FIELD - schema allows null for Google users
        });

        console.log(
          "✅ [GOOGLE OAUTH] New Google OAuth user created:",
          user._id
        );
        return done(null, user);
      } catch (error) {
        console.error("❌ [GOOGLE OAUTH] Error:", error);

        // Handle specific errors
        if (error.name === "ValidationError") {
          console.error("❌ [GOOGLE OAUTH] Validation error:", error.errors);
        }

        return done(error, null);
      }
    }
  )
);

module.exports = passport;
