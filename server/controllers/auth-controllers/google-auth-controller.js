const { signJwt } = require("../../configs/jwt");
const passport = require("../../configs/passport");
const setTokenCookie = require("./set-token-cookie");

// ===== GOOGLE OAUTH CONTROLLERS =====

/**
 * Initiate Google OAuth flow
 */
exports.googleAuthController = (req, res, next) => {
  console.log("🔐 [GOOGLE AUTH] Initiating OAuth...");
  console.log(
    "🔐 [GOOGLE AUTH] Callback URL:",
    process.env.GOOGLE_CALLBACK_URL
  );

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

/**
 * Get Google OAuth token for frontend after successful authentication
 * Frontend calls this after being redirected to /explore
 */
exports.googleSuccessController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const token = signJwt({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    });

    const userObj = req.user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: "Google authentication successful",
      user: userObj,
      token: token, // Send token to frontend to store in frontend cookie
    });
  } catch (error) {
    console.error("❌ [GOOGLE SUCCESS] Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

exports.googleCallbackController = (req, res, next) => {
  console.log("🔐 [GOOGLE CALLBACK] Received callback");

  // Add headers to handle COOP issues
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");

  passport.authenticate(
    "google",
    {
      session: false,
    },
    (err, user, info) => {
      try {
        if (err) {
          console.error("❌ [GOOGLE CALLBACK] Auth error:", err);
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
          console.error("❌ [GOOGLE CALLBACK] No user returned");
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

        console.log("✅ [GOOGLE CALLBACK] User authenticated:", user.email);

        // Generate token
        const token = signJwt({
          id: user._id,
          email: user.email,
          name: user.name,
        });

        // Set backend cookie
        setTokenCookie(res, user);
        console.log(
          "✅ [GOOGLE CALLBACK] Token set in backend cookie for user:",
          user._id
        );

        // Check if user needs to complete profile
        const needsPersonalization =
          !user.learningStyle ||
          user.learningStyle === "visual" ||
          !user.progress ||
          user.progress.length === 0;

        const redirectPath = needsPersonalization ? "/explore" : "/profile";

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
        console.error("❌ [GOOGLE CALLBACK] Error:", error);
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
    }
  )(req, res, next);
};
