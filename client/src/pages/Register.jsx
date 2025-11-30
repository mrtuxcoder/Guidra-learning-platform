import React, { useState, useEffect } from "react";
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
  useTheme,
  useMediaQuery,
  Fade,
  Stack,
  Chip,
  Grid
} from "@mui/material";
import {
  Person,
  LockOutlined,
  Visibility,
  VisibilityOff,
  Email,
  Google,
  Psychology,
  AutoAwesome,
  FormatListBulleted,
  Lightbulb,
  CheckCircle,
  PersonAddOutlined
} from "@mui/icons-material";
import { registerUser, startGoogleOAuth } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";

// --- Configuration ---

const purplePalette = {
  50: '#FAF7FE', 100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE',
  400: '#C084FC', 500: '#A855F7', 600: '#9333EA', 700: '#7C3AED',
  800: '#6B21A8', 900: '#581C87'
};

const features = [
  { icon: <AutoAwesome fontSize="small" />, label: "Start With the Basics", desc: "Learn fundamentals across 30+ subjects." },
  { icon: <FormatListBulleted fontSize="small" />, label: "Consistent Lesson Format", desc: "Concept → Explanation → Example → Practice → Quiz." },
  { icon: <CheckCircle fontSize="small" />, label: "Your Learning Workspace", desc: "Track your topics, retries, and understanding levels." },
  { icon: <Lightbulb fontSize="small" />, label: "AI-Generated Content", desc: "Reliable, cached outputs with zero hallucination drift." },
];

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // --- Logic & Handlers ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      await registerUser(formData);
      setError("");
      window.location.href = "/personalize";
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError("");
    startGoogleOAuth();
  };

  // OAuth Error Handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      let msg = 'Authentication failed.';
      if (error === 'auth_failed') msg = 'Google authentication failed.';
      if (error === 'no_user') msg = 'Unable to retrieve user info.';
      
      setError(msg);
      window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    }
  }, []);

  // --- Sub-Components (Matching Login Page) ---

  // 1. Mobile Header
  const MobileHeader = () => (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${purplePalette[600]} 0%, ${purplePalette[900]} 100%)`,
        pt: 6,
        pb: 8,
        px: 3,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
        <Avatar sx={{ bgcolor: 'white', color: purplePalette[700], width: 40, height: 40 }}>
          <Psychology />
        </Avatar>
        <Typography variant="h4" fontWeight="800">Guidra</Typography>
      </Box>
      <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 300, mx: 'auto' }}>
        Create your free account to start learning today.
      </Typography>

    </Box>
  );

  // 2. Desktop Sidebar
  const DesktopSidebar = () => (
    <Box
      sx={{
        flex: 1,
        background: `linear-gradient(135deg, ${purplePalette[600]} 0%, ${purplePalette[900]} 100%)`,
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Shapes */}
      <Box sx={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar sx={{ bgcolor: 'white', color: purplePalette[700], width: 56, height: 56, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <Psychology fontSize="large" />
          </Avatar>
          <Typography variant="h3" fontWeight="900">Guidra</Typography>
        </Box>

        
        <Typography variant="h6" sx={{ mb: 6, opacity: 0.85, fontWeight: 400 }}>
        Start learning with clean, structured AI lessons tailored for beginners.
        </Typography>

    {/* Desktop Feature Grid */}
<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
  {features.map((feat, index) => (
    <Box 
      key={index}
      sx={{ 
        p: 2, 
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        minHeight: '140px', // Minimum height
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)', 
          bgcolor: 'rgba(255,255,255,0.15)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box 
        sx={{ 
          color: 'white', 
          mb: 2,
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          flexShrink: 0 // Prevent icon from affecting height
        }}
      >
        {feat.icon}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="700" 
          sx={{ 
            color: 'white', 
            fontSize: '1rem',
            mb: 1,
            lineHeight: 1.2
          }}
        >
          {feat.label}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            opacity: 0.9, 
            lineHeight: 1.4, 
            color: 'rgba(255,255,255,0.9)',
            fontSize: '0.8rem'
          }}
        >
          {feat.desc}
        </Typography>
      </Box>
    </Box>
  ))}
</Box>
      </Box>
    </Box>
  );

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: purplePalette[50], overflowX: 'hidden' }}>
        
        {isMobile && <MobileHeader />}

        <Container 
          maxWidth="xl" 
          sx={{ 
            px: { xs: 2, sm: 3 },
            mt: isMobile ? -5 : 0, 
            pt: isMobile ? 0 : { md: 0 },
            pb: 4,
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: isMobile ? 'auto' : '100vh'
          }}
        >
          <Paper
            elevation={isMobile ? 10 : 24}
            sx={{
              borderRadius: { xs: 3, md: 4 },
              display: 'flex',
              overflow: 'hidden',
              width: '100%',
              maxWidth: 1100,
              minHeight: { md: 650 },
              bgcolor: 'white',
              boxShadow: isMobile 
                ? '0 10px 40px rgba(0,0,0,0.1)' 
                : `0 25px 80px rgba(0,0,0,0.2)`
            }}
          >
            {/* Desktop Sidebar */}
            {!isMobile && <DesktopSidebar />}

            {/* Right Side (Form) */}
            <Box
              sx={{
                flex: { xs: 'none', md: 1 },
                width: { xs: '100%', md: '50%' },
                p: { xs: 3, sm: 5, md: 8 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {isMobile && (
                <Typography variant="h5" fontWeight="700" textAlign="center" sx={{ mb: 0.5, color: purplePalette[800] }}>
                  Get Started
                </Typography>
              )}
              
              <Box sx={{ textAlign: isMobile ? "center" : "left", mb: 4 }}>
                 {!isMobile && (
                   <Typography variant="h4" fontWeight="800" sx={{ color: purplePalette[800], mb: 1 }}>
                     Create Account
                   </Typography>
                 )}
                <Typography variant="body1" color="text.secondary">
                  Join Guidra and start your journey.
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={googleLoading ? <CircularProgress size={20} /> : <Google />}
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  borderColor: purplePalette[200],
                  color: 'text.primary',
                  bgcolor: googleLoading ? purplePalette[50] : 'white',
                  '&:hover': { borderColor: purplePalette[500], bgcolor: purplePalette[50] }
                }}
              >
                {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'grey.200' }} />
                <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>OR EMAIL</Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'grey.200' }} />
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><Person sx={{ color: purplePalette[400] }} /></InputAdornment>)
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><Email sx={{ color: purplePalette[400] }} /></InputAdornment>)
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><LockOutlined sx={{ color: purplePalette[400] }} /></InputAdornment>),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><LockOutlined sx={{ color: purplePalette[400] }} /></InputAdornment>),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || googleLoading}
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: `linear-gradient(90deg, ${purplePalette[600]} 0%, ${purplePalette[800]} 100%)`,
                    boxShadow: `0 8px 20px ${alpha(purplePalette[600], 0.3)}`,
                    textTransform: 'none',
                    '&:hover': {
                       background: `linear-gradient(90deg, ${purplePalette[700]} 0%, ${purplePalette[900]} 100%)`,
                       boxShadow: `0 10px 25px ${alpha(purplePalette[600], 0.4)}`,
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Create Account"}
                </Button>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => navigate('/login')}
                      sx={{ fontWeight: 700, color: purplePalette[700], textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
}