// import React from 'react';
// import { 
//   Box, 
//   Typography, 
//   Button, 
//   Card, 
//   CardContent,
//   useTheme,
//   useMediaQuery,
//   Fade,
//   Chip
// } from "@mui/material";
// import { 
//   Psychology, 
//   AutoAwesome, 
//   School, 
//   TrendingUp,
//   RocketLaunch
// } from "@mui/icons-material";

// const WelcomeState = ({ subtopicName, isReady = false, onGenerateContent }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

//   if (isReady && subtopicName) {
//     return (
//       <Fade in={true} timeout={800}>
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           height: '100%', 
//           width: '100%',
//           p: { xs: 2, sm: 3, md: 4 },
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//         }}>
//           <Card sx={{ 
//             maxWidth: isMobile ? '100%' : 450,
//             width: '100%',
//             textAlign: 'center',
//             p: { xs: 2, sm: 3, md: 4 },
//             borderRadius: 3,
//             boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
//             border: '1px solid rgba(255,255,255,0.2)',
//             background: 'rgba(255,255,255,0.95)',
//             backdropFilter: 'blur(10px)'
//           }}>
//             <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
//               {/* Animated Icon */}
//               <Box sx={{ 
//                 position: 'relative',
//                 mb: 3
//               }}>
//                 <Box
//                   sx={{
//                     width: { xs: 70, sm: 80, md: 90 },
//                     height: { xs: 70, sm: 80, md: 90 },
//                     borderRadius: '50%',
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     margin: '0 auto',
//                     animation: 'pulse 2s ease-in-out infinite',
//                     '@keyframes pulse': {
//                       '0%': { transform: 'scale(1)', opacity: 1 },
//                       '50%': { transform: 'scale(1.1)', opacity: 0.8 },
//                       '100%': { transform: 'scale(1)', opacity: 1 }
//                     }
//                   }}
//                 >
//                   <RocketLaunch sx={{ 
//                     fontSize: { xs: 35, sm: 40, md: 45 },
//                     color: 'white',
//                     animation: 'float 3s ease-in-out infinite',
//                     '@keyframes float': {
//                       '0%, 100%': { transform: 'translateY(0px)' },
//                       '50%': { transform: 'translateY(-5px)' }
//                     }
//                   }} />
//                 </Box>
//               </Box>

//               {/* Topic Chip */}
//               <Chip 
//                 icon={<Psychology />}
//                 label={subtopicName}
//                 color="primary"
//                 variant="filled"
//                 sx={{ 
//                   mb: 3,
//                   py: 1,
//                   px: 2,
//                   fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
//                   fontWeight: 600,
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                   height: { xs: 32, sm: 36 }
//                 }}
//               />

//               <Typography 
//                 variant={isMobile ? "h5" : "h4"} 
//                 fontWeight="800" 
//                 color="text.primary" 
//                 gutterBottom
//                 sx={{ 
//                   mb: 2,
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                   backgroundClip: 'text',
//                   WebkitBackgroundClip: 'text',
//                   color: 'transparent',
//                   fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
//                 }}
//               >
//                 Ready to Learn {subtopicName}?
//               </Typography>

//               <Typography 
//                 variant="body1" 
//                 color="text.secondary" 
//                 sx={{ 
//                   mb: 4, 
//                   lineHeight: 1.6,
//                   fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' }
//                 }}
//               >
//                 Click the button below to start learning with personalized content.
//               </Typography>

//               {/* Generate Button */}
//               <Button
//                 variant="contained"
//                 size="large"
//                 onClick={onGenerateContent}
//                 startIcon={<AutoAwesome />}
//                 sx={{
//                   py: { xs: 1.25, sm: 1.5, md: 2 },
//                   px: 4,
//                   borderRadius: 3,
//                   fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
//                   fontWeight: 700,
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                   boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
//                     boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
//                     transform: 'translateY(-2px)'
//                   },
//                   transition: 'all 0.3s ease',
//                   minWidth: { xs: '100%', sm: 200 },
//                   mb: 2
//                 }}
//               >
//                 Generate Content
//               </Button>
//             </CardContent>
//           </Card>
//         </Box>
//       </Fade>
//     );
//   }

//   return (
//     <Fade in={true} timeout={800}>
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100%', 
//         width: '100%',
//         p: { xs: 2, sm: 3, md: 4 },
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//       }}>
//         <Card sx={{ 
//           maxWidth: isMobile ? '100%' : 500,
//           width: '100%',
//           textAlign: 'center',
//           p: { xs: 3, sm: 4, md: 5 },
//           borderRadius: 3,
//           boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
//           border: '1px solid rgba(255,255,255,0.2)',
//           background: 'rgba(255,255,255,0.95)',
//           backdropFilter: 'blur(10px)'
//         }}>
//           <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
//             {/* Main Icon with Animation */}
//             <Box sx={{ 
//               position: 'relative',
//               mb: 4
//             }}>
//               <Box
//                 sx={{
//                   width: { xs: 90, sm: 110, md: 120 },
//                   height: { xs: 90, sm: 110, md: 120 },
//                   borderRadius: '50%',
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   margin: '0 auto',
//                   animation: 'pulse 3s ease-in-out infinite',
//                   '@keyframes pulse': {
//                     '0%': { 
//                       transform: 'scale(1) rotate(0deg)',
//                       boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.7)'
//                     },
//                     '50%': { 
//                       transform: 'scale(1.05) rotate(180deg)',
//                       boxShadow: '0 0 0 20px rgba(102, 126, 234, 0)'
//                     },
//                     '100%': { 
//                       transform: 'scale(1) rotate(360deg)',
//                       boxShadow: '0 0 0 0 rgba(102, 126, 234, 0)'
//                     }
//                   }
//                 }}
//               >
//                 <Psychology sx={{ 
//                   fontSize: { xs: 45, sm: 55, md: 60 },
//                   color: 'white'
//                 }} />
//               </Box>
//             </Box>

//             <Typography 
//               variant={isMobile ? "h4" : "h3"} 
//               fontWeight="800" 
//               color="text.primary" 
//               gutterBottom
//               sx={{ 
//                 mb: 3,
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 color: 'transparent',
//                 lineHeight: 1.2,
//                 fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
//               }}
//             >
//               Welcome to Your Learning Journey
//             </Typography>

//             <Typography 
//               variant={isMobile ? "body1" : "h6"} 
//               color="text.secondary" 
//               sx={{ 
//                 mb: 4, 
//                 lineHeight: 1.6,
//                 margin: '0 auto',
//                 fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
//                 maxWidth: 400
//               }}
//             >
//               Select a subtopic from the sidebar to begin your personalized learning experience.
//             </Typography>

//             {/* Simple Call to Action */}
//             <Box sx={{ 
//               display: 'flex', 
//               flexDirection: 'column',
//               alignItems: 'center',
//               gap: 2,
//               mt: 4
//             }}>
//               <Box sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: 1,
//                 color: 'primary.main'
//               }}>
//                 <School sx={{ fontSize: { xs: 20, sm: 24 } }} />
//                 <Typography variant="body1" fontWeight="600">
//                   Start Learning Today
//                 </Typography>
//               </Box>
              
//               <Box sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: 1,
//                 color: 'secondary.main'
//               }}>
//                 <TrendingUp sx={{ fontSize: { xs: 20, sm: 24 } }} />
//                 <Typography variant="body1" fontWeight="600">
//                   Track Your Progress
//                 </Typography>
//               </Box>
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>
//     </Fade>
//   );
// };

// export default WelcomeState;

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Fade
} from "@mui/material";
import { 
  AutoAwesome,
  School 
} from "@mui/icons-material";

const WelcomeState = ({ subtopicName, isReady = false, onGenerateContent }) => {
  if (isReady && subtopicName) {
    return (
      <Fade in={true} timeout={500}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%', 
          width: '100%',
          p: 3
        }}>
          <Card sx={{ 
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
            p: 4,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(126, 87, 194, 0.1)',
            border: '1px solid rgba(126, 87, 194, 0.1)',
          }}>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}
                >
                  <School sx={{ 
                    fontSize: 40,
                    color: 'white',
                  }} />
                </Box>
              </Box>

              <Typography 
                variant="h5" 
                fontWeight="600" 
                color="#7C3AED" 
                gutterBottom
                sx={{ mb: 2 }}
              >
                Ready to Learn
              </Typography>

              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 3, 
                  lineHeight: 1.6,
                }}
              >
                Start learning {subtopicName} with personalized content.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={onGenerateContent}
                startIcon={<AutoAwesome />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6B21A8 0%, #581C87 100%)',
                  },
                  minWidth: 200
                }}
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        width: '100%',
        p: 3
      }}>
        <Card sx={{ 
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(126, 87, 194, 0.1)',
          border: '1px solid rgba(126, 87, 194, 0.1)',
        }}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <School sx={{ 
                  fontSize: 40,
                  color: 'white',
                }} />
              </Box>
            </Box>

            <Typography 
              variant="h5" 
              fontWeight="600" 
              color="#7C3AED" 
              gutterBottom
              sx={{ mb: 2 }}
            >
              Welcome to Learning
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 3, 
                lineHeight: 1.6,
              }}
            >
              Select a subtopic from the sidebar to begin your learning journey.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default WelcomeState;