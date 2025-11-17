import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Link,
  Grid,
  Divider,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Email,
  School,
  RocketLaunch,
  Google,
} from "@mui/icons-material";
import { loginUser, googleAuth } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { hasAuthCookie } from "../utils/auth"; // Use sync check instead of async

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // FIXED: Only check for existing auth cookie, don't make API calls
  useEffect(() => {
    const checkInitialAuth = () => {
      // Only redirect if we have an auth cookie AND we're not coming from an OAuth flow
      const urlParams = new URLSearchParams(window.location.search);
      const hasOAuthError = urlParams.get('error');
      
      if (hasAuthCookie() && !hasOAuthError) {
        console.log('🔐 [LOGIN] Auth cookie found, redirecting to profile');
        navigate('/profile');
      } else {
        console.log('🔐 [LOGIN] No auth cookie or OAuth error, showing login form');
        setAuthChecked(true);
      }
    };

    checkInitialAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔐 [FRONTEND] Making login request...");
      const response = await loginUser({ email, password });
      console.log("✅ [FRONTEND] Login response:", response);
      
      setError("");
      
      // Use navigate instead of window.location to avoid race conditions
      console.log("🔐 [FRONTEND] Login successful, redirecting to profile...");
      navigate('/profile', { replace: true });
      
    } catch (err) {
      console.error("❌ [FRONTEND] Login error:", err);
      console.error("❌ [FRONTEND] Error details:", err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setError("");
    
    console.log("🔐 [FRONTEND] Initiating Google OAuth...");
    
    // Clear any existing errors from URL first
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    
    googleAuth();
    
    // Fallback in case the redirect doesn't happen
    setTimeout(() => {
      setGoogleLoading(false);
    }, 5000);
  };

  // Check if we're returning from OAuth with an error
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      setAuthChecked(true); // Make sure form is shown even with errors
      
      switch (error) {
        case 'auth_failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'no_user':
          setError('Unable to retrieve user information from Google.');
          break;
        case 'server_error':
          setError('Server error during authentication. Please try again.');
          break;
        case 'oauth_cancelled':
          setError('Google sign-in was cancelled. Please try again.');
          break;
        default:
          setError('Authentication failed. Please try again.');
      }
      
      // Clean up URL but keep the form visible
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // Show loading while checking initial auth
  if (!authChecked) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Left Side - Minimal Intro */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: "white", textAlign: { xs: "center", md: "left" } }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, mb: 3 }}>
                <School sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" fontWeight="700">
                  Guidra
                </Typography>
              </Box>
              
              <Typography 
                variant="h3" 
                fontWeight="700" 
                gutterBottom
                sx={{ 
                  mb: 2,
                  lineHeight: 1.2
                }}
              >
                Welcome Back
              </Typography>

              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  opacity: 0.9,
                  lineHeight: 1.6,
                  fontWeight: 400
                }}
              >
                Learn with structure. Practice with clarity. Grow with Guidra.
              </Typography>

              <Box sx={{ display: "flex", gap: 3, mt: 4, justifyContent: { xs: "center", md: "flex-start" } }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="700" gutterBottom>
                    50+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Courses
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="700" gutterBottom>
                    95%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Success Rate
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                padding: 4,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                maxWidth: 400,
                mx: "auto"
              }}
            >
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.main",
                    width: 60,
                    height: 60
                  }}
                >
                  <LockOutlined />
                </Avatar>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  Sign In
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter your credentials to continue
                </Typography>
              </Box>

              {/* Google Sign In Button */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={googleLoading ? <CircularProgress size={20} /> : <Google />}
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderColor: 'grey.400',
                  color: 'text.primary',
                  backgroundColor: googleLoading ? 'grey.50' : 'white',
                  '&:hover': {
                    borderColor: 'grey.600',
                    backgroundColor: 'grey.50'
                  }
                }}
              >
                {googleLoading ? 'Redirecting to Google...' : 'Sign in with Google'}
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or continue with email
                </Typography>
              </Divider>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || googleLoading}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <>
                      <RocketLaunch sx={{ mr: 1 }} />
                      Sign In
                    </>
                  )}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link 
                      component="button" 
                      type="button" 
                      onClick={handleRegisterClick}
                      sx={{ fontWeight: 600 }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}