const User = require('../models/User');
const { signJwt } = require('../configs/jwt');
const passport = require('../configs/passport');

/**
 * Set token cookie in response - FOR BACKEND DOMAIN ONLY
 * This cookie is set on render.com domain, not accessible by frontend
 */
const setTokenCookie = (res, user) => {
  const token = signJwt({ id: user._id, email: user.email, name: user.name });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // true for HTTPS
    sameSite: 'none', // Required for cross-origin
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  console.log('✅ [SET TOKEN COOKIE] Cookie set for user:', user.email);
  return token;
};

// ===== GOOGLE OAUTH CONTROLLERS =====

/**
 * Initiate Google OAuth flow
 */
exports.googleAuthController = (req, res, next) => {
  console.log('🔐 [GOOGLE AUTH] Initiating OAuth...');
  console.log('🔐 [GOOGLE AUTH] Callback URL:', process.env.GOOGLE_CALLBACK_URL);
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

/**
 * Google OAuth callback handler
 * NOTE: This sets cookie on BACKEND domain (render.com) which frontend can't access
 * Frontend needs to handle token separately via googleSuccessController
 */
/**
 * Google OAuth callback handler
 * Redirects new users to /personalize, existing users to /profile
 */
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
      
//       // Generate token
//       const token = signJwt({ id: user._id, email: user.email, name: user.name });
      
//       // Set backend cookie (render.com domain)
//       setTokenCookie(res, user);
//       console.log('✅ [GOOGLE CALLBACK] Token set in backend cookie for user:', user._id);
      
//       // Check if user needs to complete profile
//       const needsPersonalization = !user.learningStyle || 
//                                   user.learningStyle === 'visual' || 
//                                   !user.progress || 
//                                   user.progress.length === 0;
      
//       const redirectPath = needsPersonalization ? '/personalize' : '/profile';
//       console.log(`🔄 [GOOGLE CALLBACK] Redirecting user to: ${redirectPath}`);
      
//       // Redirect with token in URL for frontend to store as authToken
//       res.redirect(`${process.env.CLIENT_URL}${redirectPath}?token=${token}&source=google`);

//     } catch (error) {
//       console.error('❌ [GOOGLE CALLBACK] Error:', error);
//       res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
//     }
//   })(req, res, next);
// };


/**
 * Get Google OAuth token for frontend after successful authentication
 * Frontend calls this after being redirected to /personalize
 */
exports.googleSuccessController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = signJwt({ id: req.user._id, email: req.user.email, name: req.user.name });
    
    const userObj = req.user.toObject();
    delete userObj.password;
    
    res.status(200).json({
      message: 'Google authentication successful',
      user: userObj,
      token: token // Send token to frontend to store in frontend cookie
    });
  } catch (error) {
    console.error('❌ [GOOGLE SUCCESS] Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// ===== AUTH CONTROLLERS =====

/**
 * User registration
 */
exports.registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = signJwt({ id: user._id, email: user.email, name: user.name });

    // Set backend cookie
    setTokenCookie(res, user);
    
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: 'Registration successful',
      user: userObj,
      token: token // Send token to frontend
    });
  } catch (err) {
    console.error('error in registerController:', err);

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

/**
 * User login
 */
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

    const token = signJwt({ id: user._id, email: user.email, name: user.name });
    
    // Set backend cookie
    setTokenCookie(res, user);
    
    const userObj = user.toObject();
    delete userObj.password;

    console.log("✅ [BACKEND LOGIN] Login successful for user:", user.email);

    res.status(200).json({
      message: 'Login successful',
      user: userObj,
      token: token // Send token to frontend
    });

  } catch (err) {
    console.error('❌ [BACKEND LOGIN] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * User logout
 */
exports.logoutController = async (req, res) => {
  try {
    console.log("🚀 [BACKEND] Fast logout initiated");
    
    // Clear backend cookie immediately
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    });
    
    // Send immediate response - don't wait for anything
    return res.status(200).json({ 
      message: 'Logout successful',
      clearFrontendCookie: true
    });
  } catch (err) {
    console.error('error in logoutController:', err);
    // Even on error, send success response to ensure frontend clears cookies
    return res.status(200).json({ 
      message: 'Logout completed',
      clearFrontendCookie: true
    });
  }
};

// ===== PROFILE & UTILITY CONTROLLERS =====

/**
 * Get user profile
 */
exports.profileController = async (req, res) => {
  try {
    const userId = (req.user && (req.user.id || req.user._id)) ? (req.user.id || req.user._id) : null;
    if (!userId) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const userData = await User.findById(userId).select('-password');
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user: userData });
  } catch (err) {
    console.error('error in profileController:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Check if user exists (for Google OAuth flow)
 */
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


exports.googleCallbackController = (req, res, next) => {
  console.log('🔐 [GOOGLE CALLBACK] Received callback');
  
  // Add headers to handle COOP issues
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  passport.authenticate('google', { 
    session: false
  }, (err, user, info) => {
    try {
      if (err) {
        console.error('❌ [GOOGLE CALLBACK] Auth error:', err);
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Authentication Failed</title>
            </head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage(
                    { 
                      type: 'OAUTH_ERROR', 
                      error: 'Authentication failed' 
                    },
                    "${process.env.CLIENT_URL}"
                  );
                }
                setTimeout(() => window.close(), 2000);
              </script>
              <p>Authentication failed. Closing window...</p>
            </body>
          </html>
        `);
      }
      
      if (!user) {
        console.error('❌ [GOOGLE CALLBACK] No user returned');
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Authentication Failed</title>
            </head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage(
                    { 
                      type: 'OAUTH_ERROR', 
                      error: 'No user found' 
                    },
                    "${process.env.CLIENT_URL}"
                  );
                }
                setTimeout(() => window.close(), 2000);
              </script>
              <p>No user found. Closing window...</p>
            </body>
          </html>
        `);
      }

      console.log('✅ [GOOGLE CALLBACK] User authenticated:', user.email);
      
      // Generate token
      const token = signJwt({ id: user._id, email: user.email, name: user.name });
      
      // Set backend cookie
      setTokenCookie(res, user);
      console.log('✅ [GOOGLE CALLBACK] Token set in backend cookie for user:', user._id);
      
      // Check if user needs to complete profile
      const needsPersonalization = !user.learningStyle || 
                                  user.learningStyle === 'visual' || 
                                  !user.progress || 
                                  user.progress.length === 0;
      
      const redirectPath = needsPersonalization ? '/personalize' : '/profile';
      
      // Send HTML that communicates token to frontend via postMessage
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Success</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0; 
                background: #f5f5f5; 
              }
              .loading { 
                text-align: center; 
                padding: 20px; 
                background: white; 
                border-radius: 8px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
              }
            </style>
          </head>
          <body>
            <div class="loading">
              <h3>✅ Authentication Successful</h3>
              <p>You will be redirected shortly...</p>
            </div>
            <script>
              (function() {
                const token = "${token}";
                const frontendOrigin = "${process.env.CLIENT_URL}";
                const needsPersonalization = ${needsPersonalization};
                const redirectPath = "${redirectPath}";
                
                console.log('🔑 [OAUTH POPUP] Token length:', token.length);
                console.log('🎯 [OAUTH POPUP] Target origin:', frontendOrigin);
                
                let messageSent = false;
                let attempts = 0;
                const maxAttempts = 10;
                
                function sendMessage() {
                  attempts++;
                  console.log('📤 [OAUTH POPUP] Attempt', attempts, 'to send message');
                  
                  if (window.opener && !window.opener.closed) {
                    try {
                      window.opener.postMessage(
                        { 
                          type: 'OAUTH_SUCCESS', 
                          token: token,
                          needsPersonalization: needsPersonalization,
                          redirectPath: redirectPath
                        },
                        frontendOrigin
                      );
                      messageSent = true;
                      console.log('✅ [OAUTH POPUP] Message sent successfully on attempt', attempts);
                      
                      // Wait longer before closing to ensure frontend processes it
                      setTimeout(() => {
                        console.log('🔒 [OAUTH POPUP] Closing popup after successful message');
                        window.close();
                      }, 1500);
                      
                    } catch (error) {
                      console.error('❌ [OAUTH POPUP] Error sending message:', error);
                      if (attempts < maxAttempts) {
                        setTimeout(sendMessage, 300);
                      } else {
                        useFallback();
                      }
                    }
                  } else {
                    console.error('❌ [OAUTH POPUP] No opener or opener closed');
                    if (attempts < maxAttempts) {
                      setTimeout(sendMessage, 300);
                    } else {
                      useFallback();
                    }
                  }
                }
                
                function useFallback() {
                  console.log('🔄 [OAUTH POPUP] Using URL fallback');
                  window.location.href = frontendOrigin + redirectPath + '?token=' + encodeURIComponent(token) + '&source=google&fallback=true';
                }
                
                // Start sending messages immediately
                console.log('🚀 [OAUTH POPUP] Starting message delivery');
                sendMessage();
                
              })();
            </script>
          </body>
        </html>
      `);

    } catch (error) {
      console.error('❌ [GOOGLE CALLBACK] Error:', error);
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error</title>
          </head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage(
                  { 
                    type: 'OAUTH_ERROR', 
                    error: 'Server error occurred' 
                  },
                  "${process.env.CLIENT_URL}"
                );
              }
              setTimeout(() => window.close(), 2000);
            </script>
            <p>Server error occurred. Closing window...</p>
          </body>
        </html>
      `);
    }
  })(req, res, next);
};