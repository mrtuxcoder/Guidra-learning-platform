
// import React from 'react';
// import {
//   Box,
//   Button,
//   Chip,
//   Tooltip,
//   Card,
//   CircularProgress,
//   useTheme,
//   useMediaQuery
// } from "@mui/material";
// import {
//   AutoAwesome,
//   Lock,
//   CheckCircle,
//   Refresh,
//   Cached
// } from "@mui/icons-material";

// const LearningHeader = ({
//   selectedTopic,
//   selectedSubtopic,
//   updatingSubtopic,
//   contentInfo,
//   remainingGenerations,
//   maxGenerations,
//   contentLoading,
//   onRegenerateContent,
//   onCompleteSubtopic,
//   onUpdateUnderstanding
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   if (!selectedSubtopic) return null;

//   return (
//     <Card sx={{
//       borderRadius: 2,
//       boxShadow: 1,
//       background: 'white',
//       border: '1px solid rgba(126, 87, 194, 0.1)',
//     }}>
//       <Box sx={{
//         p: 1.5,
//       }}>
        
//         {/* MOBILE VIEW - Minimal icons only */}
//         {isMobile ? (
//           <Box sx={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'space-between',
//             gap: 1
//           }}>
//             {/* Left side: Status icons */}
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: 1,
//               flex: 1
//             }}>
//               {/* Completed status */}
//               {selectedSubtopic.completed && (
//                 <Tooltip title="Topic completed">
//                   <CheckCircle 
//                     sx={{ 
//                       fontSize: 20,
//                       color: '#4CAF50'
//                     }} 
//                   />
//                 </Tooltip>
//               )}

//               {/* Content source */}
//               <Tooltip title={contentInfo?.source === "cache" ? "Cached content" : "AI generated"}>
//                 {contentInfo?.source === "cache" ? (
//                   <Cached 
//                     sx={{ 
//                       fontSize: 18,
//                       color: '#7C3AED'
//                     }} 
//                   />
//                 ) : (
//                   <AutoAwesome 
//                     sx={{ 
//                       fontSize: 18,
//                       color: '#FF9800'
//                     }} 
//                   />
//                 )}
//               </Tooltip>

//               {/* Version badge */}
//               <Chip
//                 label={`v${contentInfo?.version || 1}`}
//                 size="small"
//                 sx={{
//                   height: 20,
//                   fontSize: '0.6rem',
//                   fontWeight: 600,
//                   background: 'rgba(126, 87, 194, 0.1)',
//                   color: '#7C3AED'
//                 }}
//               />
//             </Box>

//             {/* Right side: Actions */}
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: 1
//             }}>
//               {/* Regenerate button */}
//               <Tooltip title={
//                 remainingGenerations === 0
//                   ? `No generations left`
//                   : `${remainingGenerations} generations left`
//               }>
//                 <Button
//                   onClick={onRegenerateContent}
//                   disabled={contentLoading || remainingGenerations === 0}
//                   variant="outlined"
//                   size="small"
//                   sx={{
//                     minWidth: 'auto',
//                     width: 36,
//                     height: 36,
//                     borderRadius: '50%',
//                     p: 0,
//                     borderColor: remainingGenerations === 0 ? '#f44336' : '#7C3AED',
//                     color: remainingGenerations === 0 ? '#f44336' : '#7C3AED',
//                     '&:hover': {
//                       background: remainingGenerations === 0 ? 'rgba(244, 67, 54, 0.04)' : 'rgba(124, 58, 237, 0.04)'
//                     }
//                   }}
//                 >
//                   {contentLoading ? (
//                     <CircularProgress size={16} />
//                   ) : remainingGenerations === 0 ? (
//                     <Lock sx={{ fontSize: 18 }} />
//                   ) : (
//                     <AutoAwesome sx={{ fontSize: 18 }} />
//                   )}
//                 </Button>
//               </Tooltip>

//               {/* Complete button */}
//               {!selectedSubtopic.completed && (
//                 <Tooltip title="Mark as complete">
//                   <Button
//                     onClick={() => onCompleteSubtopic(selectedSubtopic)}
//                     disabled={
//                       updatingSubtopic === selectedSubtopic.name ||
//                       !selectedSubtopic.understandingLevel ||
//                       selectedSubtopic.understandingLevel < 1
//                     }
//                     variant="contained"
//                     size="small"
//                     sx={{
//                       minWidth: 'auto',
//                       width: 36,
//                       height: 36,
//                       borderRadius: '50%',
//                       p: 0,
//                       background: '#4CAF50',
//                       '&:hover': {
//                         background: '#45a049'
//                       }
//                     }}
//                   >
//                     {updatingSubtopic === selectedSubtopic.name ? (
//                       <CircularProgress size={16} sx={{ color: 'white' }} />
//                     ) : (
//                       <CheckCircle sx={{ fontSize: 18, color: 'white' }} />
//                     )}
//                   </Button>
//                 </Tooltip>
//               )}
//             </Box>
//           </Box>
//         ) : (
//           /* DESKTOP VIEW - Full layout */
//           <Box sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             gap: 2
//           }}>
//             {/* Title Area */}
//             <Box sx={{ flex: 1 }}>
//               <Box sx={{ 
//                 fontSize: '1.25rem', 
//                 fontWeight: 600, 
//                 color: '#7C3AED',
//                 mb: 0.5
//               }}>
//                 {selectedSubtopic.name}
//               </Box>
//               <Box sx={{ 
//                 fontSize: '0.875rem', 
//                 color: 'text.secondary' 
//               }}>
//                 {selectedTopic}
//               </Box>
//             </Box>

//             {/* Actions Area */}
//             <Box sx={{
//               display: 'flex',
//               gap: 1.5,
//               alignItems: 'center'
//             }}>
//               {/* Status chips */}
//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 {selectedSubtopic.completed && (
//                   <Chip
//                     icon={<CheckCircle />}
//                     label="Completed"
//                     color="success"
//                     size="small"
//                     sx={{ fontSize: '0.75rem' }}
//                   />
//                 )}
//                 <Chip
//                   icon={contentInfo?.source === "cache" ? <Cached /> : <AutoAwesome />}
//                   label={contentInfo?.source === "cache" ? "Cached" : "AI"}
//                   size="small"
//                   sx={{ fontSize: '0.75rem' }}
//                 />
//               </Box>

//               {/* Regenerate button */}
//               <Tooltip title={
//                 remainingGenerations === 0
//                   ? `No generations left`
//                   : `${remainingGenerations} generations left`
//               }>
//                 <Button
//                   startIcon={
//                     remainingGenerations === 0
//                       ? <Lock />
//                       : contentLoading ? <CircularProgress size={16} /> : <AutoAwesome />
//                   }
//                   onClick={onRegenerateContent}
//                   disabled={contentLoading || remainingGenerations === 0}
//                   variant="outlined"
//                   size="small"
//                   sx={{
//                     borderColor: remainingGenerations === 0 ? '#f44336' : '#7C3AED',
//                     color: remainingGenerations === 0 ? '#f44336' : '#7C3AED'
//                   }}
//                 >
//                   {contentLoading ? "..." : "Regenerate"}
//                 </Button>
//               </Tooltip>

//               {/* Complete button */}
//               {!selectedSubtopic.completed && (
//                 <Button
//                   startIcon={updatingSubtopic === selectedSubtopic.name ? 
//                     <CircularProgress size={16} /> 
//                     : <CheckCircle />
//                   }
//                   onClick={() => onCompleteSubtopic(selectedSubtopic)}
//                   disabled={
//                     updatingSubtopic === selectedSubtopic.name ||
//                     !selectedSubtopic.understandingLevel ||
//                     selectedSubtopic.understandingLevel < 1
//                   }
//                   variant="contained"
//                   size="small"
//                   sx={{
//                     background: '#4CAF50',
//                     '&:hover': {
//                       background: '#45a049'
//                     }
//                   }}
//                 >
//                   {updatingSubtopic === selectedSubtopic.name ? "..." : "Complete"}
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         )}
//       </Box>
//     </Card>
//   );
// };

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
  Menu
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
  onOpenSidebar, // New prop for sidebar toggle
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

  // Mobile View - Fixed Footer Style
  if (isMobile) {
    return (
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid rgba(126, 87, 194, 0.1)',
        p: 1.5,
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        height: '100px' // Fixed height to prevent space
      }}>
        {/* Top Row: Navigation + Sidebar Button */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1
        }}>
          {/* Sidebar Button */}
          <IconButton
            onClick={onOpenSidebar}
            size="small"
            sx={{
              color: colorPalette[600],
              background: colorPalette[50],
              '&:hover': {
                background: colorPalette[100]
              }
            }}
          >
            <Menu sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Navigation */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            flex: 1,
            justifyContent: 'center',
            mx: 1
          }}>
            <Button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 'auto',
                width: 32,
                height: 32,
                borderRadius: '50%',
                p: 0,
                borderColor: hasPrevious ? colorPalette[600] : '#ccc',
                color: hasPrevious ? colorPalette[600] : '#ccc'
              }}
            >
              <NavigateBefore sx={{ fontSize: 18 }} />
            </Button>

            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontWeight: 600
              }}>
                {currentIndex >= 0 ? `${currentIndex + 1} / ${subtopics.length}` : '1 / 1'}
              </Typography>
              <Typography variant="body2" sx={{ 
                fontWeight: 600,
                color: colorPalette[600],
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.2
              }}>
                {selectedSubtopic.name}
              </Typography>
            </Box>

            <Button
              onClick={handleNext}
              disabled={!hasNext}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 'auto',
                width: 32,
                height: 32,
                borderRadius: '50%',
                p: 0,
                borderColor: hasNext ? colorPalette[600] : '#ccc',
                color: hasNext ? colorPalette[600] : '#ccc'
              }}
            >
              <NavigateNext sx={{ fontSize: 18 }} />
            </Button>
          </Box>

          {/* Regeneration Counter */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minWidth: 40
          }}>
            <Typography variant="caption" sx={{ 
              color: remainingGenerations === 0 ? '#f44336' : colorPalette[600],
              fontSize: '0.65rem',
              fontWeight: 700
            }}>
              {remainingGenerations}/{maxGenerations}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              fontSize: '0.55rem'
            }}>
              Regens
            </Typography>
          </Box>
        </Box>

        {/* Bottom Row: Actions */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 1
        }}>
          {/* Left side: Status icons */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1
          }}>
            {/* Completed status */}
            {selectedSubtopic.completed && (
              <Tooltip title="Topic completed">
                <CheckCircle 
                  sx={{ 
                    fontSize: 18,
                    color: '#4CAF50'
                  }} 
                />
              </Tooltip>
            )}

            {/* Content source */}
            <Tooltip title={contentInfo?.source === "cache" ? "Cached content" : "AI generated"}>
              {contentInfo?.source === "cache" ? (
                <Cached 
                  sx={{ 
                    fontSize: 16,
                    color: colorPalette[600]
                  }} 
                />
              ) : (
                <AutoAwesome 
                  sx={{ 
                    fontSize: 16,
                    color: '#FF9800'
                  }} 
                />
              )}
            </Tooltip>
          </Box>

          {/* Right side: Actions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1
          }}>
            {/* Regenerate button */}
            <Tooltip title={
              remainingGenerations === 0
                ? `No generations left`
                : `${remainingGenerations} generations left`
            }>
              <Button
                onClick={onRegenerateContent}
                disabled={contentLoading || remainingGenerations === 0}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 'auto',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  p: 0,
                  borderColor: remainingGenerations === 0 ? '#f44336' : colorPalette[600],
                  color: remainingGenerations === 0 ? '#f44336' : colorPalette[600],
                }}
              >
                {contentLoading ? (
                  <CircularProgress size={16} />
                ) : remainingGenerations === 0 ? (
                  <Lock sx={{ fontSize: 16 }} />
                ) : (
                  <AutoAwesome sx={{ fontSize: 16 }} />
                )}
              </Button>
            </Tooltip>

            {/* Complete button */}
            {!selectedSubtopic.completed && (
              <Tooltip title="Mark as complete">
                <Button
                  onClick={() => onCompleteSubtopic(selectedSubtopic)}
                  disabled={
                    updatingSubtopic === selectedSubtopic.name ||
                    !selectedSubtopic.understandingLevel ||
                    selectedSubtopic.understandingLevel < 1
                  }
                  variant="contained"
                  size="small"
                  sx={{
                    minWidth: 'auto',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    p: 0,
                    background: '#4CAF50',
                  }}
                >
                  {updatingSubtopic === selectedSubtopic.name ? (
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                  ) : (
                    <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                  )}
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    );
  }



  // Desktop View - Normal Header
  return (
    <Card sx={{
      borderRadius: 2,
      boxShadow: 1,
      background: 'white',
      border: '1px solid rgba(126, 87, 194, 0.1)',
    }}>
      <Box sx={{ p: 1.5 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}>
          {/* Title Area */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              color: '#7C3AED',
              mb: 0.5
            }}>
              {selectedSubtopic.name}
            </Box>
            <Box sx={{ 
              fontSize: '0.875rem', 
              color: 'text.secondary' 
            }}>
              {selectedTopic}
            </Box>
          </Box>

          {/* Navigation Area */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1
          }}>
            <Button
              startIcon={<NavigateBefore />}
              onClick={handlePrevious}
              disabled={!hasPrevious}
              variant="outlined"
              size="small"
              sx={{
                borderColor: hasPrevious ? '#7C3AED' : '#ccc',
                color: hasPrevious ? '#7C3AED' : '#ccc',
                minWidth: 100
              }}
            >
              Previous
            </Button>

            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              mx: 1,
              fontWeight: 600
            }}>
              {currentIndex + 1} of {subtopics.length}
            </Typography>

            <Button
              endIcon={<NavigateNext />}
              onClick={handleNext}
              disabled={!hasNext}
              variant="outlined"
              size="small"
              sx={{
                borderColor: hasNext ? '#7C3AED' : '#ccc',
                color: hasNext ? '#7C3AED' : '#ccc',
                minWidth: 100
              }}
            >
              Next
            </Button>
          </Box>

          {/* Actions Area */}
          <Box sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center'
          }}>
            {/* Status chips */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {selectedSubtopic.completed && (
                <Chip
                  icon={<CheckCircle />}
                  label="Completed"
                  color="success"
                  size="small"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
              <Chip
                icon={contentInfo?.source === "cache" ? <Cached /> : <AutoAwesome />}
                label={contentInfo?.source === "cache" ? "Cached" : "AI"}
                size="small"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>

            {/* Regenerate button */}
            <Tooltip title={
              remainingGenerations === 0
                ? `No generations left`
                : `${remainingGenerations} generations left`
            }>
              <Button
                startIcon={
                  remainingGenerations === 0
                    ? <Lock />
                    : contentLoading ? <CircularProgress size={16} /> : <AutoAwesome />
                }
                onClick={onRegenerateContent}
                disabled={contentLoading || remainingGenerations === 0}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: remainingGenerations === 0 ? '#f44336' : '#7C3AED',
                  color: remainingGenerations === 0 ? '#f44336' : '#7C3AED'
                }}
              >
                {contentLoading ? "..." : "Regenerate"}
              </Button>
            </Tooltip>

            {/* Complete button */}
            {!selectedSubtopic.completed && (
              <Button
                startIcon={updatingSubtopic === selectedSubtopic.name ? 
                  <CircularProgress size={16} /> 
                  : <CheckCircle />
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
                  background: '#4CAF50',
                }}
              >
                {updatingSubtopic === selectedSubtopic.name ? "..." : "Complete"}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default LearningHeader;