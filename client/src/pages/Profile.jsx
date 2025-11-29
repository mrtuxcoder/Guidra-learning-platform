// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Alert,
//   Button,
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Divider
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { getProfile } from "../api/auth";
// import ProfileHeader from "../components/profile/ProfileHeader";
// import ProgressStats from "../components/profile/ProgressStats";
// import PersonalInfo from "../components/profile/PersonalInfo";
// import { completeLogout } from "../utils/auth";
// import { learningStyles } from "../components/profile/constants";
// import { authHelpers } from "../api/api";
// import { RocketLaunch, TrendingUp, School, Logout } from "@mui/icons-material";

// const { setFrontendCookie } = authHelpers;

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const navigate = useNavigate();

//   // Fetch profile data with auto-refresh
//   const fetchProfile = async (forceRefresh = false) => {
//     try {
//       setError("");
      
//       // Use cache only if not forcing refresh and cache is recent (less than 30 seconds old)
//       const cachedProfile = sessionStorage.getItem('userProfile');
//       const cacheTimestamp = sessionStorage.getItem('userProfileTimestamp');
//       const isCacheRecent = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 30000; // 30 seconds
      
//       if (cachedProfile && !forceRefresh && isCacheRecent) {
//         setUser(JSON.parse(cachedProfile));
//         setLoading(false);
//         return;
//       }

//       const response = await getProfile();
//       const userData = response.data?.user || response.data || response;
      
//       const enhancedUserData = {
//         ...userData,
//         learningStyle: userData.learningStyle || "visual",
//         progress: userData.progress || []
//       };
      
//       setUser(enhancedUserData);
//       setLastUpdated(Date.now());
      
//       // Update cache
//       sessionStorage.setItem('userProfile', JSON.stringify(enhancedUserData));
//       sessionStorage.setItem('userProfileTimestamp', Date.now().toString());
      
//     } catch (err) {
//       console.error("Profile fetch error:", err);
      
//       if (err.response?.status === 401) {
//         setError("Session expired");
//         navigate('/login');
//       } else {
//         setError(err.response?.data?.error || "Failed to load profile");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-refresh profile data
//   useEffect(() => {
//     fetchProfile();
    
//     // Set up interval to refresh data every 30 seconds
//     const interval = setInterval(() => {
//       if (!loading) {
//         fetchProfile(true); // Force refresh
//       }
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, []);

//   // Handle OAuth token
//   useEffect(() => {
//     const handleOAuthToken = () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const tokenFromUrl = urlParams.get('token');
//       const source = urlParams.get('source');
      
//       if (tokenFromUrl && source === 'google') {
//         setFrontendCookie(tokenFromUrl);
//         window.history.replaceState({}, '', '/profile');
//         // Refresh profile after OAuth login
//         setTimeout(() => fetchProfile(true), 1000);
//       }
//     };
    
//     handleOAuthToken();
//   }, []);

//   // Refresh profile when coming back to the page
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         fetchProfile(true);
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.removeItem('userProfile');
//     sessionStorage.removeItem('userProfileTimestamp');
//     completeLogout();
//   };

//   const handleLoginRedirect = () => {
//     navigate('/login');
//   };

//   const getLearningStyleInfo = (learningStyle) => {
//     const style = learningStyles.find(style => style.value === learningStyle) || learningStyles[0];
    
//     // Remove "theoretical learner" from the label
//     return {
//       ...style,
//       label: style.label.replace('Theoretical Learner', 'Learner').replace('theoretical', '')
//     };
//   };

//   const getProgressStats = (user) => {
//     if (!user?.progress || !Array.isArray(user.progress)) {
//       return {
//         progressPercentage: 0,
//         totalTopics: 0,
//         completed: 0,
//         inProgress: 0,
//         completedSubtopics: 0,
//         totalSubtopics: 0
//       };
//     }

//     const progress = user.progress;
//     const totalTopics = progress.length;
    
//     const completedTopics = progress.filter(topic => {
//       if (topic.completed === true) return true;
//       const subtopics = topic.subTopics || [];
//       if (subtopics.length > 0 && subtopics.every(st => st.completed === true)) {
//         return true;
//       }
//       if (topic.overallUnderstanding >= 4) return true;
//       return false;
//     }).length;

//     const inProgressTopics = progress.filter(topic => {
//       if (topic.completed === true) return false;
//       const subtopics = topic.subTopics || [];
//       const hasSomeProgress = subtopics.some(st => st.completed === true) || 
//                             (topic.overallUnderstanding || 0) > 1;
//       return hasSomeProgress;
//     }).length;

//     let totalSubtopics = 0;
//     let completedSubtopics = 0;

//     progress.forEach(topic => {
//       const subtopics = topic.subTopics || [];
//       totalSubtopics += subtopics.length;
//       completedSubtopics += subtopics.filter(subtopic => 
//         subtopic.completed === true
//       ).length;
//     });

//     const progressPercentage = totalSubtopics > 0 ? 
//       Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

//     return {
//       progressPercentage,
//       totalTopics,
//       completed: completedTopics,
//       inProgress: inProgressTopics,
//       completedSubtopics,
//       totalSubtopics,
//       lastUpdated
//     };
//   };

//   // Manual refresh function
//   const handleRefresh = () => {
//     setLoading(true);
//     fetchProfile(true);
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <Container maxWidth="xl" sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)'
//       }}>
//         <Box sx={{ textAlign: 'center' }}>
//           <Box
//             sx={{
//               width: 80,
//               height: 80,
//               borderRadius: '50%',
//               background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               mx: 'auto',
//               mb: 3,
//               animation: 'pulse 2s ease-in-out infinite'
//             }}
//           >
//             <RocketLaunch sx={{ fontSize: 32, color: 'white' }} />
//           </Box>
//           <Typography variant="h5" sx={{ 
//             fontWeight: 700,
//             background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//             backgroundClip: 'text',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent'
//           }}>
//             Loading Your Journey...
//           </Typography>
//         </Box>
//       </Container>
//     );
//   }

//   // Error States
//   if (error && error.includes("Session expired") && !user) {
//     return (
//       <Container maxWidth="sm" sx={{ 
//         py: 4, 
//         textAlign: 'center', 
//         minHeight: '100vh',
//         display: 'flex', 
//         flexDirection: 'column', 
//         justifyContent: 'center',
//         background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)'
//       }}>
//         <Alert severity="warning" sx={{ 
//           mb: 3, 
//           borderRadius: 3,
//           border: '1px solid rgba(126, 87, 194, 0.2)',
//           bgcolor: 'rgba(126, 87, 194, 0.05)'
//         }}>
//           {error}
//         </Alert>
//         <Button
//           variant="contained"
//           onClick={handleLoginRedirect}
//           sx={{ 
//             borderRadius: 3,
//             background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//             boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
//             fontWeight: 600,
//             px: 4,
//             py: 1.5,
//             fontSize: '1.1rem',
//             '&:hover': {
//               transform: 'translateY(-2px)',
//               boxShadow: '0 12px 35px rgba(126, 87, 194, 0.4)',
//             }
//           }}
//         >
//           Continue Learning
//         </Button>
//       </Container>
//     );
//   }

//   if (!user && error) {
//     return (
//       <Container maxWidth="sm" sx={{ 
//         py: 4,
//         textAlign: 'center',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 3
//       }}>
//         <Box sx={{ textAlign: 'center' }}>
//           <Box
//             sx={{
//               width: 80,
//               height: 80,
//               borderRadius: '50%',
//               background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               mx: 'auto',
//               mb: 2
//             }}
//           >
//             <TrendingUp sx={{ fontSize: 32, color: 'white' }} />
//           </Box>
//           <Alert severity="error" sx={{ 
//             borderRadius: 3,
//             border: '1px solid rgba(211, 47, 47, 0.2)'
//           }}>
//             {error}
//           </Alert>
//         </Box>
//         <Button 
//           variant="contained"
//           onClick={handleRefresh}
//           sx={{ 
//             borderRadius: 3,
//             background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//             fontWeight: 600,
//             px: 4,
//             py: 1.5,
//             fontSize: '1.1rem'
//           }}
//         >
//           Try Again
//         </Button>
//       </Container>
//     );
//   }

//   const styleInfo = getLearningStyleInfo(user.learningStyle);
//   const stats = getProgressStats(user);

//   return (
//     <Box sx={{ 
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)'
//     }}>
//       {/* Enhanced Header */}
//       <Box sx={{ 
//         background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//         color: 'white',
//         position: 'relative',
//         overflow: 'hidden'
//       }}>
//         <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
//           <ProfileHeader user={user} />
         
//         </Container>
        
//         {/* Wave decoration */}
//         <Box sx={{
//           position: 'absolute',
//           bottom: -1,
//           left: 0,
//           right: 0,
//           height: 20,
//           background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
//           borderTopLeftRadius: 40,
//           borderTopRightRadius: 40
//         }} />
//       </Box>

//       {/* Enhanced Main Content */}
//       <Container maxWidth="xl" sx={{ 
//         px: { xs: 2, sm: 3 }, 
//         py: 4,
//         mt: -1
//       }}>
//         <Grid container spacing={3}>
//           {/* Left Column - Personal & Quick Stats */}
//           <Grid item xs={12} lg={4}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//               <PersonalInfo user={user} />
              
//               {/* Quick Stats Card */}
//               <Card sx={{ 
//                 borderRadius: 3,
//                 border: '1px solid rgba(126, 87, 194, 0.15)',
//                 background: 'white',
//                 boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
//               }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//                     <Box sx={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 2,
//                       background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}>
//                       <TrendingUp sx={{ fontSize: 20, color: 'white' }} />
//                     </Box>
//                     <Typography variant="h6" sx={{ 
//                       fontWeight: 700,
//                       background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                       backgroundClip: 'text',
//                       WebkitBackgroundClip: 'text',
//                       WebkitTextFillColor: 'transparent'
//                     }}>
//                       Quick Stats
//                     </Typography>
//                   </Box>

//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Box sx={{ textAlign: 'center', p: 2 }}>
//                         <Typography variant="h3" sx={{ 
//                           fontWeight: 800,
//                           color: '#7E57C2',
//                           mb: 1
//                         }}>
//                           {stats.completed}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           Topics Mastered
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Box sx={{ textAlign: 'center', p: 2 }}>
//                         <Typography variant="h3" sx={{ 
//                           fontWeight: 800,
//                           color: '#5E35B1',
//                           mb: 1
//                         }}>
//                           {stats.completedSubtopics}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           Subtopics Done
//                         </Typography>
//                       </Box>
//                     </Grid>
//                   </Grid>

//                   <Divider sx={{ my: 2 }} />

//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="body2" color="text.secondary">
//                       Learning Streak
//                     </Typography>
//                     <Chip 
//                       label="7 days" 
//                       size="small"
//                       sx={{
//                         background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                         color: 'white',
//                         fontWeight: 600
//                       }}
//                     />
//                   </Box>
//                 </CardContent>
//               </Card>

//               {/* Mobile Quick Actions */}
//               <Card sx={{ 
//                 display: { xs: 'block', lg: 'none' },
//                 borderRadius: 3,
//                 border: '1px solid rgba(126, 87, 194, 0.15)',
//                 background: 'white',
//                 boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
//               }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Typography variant="h6" sx={{ 
//                     fontWeight: 700,
//                     mb: 2,
//                     background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                     backgroundClip: 'text',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent'
//                   }}>
//                     Quick Actions
//                   </Typography>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                     <Button
//                       variant="contained"
//                       startIcon={<School />}
//                       onClick={() => navigate('/learn')}
//                       sx={{ 
//                         borderRadius: 2,
//                         background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                         fontWeight: 600,
//                         py: 1.5,
//                         fontSize: '1rem'
//                       }}
//                     >
//                       Continue Learning
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       startIcon={<Logout />}
//                       onClick={handleLogout}
//                       sx={{ 
//                         borderRadius: 2,
//                         borderColor: 'rgba(126, 87, 194, 0.3)',
//                         color: '#7E57C2',
//                         fontWeight: 600,
//                         py: 1.5
//                       }}
//                     >
//                       Sign Out
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Grid>

//           {/* Right Column - Progress & Main Content */}
//           <Grid item xs={12} lg={8}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//               <ProgressStats stats={stats} />
              
//               {/* Learning Journey Card */}
//               <Card sx={{ 
//                 borderRadius: 3,
//                 border: '1px solid rgba(126, 87, 194, 0.15)',
//                 background: 'white',
//                 boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
//               }}>
//                 <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
//                   <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
//                     <Box sx={{
//                       width: { xs: 50, sm: 60 },
//                       height: { xs: 50, sm: 60 },
//                       borderRadius: '50%',
//                       background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       mx: 'auto',
//                       mb: 2
//                     }}>
//                       <RocketLaunch sx={{ 
//                         fontSize: { xs: 24, sm: 28 }, 
//                         color: 'white' 
//                       }} />
//                     </Box>
//                     <Typography variant="h4" sx={{ 
//                       fontWeight: 800,
//                       fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
//                       background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                       backgroundClip: 'text',
//                       WebkitBackgroundClip: 'text',
//                       WebkitTextFillColor: 'transparent',
//                       mb: 1,
//                       lineHeight: 1.2
//                     }}>
//                       Your Learning Journey
//                     </Typography>
//                     <Typography variant="body1" 
//                       color="text.secondary"
//                       sx={{ 
//                         fontSize: { xs: '0.9rem', sm: '1rem' },
//                         lineHeight: 1.5
//                       }}
//                     >
//                       Keep up the great work! You're making amazing progress.
//                     </Typography>
//                   </Box>

//                   <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 3 } }}>
//                     <Grid item xs={12} sm={6}>
//                       <Box sx={{ 
//                         textAlign: 'center', 
//                         p: { xs: 2, sm: 3 }, 
//                         borderRadius: 3,
//                         background: 'rgba(126, 87, 194, 0.05)',
//                         border: '1px solid rgba(126, 87, 194, 0.1)',
//                         height: '100%',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         justifyContent: 'center'
//                       }}>
//                         <Typography variant="h2" sx={{ 
//                           fontWeight: 800,
//                           fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
//                           color: '#7E57C2',
//                           mb: 1,
//                           lineHeight: 1
//                         }}>
//                           {stats.progressPercentage}%
//                         </Typography>
//                         <Typography variant="body1" 
//                           fontWeight={600} 
//                           color="text.primary"
//                           sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
//                         >
//                           Overall Progress
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Box sx={{ 
//                         textAlign: 'center', 
//                         p: { xs: 2, sm: 3 }, 
//                         borderRadius: 3,
//                         background: 'rgba(126, 87, 194, 0.05)',
//                         border: '1px solid rgba(126, 87, 194, 0.1)',
//                         height: '100%',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         justifyContent: 'center'
//                       }}>
//                         <Typography variant="h2" sx={{ 
//                           fontWeight: 800,
//                           fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
//                           color: '#5E35B1',
//                           mb: 1,
//                           lineHeight: 1
//                         }}>
//                           {stats.inProgress}
//                         </Typography>
//                         <Typography variant="body1" 
//                           fontWeight={600} 
//                           color="text.primary"
//                           sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
//                         >
//                           In Progress
//                         </Typography>
//                       </Box>
//                     </Grid>
//                   </Grid>

//                   <Button
//                     variant="contained"
//                     fullWidth
//                     size="large"
//                     startIcon={<RocketLaunch />}
//                     onClick={() => navigate('/learn')}
//                     sx={{ 
//                       borderRadius: 3,
//                       background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                       fontWeight: 700,
//                       py: { xs: 1.5, sm: 2 },
//                       fontSize: { xs: '1rem', sm: '1.1rem' },
//                       boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
//                       '&:hover': {
//                         transform: 'translateY(-2px)',
//                         boxShadow: '0 12px 35px rgba(126, 87, 194, 0.4)',
//                       }
//                     }}
//                   >
//                     Launch Next Lesson
//                   </Button>
//                 </CardContent>
//               </Card>

//               {/* Desktop Quick Actions */}
//               <Card sx={{ 
//                 display: { xs: 'none', lg: 'block' },
//                 borderRadius: 3,
//                 border: '1px solid rgba(126, 87, 194, 0.15)',
//                 background: 'white',
//                 boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
//               }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Typography variant="h6" sx={{ 
//                     fontWeight: 700,
//                     mb: 3,
//                     background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
//                     backgroundClip: 'text',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent'
//                   }}>
//                     Quick Navigation
//                   </Typography>
//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Button
//                         variant="outlined"
//                         fullWidth
//                         startIcon={<School />}
//                         onClick={() => navigate('/learn')}
//                         sx={{ 
//                           borderRadius: 2,
//                           borderColor: 'rgba(126, 87, 194, 0.3)',
//                           color: '#7E57C2',
//                           fontWeight: 600,
//                           py: 1.5
//                         }}
//                       >
//                         Learn
//                       </Button>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Button
//                         variant="outlined"
//                         fullWidth
//                         startIcon={<TrendingUp />}
//                         onClick={() => navigate('/personalize')}
//                         sx={{ 
//                           borderRadius: 2,
//                           borderColor: 'rgba(126, 87, 194, 0.3)',
//                           color: '#7E57C2',
//                           fontWeight: 600,
//                           py: 1.5
//                         }}
//                       >
//                         Explore
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Container,
  Alert,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/auth";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProgressStats from "../components/profile/ProgressStats";
import PersonalInfo from "../components/profile/PersonalInfo";
import { completeLogout } from "../utils/auth";
import { learningStyles } from "../components/profile/constants";
import { authHelpers } from "../api/api";
import { RocketLaunch, TrendingUp, School, Logout, Explore } from "@mui/icons-material";

const { setFrontendCookie } = authHelpers;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  // Fetch profile data with auto-refresh
  const fetchProfile = async (forceRefresh = false) => {
    try {
      setError("");
      
      // Use cache only if not forcing refresh and cache is recent (less than 30 seconds old)
      const cachedProfile = sessionStorage.getItem('userProfile');
      const cacheTimestamp = sessionStorage.getItem('userProfileTimestamp');
      const isCacheRecent = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 30000; // 30 seconds
      
      if (cachedProfile && !forceRefresh && isCacheRecent) {
        setUser(JSON.parse(cachedProfile));
        setLoading(false);
        return;
      }

      const response = await getProfile();
      const userData = response.data?.user || response.data || response;
      
      const enhancedUserData = {
        ...userData,
        learningStyle: userData.learningStyle || "visual",
        progress: userData.progress || []
      };
      
      setUser(enhancedUserData);
      setLastUpdated(Date.now());
      
      // Update cache
      sessionStorage.setItem('userProfile', JSON.stringify(enhancedUserData));
      sessionStorage.setItem('userProfileTimestamp', Date.now().toString());
      
    } catch (err) {
      console.error("Profile fetch error:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired");
        navigate('/login');
      } else {
        setError(err.response?.data?.error || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh profile data
  useEffect(() => {
    fetchProfile();
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      if (!loading) {
        fetchProfile(true); // Force refresh
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle OAuth token
  useEffect(() => {
    const handleOAuthToken = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      const source = urlParams.get('source');
      
      if (tokenFromUrl && source === 'google') {
        setFrontendCookie(tokenFromUrl);
        window.history.replaceState({}, '', '/profile');
        // Refresh profile after OAuth login
        setTimeout(() => fetchProfile(true), 1000);
      }
    };
    
    handleOAuthToken();
  }, []);

  // Refresh profile when coming back to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProfile(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('userProfileTimestamp');
    completeLogout();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const getLearningStyleInfo = (learningStyle) => {
    const style = learningStyles.find(style => style.value === learningStyle) || learningStyles[0];
    
    // Remove "theoretical learner" from the label
    return {
      ...style,
      label: style.label.replace('Theoretical Learner', 'Learner').replace('theoretical', '')
    };
  };

  const getProgressStats = (user) => {
    if (!user?.progress || !Array.isArray(user.progress)) {
      return {
        progressPercentage: 0,
        totalTopics: 0,
        completed: 0,
        inProgress: 0,
        completedSubtopics: 0,
        totalSubtopics: 0
      };
    }

    const progress = user.progress;
    const totalTopics = progress.length;
    
    const completedTopics = progress.filter(topic => {
      if (topic.completed === true) return true;
      const subtopics = topic.subTopics || [];
      if (subtopics.length > 0 && subtopics.every(st => st.completed === true)) {
        return true;
      }
      if (topic.overallUnderstanding >= 4) return true;
      return false;
    }).length;

    const inProgressTopics = progress.filter(topic => {
      if (topic.completed === true) return false;
      const subtopics = topic.subTopics || [];
      const hasSomeProgress = subtopics.some(st => st.completed === true) || 
                            (topic.overallUnderstanding || 0) > 1;
      return hasSomeProgress;
    }).length;

    let totalSubtopics = 0;
    let completedSubtopics = 0;

    progress.forEach(topic => {
      const subtopics = topic.subTopics || [];
      totalSubtopics += subtopics.length;
      completedSubtopics += subtopics.filter(subtopic => 
        subtopic.completed === true
      ).length;
    });

    const progressPercentage = totalSubtopics > 0 ? 
      Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

    return {
      progressPercentage,
      totalTopics,
      completed: completedTopics,
      inProgress: inProgressTopics,
      completedSubtopics,
      totalSubtopics,
      lastUpdated
    };
  };

  // Manual refresh function
  const handleRefresh = () => {
    setLoading(true);
    fetchProfile(true);
  };

  // Enhanced Loading State
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)'
      }}>
        <Box sx={{ textAlign: 'center', px: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.05)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 1 }
              }
            }}
          >
            <RocketLaunch sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Loading Your Journey...
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Preparing your learning dashboard
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error States
  if (error && error.includes("Session expired") && !user) {
    return (
      <Container maxWidth="sm" sx={{ 
        py: 4, 
        textAlign: 'center', 
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
        px: 2
      }}>
        <Alert severity="warning" sx={{ 
          mb: 3, 
          borderRadius: 3,
          border: '1px solid rgba(126, 87, 194, 0.2)',
          bgcolor: 'rgba(126, 87, 194, 0.05)'
        }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleLoginRedirect}
          sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(126, 87, 194, 0.4)',
            }
          }}
        >
          Continue Learning
        </Button>
      </Container>
    );
  }

  if (!user && error) {
    return (
      <Container maxWidth="sm" sx={{ 
        py: 4,
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        px: 2
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <TrendingUp sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Alert severity="error" sx={{ 
            borderRadius: 3,
            border: '1px solid rgba(211, 47, 47, 0.2)'
          }}>
            {error}
          </Alert>
        </Box>
        <Button 
          variant="contained"
          onClick={handleRefresh}
          sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            fontSize: '1rem'
          }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  const styleInfo = getLearningStyleInfo(user.learningStyle);
  const stats = getProgressStats(user);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)'
    }}>
      {/* Enhanced Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          <ProfileHeader user={user} />
        </Container>
        
        {/* Wave decoration */}
        <Box sx={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          right: 0,
          height: 20,
          background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40
        }} />
      </Box>

      {/* Enhanced Main Content */}
      <Container maxWidth="xl" sx={{ 
        px: { xs: 2, sm: 3 }, 
        py: 4,
        mt: -1
      }}>
        <Grid container spacing={3}>
          {/* Left Column - Personal & Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <PersonalInfo user={user} />
              
              {/* Quick Stats Card */}
              <Card sx={{ 
                borderRadius: 3,
                border: '1px solid rgba(126, 87, 194, 0.15)',
                background: 'white',
                boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
              }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <TrendingUp sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Quick Stats
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 800,
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                          color: '#7E57C2',
                          mb: 1,
                          lineHeight: 1
                        }}>
                          {stats.completed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Topics Mastered
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 800,
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                          color: '#5E35B1',
                          mb: 1,
                          lineHeight: 1
                        }}>
                          {stats.completedSubtopics}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Subtopics Done
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Removed streak section */}
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Keep learning every day!
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Mobile Quick Actions */}
              <Card sx={{ 
                display: { xs: 'block', lg: 'none' },
                borderRadius: 3,
                border: '1px solid rgba(126, 87, 194, 0.15)',
                background: 'white',
                boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                      variant="contained"
                      startIcon={<School />}
                      onClick={() => navigate('/learn')}
                      sx={{ 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                        fontWeight: 600,
                        py: 1.5,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      Continue Learning
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Explore />}
                      onClick={() => navigate('/personalize')}
                      sx={{ 
                        borderRadius: 2,
                        borderColor: 'rgba(126, 87, 194, 0.3)',
                        color: '#7E57C2',
                        fontWeight: 600,
                        py: 1.5,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      Explore Courses
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Logout />}
                      onClick={handleLogout}
                      sx={{ 
                        borderRadius: 2,
                        borderColor: 'rgba(211, 47, 47, 0.3)',
                        color: '#d32f2f',
                        fontWeight: 600,
                        py: 1.5,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      Sign Out
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column - Progress & Main Content */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <ProgressStats stats={stats} />
              
              {/* Learning Journey Card */}
              <Card sx={{ 
                borderRadius: 3,
                border: '1px solid rgba(126, 87, 194, 0.15)',
                background: 'white',
                boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
              }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                  <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                    <Box sx={{
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <RocketLaunch sx={{ 
                        fontSize: { xs: 24, sm: 28 }, 
                        color: 'white' 
                      }} />
                    </Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                      lineHeight: 1.2
                    }}>
                      Your Learning Journey
                    </Typography>
                    <Typography variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.85rem', sm: '1rem' },
                        lineHeight: 1.5
                      }}
                    >
                      Keep up the great work! You're making amazing progress.
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: { xs: 2, sm: 3 }, 
                        borderRadius: 3,
                        background: 'rgba(126, 87, 194, 0.05)',
                        border: '1px solid rgba(126, 87, 194, 0.1)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h2" sx={{ 
                          fontWeight: 800,
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                          color: '#7E57C2',
                          mb: 1,
                          lineHeight: 1
                        }}>
                          {stats.progressPercentage}%
                        </Typography>
                        <Typography variant="body1" 
                          fontWeight={600} 
                          color="text.primary"
                          sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
                        >
                          Overall Progress
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: { xs: 2, sm: 3 }, 
                        borderRadius: 3,
                        background: 'rgba(126, 87, 194, 0.05)',
                        border: '1px solid rgba(126, 87, 194, 0.1)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h2" sx={{ 
                          fontWeight: 800,
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                          color: '#5E35B1',
                          mb: 1,
                          lineHeight: 1
                        }}>
                          {stats.inProgress}
                        </Typography>
                        <Typography variant="body1" 
                          fontWeight={600} 
                          color="text.primary"
                          sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
                        >
                          In Progress
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<RocketLaunch />}
                    onClick={() => navigate('/learn')}
                    sx={{ 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                      fontWeight: 700,
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(126, 87, 194, 0.4)',
                      }
                    }}
                  >
                    Launch Next Lesson
                  </Button>
                </CardContent>
              </Card>

              {/* Desktop Quick Actions */}
              <Card sx={{ 
                display: { xs: 'none', lg: 'block' },
                borderRadius: 3,
                border: '1px solid rgba(126, 87, 194, 0.15)',
                background: 'white',
                boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    fontSize: '1.125rem',
                    background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Quick Navigation
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<School />}
                        onClick={() => navigate('/learn')}
                        sx={{ 
                          borderRadius: 2,
                          borderColor: 'rgba(126, 87, 194, 0.3)',
                          color: '#7E57C2',
                          fontWeight: 600,
                          py: 1.5,
                          fontSize: '0.9rem'
                        }}
                      >
                        Learn
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Explore />}
                        onClick={() => navigate('/personalize')}
                        sx={{ 
                          borderRadius: 2,
                          borderColor: 'rgba(126, 87, 194, 0.3)',
                          color: '#7E57C2',
                          fontWeight: 600,
                          py: 1.5,
                          fontSize: '0.9rem'
                        }}
                      >
                        Explore
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}