// import React from 'react';
// import { 
//   Box, 
//   Typography, 
//   CircularProgress, 
//   Chip,
//   Fade,
//   useTheme,
//   useMediaQuery 
// } from "@mui/material";
// import { 
//   AutoAwesome, 
//   Psychology, 
//   Cached,
//   School 
// } from "@mui/icons-material";

// const LoadingState = ({ isContentLoading = false, source = "ai" }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   // Content Loading State (when generating specific content)
//   if (isContentLoading) {
//     return (
//       <Fade in={true} timeout={800}>
//         <Box 
//           sx={{ 
//             display: 'flex', 
//             justifyContent: 'center', 
//             alignItems: 'center', 
//             height: '300px', 
//             flexDirection: 'column', 
//             gap: 3,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             borderRadius: 3,
//             mx: 2,
//             my: 1,
//             position: 'relative',
//             overflow: 'hidden'
//           }}
//         >
//           {/* Animated background elements */}
//           <Box
//             sx={{
//               position: 'absolute',
//               top: -50,
//               left: -50,
//               width: 100,
//               height: 100,
//               borderRadius: '50%',
//               background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
//               animation: 'float 6s ease-in-out infinite',
//             }}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: -30,
//               right: -30,
//               width: 80,
//               height: 80,
//               borderRadius: '50%',
//               background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
//               animation: 'float 8s ease-in-out infinite 1s',
//             }}
//           />

//           {/* Main content */}
//           <Box sx={{ 
//             position: 'relative', 
//             zIndex: 1,
//             textAlign: 'center'
//           }}>
//             {/* Animated icon and progress */}
//             <Box sx={{ position: 'relative', mb: 2 }}>
//               <CircularProgress 
//                 size={isMobile ? 60 : 80} 
//                 thickness={4}
//                 sx={{ 
//                   color: 'rgba(255,255,255,0.9)',
//                   animation: 'spin 1.5s linear infinite',
//                 }} 
//               />
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                 }}
//               >
//                 {source === "cache" ? (
//                   <Cached 
//                     sx={{ 
//                       fontSize: isMobile ? 30 : 40,
//                       color: 'rgba(255,255,255,0.9)',
//                     }} 
//                   />
//                 ) : (
//                   <AutoAwesome 
//                     sx={{ 
//                       fontSize: isMobile ? 30 : 40,
//                       color: 'rgba(255,255,255,0.9)',
//                       animation: 'pulse 2s ease-in-out infinite',
//                     }} 
//                   />
//                 )}
//               </Box>
//             </Box>

//             {/* Text content */}
//             <Typography 
//               variant={isMobile ? "h6" : "h5"} 
//               fontWeight="700"
//               gutterBottom
//               sx={{ 
//                 color: 'white',
//                 mb: 1
//               }}
//             >
//               {source === "cache" ? "Loading from Cache" : "Crafting Your Lesson"}
//             </Typography>
            
//             <Typography 
//               variant={isMobile ? "body2" : "body1"} 
//               sx={{ 
//                 color: 'rgba(255,255,255,0.9)',
//                 mb: 2,
//                 maxWidth: 400
//               }}
//             >
//               {source === "cache" 
//                 ? "Retrieving your previously generated content..." 
//                 : "AI is generating personalized content tailored to your learning style..."}
//             </Typography>

//             {/* Status chip */}
//             <Chip 
//               icon={source === "cache" ? <Cached /> : <AutoAwesome />}
//               label={source === "cache" ? "Loading from Cache" : "AI Generating"}
//               color={source === "cache" ? "default" : "warning"}
//               variant="filled"
//               sx={{ 
//                 background: source === "cache" 
//                   ? 'rgba(255,255,255,0.2)' 
//                   : 'rgba(255,193,7,0.2)',
//                 color: 'white',
//                 border: '1px solid rgba(255,255,255,0.3)',
//                 fontWeight: 600,
//                 backdropFilter: 'blur(10px)'
//               }}
//             />
//           </Box>

//           {/* CSS Animations */}
//           <style jsx>{`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
            
//             @keyframes pulse {
//               0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
//               50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
//               100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
//             }
            
//             @keyframes float {
//               0%, 100% { transform: translateY(0px) rotate(0deg); }
//               50% { transform: translateY(-10px) rotate(180deg); }
//             }
//           `}</style>
//         </Box>
//       </Fade>
//     );
//   }

//   // Initial Loading State (when loading the entire page)
//   return (
//     <Fade in={true} timeout={800}>
//       <Box 
//         sx={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           height: '100vh', 
//           flexDirection: 'column', 
//           gap: 4,
//           background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//           position: 'relative',
//           overflow: 'hidden'
//         }}
//       >
//         {/* Background elements */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '10%',
//             left: '10%',
//             width: 120,
//             height: 120,
//             borderRadius: '50%',
//             background: 'radial-gradient(circle, rgba(103, 126, 234, 0.1) 0%, rgba(103, 126, 234, 0) 70%)',
//             animation: 'float 8s ease-in-out infinite',
//           }}
//         />
//         <Box
//           sx={{
//             position: 'absolute',
//             bottom: '15%',
//             right: '15%',
//             width: 100,
//             height: 100,
//             borderRadius: '50%',
//             background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, rgba(118, 75, 162, 0) 70%)',
//             animation: 'float 10s ease-in-out infinite 2s',
//           }}
//         />

//         {/* Main content */}
//         <Box sx={{ 
//           position: 'relative', 
//           zIndex: 1,
//           textAlign: 'center'
//         }}>
//           {/* Animated icon and progress */}
//           <Box sx={{ position: 'relative', mb: 3 }}>
//             <CircularProgress 
//               size={isMobile ? 80 : 100} 
//               thickness={4}
//               sx={{ 
//                 color: 'primary.main',
//                 animation: 'spin 2s linear infinite',
//               }} 
//             />
//             <Box
//               sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 animation: 'pulse 3s ease-in-out infinite',
//               }}
//             >
//               <School 
//                 sx={{ 
//                   fontSize: isMobile ? 40 : 50,
//                   color: 'primary.main',
//                 }} 
//               />
//             </Box>
//           </Box>

//           {/* Text content */}
//           <Typography 
//             variant={isMobile ? "h5" : "h4"} 
//             fontWeight="800"
//             gutterBottom
//             sx={{ 
//               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//               backgroundClip: 'text',
//               WebkitBackgroundClip: 'text',
//               color: 'transparent',
//               mb: 2
//             }}
//           >
//             Preparing Your Learning Journey
//           </Typography>
          
//           <Typography 
//             variant={isMobile ? "body1" : "h6"} 
//             color="text.secondary"
//             sx={{ 
//               mb: 3,
//               maxWidth: 400
//             }}
//           >
//             Loading your personalized learning experience...
//           </Typography>

//           {/* Progress dots */}
//           <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
//             {[0, 1, 2].map((dot) => (
//               <Box
//                 key={dot}
//                 sx={{
//                   width: 8,
//                   height: 8,
//                   borderRadius: '50%',
//                   backgroundColor: 'primary.main',
//                   animation: `bounce 1.4s ease-in-out ${dot * 0.2}s infinite both`,
//                 }}
//               />
//             ))}
//           </Box>
//         </Box>

//         {/* CSS Animations */}
//         <style jsx>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
          
//           @keyframes pulse {
//             0% { transform: translate(-50%, -50%) scale(1); }
//             50% { transform: translate(-50%, -50%) scale(1.1); }
//             100% { transform: translate(-50%, -50%) scale(1); }
//           }
          
//           @keyframes float {
//             0%, 100% { transform: translateY(0px) rotate(0deg); }
//             50% { transform: translateY(-15px) rotate(180deg); }
//           }
          
//           @keyframes bounce {
//             0%, 80%, 100% { 
//               transform: scale(0);
//               opacity: 0.5;
//             }
//             40% { 
//               transform: scale(1);
//               opacity: 1;
//             }
//           }
//         `}</style>
//       </Box>
//     </Fade>
//   );
// };

// export default LoadingState;


import React from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Fade
} from "@mui/material";
import { 
  AutoAwesome, 
  Cached,
  School 
} from "@mui/icons-material";

const LoadingState = ({ isContentLoading = false, source = "ai" }) => {
  // Content Loading State
  if (isContentLoading) {
    return (
      <Fade in={true} timeout={500}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '300px', 
            flexDirection: 'column', 
            gap: 3,
            background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
            borderRadius: 3,
            p: 3
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
              }} 
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {source === "cache" ? (
                <Cached 
                  sx={{ 
                    fontSize: 24,
                    color: 'rgba(255,255,255,0.9)',
                  }} 
                />
              ) : (
                <AutoAwesome 
                  sx={{ 
                    fontSize: 24,
                    color: 'rgba(255,255,255,0.9)',
                  }} 
                />
              )}
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              fontWeight="600"
              sx={{ 
                color: 'white',
                mb: 1
              }}
            >
              {source === "cache" ? "Loading Content" : "Generating Lesson"}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {source === "cache" 
                ? "Getting your saved content..." 
                : "Creating personalized learning material..."}
            </Typography>
          </Box>
        </Box>
      </Fade>
    );
  }

  // Initial Loading State
  return (
    <Fade in={true} timeout={500}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          flexDirection: 'column', 
          gap: 3,
          background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress 
            size={80} 
            thickness={4}
            sx={{ 
              color: '#7C3AED',
            }} 
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <School 
              sx={{ 
                fontSize: 32,
                color: '#7C3AED',
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h5" 
            fontWeight="700"
            sx={{ 
              color: '#7C3AED',
              mb: 1
            }}
          >
            Preparing Learning
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            Loading your personalized experience...
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingState;