// import React from 'react';
// import {
//   Box,
//   Button,
//   Chip,
//   Tooltip,
//   Card,
//   CircularProgress,
//   Typography,
//   useTheme,
//   useMediaQuery,
//   IconButton
// } from "@mui/material";
// import {
//   AutoAwesome,
//   Lock,
//   CheckCircle,
//   Cached,
//   NavigateBefore,
//   NavigateNext,
//   Menu
// } from "@mui/icons-material";

// const LearningHeader = ({
//   selectedTopic,
//   selectedSubtopic,
//   subtopics = [],
//   updatingSubtopic,
//   contentInfo,
//   remainingGenerations,
//   maxGenerations,
//   contentLoading,
//   onRegenerateContent,
//   onCompleteSubtopic,
//   onNavigateSubtopic,
//   onOpenSidebar, // New prop for sidebar toggle
//   colorPalette
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   if (!selectedSubtopic) return null;

//   // Find current subtopic index and calculate navigation
//   const currentIndex = subtopics.findIndex(sub => sub.name === selectedSubtopic.name);
//   const hasPrevious = currentIndex > 0;
//   const hasNext = currentIndex < subtopics.length - 1 && currentIndex >= 0;
//   const previousSubtopic = hasPrevious ? subtopics[currentIndex - 1] : null;
//   const nextSubtopic = hasNext ? subtopics[currentIndex + 1] : null;

//   const handlePrevious = () => {
//     if (hasPrevious && previousSubtopic) {
//       onNavigateSubtopic(previousSubtopic);
//     }
//   };

//   const handleNext = () => {
//     if (hasNext && nextSubtopic) {
//       onNavigateSubtopic(nextSubtopic);
//     }
//   };

//  // Mobile View - Premium Dock with Progress Bar
// if (isMobile) {
//   const progress = ((currentIndex + 1) / subtopics.length) * 100;
  
//   return (
//     <Box sx={{
//       position: 'fixed',
//       bottom: 0,
//       left: 0,
//       right: 0,
//       background: 'rgba(255, 255, 255, 0.95)',
//       backdropFilter: 'blur(30px)',
//       borderTop: '1px solid rgba(126, 87, 194, 0.15)',
//       zIndex: 1000,
//       height: '80px',
//       display: 'flex',
//       flexDirection: 'column'
//     }}>
//       {/* Progress Bar */}
//       <Box sx={{
//         width: '100%',
//         height: '3px',
//         background: 'rgba(126, 87, 194, 0.1)',
//         position: 'relative',
//         overflow: 'hidden'
//       }}>
//         <Box sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           height: '100%',
//           background: `linear-gradient(90deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`,
//           width: `${progress}%`,
//           transition: 'width 0.3s ease',
//           '&::after': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             right: 0,
//             height: '100%',
//             width: '20px',
//             background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 100%)'
//           }
//         }} />
//       </Box>

//       {/* Main Dock */}
//       <Box sx={{
//         flex: 1,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         px: 2,
//         py: 1
//       }}>
        
//         {/* Left Section - Navigation & Progress */}
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: 1.5
//         }}>
//           {/* Menu Button */}
//           <Tooltip title="Menu">
//             <IconButton
//               onClick={onOpenSidebar}
//               sx={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: '12px',
//                 background: 'linear-gradient(135deg, rgba(126, 87, 194, 0.1) 0%, rgba(126, 87, 194, 0.05) 100%)',
//                 color: colorPalette[600],
//                 border: '1px solid rgba(126, 87, 194, 0.1)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, rgba(126, 87, 194, 0.2) 0%, rgba(126, 87, 194, 0.1) 100%)',
//                   transform: 'translateY(-1px)',
//                   boxShadow: '0 4px 12px rgba(126, 87, 194, 0.15)'
//                 },
//                 transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
//               }}
//             >
//               <Menu sx={{ fontSize: 20 }} />
//             </IconButton>
//           </Tooltip>

//           {/* Navigation Controls */}
//           <Box sx={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             background: 'rgba(126, 87, 194, 0.05)',
//             borderRadius: '14px',
//             p: 0.5,
//             border: '1px solid rgba(126, 87, 194, 0.1)'
//           }}>
//             <Tooltip title="Previous">
//               <IconButton
//                 onClick={handlePrevious}
//                 disabled={!hasPrevious}
//                 size="small"
//                 sx={{
//                   width: 36,
//                   height: 36,
//                   borderRadius: '10px',
//                   color: hasPrevious ? colorPalette[600] : 'rgba(0,0,0,0.2)',
//                   background: hasPrevious ? 'rgba(126, 87, 194, 0.1)' : 'transparent',
//                   '&:hover': hasPrevious ? {
//                     background: 'rgba(126, 87, 194, 0.2)',
//                     transform: 'scale(1.1)'
//                   } : {},
//                   transition: 'all 0.2s ease'
//                 }}
//               >
//                 <NavigateBefore sx={{ fontSize: 18 }} />
//               </IconButton>
//             </Tooltip>

//             {/* Progress Indicator */}
//             <Box sx={{ 
//               px: 1.5,
//               textAlign: 'center',
//               minWidth: 50
//             }}>
//               <Typography variant="caption" sx={{ 
//                 color: colorPalette[600],
//                 fontSize: '0.8rem',
//                 fontWeight: 800,
//                 lineHeight: 1,
//                 display: 'block'
//               }}>
//                 {currentIndex >= 0 ? currentIndex + 1 : 1}
//               </Typography>
//               <Typography variant="caption" sx={{ 
//                 color: colorPalette[500],
//                 fontSize: '0.65rem',
//                 fontWeight: 600,
//                 lineHeight: 1,
//                 display: 'block'
//               }}>
//                 of {subtopics.length}
//               </Typography>
//             </Box>

//             <Tooltip title="Next">
//               <IconButton
//                 onClick={handleNext}
//                 disabled={!hasNext}
//                 size="small"
//                 sx={{
//                   width: 36,
//                   height: 36,
//                   borderRadius: '10px',
//                   color: hasNext ? colorPalette[600] : 'rgba(0,0,0,0.2)',
//                   background: hasNext ? 'rgba(126, 87, 194, 0.1)' : 'transparent',
//                   '&:hover': hasNext ? {
//                     background: 'rgba(126, 87, 194, 0.2)',
//                     transform: 'scale(1.1)'
//                   } : {},
//                   transition: 'all 0.2s ease'
//                 }}
//               >
//                 <NavigateNext sx={{ fontSize: 18 }} />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>

//         {/* Right Section - Actions */}
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: 1
//         }}>
//           {/* Regeneration System */}
//           <Tooltip title={`${remainingGenerations} regenerations available`}>
//             <Box sx={{ 
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1,
//               background: remainingGenerations === 0 
//                 ? 'rgba(244, 67, 54, 0.08)' 
//                 : 'rgba(126, 87, 194, 0.08)',
//               borderRadius: '12px',
//               px: 1.5,
//               py: 0.75,
//               border: remainingGenerations === 0 
//                 ? '1px solid rgba(244, 67, 54, 0.2)' 
//                 : '1px solid rgba(126, 87, 194, 0.2)'
//             }}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography variant="caption" sx={{ 
//                   color: remainingGenerations === 0 ? '#f44336' : colorPalette[600],
//                   fontSize: '0.75rem',
//                   fontWeight: 800,
//                   lineHeight: 1,
//                   display: 'block'
//                 }}>
//                   {remainingGenerations}
//                 </Typography>
//                 <Typography variant="caption" sx={{ 
//                   color: remainingGenerations === 0 ? '#f44336' : colorPalette[500],
//                   fontSize: '0.55rem',
//                   fontWeight: 700,
//                   lineHeight: 1,
//                   display: 'block'
//                 }}>
//                   REGEN
//                 </Typography>
//               </Box>
              
//               <IconButton
//                 onClick={onRegenerateContent}
//                 disabled={contentLoading || remainingGenerations === 0}
//                 size="small"
//                 sx={{
//                   width: 32,
//                   height: 32,
//                   borderRadius: '8px',
//                   color: remainingGenerations === 0 ? '#f44336' : colorPalette[600],
//                   background: remainingGenerations === 0 
//                     ? 'rgba(244, 67, 54, 0.1)' 
//                     : 'rgba(126, 87, 194, 0.1)',
//                   '&:hover': !contentLoading && remainingGenerations > 0 ? {
//                     background: 'rgba(126, 87, 194, 0.2)',
//                     transform: 'scale(1.1)'
//                   } : {},
//                   transition: 'all 0.2s ease'
//                 }}
//               >
//                 {contentLoading ? (
//                   <CircularProgress size={14} />
//                 ) : remainingGenerations === 0 ? (
//                   <Lock sx={{ fontSize: 16 }} />
//                 ) : (
//                   <AutoAwesome sx={{ fontSize: 16 }} />
//                 )}
//               </IconButton>
//             </Box>
//           </Tooltip>

//           {/* Complete Button */}
//           {!selectedSubtopic.completed && (
//             <Tooltip title="Mark as complete">
//               <IconButton
//                 onClick={() => onCompleteSubtopic(selectedSubtopic)}
//                 disabled={
//                   updatingSubtopic === selectedSubtopic.name ||
//                   !selectedSubtopic.understandingLevel ||
//                   selectedSubtopic.understandingLevel < 1
//                 }
//                 sx={{
//                   width: 44,
//                   height: 44,
//                   borderRadius: '12px',
//                   background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
//                   color: 'white',
//                   border: '1px solid rgba(16, 185, 129, 0.2)',
//                   '&:hover': !updatingSubtopic ? {
//                     background: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
//                   } : {},
//                   transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
//                 }}
//               >
//                 {updatingSubtopic === selectedSubtopic.name ? (
//                   <CircularProgress size={18} sx={{ color: 'white' }} />
//                 ) : (
//                   <CheckCircle sx={{ fontSize: 18 }} />
//                 )}
//               </IconButton>
//             </Tooltip>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// }

//   // Desktop View - Normal Header
//   return (
//     <Card sx={{
//       borderRadius: 2,
//       boxShadow: 1,
//       background: 'white',
//       border: '1px solid rgba(126, 87, 194, 0.1)',
//     }}>
//       <Box sx={{ p: 1.5 }}>
//         <Box sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           gap: 2
//         }}>
//           {/* Title Area */}
//           <Box sx={{ flex: 1 }}>
//             <Box sx={{ 
//               fontSize: '1.25rem', 
//               fontWeight: 600, 
//               color: '#7C3AED',
//               mb: 0.5
//             }}>
//               {selectedSubtopic.name}
//             </Box>
//             <Box sx={{ 
//               fontSize: '0.875rem', 
//               color: 'text.secondary' 
//             }}>
//               {selectedTopic}
//             </Box>
//           </Box>

//           {/* Navigation Area */}
//           <Box sx={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: 1
//           }}>
//             <Button
//               startIcon={<NavigateBefore />}
//               onClick={handlePrevious}
//               disabled={!hasPrevious}
//               variant="outlined"
//               size="small"
//               sx={{
//                 borderColor: hasPrevious ? '#7C3AED' : '#ccc',
//                 color: hasPrevious ? '#7C3AED' : '#ccc',
//                 minWidth: 100
//               }}
//             >
//               Previous
//             </Button>

//             <Typography variant="caption" sx={{ 
//               color: 'text.secondary',
//               mx: 1,
//               fontWeight: 600
//             }}>
//               {currentIndex + 1} of {subtopics.length}
//             </Typography>

//             <Button
//               endIcon={<NavigateNext />}
//               onClick={handleNext}
//               disabled={!hasNext}
//               variant="outlined"
//               size="small"
//               sx={{
//                 borderColor: hasNext ? '#7C3AED' : '#ccc',
//                 color: hasNext ? '#7C3AED' : '#ccc',
//                 minWidth: 100
//               }}
//             >
//               Next
//             </Button>
//           </Box>

//           {/* Actions Area */}
//           <Box sx={{
//             display: 'flex',
//             gap: 1.5,
//             alignItems: 'center'
//           }}>
//             {/* Status chips */}
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               {selectedSubtopic.completed && (
//                 <Chip
//                   icon={<CheckCircle />}
//                   label="Completed"
//                   color="success"
//                   size="small"
//                   sx={{ fontSize: '0.75rem' }}
//                 />
//               )}
//               <Chip
//                 icon={contentInfo?.source === "cache" ? <Cached /> : <AutoAwesome />}
//                 label={contentInfo?.source === "cache" ? "Cached" : "AI"}
//                 size="small"
//                 sx={{ fontSize: '0.75rem' }}
//               />
//             </Box>

//             {/* Regenerate button */}
//             <Tooltip title={
//               remainingGenerations === 0
//                 ? `No generations left`
//                 : `${remainingGenerations} generations left`
//             }>
//               <Button
//                 startIcon={
//                   remainingGenerations === 0
//                     ? <Lock />
//                     : contentLoading ? <CircularProgress size={16} /> : <AutoAwesome />
//                 }
//                 onClick={onRegenerateContent}
//                 disabled={contentLoading || remainingGenerations === 0}
//                 variant="outlined"
//                 size="small"
//                 sx={{
//                   borderColor: remainingGenerations === 0 ? '#f44336' : '#7C3AED',
//                   color: remainingGenerations === 0 ? '#f44336' : '#7C3AED'
//                 }}
//               >
//                 {contentLoading ? "..." : "Regenerate"}
//               </Button>
//             </Tooltip>

//             {/* Complete button */}
//             {!selectedSubtopic.completed && (
//               <Button
//                 startIcon={updatingSubtopic === selectedSubtopic.name ? 
//                   <CircularProgress size={16} /> 
//                   : <CheckCircle />
//                 }
//                 onClick={() => onCompleteSubtopic(selectedSubtopic)}
//                 disabled={
//                   updatingSubtopic === selectedSubtopic.name ||
//                   !selectedSubtopic.understandingLevel ||
//                   selectedSubtopic.understandingLevel < 1
//                 }
//                 variant="contained"
//                 size="small"
//                 sx={{
//                   background: '#4CAF50',
//                 }}
//               >
//                 {updatingSubtopic === selectedSubtopic.name ? "..." : "Complete"}
//               </Button>
//             )}
//           </Box>
//         </Box>
//       </Box>
//     </Card>
//   );
// };

// export default LearningHeader;

import React from 'react';
import {
  Box,
  Button,
  Chip,
  Tooltip,
  Card,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton
} from "@mui/material";
import {
  AutoAwesome,
  Lock,
  CheckCircle,
  Cached,
  NavigateBefore,
  NavigateNext,
  Menu,
  Refresh
} from "@mui/icons-material";

const LearningHeader = ({
  selectedTopic,
  selectedSubtopic,
  subtopics = [],
  updatingSubtopic,
  contentInfo,
  remainingGenerations,
  maxGenerations,
  contentLoading,
  onRegenerateContent,
  onCompleteSubtopic,
  onNavigateSubtopic,
  onOpenSidebar,
  colorPalette
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!selectedSubtopic) return null;

  // Find current subtopic index and calculate navigation
  const currentIndex = subtopics.findIndex(sub => sub.name === selectedSubtopic.name);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < subtopics.length - 1 && currentIndex >= 0;
  const previousSubtopic = hasPrevious ? subtopics[currentIndex - 1] : null;
  const nextSubtopic = hasNext ? subtopics[currentIndex + 1] : null;

  const handlePrevious = () => {
    if (hasPrevious && previousSubtopic) {
      onNavigateSubtopic(previousSubtopic);
    }
  };

  const handleNext = () => {
    if (hasNext && nextSubtopic) {
      onNavigateSubtopic(nextSubtopic);
    }
  };

  // Mobile View - Compact Floating Capsule Footer
  if (isMobile) {
    const progress = ((currentIndex + 1) / subtopics.length) * 100;
    
    return (
      <Box sx={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(126, 87, 194, 0.15)',
        borderRadius: '24px',
        zIndex: 1000,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: `
          0 12px 32px rgba(126, 87, 194, 0.18),
          0 4px 16px rgba(0, 0, 0, 0.08),
          0 2px 8px rgba(0, 0, 0, 0.04)
        `,
        minWidth: '320px',
        maxWidth: 'calc(100vw - 32px)',
        overflow: 'hidden',
      }}>
        {/* Floating Progress Indicator */}
        <Box sx={{
          position: 'absolute',
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(90deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`,
          height: '2px',
          width: `${progress}%`,
          maxWidth: '260px',
          borderRadius: '1px',
          boxShadow: '0 1px 4px rgba(126, 87, 194, 0.3)',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />

        {/* Main Footer Content */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          height: '100%',
        }}>
          
          {/* Left Section - Navigation */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1
          }}>
            {/* Menu Button */}
            <Tooltip title="Course Menu" placement="top">
              <IconButton
                onClick={onOpenSidebar}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: 'rgba(126, 87, 194, 0.08)',
                  color: colorPalette[600],
                  border: '1px solid rgba(126, 87, 194, 0.12)',
                  '&:hover': {
                    background: 'rgba(126, 87, 194, 0.15)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Menu sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            {/* Navigation Controls */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(126, 87, 194, 0.06)',
              borderRadius: '12px',
              p: 0.5,
              border: '1px solid rgba(126, 87, 194, 0.1)'
            }}>
              <Tooltip title="Previous lesson" placement="top">
                <IconButton
                  onClick={handlePrevious}
                  disabled={!hasPrevious}
                  size="small"
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    color: hasPrevious ? colorPalette[600] : 'rgba(126, 87, 194, 0.3)',
                    background: hasPrevious ? 'rgba(126, 87, 194, 0.1)' : 'transparent',
                    '&:hover': hasPrevious ? {
                      background: 'rgba(126, 87, 194, 0.18)',
                      transform: 'scale(1.1)'
                    } : {},
                    transition: 'all 0.2s ease'
                  }}
                >
                  <NavigateBefore sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>

              {/* Progress Indicator */}
              <Tooltip title={`Lesson ${currentIndex + 1} of ${subtopics.length}`} placement="top">
                <Box sx={{ 
                  px: 1.2,
                  textAlign: 'center',
                  minWidth: 40
                }}>
                  <Typography variant="caption" sx={{ 
                    color: colorPalette[700],
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    display: 'block'
                  }}>
                    {currentIndex >= 0 ? currentIndex + 1 : 1}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: colorPalette[500],
                    fontSize: '0.5rem',
                    fontWeight: 600,
                    lineHeight: 1,
                    display: 'block'
                  }}>
                    of {subtopics.length}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Next lesson" placement="top">
                <IconButton
                  onClick={handleNext}
                  disabled={!hasNext}
                  size="small"
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    color: hasNext ? colorPalette[600] : 'rgba(126, 87, 194, 0.3)',
                    background: hasNext ? 'rgba(126, 87, 194, 0.1)' : 'transparent',
                    '&:hover': hasNext ? {
                      background: 'rgba(126, 87, 194, 0.18)',
                      transform: 'scale(1.1)'
                    } : {},
                    transition: 'all 0.2s ease'
                  }}
                >
                  <NavigateNext sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Right Section - Actions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1
          }}>
            {/* Regeneration System */}
            <Tooltip title={
              remainingGenerations === 0 
                ? "No regenerations available" 
                : `${remainingGenerations} regenerations available`
            } placement="top">
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                background: remainingGenerations === 0 
                  ? 'rgba(239, 68, 68, 0.08)' 
                  : 'rgba(126, 87, 194, 0.08)',
                borderRadius: '10px',
                px: 1.2,
                py: 0.4,
                border: remainingGenerations === 0 
                  ? '1px solid rgba(239, 68, 68, 0.15)' 
                  : '1px solid rgba(126, 87, 194, 0.15)'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ 
                    color: remainingGenerations === 0 ? '#ef4444' : colorPalette[600],
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    display: 'block'
                  }}>
                    {remainingGenerations}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: remainingGenerations === 0 ? '#ef4444' : colorPalette[500],
                    fontSize: '0.45rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    display: 'block'
                  }}>
                    REGEN
                  </Typography>
                </Box>
                
                <Tooltip title={remainingGenerations === 0 ? "No regenerations left" : "Regenerate content"} placement="top">
                  <IconButton
                    onClick={onRegenerateContent}
                    disabled={contentLoading || remainingGenerations === 0}
                    size="small"
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '7px',
                      color: remainingGenerations === 0 ? '#ef4444' : colorPalette[600],
                      background: remainingGenerations === 0 
                        ? 'rgba(239, 68, 68, 0.1)' 
                        : 'rgba(126, 87, 194, 0.1)',
                      '&:hover': !contentLoading && remainingGenerations > 0 ? {
                        background: 'rgba(126, 87, 194, 0.18)',
                        transform: 'scale(1.1)'
                      } : {},
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {contentLoading ? (
                      <CircularProgress size={10} />
                    ) : remainingGenerations === 0 ? (
                      <Lock sx={{ fontSize: 12 }} />
                    ) : (
                      <Refresh sx={{ fontSize: 12 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Tooltip>

            {/* Always show a button here - either Complete or Completed Checkmark */}
            {selectedSubtopic.completed ? (
              // Completed Checkmark - Always visible when completed
              <Tooltip title="Lesson completed" placement="top">
                <IconButton
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                    cursor: 'default',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Same color on hover
                      transform: 'none', // No movement on hover
                    }
                  }}
                  disabled // Make it non-interactive
                >
                  <CheckCircle sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            ) : (
              // Complete Button - Shows when subtopic is not completed
              <Tooltip title={
                updatingSubtopic === selectedSubtopic.name 
                  ? "Completing..." 
                  : (!selectedSubtopic.understandingLevel || selectedSubtopic.understandingLevel < 1)
                  ? "Complete the content first"
                  : "Mark as complete"
              } placement="top">
                <IconButton
                  onClick={() => onCompleteSubtopic(selectedSubtopic)}
                  disabled={
                    updatingSubtopic === selectedSubtopic.name ||
                    !selectedSubtopic.understandingLevel ||
                    selectedSubtopic.understandingLevel < 1
                  }
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
                    color: 'white',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                    '&:hover': !updatingSubtopic ? {
                      background: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                    } : {},
                    transition: 'all 0.2s ease'
                  }}
                >
                  {updatingSubtopic === selectedSubtopic.name ? (
                    <CircularProgress size={12} sx={{ color: 'white' }} />
                  ) : (
                    <CheckCircle sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop View - Premium Header (unchanged)
  return (
    <Card sx={{
      borderRadius: 3,
      boxShadow: '0 4px 24px rgba(126, 87, 194, 0.08)',
      background: 'white',
      border: '1px solid rgba(126, 87, 194, 0.1)',
      overflow: 'visible',
      mb: 3
    }}>
      <Box sx={{ p: 2.5 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3
        }}>
          {/* Title Area */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              fontWeight="700"
              sx={{ 
                color: colorPalette[700],
                mb: 0.5,
                background: `linear-gradient(135deg, ${colorPalette[600]} 0%, ${colorPalette[700]} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {selectedSubtopic.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colorPalette[500],
                fontWeight: 500
              }}
            >
              {selectedTopic}
            </Typography>
          </Box>

          {/* Navigation Area */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            background: 'rgba(126, 87, 194, 0.03)',
            borderRadius: 2,
            p: 1,
            border: '1px solid rgba(126, 87, 194, 0.08)'
          }}>
            <Tooltip title="Previous lesson">
              <IconButton
                onClick={handlePrevious}
                disabled={!hasPrevious}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  color: hasPrevious ? colorPalette[600] : 'rgba(126, 87, 194, 0.3)',
                  background: hasPrevious ? 'rgba(126, 87, 194, 0.08)' : 'transparent',
                  '&:hover': hasPrevious ? {
                    background: 'rgba(126, 87, 194, 0.15)',
                    transform: 'scale(1.1)'
                  } : {},
                  transition: 'all 0.2s ease'
                }}
              >
                <NavigateBefore />
              </IconButton>
            </Tooltip>

            {/* Progress */}
            <Box sx={{ textAlign: 'center', minWidth: 60 }}>
              <Typography variant="body2" sx={{ 
                color: colorPalette[700],
                fontWeight: 700,
                lineHeight: 1.2
              }}>
                {currentIndex + 1}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: colorPalette[500],
                fontWeight: 600,
                lineHeight: 1.2
              }}>
                of {subtopics.length}
              </Typography>
            </Box>

            <Tooltip title="Next lesson">
              <IconButton
                onClick={handleNext}
                disabled={!hasNext}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  color: hasNext ? colorPalette[600] : 'rgba(126, 87, 194, 0.3)',
                  background: hasNext ? 'rgba(126, 87, 194, 0.08)' : 'transparent',
                  '&:hover': hasNext ? {
                    background: 'rgba(126, 87, 194, 0.15)',
                    transform: 'scale(1.1)'
                  } : {},
                  transition: 'all 0.2s ease'
                }}
              >
                <NavigateNext />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Actions Area */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center'
          }}>
            {/* Status chips */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {selectedSubtopic.completed && (
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 16 }} />}
                  label="Completed"
                  color="success"
                  size="small"
                  sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white'
                  }}
                />
              )}
              <Chip
                icon={contentInfo?.source === "cache" ? 
                  <Cached sx={{ fontSize: 16 }} /> : 
                  <AutoAwesome sx={{ fontSize: 16 }} />
                }
                label={contentInfo?.source === "cache" ? "Cached" : "AI Generated"}
                size="small"
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'rgba(126, 87, 194, 0.08)',
                  color: colorPalette[600],
                  border: '1px solid rgba(126, 87, 194, 0.2)'
                }}
              />
            </Box>

            {/* Regenerate button */}
            <Tooltip title={
              remainingGenerations === 0
                ? `No regenerations available`
                : `${remainingGenerations} regenerations available`
            }>
              <Button
                startIcon={
                  remainingGenerations === 0
                    ? <Lock sx={{ fontSize: 18 }} />
                    : contentLoading ? <CircularProgress size={18} /> : <Refresh sx={{ fontSize: 18 }} />
                }
                onClick={onRegenerateContent}
                disabled={contentLoading || remainingGenerations === 0}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: remainingGenerations === 0 ? '#ef4444' : colorPalette[500],
                  color: remainingGenerations === 0 ? '#ef4444' : colorPalette[600],
                  background: remainingGenerations === 0 ? 'rgba(239, 68, 68, 0.04)' : 'rgba(126, 87, 194, 0.04)',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    background: remainingGenerations === 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(126, 87, 194, 0.08)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(126, 87, 194, 0.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {contentLoading ? "Regenerating..." : "Regenerate"}
              </Button>
            </Tooltip>

            {/* Complete button */}
            {!selectedSubtopic.completed && (
              <Button
                startIcon={updatingSubtopic === selectedSubtopic.name ? 
                  <CircularProgress size={18} /> 
                  : <CheckCircle sx={{ fontSize: 18 }} />
                }
                onClick={() => onCompleteSubtopic(selectedSubtopic)}
                disabled={
                  updatingSubtopic === selectedSubtopic.name ||
                  !selectedSubtopic.understandingLevel ||
                  selectedSubtopic.understandingLevel < 1
                }
                variant="contained"
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  boxShadow: '0 2px 12px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {updatingSubtopic === selectedSubtopic.name ? "Completing..." : "Complete"}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default LearningHeader;