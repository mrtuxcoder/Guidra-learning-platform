
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔐 [GOOGLE OAUTH] Profile received:', profile.id);
    
    // Only check by email (no googleId field)
    let user = await User.findOne({ 
      email: profile.emails[0].value.toLowerCase()
    });
    
    if (user) {
      console.log('🔐 [GOOGLE OAUTH] Existing user found by email:', user._id);
      return done(null, user);
    }
    
    // Create new user with ONLY fields that exist in your schema
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value.toLowerCase(),
      password: 'google-oauth-' + Math.random().toString(36).slice(-8), // Required field
      // All other fields will use schema defaults automatically
    });
    
    console.log('🔐 [GOOGLE OAUTH] New user created:', user._id);
    return done(null, user);
    
  } catch (error) {
    console.error('❌ [GOOGLE OAUTH] Error:', error);
    return done(error, null);
  }
}));

module.exports = passport;