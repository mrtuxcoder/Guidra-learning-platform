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
  Divider,
} from "@mui/material";
import {
  PersonAddOutlined,
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
  School,
  Google,
} from "@mui/icons-material";
import { registerUser, googleAuth } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log("🚀 [REGISTER] Sending registration request...");
      const { data } = await registerUser(formData);
      console.log("✅ [REGISTER] Registration successful:", data);
      setError("");
      
      // Use window.location.href for hard redirect like in Login
      console.log("🎯 [REGISTER] Redirecting to /personalize");
      window.location.href = "/personalize";
      
    } catch (err) {
      console.error("❌ [REGISTER] Registration failed:", err);
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setError("");
    
    console.log("🔐 [FRONTEND] Initiating Google OAuth for registration...");
    
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
      
      // Clean up URL
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

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
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <School sx={{ fontSize: 40, mr: 2, color: "white" }} />
            <Typography variant="h4" fontWeight="700" color="white">
              Guidra
            </Typography>
          </Box>
          
          <Typography 
            variant="h3" 
            fontWeight="700" 
            color="white"
            gutterBottom
            sx={{ 
              mb: 2,
              lineHeight: 1.2
            }}
          >
            Join Guidra
          </Typography>

          <Typography 
            variant="h6" 
            color="white"
            sx={{ 
              mb: 3, 
              opacity: 0.9,
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Start your step-by-step learning path, guided by AI.
          </Typography>
        </Box>

        {/* Registration Form */}
        <Paper
          sx={{
            padding: 4,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
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
              <PersonAddOutlined />
            </Avatar>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign up to start learning
            </Typography>
          </Box>

          {/* Google Sign Up Button */}
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
            {googleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}
          </Button>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or continue with email
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
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

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                "Create Account"
              )}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link 
                  component="button" 
                  type="button" 
                  onClick={handleLoginClick}
                  sx={{ fontWeight: 600 }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Stats */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 4 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight="700" color="white" gutterBottom>
              50+
            </Typography>
            <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
              Courses
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight="700" color="white" gutterBottom>
              95%
            </Typography>
            <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
              Success Rate
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}