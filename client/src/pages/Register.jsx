// import { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Box,
//   Paper,
//   Avatar,
//   InputAdornment,
//   IconButton,
//   Alert,
//   CircularProgress,
//   Link,
//   Divider,
// } from "@mui/material";
// import {
//   PersonAddOutlined,
//   Visibility,
//   VisibilityOff,
//   Email,
//   Person,
//   Lock,
//   School,
//   Google,
// } from "@mui/icons-material";
// import { registerUser, googleAuth } from "../api/auth";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("🚀 [REGISTER] Sending registration request...");
//       const { data } = await registerUser(formData);
//       console.log("✅ [REGISTER] Registration successful:", data);
//       setError("");
      
//       // Use window.location.href for hard redirect like in Login
//       console.log("🎯 [REGISTER] Redirecting to /personalize");
//       window.location.href = "/personalize";
      
//     } catch (err) {
//       console.error("❌ [REGISTER] Registration failed:", err);
//       setError(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTogglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleToggleConfirmPassword = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleLoginClick = () => {
//     navigate('/login');
//   };

//   const handleGoogleSignIn = () => {
//     setGoogleLoading(true);
//     setError("");
    
//     console.log("🔐 [FRONTEND] Initiating Google OAuth for registration...");
    
//     // Clear any existing errors from URL first
//     const cleanUrl = window.location.origin + window.location.pathname;
//     window.history.replaceState({}, document.title, cleanUrl);
    
//     googleAuth();
    
//     // Fallback in case the redirect doesn't happen
//     setTimeout(() => {
//       setGoogleLoading(false);
//     }, 5000);
//   };

//   // Check if we're returning from OAuth with an error
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const error = urlParams.get('error');
    
//     if (error) {
//       switch (error) {
//         case 'auth_failed':
//           setError('Google authentication failed. Please try again.');
//           break;
//         case 'no_user':
//           setError('Unable to retrieve user information from Google.');
//           break;
//         case 'server_error':
//           setError('Server error during authentication. Please try again.');
//           break;
//         case 'oauth_cancelled':
//           setError('Google sign-in was cancelled. Please try again.');
//           break;
//         default:
//           setError('Authentication failed. Please try again.');
//       }
      
//       // Clean up URL
//       const cleanUrl = window.location.origin + window.location.pathname;
//       window.history.replaceState({}, document.title, cleanUrl);
//     }
//   }, []);

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         py: 4,
//       }}
//     >
//       <Container maxWidth="sm">
//         {/* Header */}
//         <Box sx={{ textAlign: "center", mb: 4 }}>
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
//             <School sx={{ fontSize: 40, mr: 2, color: "white" }} />
//             <Typography variant="h4" fontWeight="700" color="white">
//               Guidra
//             </Typography>
//           </Box>
          
//           <Typography 
//             variant="h3" 
//             fontWeight="700" 
//             color="white"
//             gutterBottom
//             sx={{ 
//               mb: 2,
//               lineHeight: 1.2
//             }}
//           >
//             Join Guidra
//           </Typography>

//           <Typography 
//             variant="h6" 
//             color="white"
//             sx={{ 
//               mb: 3, 
//               opacity: 0.9,
//               lineHeight: 1.6,
//               fontWeight: 400
//             }}
//           >
//             Start your step-by-step learning path, guided by AI.
//           </Typography>
//         </Box>

//         {/* Registration Form */}
//         <Paper
//           sx={{
//             padding: 4,
//             borderRadius: 3,
//             background: "rgba(255, 255, 255, 0.95)",
//             backdropFilter: "blur(10px)",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Box sx={{ textAlign: "center", mb: 3 }}>
//             <Avatar
//               sx={{
//                 mx: "auto",
//                 mb: 2,
//                 bgcolor: "primary.main",
//                 width: 60,
//                 height: 60
//               }}
//             >
//               <PersonAddOutlined />
//             </Avatar>
//             <Typography variant="h5" fontWeight="600" gutterBottom>
//               Create Account
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Sign up to start learning
//             </Typography>
//           </Box>

//           {/* Google Sign Up Button */}
//           <Button
//             fullWidth
//             variant="outlined"
//             startIcon={googleLoading ? <CircularProgress size={20} /> : <Google />}
//             onClick={handleGoogleSignIn}
//             disabled={googleLoading}
//             sx={{
//               mb: 3,
//               py: 1.5,
//               borderRadius: 2,
//               fontWeight: 600,
//               borderColor: 'grey.400',
//               color: 'text.primary',
//               backgroundColor: googleLoading ? 'grey.50' : 'white',
//               '&:hover': {
//                 borderColor: 'grey.600',
//                 backgroundColor: 'grey.50'
//               }
//             }}
//           >
//             {googleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}
//           </Button>

//           <Divider sx={{ mb: 3 }}>
//             <Typography variant="body2" color="text.secondary">
//               or continue with email
//             </Typography>
//           </Divider>

//           <Box component="form" onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Full Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Person color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 3 }}
//             />

//             <TextField
//               fullWidth
//               label="Email Address"
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Email color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 3 }}
//             />

//             <TextField
//               fullWidth
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Lock color="primary" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleTogglePassword} edge="end">
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 3 }}
//             />

//             <TextField
//               fullWidth
//               label="Confirm Password"
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Lock color="primary" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleToggleConfirmPassword} edge="end">
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 3 }}
//             />

//             {error && (
//               <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
//                 {error}
//               </Alert>
//             )}

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               size="large"
//               disabled={loading || googleLoading}
//               sx={{
//                 mb: 2,
//                 py: 1.5,
//                 borderRadius: 2,
//                 fontWeight: 600
//               }}
//             >
//               {loading ? (
//                 <CircularProgress size={24} />
//               ) : (
//                 "Create Account"
//               )}
//             </Button>

//             <Box sx={{ textAlign: "center" }}>
//               <Typography variant="body2" color="text.secondary">
//                 Already have an account?{" "}
//                 <Link 
//                   component="button" 
//                   type="button" 
//                   onClick={handleLoginClick}
//                   sx={{ fontWeight: 600 }}
//                 >
//                   Sign in
//                 </Link>
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>

//         {/* Stats */}
//         <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 4 }}>
//           <Box sx={{ textAlign: "center" }}>
//             <Typography variant="h4" fontWeight="700" color="white" gutterBottom>
//               50+
//             </Typography>
//             <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
//               Courses
//             </Typography>
//           </Box>
//           <Box sx={{ textAlign: "center" }}>
//             <Typography variant="h4" fontWeight="700" color="white" gutterBottom>
//               95%
//             </Typography>
//             <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
//               Success Rate
//             </Typography>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// }


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
  Grid,
  useTheme,
  useMediaQuery,
  Fade
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
  RocketLaunch,
  Psychology
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Purple color palette
  const purplePalette = {
    50: '#FAF7FE',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87'
  };

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
      const { data } = await registerUser(formData);
      setError("");
      window.location.href = "/personalize";
    } catch (err) {
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
    
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    
    googleAuth();
    
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
      
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${purplePalette[500]} 0%, ${purplePalette[700]} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2 }
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          <Grid 
            container 
            spacing={{ xs: 3, md: 4 }} 
            alignItems="center" 
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
          >
            {/* Left Side - Brand Intro */}
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  color: "white", 
                  textAlign: { xs: "center", md: "left" },
                  px: { xs: 2, sm: 3, md: 0 }
                }}
              >
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: { xs: "center", md: "flex-start" }, 
                    mb: { xs: 2, md: 3 },
                    gap: 2
                  }}
                >
                  <Box sx={{
                    width: { xs: 50, md: 60 },
                    height: { xs: 50, md: 60 },
                    borderRadius: { xs: 2, md: 2.5 },
                    background: `linear-gradient(135deg, ${purplePalette[400]} 0%, ${purplePalette[600]} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  }}>
                    <Psychology sx={{ fontSize: { xs: 24, md: 28 } }} />
                  </Box>
                  <Typography 
                    variant={isMobile ? "h4" : "h3"} 
                    fontWeight="800"
                    sx={{
                      background: `linear-gradient(135deg, #FFFFFF 0%, ${purplePalette[200]} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Guidra
                  </Typography>
                </Box>
                
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  fontWeight="700" 
                  gutterBottom
                  sx={{ 
                    mb: { xs: 2, md: 3 },
                    lineHeight: 1.2,
                    fontSize: { 
                      xs: '1.75rem', 
                      sm: '2.5rem',
                      md: '3rem'
                    }
                  }}
                >
                  Join Guidra
                </Typography>

                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  sx={{ 
                    mb: { xs: 3, md: 4 }, 
                    opacity: 0.9,
                    lineHeight: 1.6,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}
                >
                  Start your step-by-step learning path, guided by AI.
                </Typography>

                {/* Stats Section */}
                <Box 
                  sx={{ 
                    display: "flex", 
                    gap: { xs: 2, md: 3 }, 
                    mt: { xs: 3, md: 4 }, 
                    justifyContent: { xs: "center", md: "flex-start" },
                    flexWrap: 'wrap'
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography 
                      variant={isMobile ? "h5" : "h4"} 
                      fontWeight="700" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
                    >
                      50+
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8,
                        fontSize: { xs: '0.8rem', md: '0.9rem' }
                      }}
                    >
                      Courses
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography 
                      variant={isMobile ? "h5" : "h4"} 
                      fontWeight="700" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
                    >
                      95%
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8,
                        fontSize: { xs: '0.8rem', md: '0.9rem' }
                      }}
                    >
                      Success Rate
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography 
                      variant={isMobile ? "h5" : "h4"} 
                      fontWeight="700" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
                    >
                      10K+
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8,
                        fontSize: { xs: '0.8rem', md: '0.9rem' }
                      }}
                    >
                      Learners
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Registration Form */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: { xs: 3, sm: 4 },
                  borderRadius: { xs: 2, md: 3 },
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  maxWidth: 400,
                  mx: "auto",
                  border: `1px solid ${purplePalette[100]}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ textAlign: "center", mb: { xs: 2, md: 3 } }}>
                  <Avatar
                    sx={{
                      mx: "auto",
                      mb: 2,
                      bgcolor: purplePalette[500],
                      width: { xs: 50, md: 60 },
                      height: { xs: 50, md: 60 },
                      boxShadow: `0 4px 12px ${purplePalette[300]}`
                    }}
                  >
                    <PersonAddOutlined sx={{ fontSize: { xs: 24, md: 28 } }} />
                  </Avatar>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    fontWeight="600" 
                    gutterBottom
                    sx={{ color: purplePalette[700] }}
                  >
                    Create Account
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}
                  >
                    Sign up to start learning
                  </Typography>
                </Box>

                {/* Google Sign Up Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={googleLoading ? 
                    <CircularProgress size={isMobile ? 16 : 20} /> : 
                    <Google sx={{ fontSize: { xs: 18, md: 20 } }} />
                  }
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  sx={{
                    mb: 3,
                    py: { xs: 1.25, md: 1.5 },
                    borderRadius: 2,
                    fontWeight: 600,
                    borderColor: purplePalette[200],
                    color: 'text.primary',
                    backgroundColor: googleLoading ? purplePalette[50] : 'white',
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    '&:hover': {
                      borderColor: purplePalette[400],
                      backgroundColor: purplePalette[50],
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${purplePalette[100]}`
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
                </Button>

                <Divider sx={{ mb: 3 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', md: '0.8rem' } }}
                  >
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
                          <Person sx={{ color: purplePalette[500], fontSize: { xs: 20, md: 24 } }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }
                    }}
                    size={isMobile ? "small" : "medium"}
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
                          <Email sx={{ color: purplePalette[500], fontSize: { xs: 20, md: 24 } }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }
                    }}
                    size={isMobile ? "small" : "medium"}
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
                          <Lock sx={{ color: purplePalette[500], fontSize: { xs: 20, md: 24 } }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={handleTogglePassword} 
                            edge="end"
                            size={isMobile ? "small" : "medium"}
                            sx={{ color: purplePalette[500] }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }
                    }}
                    size={isMobile ? "small" : "medium"}
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
                          <Lock sx={{ color: purplePalette[500], fontSize: { xs: 20, md: 24 } }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={handleToggleConfirmPassword} 
                            edge="end"
                            size={isMobile ? "small" : "medium"}
                            sx={{ color: purplePalette[500] }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }
                    }}
                    size={isMobile ? "small" : "medium"}
                  />

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3, 
                        borderRadius: 2,
                        fontSize: { xs: '0.8rem', md: '0.9rem' }
                      }} 
                      onClose={() => setError("")}
                    >
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
                      py: { xs: 1.25, md: 1.5 },
                      borderRadius: 2,
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${purplePalette[500]} 0%, ${purplePalette[600]} 100%)`,
                      boxShadow: `0 4px 14px ${purplePalette[300]}`,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      '&:hover': {
                        background: `linear-gradient(135deg, ${purplePalette[600]} 0%, ${purplePalette[700]} 100%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${purplePalette[400]}`,
                      },
                      transition: 'all 0.3s ease',
                      '&:disabled': {
                        background: purplePalette[300],
                        transform: 'none',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={isMobile ? 20 : 24} sx={{ color: 'white' }} />
                    ) : (
                      <>
                        <RocketLaunch sx={{ 
                          mr: 1, 
                          fontSize: { xs: 18, md: 20 } 
                        }} />
                        Create Account
                      </>
                    )}
                  </Button>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}
                    >
                      Already have an account?{" "}
                      <Link 
                        component="button" 
                        type="button" 
                        onClick={handleLoginClick}
                        sx={{ 
                          fontWeight: 600, 
                          color: purplePalette[600],
                          fontSize: 'inherit'
                        }}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
}