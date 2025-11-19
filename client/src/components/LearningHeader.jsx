// import React from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   Chip,
//   Tooltip,
//   Card,
//   Rating,
//   CircularProgress,
//   useTheme,
//   useMediaQuery
// } from "@mui/material";
// import {
//   School,
//   AutoAwesome,
//   Lock,
//   CheckCircle,
//   Refresh
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
//   const isXs = useMediaQuery(theme.breakpoints.down('sm')); // very small screens
//   const isSm = useMediaQuery(theme.breakpoints.down('md')); // small / tablet

//   if (!selectedSubtopic) return null;

//   return (
//     <Card sx={{
//       borderRadius: { xs: 2, md: 3 },
//       boxShadow: { xs: 1, md: 3 },
//       mb: 2,
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       color: 'white',
//       position: 'relative',
//       overflow: 'hidden',
//       '&::before': {
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         height: '2px',
//         background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1)',
//       }
//     }}>
//       <Box sx={{
//         p: { xs: 1.5, sm: 2, md: 3 },
//         pt: { xs: 2, sm: 2.5, md: 3 },
//       }}>
        
//         {/* MOBILE VIEW - Compact stylish layout without title */}
//         {isXs ? (
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//             {/* Top Row: Topic + Actions */}
//             <Box sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               gap: 1
//             }}>
//               {/* Topic with icon */}
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
//                 <School sx={{ 
//                   fontSize: 16, 
//                   color: 'rgba(255,255,255,0.9)',
//                   filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
//                 }} />
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: 'rgba(255,255,255,0.95)',
//                     fontWeight: 600,
//                     fontSize: '0.8rem',
//                     letterSpacing: '0.5px'
//                   }}
//                   noWrap
//                 >
//                   {selectedTopic}
//                 </Typography>
//               </Box>

//               {/* Action Buttons */}
//               <Box sx={{ 
//                 display: 'flex', 
//                 gap: 1, 
//                 alignItems: 'center',
//                 flexShrink: 0
//               }}>
//                 {/* Regenerate Button */}
//                 <Tooltip title={
//                   remainingGenerations === 0
//                     ? `Generation limit reached`
//                     : `Generate new content (${remainingGenerations} left)`
//                 }>
//                   <Button
//                     startIcon={
//                       remainingGenerations === 0
//                         ? <Lock sx={{ fontSize: 14 }} />
//                         : contentLoading ? 
//                             <CircularProgress size={12} sx={{ color: 'white' }} /> 
//                             : <AutoAwesome sx={{ fontSize: 14 }} />
//                     }
//                     onClick={onRegenerateContent}
//                     disabled={contentLoading || remainingGenerations === 0}
//                     variant="contained"
//                     color={remainingGenerations === 0 ? "error" : "primary"}
//                     size="small"
//                     sx={{
//                       borderRadius: 2,
//                       px: 1.25,
//                       py: 0.5,
//                       minWidth: 'auto',
//                       fontSize: '0.7rem',
//                       fontWeight: 600,
//                       background: remainingGenerations === 0 
//                         ? 'rgba(239,83,80,0.9)' 
//                         : 'rgba(255,255,255,0.2)',
//                       backdropFilter: 'blur(10px)',
//                       border: '1px solid rgba(255,255,255,0.3)',
//                       color: 'white',
//                       '&:hover': {
//                         background: remainingGenerations === 0 
//                           ? 'rgba(239,83,80,1)' 
//                           : 'rgba(255,255,255,0.3)',
//                         transform: 'translateY(-1px)'
//                       },
//                       transition: 'all 0.2s ease'
//                     }}
//                   >
//                     {contentLoading ? "..." : "New"}
//                   </Button>
//                 </Tooltip>

//                 {/* Complete Button */}
//                 {!selectedSubtopic.completed && (
//                   <Button
//                     variant="contained"
//                     onClick={() => onCompleteSubtopic(selectedSubtopic)}
//                     disabled={
//                       updatingSubtopic === selectedSubtopic.name ||
//                       !selectedSubtopic.understandingLevel ||
//                       selectedSubtopic.understandingLevel < 1
//                     }
//                     startIcon={updatingSubtopic === selectedSubtopic.name ? 
//                       <CircularProgress size={12} sx={{ color: 'white' }} /> 
//                       : <CheckCircle sx={{ fontSize: 14 }} />
//                     }
//                     size="small"
//                     sx={{
//                       borderRadius: 2,
//                       px: 1.25,
//                       py: 0.5,
//                       minWidth: 'auto',
//                       fontSize: '0.7rem',
//                       fontWeight: 600,
//                       background: 'rgba(76,175,80,0.9)',
//                       backdropFilter: 'blur(10px)',
//                       border: '1px solid rgba(255,255,255,0.3)',
//                       color: 'white',
//                       '&:hover': {
//                         background: 'rgba(76,175,80,1)',
//                         transform: 'translateY(-1px)'
//                       },
//                       transition: 'all 0.2s ease'
//                     }}
//                   >
//                     {updatingSubtopic === selectedSubtopic.name ? "..." : "Done"}
//                   </Button>
//                 )}
//               </Box>
//             </Box>

//             {/* Middle Row: Understanding Rating */}
//             <Box sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               gap: 1
//             }}>
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: 'rgba(255,255,255,0.9)',
//                   fontWeight: 600,
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.3px'
//                 }}
//               >
//                 Your understanding:
//               </Typography>

//               <Tooltip title={updatingSubtopic === selectedSubtopic.name ? "Updating..." : "Rate your understanding"}>
//                 <span>
//                   <Rating
//                     value={selectedSubtopic.understandingLevel || 0}
//                     onChange={(event, newValue) => {
//                       if (newValue !== null) onUpdateUnderstanding(selectedSubtopic, newValue);
//                     }}
//                     disabled={updatingSubtopic === selectedSubtopic.name}
//                     size="small"
//                     sx={{
//                       '& .MuiRating-icon': {
//                         fontSize: 18,
//                         color: 'rgba(255,255,255,0.9)',
//                         filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
//                       },
//                       '& .MuiRating-iconEmpty': {
//                         color: 'rgba(255,255,255,0.4)'
//                       }
//                     }}
//                   />
//                 </span>
//               </Tooltip>
//             </Box>

//             {/* Bottom Row: Status Chips */}
//             <Box sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               gap: 0.5
//             }}>
//               {/* Left side chips */}
//               <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', flex: 1 }}>
//                 {selectedSubtopic.completed && (
//                   <Chip
//                     icon={<CheckCircle sx={{ fontSize: 12 }} />}
//                     label="Completed"
//                     color="success"
//                     variant="filled"
//                     size="small"
//                     sx={{
//                       fontSize: '0.6rem',
//                       height: 20,
//                       background: 'rgba(76,175,80,0.9)',
//                       color: 'white',
//                       '& .MuiChip-icon': { fontSize: 12, ml: 0.5 },
//                       fontWeight: 600
//                     }}
//                   />
//                 )}

//                 <Chip
//                   icon={contentInfo?.source === "cache" ? 
//                     <Refresh sx={{ fontSize: 12 }} /> : 
//                     <AutoAwesome sx={{ fontSize: 12 }} />
//                   }
//                   label={
//                     contentInfo?.source === "cache"
//                       ? `Cached v${contentInfo?.version ?? 1}`
//                       : `AI v${contentInfo?.version ?? 1}`
//                   }
//                   size="small"
//                   sx={{
//                     fontSize: '0.6rem',
//                     height: 20,
//                     background: contentInfo?.source === "cache" 
//                       ? 'rgba(255,255,255,0.15)' 
//                       : 'rgba(255,193,7,0.2)',
//                     color: 'white',
//                     border: contentInfo?.source === "cache" 
//                       ? '1px solid rgba(255,255,255,0.3)' 
//                       : '1px solid rgba(255,193,7,0.5)',
//                     '& .MuiChip-icon': { 
//                       fontSize: 12, 
//                       ml: 0.5,
//                       color: contentInfo?.source === "cache" ? 'white' : '#ffc107'
//                     },
//                     fontWeight: 600
//                   }}
//                 />
//               </Box>

//               {/* Right side - generation counter */}
//               <Chip
//                 icon={remainingGenerations === 0 ? 
//                   <Lock sx={{ fontSize: 12 }} /> : 
//                   <AutoAwesome sx={{ fontSize: 12 }} />
//                 }
//                 label={`${remainingGenerations}/${maxGenerations}`}
//                 size="small"
//                 sx={{
//                   fontSize: '0.6rem',
//                   height: 20,
//                   background: remainingGenerations === 0 
//                     ? 'rgba(239,83,80,0.9)' 
//                     : 'rgba(255,255,255,0.15)',
//                   color: 'white',
//                   border: remainingGenerations === 0 
//                     ? '1px solid rgba(239,83,80,0.5)' 
//                     : '1px solid rgba(255,255,255,0.3)',
//                   '& .MuiChip-icon': { 
//                     fontSize: 12, 
//                     ml: 0.5,
//                     color: remainingGenerations === 0 ? 'white' : '#4fc3f7'
//                   },
//                   fontWeight: 600
//                 }}
//               />
//             </Box>
//           </Box>
//         ) : (
//           /* DESKTOP/TABLET VIEW - Original layout with title */
//           <>
//             {/* Top Row: title + actions */}
//             <Box sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               gap: 1,
//               flexDirection: { sm: 'row', md: 'row' }
//             }}>
//               {/* Title Area (left) */}
//               <Box sx={{
//                 flex: 1,
//                 minWidth: 0,
//                 pr: { sm: 2, md: 3 }
//               }}>
//                 <Typography
//                   variant={isSm ? "h5" : "h4"}
//                   fontWeight="800"
//                   noWrap
//                   sx={{
//                     fontSize: { sm: '1.25rem', md: '1.7rem' },
//                     lineHeight: 1.05,
//                     color: 'white'
//                   }}
//                 >
//                   {selectedSubtopic.name}
//                 </Typography>

//                 {selectedTopic && (
//                   <Typography
//                     variant="caption"
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                       mt: 0.5,
//                       fontSize: { sm: '0.8rem', md: '0.9rem' },
//                       color: 'rgba(255,255,255,0.9)'
//                     }}
//                     noWrap
//                   >
//                     <School sx={{ fontSize: { sm: 16, md: 18 } }} />
//                     {selectedTopic}
//                   </Typography>
//                 )}
//               </Box>

//               {/* Actions Area (right) - Desktop version */}
//               <Box sx={{
//                 display: 'flex',
//                 gap: { sm: 1.25, md: 2 },
//                 alignItems: 'center',
//                 flexShrink: 0
//               }}>
//                 <Tooltip title={
//                   remainingGenerations === 0
//                     ? `Generation limit reached (${maxGenerations}/${maxGenerations})`
//                     : `Generate new content (${remainingGenerations}/${maxGenerations} left)`
//                 }>
//                   <span>
//                     <Button
//                       startIcon={
//                         remainingGenerations === 0
//                           ? <Lock sx={{ fontSize: 18 }} />
//                           : contentLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <AutoAwesome sx={{ fontSize: 18 }} />
//                       }
//                       onClick={onRegenerateContent}
//                       disabled={contentLoading || remainingGenerations === 0}
//                       variant="outlined"
//                       color={remainingGenerations === 0 ? "error" : "primary"}
//                       size="small"
//                       sx={{
//                         borderRadius: 2,
//                         px: 1.5,
//                         py: 0.6,
//                         minWidth: 140,
//                         fontSize: { sm: '0.82rem', md: '0.875rem' },
//                         color: 'white',
//                         borderColor: 'rgba(255,255,255,0.5)',
//                         '&:hover': {
//                           borderColor: 'white',
//                           backgroundColor: 'rgba(255,255,255,0.1)'
//                         }
//                       }}
//                     >
//                       {contentLoading ? "Generating" : "Regenerate"}
//                       {remainingGenerations > 0 && ` (${remainingGenerations})`}
//                     </Button>
//                   </span>
//                 </Tooltip>

//                 {!selectedSubtopic.completed && (
//                   <Button
//                     variant="contained"
//                     onClick={() => onCompleteSubtopic(selectedSubtopic)}
//                     disabled={
//                       updatingSubtopic === selectedSubtopic.name ||
//                       !selectedSubtopic.understandingLevel ||
//                       selectedSubtopic.understandingLevel < 1
//                     }
//                     startIcon={updatingSubtopic === selectedSubtopic.name ? 
//                       <CircularProgress size={16} sx={{ color: 'white' }} /> 
//                       : <CheckCircle sx={{ fontSize: 20 }} />
//                     }
//                     size="small"
//                     sx={{
//                       borderRadius: 2,
//                       px: 1.5,
//                       py: 0.6,
//                       minWidth: 120,
//                       fontSize: { sm: '0.82rem', md: '0.875rem' },
//                       background: 'rgba(76,175,80,0.9)',
//                       '&:hover': {
//                         background: 'rgba(76,175,80,1)'
//                       }
//                     }}
//                   >
//                     {updatingSubtopic === selectedSubtopic.name ? "Updating" : "Complete"}
//                   </Button>
//                 )}
//               </Box>
//             </Box>

//             {/* Bottom Row: status (rating + chips) - Desktop version */}
//             <Box sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               gap: 1,
//               mt: { sm: 1.25, md: 2 },
//               flexDirection: { sm: 'row', md: 'row' }
//             }}>
//               <Box sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1,
//                 flexWrap: 'nowrap'
//               }}>
//                 <Typography
//                   variant="caption"
//                   sx={{ 
//                     fontSize: { sm: '0.8rem', md: '0.85rem' },
//                     color: 'rgba(255,255,255,0.9)',
//                     fontWeight: 600
//                   }}
//                 >
//                   Your understanding:
//                 </Typography>

//                 <Tooltip title={updatingSubtopic === selectedSubtopic.name ? "Updating..." : "Rate your understanding"}>
//                   <span>
//                     <Rating
//                       value={selectedSubtopic.understandingLevel || 0}
//                       onChange={(event, newValue) => {
//                         if (newValue !== null) onUpdateUnderstanding(selectedSubtopic, newValue);
//                       }}
//                       disabled={updatingSubtopic === selectedSubtopic.name}
//                       size="medium"
//                       sx={{
//                         '& .MuiRating-icon': {
//                           color: 'rgba(255,255,255,0.9)',
//                         },
//                         '& .MuiRating-iconEmpty': {
//                           color: 'rgba(255,255,255,0.4)'
//                         }
//                       }}
//                     />
//                   </span>
//                 </Tooltip>
//               </Box>

//               <Box sx={{
//                 display: 'flex',
//                 gap: 1,
//                 alignItems: 'center',
//                 flexWrap: 'wrap'
//               }}>
//                 {selectedSubtopic.completed && (
//                   <Chip
//                     icon={<CheckCircle />}
//                     label="Topic Completed"
//                     color="success"
//                     variant="filled"
//                     size={isSm ? "small" : "medium"}
//                     sx={{ 
//                       fontSize: { sm: '0.75rem', md: '0.8rem' },
//                       background: 'rgba(76,175,80,0.9)',
//                       color: 'white'
//                     }}
//                   />
//                 )}

//                 <Chip
//                   icon={contentInfo?.source === "cache" ? <Refresh /> : <AutoAwesome />}
//                   label={
//                     contentInfo?.source === "cache"
//                       ? `Cached • v${contentInfo?.version ?? 1}`
//                       : `AI • v${contentInfo?.version ?? 1}`
//                   }
//                   color={contentInfo?.source === "cache" ? "default" : "warning"}
//                   variant="outlined"
//                   size={isSm ? "small" : "medium"}
//                   sx={{ 
//                     fontSize: { sm: '0.75rem', md: '0.8rem' },
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)'
//                   }}
//                 />
//               </Box>
//             </Box>
//           </>
//         )}
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
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  AutoAwesome,
  Lock,
  CheckCircle,
  Refresh,
  Cached
} from "@mui/icons-material";

const LearningHeader = ({
  selectedTopic,
  selectedSubtopic,
  updatingSubtopic,
  contentInfo,
  remainingGenerations,
  maxGenerations,
  contentLoading,
  onRegenerateContent,
  onCompleteSubtopic,
  onUpdateUnderstanding
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!selectedSubtopic) return null;

  return (
    <Card sx={{
      borderRadius: 2,
      boxShadow: 1,
      background: 'white',
      border: '1px solid rgba(126, 87, 194, 0.1)',
    }}>
      <Box sx={{
        p: 1.5,
      }}>
        
        {/* MOBILE VIEW - Minimal icons only */}
        {isMobile ? (
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
              gap: 1,
              flex: 1
            }}>
              {/* Completed status */}
              {selectedSubtopic.completed && (
                <Tooltip title="Topic completed">
                  <CheckCircle 
                    sx={{ 
                      fontSize: 20,
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
                      fontSize: 18,
                      color: '#7C3AED'
                    }} 
                  />
                ) : (
                  <AutoAwesome 
                    sx={{ 
                      fontSize: 18,
                      color: '#FF9800'
                    }} 
                  />
                )}
              </Tooltip>

              {/* Version badge */}
              <Chip
                label={`v${contentInfo?.version || 1}`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  background: 'rgba(126, 87, 194, 0.1)',
                  color: '#7C3AED'
                }}
              />
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
                    borderColor: remainingGenerations === 0 ? '#f44336' : '#7C3AED',
                    color: remainingGenerations === 0 ? '#f44336' : '#7C3AED',
                    '&:hover': {
                      background: remainingGenerations === 0 ? 'rgba(244, 67, 54, 0.04)' : 'rgba(124, 58, 237, 0.04)'
                    }
                  }}
                >
                  {contentLoading ? (
                    <CircularProgress size={16} />
                  ) : remainingGenerations === 0 ? (
                    <Lock sx={{ fontSize: 18 }} />
                  ) : (
                    <AutoAwesome sx={{ fontSize: 18 }} />
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
                      '&:hover': {
                        background: '#45a049'
                      }
                    }}
                  >
                    {updatingSubtopic === selectedSubtopic.name ? (
                      <CircularProgress size={16} sx={{ color: 'white' }} />
                    ) : (
                      <CheckCircle sx={{ fontSize: 18, color: 'white' }} />
                    )}
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Box>
        ) : (
          /* DESKTOP VIEW - Full layout */
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
                    '&:hover': {
                      background: '#45a049'
                    }
                  }}
                >
                  {updatingSubtopic === selectedSubtopic.name ? "..." : "Complete"}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default LearningHeader;