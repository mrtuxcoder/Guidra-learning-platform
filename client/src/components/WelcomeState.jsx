// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Button, 
//   Card, 
//   CardContent,
//   Fade,
//   IconButton,
//   Tooltip,
//   Chip,
//   Stack,
//   Grid,
//   Alert,
//   useTheme,
//   useMediaQuery,
//   Avatar,
//   LinearProgress,
//   Container,
//   CircularProgress
// } from "@mui/material";
// import { 
//   AutoAwesome,
//   Menu,
//   CheckCircle,
//   Explore,
//   Celebration,
//   Whatshot,
//   Restore,
//   RocketLaunch,
//   Bolt,
//   SmartToy,
//   School,
//   TrendingUp
// } from "@mui/icons-material";

// const WelcomeState = ({ 
//   subtopicName, 
//   isReady = false, 
//   onGenerateContent,
//   subtopics = [],
//   topics = [],
//   selectedTopic,
//   onNavigateToFirstIncomplete,
//   onTopicSelect,
//   onSubtopicSelect,
//   onOpenSidebar,
//   progress = 0,
//   generationCounts = {},
//   contentCache = {},
//   colorPalette = {
//     50: '#faf5ff',
//     100: '#f3e8ff',
//     200: '#e9d5ff',
//     300: '#d8b4fe',
//     400: '#c084fc',
//     500: '#a855f7',
//     600: '#9333ea',
//     700: '#7c3aed',
//     800: '#6b21a8',
//     900: '#581c87'
//   }
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
//   const [activeSuggestion, setActiveSuggestion] = useState('continue');
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Add loading delay to prevent flash of wrong content
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 500); // Short delay to ensure data is loaded
    
//     return () => clearTimeout(timer);
//   }, []);

//   // Memoized calculations
//   const learningInsights = useMemo(() => {
//     const validSubtopics = Array.isArray(subtopics) ? subtopics : [];
//     const totalSubtopics = validSubtopics.length;
//     const completedSubtopics = validSubtopics.filter(sub => sub?.completed).length;
//     const incompleteSubtopics = validSubtopics.filter(sub => !sub?.completed);
    
//     // Consider topic completed when all subtopics are completed
//     const isTopicCompleted = totalSubtopics > 0 && completedSubtopics === totalSubtopics;
//     const progressPercentage = totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;
//     const hasIncompleteTopics = incompleteSubtopics.length > 0;
//     const firstIncompleteSubtopic = incompleteSubtopics[0] || null;
    
//     return {
//       totalSubtopics,
//       completedSubtopics,
//       incompleteSubtopics,
//       progressPercentage,
//       isTopicCompleted,
//       hasIncompleteTopics,
//       firstIncompleteSubtopic
//     };
//   }, [subtopics]);

//   const suggestions = useMemo(() => {
//     const validSubtopics = Array.isArray(subtopics) ? subtopics : [];
//     const validTopics = Array.isArray(topics) ? topics : [];
    
//     return {
//       recentlyAccessed: getRecentlyAccessedSubtopics(contentCache, validSubtopics),
//       highPrioritySubtopics: getHighPrioritySubtopics(validSubtopics, generationCounts),
//       recommendedTopics: getRecommendedTopics(validTopics, selectedTopic)
//     };
//   }, [contentCache, subtopics, generationCounts, topics, selectedTopic]);

//   // Check if we have any topics at all
//   const hasTopics = Array.isArray(topics) && topics.length > 0;
//   const hasSelectedTopic = !!selectedTopic;

//   // Quick actions for desktop
//   const quickActions = [
//     {
//       icon: <Bolt sx={{ fontSize: 24 }} />,
//       name: 'Continue Learning',
//       type: 'continue',
//       subtitle: 'Pick up where you left',
//       color: '#10b981',
//       gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
//     },
//     {
//       icon: <Restore sx={{ fontSize: 24 }} />,
//       name: 'Recent Topic',
//       type: 'recent',
//       subtitle: 'Jump back in',
//       color: '#8b5cf6',
//       gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
//     },
//     {
//       icon: <TrendingUp sx={{ fontSize: 24 }} />,
//       name: 'Priority Topic',
//       type: 'priority',
//       subtitle: 'Needs attention',
//       color: '#f59e0b',
//       gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
//     }
//   ];

//   const handleQuickAction = (actionType) => {
//     let targetSubtopic = null;
    
//     switch (actionType) {
//       case 'continue':
//         targetSubtopic = learningInsights.firstIncompleteSubtopic;
//         break;
//       case 'recent':
//         targetSubtopic = suggestions.recentlyAccessed[0];
//         break;
//       case 'priority':
//         targetSubtopic = suggestions.highPrioritySubtopics[0];
//         break;
//     }
    
//     if (targetSubtopic && onSubtopicSelect) {
//       onSubtopicSelect(targetSubtopic);
//     }
//   };

//   // Loading state
//   const renderLoadingState = () => (
//     <Box sx={{ 
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center'
//     }}>
//       {/* Mobile Menu Button */}
//       {onOpenSidebar && (
//         <Tooltip title="Open menu">
//           <IconButton
//             onClick={onOpenSidebar}
//             sx={{
//               position: 'fixed',
//               top: isMobile ? 12 : 16,
//               left: isMobile ? 12 : 16,
//               width: isMobile ? 44 : 48,
//               height: isMobile ? 44 : 48,
//               display: { xs: 'flex', md: 'none' },
//               background: 'white',
//               boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//               color: colorPalette[600],
//               zIndex: 1000,
//               '&:hover': {
//                 background: '#f8fafc',
//               }
//             }}
//           >
//             <Menu sx={{ fontSize: isMobile ? 20 : 24 }} />
//           </IconButton>
//         </Tooltip>
//       )}

//       <Box sx={{ textAlign: 'center' }}>
//         <CircularProgress 
//           size={isDesktop ? 80 : 60}
//           sx={{ 
//             color: colorPalette[500],
//             mb: 3 
//           }} 
//         />
//         <Typography 
//           variant={isDesktop ? "h5" : "h6"} 
//           fontWeight="600" 
//           color="#1e293b"
//           gutterBottom
//         >
//           Loading Your Learning Dashboard
//         </Typography>
//         <Typography 
//           variant="body1" 
//           color="#64748b"
//           sx={{ maxWidth: '400px' }}
//         >
//           Preparing your personalized learning experience...
//         </Typography>
//       </Box>
//     </Box>
//   );

//   // Empty state when no topics are available
//   const renderEmptyState = () => (
//     <Box sx={{ 
//       textAlign: 'center', 
//       py: isDesktop ? 8 : 6,
//       px: 2
//     }}>
//       <Avatar sx={{ 
//         width: isDesktop ? 120 : 80, 
//         height: isDesktop ? 120 : 80,
//         background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//         margin: '0 auto 24px',
//         border: '3px solid white',
//         boxShadow: '0 8px 32px rgba(126, 87, 194, 0.3)',
//       }}>
//         <School sx={{ fontSize: isDesktop ? 50 : 35 }} />
//       </Avatar>
      
//       <Typography 
//         variant={isDesktop ? "h3" : "h4"} 
//         fontWeight="800" 
//         color="#1e293b"
//         gutterBottom
//         sx={{ mb: 2 }}
//       >
//         Welcome to Guidra!
//       </Typography>
      
//       <Typography 
//         variant={isDesktop ? "h6" : "body1"} 
//         color="#64748b"
//         sx={{ 
//           maxWidth: '500px', 
//           margin: '0 auto 32px',
//           lineHeight: 1.6
//         }}
//       >
//         It looks like you don't have any courses yet. Start your learning journey by exploring available courses and topics.
//       </Typography>

//       <Button
//         variant="contained"
//         size="large"
//         onClick={() => window.location.href = '/personalize'}
//         startIcon={<Explore />}
//         sx={{
//           py: isDesktop ? 2 : 1.5,
//           px: 4,
//           borderRadius: 2,
//           fontSize: isDesktop ? '1.1rem' : '1rem',
//           fontWeight: '700',
//           background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//           boxShadow: `0 8px 24px ${colorPalette[300]}`,
//           '&:hover': {
//             transform: 'translateY(-2px)',
//             boxShadow: `0 12px 32px ${colorPalette[400]}`,
//           },
//           transition: 'all 0.3s ease'
//         }}
//       >
//         Explore Available Courses
//       </Button>
//     </Box>
//   );

//   // Topic selector at the top - Only show if we have topics
//   const renderTopicSelector = () => {
//     if (!hasTopics) return null;

//     return (
//       <Box sx={{ mb: 3 }}>
//         <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
//           Choose a Topic
//         </Typography>
//         <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//           {topics.map((topic, index) => (
//             <Chip
//               key={index}
//               label={topic?.topic || topic?.name || 'Unnamed Topic'}
//               onClick={() => onTopicSelect && onTopicSelect(topic?.topic || topic?.name)}
//               variant={selectedTopic === (topic?.topic || topic?.name) ? "filled" : "outlined"}
//               size={isMobile ? "small" : "medium"}
//               sx={{
//                 mb: 1,
//                 background: selectedTopic === (topic?.topic || topic?.name) 
//                   ? `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`
//                   : 'white',
//                 color: selectedTopic === (topic?.topic || topic?.name) ? 'white' : '#475569',
//                 borderColor: selectedTopic === (topic?.topic || topic?.name) ? colorPalette[500] : '#e2e8f0',
//                 fontWeight: '600',
//                 '&:hover': {
//                   background: selectedTopic === (topic?.topic || topic?.name) 
//                     ? colorPalette[600] 
//                     : '#f8fafc',
//                 }
//               }}
//             />
//           ))}
//         </Stack>
//       </Box>
//     );
//   };

//   // Progress card - Only show if we have a selected topic
//   const renderProgressCard = () => {
//     if (!hasSelectedTopic) return null;

//     return (
//       <Card sx={{ 
//         mb: 3, 
//         p: isMobile ? 2 : 3,
//         background: 'white',
//         border: '1px solid #e2e8f0',
//         borderRadius: 2,
//         boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
//       }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//           <Box sx={{ flex: 1 }}>
//             <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="700" color="#1e293b" gutterBottom>
//               {selectedTopic}
//             </Typography>
//             <Typography variant={isMobile ? "caption" : "body2"} color="#64748b">
//               {learningInsights.isTopicCompleted ? 'Course Completed' : 'Progress'}
//             </Typography>
//           </Box>
//           <Chip 
//             label={`${learningInsights.completedSubtopics}/${learningInsights.totalSubtopics}`}
//             size="small"
//             sx={{ 
//               background: learningInsights.isTopicCompleted ? '#10b981' : colorPalette[500],
//               color: 'white',
//               fontWeight: '600',
//               fontSize: isMobile ? '0.75rem' : '0.875rem'
//             }}
//           />
//         </Box>
        
//         <Box sx={{ mb: 2 }}>
//           <LinearProgress 
//             variant="determinate" 
//             value={learningInsights.progressPercentage}
//             sx={{
//               height: isMobile ? 6 : 8,
//               borderRadius: 4,
//               backgroundColor: '#f1f5f9',
//               '& .MuiLinearProgress-bar': {
//                 background: learningInsights.isTopicCompleted 
//                   ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
//                   : `linear-gradient(90deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`,
//                 borderRadius: 4
//               }
//             }}
//           />
//         </Box>
        
//         <Typography variant="caption" color="#64748b" sx={{ display: 'flex', alignItems: 'center' }}>
//           {learningInsights.isTopicCompleted ? (
//             <>🎉 Congratulations! You've completed this course</>
//           ) : (
//             <>📚 {Math.round(learningInsights.progressPercentage)}% complete - Continue learning</>
//           )}
//         </Typography>
//       </Card>
//     );
//   };

//   // Quick suggestions - Only show if we have a selected topic and it's not completed
//   const renderQuickActions = () => {
//     if (!hasSelectedTopic || learningInsights.isTopicCompleted) return null;

//     if (isDesktop) {
//       return (
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#1e293b' }}>
//             Learning Suggestions
//           </Typography>
          
//           <Grid container spacing={3}>
//             {quickActions.map((action) => {
//               const getSubtopic = () => {
//                 switch (action.type) {
//                   case 'continue': return learningInsights.firstIncompleteSubtopic;
//                   case 'recent': return suggestions.recentlyAccessed[0];
//                   case 'priority': return suggestions.highPrioritySubtopics[0];
//                   default: return null;
//                 }
//               };
              
//               const subtopic = getSubtopic();
//               if (!subtopic) return null;

//               return (
//                 <Grid item xs={12} md={4} key={action.type}>
//                   <Card
//                     sx={{
//                       cursor: 'pointer',
//                       border: `2px solid #e2e8f0`,
//                       borderRadius: 2,
//                       transition: 'all 0.2s ease',
//                       background: 'white',
//                       height: '100%',
//                       '&:hover': {
//                         transform: 'translateY(-4px)',
//                         boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
//                         borderColor: action.color
//                       }
//                     }}
//                     onClick={() => {
//                       setActiveSuggestion(action.type);
//                       handleQuickAction(action.type);
//                     }}
//                   >
//                     <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
//                         <Box
//                           sx={{
//                             width: 48,
//                             height: 48,
//                             borderRadius: 2,
//                             background: action.gradient,
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             mb: 2
//                           }}
//                         >
//                           {React.cloneElement(action.icon, { 
//                             sx: { fontSize: 24, color: 'white' } 
//                           })}
//                         </Box>
                        
//                         <Typography variant="subtitle1" fontWeight="700" color="#1e293b" gutterBottom>
//                           {action.name}
//                         </Typography>
                        
//                         <Typography variant="body2" color="#64748b" sx={{ mb: 2, lineHeight: 1.4 }}>
//                           {action.subtitle}
//                         </Typography>
                        
//                         <Box sx={{ flex: 1, width: '100%' }}>
//                           <Typography 
//                             variant="body2" 
//                             color="#1e293b" 
//                             sx={{ 
//                               fontWeight: '600',
//                               p: 2,
//                               background: '#f8fafc',
//                               borderRadius: 1,
//                               border: '1px solid #e2e8f0'
//                             }}
//                           >
//                             {subtopic.name}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         </Box>
//       );
//     }

//     return (
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
//           Learning Suggestions
//         </Typography>
        
//         <Stack spacing={1}>
//           {quickActions.map((action) => {
//             const getSubtopic = () => {
//               switch (action.type) {
//                 case 'continue': return learningInsights.firstIncompleteSubtopic;
//                 case 'recent': return suggestions.recentlyAccessed[0];
//                 case 'priority': return suggestions.highPrioritySubtopics[0];
//                 default: return null;
//               }
//             };
            
//             const subtopic = getSubtopic();
//             if (!subtopic) return null;

//             return (
//               <Card
//                 key={action.type}
//                 sx={{
//                   cursor: 'pointer',
//                   border: `1px solid #e2e8f0`,
//                   borderRadius: 2,
//                   transition: 'all 0.2s ease',
//                   background: 'white',
//                   '&:hover': {
//                     transform: 'translateY(-2px)',
//                     boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
//                     borderColor: action.color
//                   }
//                 }}
//                 onClick={() => {
//                   setActiveSuggestion(action.type);
//                   handleQuickAction(action.type);
//                 }}
//               >
//                 <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     <Box
//                       sx={{
//                         width: 36,
//                         height: 36,
//                         borderRadius: '10px',
//                         background: action.gradient,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         mr: 2,
//                         flexShrink: 0
//                       }}
//                     >
//                       {React.cloneElement(action.icon, { 
//                         sx: { color: 'white' } 
//                       })}
//                     </Box>
//                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
//                         <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
//                           {action.name}
//                         </Typography>
//                       </Box>
//                       <Typography variant="caption" color="#64748b" sx={{ lineHeight: 1.2 }}>
//                         {action.subtitle}
//                       </Typography>
//                       <Typography 
//                         variant="caption" 
//                         color="#1e293b" 
//                         sx={{ 
//                           fontWeight: '500',
//                           mt: 0.5,
//                           display: 'block',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           whiteSpace: 'nowrap'
//                         }}
//                       >
//                         {subtopic.name}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </Stack>
//       </Box>
//     );
//   };

//   // Header - Show different content based on whether we have topics
//   const renderHeader = () => (
//     <Box sx={{ 
//       background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//       color: 'white',
//       p: isMobile ? 3 : isDesktop ? 4 : 3,
//       position: 'relative',
//       overflow: 'hidden',
//     }}>
//       <Box sx={{
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         bottom: 0,
//         left: 0,
//         background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
//       }} />
      
//       <Box sx={{ 
//         position: 'relative', 
//         zIndex: 1,
//         textAlign: 'center'
//       }}>
//         <Typography 
//           variant={isMobile ? "h5" : isDesktop ? "h4" : "h5"} 
//           fontWeight="800" 
//           sx={{ mb: 1 }}
//         >
//           {!hasTopics 
//             ? 'Welcome to Guidra!' 
//             : learningInsights.isTopicCompleted 
//               ? 'Course Completed! 🎉' 
//               : isReady 
//                 ? 'Ready to Learn' 
//                 : 'Continue Learning'
//           }
//         </Typography>
        
//         <Typography 
//           variant={isMobile ? "body2" : "body1"} 
//           sx={{ 
//             opacity: 0.9, 
//             lineHeight: 1.5,
//           }}
//         >
//           {!hasTopics 
//             ? 'Start your learning journey with personalized AI-powered courses'
//             : learningInsights.isTopicCompleted 
//               ? `You've mastered ${selectedTopic}`
//               : isReady 
//                 ? `Start learning "${subtopicName}"`
//                 : selectedTopic 
//                   ? `Continue your progress in ${selectedTopic}`
//                   : 'Select a topic to begin'
//           }
//         </Typography>
//       </Box>
//     </Box>
//   );

//   // Main content when data is loaded
//   const renderContent = () => {
//     if (!hasTopics) {
//       return (
//         <Fade in={true} timeout={400}>
//           <Box sx={{ 
//             minHeight: '100vh',
//             background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//             display: 'flex',
//             flexDirection: 'column'
//           }}>
//             {/* Mobile Menu Button */}
//             {onOpenSidebar && (
//               <Tooltip title="Open menu">
//                 <IconButton
//                   onClick={onOpenSidebar}
//                   sx={{
//                     position: 'fixed',
//                     top: isMobile ? 12 : 16,
//                     left: isMobile ? 12 : 16,
//                     width: isMobile ? 44 : 48,
//                     height: isMobile ? 44 : 48,
//                     display: { xs: 'flex', md: 'none' },
//                     background: 'white',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                     color: colorPalette[600],
//                     zIndex: 1000,
//                     '&:hover': {
//                       background: '#f8fafc',
//                     }
//                   }}
//                 >
//                   <Menu sx={{ fontSize: isMobile ? 20 : 24 }} />
//                 </IconButton>
//               </Tooltip>
//             )}

//             {renderHeader()}
//             {renderEmptyState()}
//           </Box>
//         </Fade>
//       );
//     }

//     return (
//       <Fade in={true} timeout={400}>
//         <Box sx={{ 
//           minHeight: '100vh',
//           background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//           display: 'flex',
//           flexDirection: 'column'
//         }}>
//           {/* Mobile Menu Button */}
//           {onOpenSidebar && (
//             <Tooltip title="Open menu">
//               <IconButton
//                 onClick={onOpenSidebar}
//                 sx={{
//                   position: 'fixed',
//                   top: isMobile ? 12 : 16,
//                   left: isMobile ? 12 : 16,
//                   width: isMobile ? 44 : 48,
//                   height: isMobile ? 44 : 48,
//                   display: { xs: 'flex', md: 'none' },
//                   background: 'white',
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                   color: colorPalette[600],
//                   zIndex: 1000,
//                   '&:hover': {
//                     background: '#f8fafc',
//                   }
//                 }}
//               >
//                 <Menu sx={{ fontSize: isMobile ? 20 : 24 }} />
//               </IconButton>
//             </Tooltip>
//           )}

//           {/* Full-screen content */}
//           <Box sx={{ 
//             flex: 1,
//             display: 'flex',
//             flexDirection: 'column',
//             width: '100%',
//             maxWidth: '100%',
//             margin: 0
//           }}>
//             {renderHeader()}
            
//             <Container 
//               maxWidth={false} 
//               sx={{ 
//                 flex: 1,
//                 py: isMobile ? 3 : isDesktop ? 4 : 3,
//                 px: isMobile ? 2 : isDesktop ? 3 : 2
//               }}
//             >
//               <Box sx={{ 
//                 maxWidth: isDesktop ? '800px' : '100%',
//                 margin: '0 auto'
//               }}>
//                 {/* Topic Selector at the top */}
//                 {renderTopicSelector()}
                
//                 {/* Progress Card */}
//                 {renderProgressCard()}
                
//                 {/* Quick Actions */}
//                 {renderQuickActions()}

//                 {/* Main CTA Button */}
//                 {isReady && !learningInsights.isTopicCompleted && (
//                   <Button
//                     variant="contained"
//                     size="large"
//                     onClick={onGenerateContent}
//                     startIcon={<AutoAwesome />}
//                     sx={{
//                       width: '100%',
//                       py: isMobile ? 1.5 : 2,
//                       borderRadius: 2,
//                       fontSize: isMobile ? '1rem' : '1.1rem',
//                       fontWeight: '700',
//                       background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//                       boxShadow: `0 8px 24px ${colorPalette[300]}`,
//                       '&:hover': {
//                         transform: isMobile ? 'none' : 'translateY(-2px)',
//                         boxShadow: `0 12px 32px ${colorPalette[400]}`,
//                       },
//                       transition: 'all 0.3s ease'
//                     }}
//                   >
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <SmartToy sx={{ fontSize: isMobile ? 20 : 24 }} />
//                       Start Learning {subtopicName}
//                     </Box>
//                   </Button>
//                 )}
//               </Box>
//             </Container>
//           </Box>
//         </Box>
//       </Fade>
//     );
//   };

//   // Show loader first, then content
//   if (isLoading) {
//     return renderLoadingState();
//   }

//   return renderContent();
// };

// // Helper functions
// const getRecentlyAccessedSubtopics = (contentCache, subtopics) => {
//   try {
//     if (!contentCache || typeof contentCache !== 'object') return [];
//     if (!Array.isArray(subtopics)) return [];

//     const cachedEntries = Object.entries(contentCache);
//     const recentlyAccessed = cachedEntries
//       .sort(([, a], [, b]) => (b.timestamp || 0) - (a.timestamp || 0))
//       .slice(0, 3)
//       .map(([key]) => {
//         const subtopicName = key.split('-')[1];
//         return subtopics.find(sub => sub && sub.name === subtopicName);
//       })
//       .filter(Boolean);
    
//     return recentlyAccessed;
//   } catch (error) {
//     return [];
//   }
// };

// const getHighPrioritySubtopics = (subtopics, generationCounts) => {
//   try {
//     if (!Array.isArray(subtopics)) return [];
//     const validGenerationCounts = generationCounts || {};

//     const incomplete = subtopics.filter(sub => sub && !sub.completed);
//     return incomplete
//       .sort((a, b) => {
//         const aScore = (validGenerationCounts[a.name] || 0) + (a.understandingLevel || 0);
//         const bScore = (validGenerationCounts[b.name] || 0) + (b.understandingLevel || 0);
//         return aScore - bScore;
//       })
//       .slice(0, 3);
//   } catch (error) {
//     return [];
//   }
// };

// const getRecommendedTopics = (topics, currentTopic) => {
//   try {
//     if (!Array.isArray(topics)) return [];
//     return topics
//       .filter(topic => topic && (topic.topic || topic.name) !== currentTopic)
//       .slice(0, 3);
//   } catch (error) {
//     return [];
//   }
// };

// export default WelcomeState;

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Fade,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Grid,
  Alert,
  useTheme,
  useMediaQuery,
  Avatar,
  LinearProgress,
  Container,
  CircularProgress
} from "@mui/material";
import { 
  AutoAwesome,
  Menu,
  CheckCircle,
  Explore,
  Celebration,
  Whatshot,
  Restore,
  RocketLaunch,
  Bolt,
  SmartToy,
  School,
  TrendingUp
} from "@mui/icons-material";

const WelcomeState = ({ 
  subtopicName, 
  isReady = false, 
  onGenerateContent,
  subtopics = [],
  topics = [],
  selectedTopic,
  onNavigateToFirstIncomplete,
  onTopicSelect,
  onSubtopicSelect,
  onOpenSidebar,
  progress = 0,
  generationCounts = {},
  contentCache = {},
  colorPalette = {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  }
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [activeSuggestion, setActiveSuggestion] = useState('continue');
  const [isLoading, setIsLoading] = useState(true);
  
  // Add loading delay to prevent flash of wrong content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Short delay to ensure data is loaded
    
    return () => clearTimeout(timer);
  }, []);

  // Memoized calculations
  const learningInsights = useMemo(() => {
    const validSubtopics = Array.isArray(subtopics) ? subtopics : [];
    const totalSubtopics = validSubtopics.length;
    const completedSubtopics = validSubtopics.filter(sub => sub?.completed).length;
    const incompleteSubtopics = validSubtopics.filter(sub => !sub?.completed);
    
    // Consider topic completed when all subtopics are completed
    const isTopicCompleted = totalSubtopics > 0 && completedSubtopics === totalSubtopics;
    const progressPercentage = totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;
    const hasIncompleteTopics = incompleteSubtopics.length > 0;
    const firstIncompleteSubtopic = incompleteSubtopics[0] || null;
    
    return {
      totalSubtopics,
      completedSubtopics,
      incompleteSubtopics,
      progressPercentage,
      isTopicCompleted,
      hasIncompleteTopics,
      firstIncompleteSubtopic
    };
  }, [subtopics]);

  const suggestions = useMemo(() => {
    const validSubtopics = Array.isArray(subtopics) ? subtopics : [];
    const validTopics = Array.isArray(topics) ? topics : [];
    
    return {
      recentlyAccessed: getRecentlyAccessedSubtopics(contentCache, validSubtopics),
      highPrioritySubtopics: getHighPrioritySubtopics(validSubtopics, generationCounts),
      recommendedTopics: getRecommendedTopics(validTopics, selectedTopic)
    };
  }, [contentCache, subtopics, generationCounts, topics, selectedTopic]);

  // Check if we have any topics at all
  const hasTopics = Array.isArray(topics) && topics.length > 0;
  const hasSelectedTopic = !!selectedTopic;

  // Quick actions for desktop
  const quickActions = [
    {
      icon: <Bolt sx={{ fontSize: 24 }} />,
      name: 'Continue Learning',
      type: 'continue',
      subtitle: 'Pick up where you left',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: <Restore sx={{ fontSize: 24 }} />,
      name: 'Recent Topic',
      type: 'recent',
      subtitle: 'Jump back in',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      name: 'Priority Topic',
      type: 'priority',
      subtitle: 'Needs attention',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  ];

  const handleQuickAction = (actionType) => {
    let targetSubtopic = null;
    
    switch (actionType) {
      case 'continue':
        targetSubtopic = learningInsights.firstIncompleteSubtopic;
        break;
      case 'recent':
        targetSubtopic = suggestions.recentlyAccessed[0];
        break;
      case 'priority':
        targetSubtopic = suggestions.highPrioritySubtopics[0];
        break;
    }
    
    if (targetSubtopic && onSubtopicSelect) {
      onSubtopicSelect(targetSubtopic);
    }
  };

  // Loading state
  const renderLoadingState = () => (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress 
          size={isDesktop ? 80 : 60}
          sx={{ 
            color: colorPalette[500],
            mb: 3 
          }} 
        />
        <Typography 
          variant={isDesktop ? "h5" : "h6"} 
          fontWeight="600" 
          color="#1e293b"
          gutterBottom
        >
          Loading Your Learning Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          color="#64748b"
          sx={{ maxWidth: '400px' }}
        >
          Preparing your personalized learning experience...
        </Typography>
      </Box>
    </Box>
  );

  // Empty state when no topics are available
  const renderEmptyState = () => (
    <Box sx={{ 
      textAlign: 'center', 
      py: isDesktop ? 8 : 6,
      px: 2
    }}>
      <Avatar sx={{ 
        width: isDesktop ? 120 : 80, 
        height: isDesktop ? 120 : 80,
        background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
        margin: '0 auto 24px',
        border: '3px solid white',
        boxShadow: '0 8px 32px rgba(126, 87, 194, 0.3)',
      }}>
        <School sx={{ fontSize: isDesktop ? 50 : 35 }} />
      </Avatar>
      
      <Typography 
        variant={isDesktop ? "h3" : "h4"} 
        fontWeight="800" 
        color="#1e293b"
        gutterBottom
        sx={{ mb: 2 }}
      >
        Welcome to Guidra!
      </Typography>
      
      <Typography 
        variant={isDesktop ? "h6" : "body1"} 
        color="#64748b"
        sx={{ 
          maxWidth: '500px', 
          margin: '0 auto 32px',
          lineHeight: 1.6
        }}
      >
        It looks like you don't have any courses yet. Start your learning journey by exploring available courses and topics.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => window.location.href = '/personalize'}
        startIcon={<Explore />}
        sx={{
          py: isDesktop ? 2 : 1.5,
          px: 4,
          borderRadius: 2,
          fontSize: isDesktop ? '1.1rem' : '1rem',
          fontWeight: '700',
          background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
          boxShadow: `0 8px 24px ${colorPalette[300]}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 32px ${colorPalette[400]}`,
          },
          transition: 'all 0.3s ease'
        }}
      >
        Explore Available Courses
      </Button>
    </Box>
  );

  // Topic selector at the top - Only show if we have topics
  const renderTopicSelector = () => {
    if (!hasTopics) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
          Choose a Topic
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {topics.map((topic, index) => (
            <Chip
              key={index}
              label={topic?.topic || topic?.name || 'Unnamed Topic'}
              onClick={() => onTopicSelect && onTopicSelect(topic?.topic || topic?.name)}
              variant={selectedTopic === (topic?.topic || topic?.name) ? "filled" : "outlined"}
              size={isMobile ? "small" : "medium"}
              sx={{
                mb: 1,
                background: selectedTopic === (topic?.topic || topic?.name) 
                  ? `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`
                  : 'white',
                color: selectedTopic === (topic?.topic || topic?.name) ? 'white' : '#475569',
                borderColor: selectedTopic === (topic?.topic || topic?.name) ? colorPalette[500] : '#e2e8f0',
                fontWeight: '600',
                '&:hover': {
                  background: selectedTopic === (topic?.topic || topic?.name) 
                    ? colorPalette[600] 
                    : '#f8fafc',
                }
              }}
            />
          ))}
        </Stack>
      </Box>
    );
  };

  // Progress card - Only show if we have a selected topic
  const renderProgressCard = () => {
    if (!hasSelectedTopic) return null;

    return (
      <Card sx={{ 
        mb: 3, 
        p: isMobile ? 2 : 3,
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="700" color="#1e293b" gutterBottom>
              {selectedTopic}
            </Typography>
            <Typography variant={isMobile ? "caption" : "body2"} color="#64748b">
              {learningInsights.isTopicCompleted ? 'Course Completed' : 'Progress'}
            </Typography>
          </Box>
          <Chip 
            label={`${learningInsights.completedSubtopics}/${learningInsights.totalSubtopics}`}
            size="small"
            sx={{ 
              background: learningInsights.isTopicCompleted ? '#10b981' : colorPalette[500],
              color: 'white',
              fontWeight: '600',
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={learningInsights.progressPercentage}
            sx={{
              height: isMobile ? 6 : 8,
              borderRadius: 4,
              backgroundColor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                background: learningInsights.isTopicCompleted 
                  ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                  : `linear-gradient(90deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`,
                borderRadius: 4
              }
            }}
          />
        </Box>
        
        <Typography variant="caption" color="#64748b" sx={{ display: 'flex', alignItems: 'center' }}>
          {learningInsights.isTopicCompleted ? (
            <>🎉 Congratulations! You've completed this course</>
          ) : (
            <>📚 {Math.round(learningInsights.progressPercentage)}% complete - Continue learning</>
          )}
        </Typography>
      </Card>
    );
  };

  // Quick suggestions - Only show if we have a selected topic and it's not completed
  const renderQuickActions = () => {
    if (!hasSelectedTopic || learningInsights.isTopicCompleted) return null;

    if (isDesktop) {
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#1e293b' }}>
            Learning Suggestions
          </Typography>
          
          {/* Use CSS Grid for perfect equal sizing */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 3,
            alignItems: 'stretch'
          }}>
            {quickActions.map((action, index) => {
              const getSubtopic = () => {
                switch (action.type) {
                  case 'continue': return learningInsights.firstIncompleteSubtopic;
                  case 'recent': return suggestions.recentlyAccessed[0];
                  case 'priority': return suggestions.highPrioritySubtopics[0];
                  default: return null;
                }
              };
              
              const subtopic = getSubtopic();
              if (!subtopic) return null;

              return (
                <Card
                  key={action.type}
                  sx={{
                    cursor: 'pointer',
                    border: `2px solid #f1f5f9`,
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: 280,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: action.gradient,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 24px 48px rgba(126, 87, 194, 0.15)',
                      borderColor: action.color,
                      '&::before': {
                        transform: 'scaleX(1)'
                      },
                      '& .action-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                      },
                      '& .subtopic-box': {
                        background: action.gradient,
                        color: 'white',
                        transform: 'translateY(-2px)'
                      }
                    },
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(30px)'
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    }
                  }}
                  onClick={() => {
                    setActiveSuggestion(action.type);
                    handleQuickAction(action.type);
                  }}
                >
                  <CardContent sx={{ 
                    p: 3, 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:last-child': { pb: 3 } 
                  }}>
                    
                    {/* Header - Fixed height */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 2.5,
                      flexShrink: 0
                    }}>
                      <Box
                        className="action-icon"
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          background: action.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 8px 24px ${action.color}40`,
                          transition: 'all 0.3s ease',
                          flexShrink: 0
                        }}
                      >
                        {React.cloneElement(action.icon, { 
                          sx: { 
                            fontSize: 24, 
                            color: 'white',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                          } 
                        })}
                      </Box>
                      
                      <Chip
                        label={action.type.toUpperCase()}
                        size="small"
                        sx={{
                          background: 'rgba(126, 87, 194, 0.08)',
                          color: '#7e57c2',
                          fontWeight: '800',
                          fontSize: '0.65rem',
                          height: 22,
                          border: '1px solid rgba(126, 87, 194, 0.2)'
                        }}
                      />
                    </Box>
                    
                    {/* Content - Flexible but controlled */}
                    <Box sx={{ 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}>
                      {/* Title Section */}
                      <Box>
                        <Typography 
                          variant="h6" 
                          fontWeight="800" 
                          sx={{ 
                            color: '#1e293b',
                            lineHeight: 1.3,
                            mb: 1,
                            fontSize: '1.1rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.6em'
                          }}
                        >
                          {action.name}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            lineHeight: 1.4,
                            fontSize: '0.85rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.8em'
                          }}
                        >
                          {action.subtitle}
                        </Typography>
                      </Box>
                      
                      {/* Spacer - Pushes subtopic to bottom */}
                      <Box sx={{ flex: 1 }} />
                      
                      {/* Subtopic Section - Fixed at bottom */}
                      <Box sx={{ 
                        flexShrink: 0
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#64748b',
                            fontWeight: '600',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                            mb: 1
                          }}
                        >
                          Suggested Topic
                        </Typography>
                        
                        <Box 
                          className="subtopic-box"
                          sx={{
                            p: 2,
                            background: '#f8fafc',
                            borderRadius: 2,
                            border: '2px solid #f1f5f9',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: 68,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '3px',
                              height: '100%',
                              background: action.gradient,
                              opacity: 0.8
                            }
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: '700',
                              color: '#1e293b',
                              lineHeight: 1.3,
                              fontSize: '0.9rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {subtopic.name}
                          </Typography>
                          
                          {/* Progress indicator */}
                          {action.type === 'continue' && subtopic.progress && (
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 0.5
                              }}>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontWeight: '600',
                                    color: 'inherit',
                                    opacity: 0.9,
                                    fontSize: '0.65rem'
                                  }}
                                >
                                  Progress
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontWeight: '800',
                                    color: 'inherit',
                                    fontSize: '0.65rem'
                                  }}
                                >
                                  {Math.round(subtopic.progress * 100)}%
                                </Typography>
                              </Box>
                              <Box 
                                sx={{ 
                                  height: 3,
                                  background: 'rgba(255,255,255,0.3)',
                                  borderRadius: 2,
                                  overflow: 'hidden'
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    height: '100%',
                                    background: 'white',
                                    borderRadius: 2,
                                    width: `${subtopic.progress * 100}%`,
                                    transition: 'width 0.5s ease'
                                  }}
                                />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
          Learning Suggestions
        </Typography>
        
        <Stack spacing={1}>
          {quickActions.map((action) => {
            const getSubtopic = () => {
              switch (action.type) {
                case 'continue': return learningInsights.firstIncompleteSubtopic;
                case 'recent': return suggestions.recentlyAccessed[0];
                case 'priority': return suggestions.highPrioritySubtopics[0];
                default: return null;
              }
            };
            
            const subtopic = getSubtopic();
            if (!subtopic) return null;

            return (
              <Card
                key={action.type}
                sx={{
                  cursor: 'pointer',
                  border: `1px solid #e2e8f0`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  background: 'white',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    borderColor: action.color
                  }
                }}
                onClick={() => {
                  setActiveSuggestion(action.type);
                  handleQuickAction(action.type);
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: action.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0
                      }}
                    >
                      {React.cloneElement(action.icon, { 
                        sx: { color: 'white' } 
                      })}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                          {action.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="#64748b" sx={{ lineHeight: 1.2 }}>
                        {action.subtitle}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="#1e293b" 
                        sx={{ 
                          fontWeight: '500',
                          mt: 0.5,
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {subtopic.name}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>
    );
  };

  // Header - Show different content based on whether we have topics
  const renderHeader = () => (
    <Box sx={{ 
      background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
      color: 'white',
      p: isMobile ? 3 : isDesktop ? 4 : 3,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      }} />
      
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        textAlign: 'center'
      }}>
        <Typography 
          variant={isMobile ? "h5" : isDesktop ? "h4" : "h5"} 
          fontWeight="800" 
          sx={{ mb: 1 }}
        >
          {!hasTopics 
            ? 'Welcome to Guidra!' 
            : learningInsights.isTopicCompleted 
              ? 'Course Completed! 🎉' 
              : isReady 
                ? 'Ready to Learn' 
                : 'Continue Learning'
          }
        </Typography>
        
        <Typography 
          variant={isMobile ? "body2" : "body1"} 
          sx={{ 
            opacity: 0.9, 
            lineHeight: 1.5,
          }}
        >
          {!hasTopics 
            ? 'Start your learning journey with personalized AI-powered courses'
            : learningInsights.isTopicCompleted 
              ? `You've mastered ${selectedTopic}`
              : isReady 
                ? `Start learning "${subtopicName}"`
                : selectedTopic 
                  ? `Continue your progress in ${selectedTopic}`
                  : 'Select a topic to begin'
          }
        </Typography>
      </Box>
    </Box>
  );

  // Mobile Menu Button - Only show on mobile
  const renderMobileMenuButton = () => {
    if (!isMobile || !onOpenSidebar) return null;

    return (
      <Tooltip title="Open menu">
        <IconButton
          onClick={onOpenSidebar}
          sx={{
            position: 'fixed',
            top: 12,
            left: 12,
            width: 44,
            height: 44,
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: colorPalette[600],
            zIndex: 1000,
            '&:hover': {
              background: '#f8fafc',
            }
          }}
        >
          <Menu sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    );
  };

  // Main content when data is loaded
  const renderContent = () => {
    if (!hasTopics) {
      return (
        <Fade in={true} timeout={400}>
          <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {renderMobileMenuButton()}
            {renderHeader()}
            {renderEmptyState()}
          </Box>
        </Fade>
      );
    }

    return (
      <Fade in={true} timeout={400}>
        <Box sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {renderMobileMenuButton()}
          
          {/* Full-screen content */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '100%',
            margin: 0
          }}>
            {renderHeader()}
            
            <Container 
              maxWidth={false} 
              sx={{ 
                flex: 1,
                py: isMobile ? 3 : isDesktop ? 4 : 3,
                px: isMobile ? 2 : isDesktop ? 3 : 2
              }}
            >
              <Box sx={{ 
                maxWidth: isDesktop ? '800px' : '100%',
                margin: '0 auto'
              }}>
                {/* Topic Selector at the top */}
                {renderTopicSelector()}
                
                {/* Progress Card */}
                {renderProgressCard()}
                
                {/* Quick Actions */}
                {renderQuickActions()}

                {/* Main CTA Button */}
                {isReady && !learningInsights.isTopicCompleted && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onGenerateContent}
                    startIcon={<AutoAwesome />}
                    sx={{
                      width: '100%',
                      py: isMobile ? 1.5 : 2,
                      borderRadius: 2,
                      fontSize: isMobile ? '1rem' : '1.1rem',
                      fontWeight: '700',
                      background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
                      boxShadow: `0 8px 24px ${colorPalette[300]}`,
                      '&:hover': {
                        transform: isMobile ? 'none' : 'translateY(-2px)',
                        boxShadow: `0 12px 32px ${colorPalette[400]}`,
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SmartToy sx={{ fontSize: isMobile ? 20 : 24 }} />
                      Start Learning {subtopicName}
                    </Box>
                  </Button>
                )}
              </Box>
            </Container>
          </Box>
        </Box>
      </Fade>
    );
  };

  // Show loader first, then content
  if (isLoading) {
    return renderLoadingState();
  }

  return renderContent();
};

// Helper functions
const getRecentlyAccessedSubtopics = (contentCache, subtopics) => {
  try {
    if (!contentCache || typeof contentCache !== 'object') return [];
    if (!Array.isArray(subtopics)) return [];

    const cachedEntries = Object.entries(contentCache);
    const recentlyAccessed = cachedEntries
      .sort(([, a], [, b]) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 3)
      .map(([key]) => {
        const subtopicName = key.split('-')[1];
        return subtopics.find(sub => sub && sub.name === subtopicName);
      })
      .filter(Boolean);
    
    return recentlyAccessed;
  } catch (error) {
    return [];
  }
};

const getHighPrioritySubtopics = (subtopics, generationCounts) => {
  try {
    if (!Array.isArray(subtopics)) return [];
    const validGenerationCounts = generationCounts || {};

    const incomplete = subtopics.filter(sub => sub && !sub.completed);
    return incomplete
      .sort((a, b) => {
        const aScore = (validGenerationCounts[a.name] || 0) + (a.understandingLevel || 0);
        const bScore = (validGenerationCounts[b.name] || 0) + (b.understandingLevel || 0);
        return aScore - bScore;
      })
      .slice(0, 3);
  } catch (error) {
    return [];
  }
};

const getRecommendedTopics = (topics, currentTopic) => {
  try {
    if (!Array.isArray(topics)) return [];
    return topics
      .filter(topic => topic && (topic.topic || topic.name) !== currentTopic)
      .slice(0, 3);
  } catch (error) {
    return [];
  }
};

export default WelcomeState;