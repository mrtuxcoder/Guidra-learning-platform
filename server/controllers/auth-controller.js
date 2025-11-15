const User = require('../models/User');
const { signJwt } = require('../configs/jwt');
const passport = require('../configs/passport');

const setTokenCookie = (res, user) => {
  const token = signJwt({ id: user._id, email: user.email, name: user.name });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'none',
     path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  console.log('✅ [SET TOKEN COOKIE] Cookie set for user:', user.email);
  return token;
};

exports.registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password });
    setTokenCookie(res, user);

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: 'Registration successful',
      user: userObj,
    });
  } catch (err) {
    console.error('error in registerController:', err);

    if (err.code === 11000)
      return res.status(409).json({ error: 'Duplicate email detected' });

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Validation error', details: messages });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.logoutController = async (req, res) => {
  try {
    console.log("logging out")
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('error in logoutController:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.profileController = async (req, res) => {
  try {
    const userId = (req.user && (req.user.id || req.user._id)) ? (req.user.id || req.user._id) : null;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });

    const userData = await User.findById(userId).select('-password');
    if (!userData) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({ user: userData });
  } catch (err) {
    console.error('error in profileController:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔐 [BACKEND LOGIN] Request received for email:", email);
    
    if (!email || !password) {
      console.log("❌ [BACKEND LOGIN] Missing email or password");
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ [BACKEND LOGIN] User not found for email:", email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ [BACKEND LOGIN] Password mismatch for user:", user._id);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    setTokenCookie(res, user);

    const userObj = user.toObject();
    delete userObj.password;

    console.log("✅ [BACKEND LOGIN] Login successful for user:", user.email);

    res.status(200).json({
      message: 'Login successful',
      user: userObj
    });

  } catch (err) {
    console.error('❌ [BACKEND LOGIN] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.googleAuthController = (req, res, next) => {
  console.log('🔐 [GOOGLE AUTH] Initiating OAuth...');
  console.log('🔐 [GOOGLE AUTH] Callback URL:', process.env.GOOGLE_CALLBACK_URL);
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

exports.googleCallbackController = (req, res, next) => {
  console.log('🔐 [GOOGLE CALLBACK] Received callback');
  
  passport.authenticate('google', { 
    session: false
  }, (err, user, info) => {
    try {
      if (err) {
        console.error('❌ [GOOGLE CALLBACK] Auth error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
      }
      
      if (!user) {
        console.error('❌ [GOOGLE CALLBACK] No user returned');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
      }

      console.log('✅ [GOOGLE CALLBACK] User authenticated:', user.email);
      setTokenCookie(res, user);
      console.log('✅ [GOOGLE CALLBACK] Token set in cookie for user:', user._id);
      
      res.redirect(`${process.env.CLIENT_URL}/personalize`);

    } catch (error) {
      console.error('❌ [GOOGLE CALLBACK] Error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
  })(req, res, next);
};

exports.googleSuccessController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    setTokenCookie(res, req.user);
    
    const userObj = req.user.toObject();
    delete userObj.password;
    
    res.status(200).json({
      message: 'Google authentication successful',
      user: userObj
    });
  } catch (error) {
    console.error('❌ [GOOGLE SUCCESS] Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

exports.checkUserExists = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('-password');
    
    if (user) {
      const hasPassword = !!user.password && !user.password.startsWith('google-oauth-');
      
      return res.status(200).json({ 
        exists: true,
        user: user,
        hasPassword: hasPassword
      });
    }

    return res.status(200).json({ 
      exists: false 
    });

  } catch (error) {
    console.error('❌ [USER CHECK] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};