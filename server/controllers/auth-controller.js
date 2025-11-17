// const User = require('../models/User');
// const { signJwt } = require('../configs/jwt');
// const passport = require('../configs/passport');

// const setTokenCookie = (res, user) => {
//   const token = signJwt({ id: user._id, email: user.email, name: user.name });
// res.cookie('token', token, {
//   httpOnly: true,
//   secure: true, // true for HTTPS
//   sameSite: 'none', // Required for cross-origin (different Render domains)
//   path: '/',
//   maxAge: 7 * 24 * 60 * 60 * 1000
// });

//   console.log('✅ [SET TOKEN COOKIE] Cookie set for user:', user.email);
//   return token;
// };

// exports.registerController = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ error: 'Name, email and password are required' });

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(409).json({ error: 'Email already registered' });

//     const user = await User.create({ name, email, password });
//     setTokenCookie(res, user);

//     const userObj = user.toObject();
//     delete userObj.password;

//     return res.status(201).json({
//       message: 'Registration successful',
//       user: userObj,
//     });
//   } catch (err) {
//     console.error('error in registerController:', err);

//     if (err.code === 11000)
//       return res.status(409).json({ error: 'Duplicate email detected' });

//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map((e) => e.message);
//       return res.status(400).json({ error: 'Validation error', details: messages });
//     }

//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.logoutController = async (req, res) => {
//   try {
//     console.log("logging out");
    
//     res.clearCookie('token', {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//       path: '/'
//     });
    
//     return res.status(200).json({ message: 'Logout successful' });
//   } catch (err) {
//     console.error('error in logoutController:', err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.profileController = async (req, res) => {
//   try {
//     const userId = (req.user && (req.user.id || req.user._id)) ? (req.user.id || req.user._id) : null;
//     if (!userId) return res.status(401).json({ error: 'Not authorized' });

//     const userData = await User.findById(userId).select('-password');
//     if (!userData) return res.status(404).json({ error: 'User not found' });

//     return res.status(200).json({ user: userData });
//   } catch (err) {
//     console.error('error in profileController:', err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     console.log("🔐 [BACKEND LOGIN] Request received for email:", email);
    
//     if (!email || !password) {
//       console.log("❌ [BACKEND LOGIN] Missing email or password");
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("❌ [BACKEND LOGIN] User not found for email:", email);
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       console.log("❌ [BACKEND LOGIN] Password mismatch for user:", user._id);
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     setTokenCookie(res, user);

//     const userObj = user.toObject();
//     delete userObj.password;

//     console.log("✅ [BACKEND LOGIN] Login successful for user:", user.email);

//     res.status(200).json({
//       message: 'Login successful',
//       user: userObj
//     });

//   } catch (err) {
//     console.error('❌ [BACKEND LOGIN] Error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.googleAuthController = (req, res, next) => {
//   console.log('🔐 [GOOGLE AUTH] Initiating OAuth...');
//   console.log('🔐 [GOOGLE AUTH] Callback URL:', process.env.GOOGLE_CALLBACK_URL);
  
//   passport.authenticate('google', {
//     scope: ['profile', 'email']
//   })(req, res, next);
// };

// exports.googleCallbackController = (req, res, next) => {
//   console.log('🔐 [GOOGLE CALLBACK] Received callback');
  
//   passport.authenticate('google', { 
//     session: false
//   }, (err, user, info) => {
//     try {
//       if (err) {
//         console.error('❌ [GOOGLE CALLBACK] Auth error:', err);
//         return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
//       }
      
//       if (!user) {
//         console.error('❌ [GOOGLE CALLBACK] No user returned');
//         return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
//       }

//       console.log('✅ [GOOGLE CALLBACK] User authenticated:', user.email);
//       setTokenCookie(res, user);
//       console.log('✅ [GOOGLE CALLBACK] Token set in cookie for user:', user._id);
      
//       res.redirect(`${process.env.CLIENT_URL}/personalize`);

//     } catch (error) {
//       console.error('❌ [GOOGLE CALLBACK] Error:', error);
//       res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
//     }
//   })(req, res, next);
// };

// exports.googleSuccessController = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Not authenticated' });
//     }

//     setTokenCookie(res, req.user);
    
//     const userObj = req.user.toObject();
//     delete userObj.password;
    
//     res.status(200).json({
//       message: 'Google authentication successful',
//       user: userObj
//     });
//   } catch (error) {
//     console.error('❌ [GOOGLE SUCCESS] Error:', error);
//     res.status(500).json({ error: 'Authentication failed' });
//   }
// };

// exports.checkUserExists = async (req, res) => {
//   try {
//     const { email } = req.query;
    
//     if (!email) {
//       return res.status(400).json({ error: 'Email is required' });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() }).select('-password');
    
//     if (user) {
//       const hasPassword = !!user.password && !user.password.startsWith('google-oauth-');
      
//       return res.status(200).json({ 
//         exists: true,
//         user: user,
//         hasPassword: hasPassword
//       });
//     }

//     return res.status(200).json({ 
//       exists: false 
//     });

//   } catch (error) {
//     console.error('❌ [USER CHECK] Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


const User = require('../models/User');
const { signJwt } = require('../configs/jwt');
const passport = require('../configs/passport');

const setTokenCookie = (res, user) => {
  const token = signJwt({ id: user._id, email: user.email, name: user.name });
  
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

  console.log('🍪 [SET TOKEN COOKIE] Setting cookie for:', user.email);
  console.log('🔧 [COOKIE OPTIONS]', { secure: true, sameSite: 'none', httpOnly: true });

  res.cookie('token', token, cookieOptions);
  console.log('✅ [SET TOKEN COOKIE] Cookie set successfully');

  return token;
};

// Essential debugging middleware
const debugCookies = (req, res, next) => {
  console.log('🔍 [REQUEST]', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    cookies: req.headers.cookie ? 'Present' : 'Missing'
  });
  next();
};

exports.registerController = async (req, res) => {
  try {
    console.log('👤 [REGISTER] Attempting registration for:', req.body.email);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('❌ [REGISTER] Missing required fields');
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('❌ [REGISTER] Email already exists');
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    setTokenCookie(res, user);

    const userObj = user.toObject();
    delete userObj.password;

    console.log('✅ [REGISTER] Registration successful');

    return res.status(201).json({
      message: 'Registration successful',
      user: userObj,
    });
  } catch (err) {
    console.error('❌ [REGISTER] Error:', err.message);

    if (err.code === 11000) {
      return res.status(409).json({ error: 'Duplicate email detected' });
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Validation error', details: messages });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.logoutController = async (req, res) => {
  try {
    console.log('🚪 [LOGOUT] Clearing authentication cookie');

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    };

    res.clearCookie('token', cookieOptions);
    console.log('✅ [LOGOUT] Cookie cleared');

    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('❌ [LOGOUT] Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.profileController = async (req, res) => {
  try {
    console.log('👤 [PROFILE] Fetching user profile');

    const userId = (req.user && (req.user.id || req.user._id)) ? (req.user.id || req.user._id) : null;
    
    if (!userId) {
      console.log('❌ [PROFILE] No user ID in request');
      return res.status(401).json({ error: 'Not authorized' });
    }

    const userData = await User.findById(userId).select('-password');
    if (!userData) {
      console.log('❌ [PROFILE] User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ [PROFILE] Profile data retrieved');

    return res.status(200).json({ user: userData });
  } catch (err) {
    console.error('❌ [PROFILE] Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 [LOGIN] Attempting login for:', email);
    
    if (!email || !password) {
      console.log('❌ [LOGIN] Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ [LOGIN] User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ [LOGIN] Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    setTokenCookie(res, user);

    const userObj = user.toObject();
    delete userObj.password;

    console.log('✅ [LOGIN] Login successful');

    res.status(200).json({
      message: 'Login successful',
      user: userObj
    });

  } catch (err) {
    console.error('❌ [LOGIN] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.googleAuthController = (req, res, next) => {
  console.log('🔐 [GOOGLE AUTH] Initiating OAuth flow');
  console.log('🔄 [GOOGLE AUTH] Callback URL:', process.env.GOOGLE_CALLBACK_URL);
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

exports.googleCallbackController = (req, res, next) => {
  console.log('🔐 [GOOGLE CALLBACK] Received OAuth callback');
  
  passport.authenticate('google', { 
    session: false
  }, (err, user, info) => {
    try {
      if (err) {
        console.error('❌ [GOOGLE CALLBACK] Auth error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
      }
      
      if (!user) {
        console.error('❌ [GOOGLE CALLBACK] No user returned from OAuth');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
      }

      console.log('✅ [GOOGLE CALLBACK] User authenticated:', user.email);
      setTokenCookie(res, user);
      
      console.log('🔄 [GOOGLE CALLBACK] Redirecting to personalize page');
      res.redirect(`${process.env.CLIENT_URL}/personalize`);

    } catch (error) {
      console.error('❌ [GOOGLE CALLBACK] Error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
  })(req, res, next);
};

exports.googleSuccessController = async (req, res) => {
  try {
    console.log('🔐 [GOOGLE SUCCESS] Processing OAuth success');

    if (!req.user) {
      console.log('❌ [GOOGLE SUCCESS] No authenticated user');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    setTokenCookie(res, req.user);
    
    const userObj = req.user.toObject();
    delete userObj.password;
    
    console.log('✅ [GOOGLE SUCCESS] OAuth flow completed');

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
    
    console.log('🔍 [USER CHECK] Checking existence for:', email);

    if (!email) {
      console.log('❌ [USER CHECK] No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('-password');
    
    if (user) {
      const hasPassword = !!user.password && !user.password.startsWith('google-oauth-');
      console.log('✅ [USER CHECK] User exists, hasPassword:', hasPassword);

      return res.status(200).json({ 
        exists: true,
        user: user,
        hasPassword: hasPassword
      });
    }

    console.log('❌ [USER CHECK] User does not exist');

    return res.status(200).json({ 
      exists: false 
    });

  } catch (error) {
    console.error('❌ [USER CHECK] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the debug middleware
exports.debugCookies = debugCookies;