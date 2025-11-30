// import React from 'react';
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
//   Divider,
//   Alert
// } from "@mui/material";
// import { 
//   AutoAwesome,
//   School,
//   PlayArrow,
//   Menu,
//   TrendingUp,
//   Schedule,
//   Star,
//   Lightbulb,
//   CheckCircle,
//   Explore,
//   Celebration
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
//   // Calculate learning insights
//   const totalSubtopics = subtopics.length;
//   const completedSubtopics = subtopics.filter(sub => sub.completed).length;
//   const incompleteSubtopics = subtopics.filter(sub => !sub.completed);
//   const progressPercentage = totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;
  
//   // Check completion status
//   const isTopicCompleted = totalSubtopics > 0 && incompleteSubtopics.length === 0;
//   const hasIncompleteTopics = incompleteSubtopics.length > 0;
//   const hasMultipleTopics = topics && topics.length > 1;

//   // Find learning suggestions
//   const firstIncompleteSubtopic = incompleteSubtopics[0];
//   const recentlyAccessed = getRecentlyAccessedSubtopics(contentCache, subtopics);
//   const highPrioritySubtopics = getHighPrioritySubtopics(subtopics, generationCounts);
//   const recommendedTopics = getRecommendedTopics(topics, selectedTopic);

//   const handleQuickStart = (subtopic) => {
//     if (onSubtopicSelect) {
//       onSubtopicSelect(subtopic);
//     }
//   };

//   const handleTopicChange = (topic) => {
//     if (onTopicSelect) {
//       onTopicSelect(topic.topic || topic.name);
//     }
//   };

//   const handleExplorePersonalize = () => {
//     // Navigate to personalize page
//     window.location.href = '/personalize';
//   };

//   const renderCompletionCelebration = () => {
//     if (!isTopicCompleted) return null;

//     return (
//       <Box sx={{ width: '100%', mb: 3 }}>
//         <Alert 
//           severity="success"
//           icon={<Celebration />}
//           sx={{
//             borderRadius: 2,
//             backgroundColor: `${colorPalette[50]} !important`,
//             color: colorPalette[800],
//             border: `1px solid ${colorPalette[200]}`,
//             '& .MuiAlert-icon': {
//               color: colorPalette[600],
//             }
//           }}
//         >
//           <Typography variant="body1" fontWeight="600">
//             🎉 Topic Completed!
//           </Typography>
//           <Typography variant="body2">
//             You've mastered all subtopics in {selectedTopic}. Ready for your next challenge?
//           </Typography>
//         </Alert>

//         <Button
//           variant="contained"
//           size="large"
//           onClick={handleExplorePersonalize}
//           startIcon={<Explore />}
//           sx={{
//             mt: 2,
//             py: 1.2,
//             px: 3,
//             borderRadius: 2,
//             fontSize: '1rem',
//             fontWeight: 600,
//             background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//             width: '100%'
//           }}
//         >
//           Explore More Courses
//         </Button>
//       </Box>
//     );
//   };

//   const renderLearningSuggestions = () => {
//     if (isTopicCompleted || !hasIncompleteTopics) return null;

//     return (
//       <Box sx={{ mt: 3, width: '100%' }}>
//         <Divider sx={{ mb: 2 }} />
//         <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: colorPalette[700] }}>
//           Learning Suggestions
//         </Typography>
        
//         <Stack spacing={1}>
//           {/* Continue with First Incomplete */}
//           {firstIncompleteSubtopic && (
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => handleQuickStart(firstIncompleteSubtopic)}
//               startIcon={<PlayArrow />}
//               sx={{
//                 justifyContent: 'flex-start',
//                 textAlign: 'left',
//                 py: 1,
//                 px: 2,
//                 borderRadius: 2,
//                 borderColor: colorPalette[200],
//                 color: colorPalette[700],
//                 '&:hover': {
//                   borderColor: colorPalette[500],
//                   backgroundColor: colorPalette[50]
//                 }
//               }}
//             >
//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="body2" fontWeight="600">
//                   Continue: {firstIncompleteSubtopic.name}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   Next topic in your learning path
//                 </Typography>
//               </Box>
//             </Button>
//           )}

//           {/* Recently Accessed */}
//           {recentlyAccessed.length > 0 && recentlyAccessed[0]?.name !== firstIncompleteSubtopic?.name && (
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => handleQuickStart(recentlyAccessed[0])}
//               startIcon={<Schedule />}
//               sx={{
//                 justifyContent: 'flex-start',
//                 textAlign: 'left',
//                 py: 1,
//                 px: 2,
//                 borderRadius: 2,
//                 borderColor: colorPalette[200],
//                 color: colorPalette[700],
//                 '&:hover': {
//                   borderColor: colorPalette[500],
//                   backgroundColor: colorPalette[50]
//                 }
//               }}
//             >
//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="body2" fontWeight="600">
//                   Recent: {recentlyAccessed[0].name}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   Continue from last session
//                 </Typography>
//               </Box>
//             </Button>
//           )}

//           {/* High Priority */}
//           {highPrioritySubtopics.length > 0 && highPrioritySubtopics[0]?.name !== firstIncompleteSubtopic?.name && (
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => handleQuickStart(highPrioritySubtopics[0])}
//               startIcon={<TrendingUp />}
//               sx={{
//                 justifyContent: 'flex-start',
//                 textAlign: 'left',
//                 py: 1,
//                 px: 2,
//                 borderRadius: 2,
//                 borderColor: colorPalette[200],
//                 color: colorPalette[700],
//                 '&:hover': {
//                   borderColor: colorPalette[500],
//                   backgroundColor: colorPalette[50]
//                 }
//               }}
//             >
//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="body2" fontWeight="600">
//                   Priority: {highPrioritySubtopics[0].name}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   Needs more practice
//                 </Typography>
//               </Box>
//             </Button>
//           )}
//         </Stack>
//       </Box>
//     );
//   };

//   const renderTopicSelector = () => {
//     if (!hasMultipleTopics) return null;

//     return (
//       <Box sx={{ mt: 3, width: '100%' }}>
//         <Divider sx={{ mb: 2 }} />
//         <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: colorPalette[700] }}>
//           Switch Topic
//         </Typography>
//         <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//           {recommendedTopics.map((topic, index) => (
//             <Chip
//               key={index}
//               label={topic.topic || topic.name}
//               onClick={() => handleTopicChange(topic)}
//               variant={selectedTopic === (topic.topic || topic.name) ? "filled" : "outlined"}
//               sx={{
//                 mb: 1,
//                 backgroundColor: selectedTopic === (topic.topic || topic.name) ? colorPalette[500] : 'transparent',
//                 color: selectedTopic === (topic.topic || topic.name) ? 'white' : colorPalette[700],
//                 borderColor: colorPalette[300],
//                 '&:hover': {
//                   backgroundColor: selectedTopic === (topic.topic || topic.name) ? colorPalette[600] : colorPalette[50],
//                 }
//               }}
//             />
//           ))}
//         </Stack>
//       </Box>
//     );
//   };

//   const renderProgress = () => {
//     if (!selectedTopic || totalSubtopics === 0) return null;

//     return (
//       <Box sx={{ mt: 2, width: '100%' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//           <Typography variant="body2" color="text.secondary">
//             Progress
//           </Typography>
//           <Typography variant="body2" fontWeight="600" color={colorPalette[600]}>
//             {completedSubtopics}/{totalSubtopics} completed
//             {isTopicCompleted && <CheckCircle sx={{ fontSize: 16, ml: 0.5 }} />}
//           </Typography>
//         </Box>
//         <Box sx={{ 
//           width: '100%', 
//           height: 6, 
//           backgroundColor: colorPalette[100], 
//           borderRadius: 3,
//           overflow: 'hidden'
//         }}>
//           <Box 
//             sx={{ 
//               height: '100%', 
//               backgroundColor: isTopicCompleted ? colorPalette[600] : colorPalette[500],
//               borderRadius: 3,
//               width: `${progressPercentage}%`,
//               transition: 'width 0.3s ease'
//             }} 
//           />
//         </Box>
//         {isTopicCompleted && (
//           <Typography variant="caption" color={colorPalette[600]} sx={{ mt: 0.5, display: 'block' }}>
//             🎉 Excellent! You've completed this topic
//           </Typography>
//         )}
//       </Box>
//     );
//   };

//   const renderContent = () => {
//     if (isTopicCompleted) {
//       return (
//         <>
//           <Box sx={{ mb: 3 }}>
//             <Box
//               sx={{
//                 width: 80,
//                 height: 80,
//                 borderRadius: '50%',
//                 background: `linear-gradient(135deg, ${colorPalette[600]} 0%, ${colorPalette[800]} 100%)`,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto',
//                 boxShadow: '0 8px 25px rgba(126, 87, 194, 0.4)',
//                 border: '3px solid white'
//               }}
//             >
//               <Celebration sx={{ fontSize: 36, color: 'white' }} />
//             </Box>
//           </Box>

//           <Typography variant="h5" fontWeight="700" sx={{ color: colorPalette[700], mb: 1 }}>
//             Topic Mastered!
//           </Typography>

//           <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
//             Congratulations! You've successfully completed <strong>{selectedTopic}</strong>. 
//             {hasMultipleTopics ? ' Ready to explore another topic?' : ' Ready for your next challenge?'}
//           </Typography>

//           {renderProgress()}
//         </>
//       );
//     }

//     if (isReady && subtopicName) {
//       return (
//         <>
//           <Box sx={{ mb: 3 }}>
//             <Box
//               sx={{
//                 width: 80,
//                 height: 80,
//                 borderRadius: '50%',
//                 background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto',
//                 boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
//                 border: '3px solid white'
//               }}
//             >
//               <School sx={{ fontSize: 36, color: 'white' }} />
//             </Box>
//           </Box>

//           <Typography variant="h5" fontWeight="700" sx={{ color: colorPalette[700], mb: 1 }}>
//             Ready to Learn
//           </Typography>

//           <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
//             Start learning <strong>{subtopicName}</strong> with personalized AI content.
//           </Typography>

//           {renderProgress()}

//           <Button
//             variant="contained"
//             size="large"
//             onClick={onGenerateContent}
//             startIcon={<AutoAwesome />}
//             sx={{
//               mt: 2,
//               py: 1.2,
//               px: 3,
//               borderRadius: 2,
//               fontSize: '1rem',
//               fontWeight: 600,
//               background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//               minWidth: 200
//             }}
//           >
//             Start Learning
//           </Button>
//         </>
//       );
//     }

//     return (
//       <>
//         <Box sx={{ mb: 3 }}>
//           <Box
//             sx={{
//               width: 80,
//               height: 80,
//               borderRadius: '50%',
//               background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto',
//               boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
//               border: '3px solid white'
//             }}
//           >
//             <Lightbulb sx={{ fontSize: 36, color: 'white' }} />
//           </Box>
//         </Box>

//         <Typography variant="h5" fontWeight="700" sx={{ color: colorPalette[700], mb: 1 }}>
//           {hasIncompleteTopics ? 'Continue Learning' : 'Welcome to Guidra'}
//         </Typography>

//         <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
//           {hasIncompleteTopics 
//             ? `You're ${Math.round(progressPercentage)}% through "${selectedTopic}". Continue your journey to mastery.`
//             : 'Select a topic to begin your personalized learning experience with AI-powered content.'
//           }
//         </Typography>

//         {renderProgress()}

//         {hasIncompleteTopics && (
//           <Button
//             variant="contained"
//             size="large"
//             onClick={() => handleQuickStart(firstIncompleteSubtopic)}
//             startIcon={<PlayArrow />}
//             sx={{
//               mt: 2,
//               py: 1.2,
//               px: 3,
//               borderRadius: 2,
//               fontSize: '1rem',
//               fontWeight: 600,
//               background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
//               minWidth: 200
//             }}
//           >
//             Continue Learning
//           </Button>
//         )}
//       </>
//     );
//   };

//   return (
//     <Fade in={true} timeout={500}>
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100%', 
//         width: '100%',
//         p: 2,
//         position: 'relative'
//       }}>
//         {/* Menu Button */}
//         {onOpenSidebar && (
//           <Tooltip title="Open menu">
//             <IconButton
//               onClick={onOpenSidebar}
//               sx={{
//                 position: 'absolute',
//                 top: 16,
//                 left: 16,
//                 width: 40,
//                 height: 40,
//                 display: { xs: 'flex', md: 'none' },
//                 borderRadius: '10px',
//                 background: 'rgba(126, 87, 194, 0.1)',
//                 color: colorPalette[600],
//                 '&:hover': {
//                   background: 'rgba(126, 87, 194, 0.2)',
//                 }
//               }}
//             >
//               <Menu sx={{ fontSize: 20 }} />
//             </IconButton>
//           </Tooltip>
//         )}

//         <Card sx={{ 
//           maxWidth: 500,
//           width: '100%',
//           textAlign: 'center',
//           p: 3,
//           borderRadius: 2,
//           boxShadow: '0 8px 32px rgba(126, 87, 194, 0.1)',
//           border: '1px solid rgba(126, 87, 194, 0.1)',
//         }}>
//           <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
//             {renderContent()}
//             {isTopicCompleted && renderCompletionCelebration()}
//             {renderLearningSuggestions()}
//             {renderTopicSelector()}
//           </CardContent>
//         </Card>
//       </Box>
//     </Fade>
//   );
// };

// // Helper functions
// const getRecentlyAccessedSubtopics = (contentCache, subtopics) => {
//   const cachedEntries = Object.entries(contentCache);
//   const recentlyAccessed = cachedEntries
//     .sort(([, a], [, b]) => (b.timestamp || 0) - (a.timestamp || 0))
//     .slice(0, 3)
//     .map(([key]) => {
//       const subtopicName = key.split('-')[1];
//       return subtopics.find(sub => sub.name === subtopicName);
//     })
//     .filter(Boolean);
  
//   return recentlyAccessed;
// };

// const getHighPrioritySubtopics = (subtopics, generationCounts) => {
//   const incomplete = subtopics.filter(sub => !sub.completed);
//   return incomplete
//     .sort((a, b) => {
//       const aScore = (generationCounts[a.name] || 0) + (a.understandingLevel || 0);
//       const bScore = (generationCounts[b.name] || 0) + (b.understandingLevel || 0);
//       return aScore - bScore; // Lower score = higher priority
//     })
//     .slice(0, 3);
// };

// const getRecommendedTopics = (topics, currentTopic) => {
//   if (!topics || topics.length === 0) return [];
  
//   return topics
//     .filter(topic => (topic.topic || topic.name) !== currentTopic)
//     .slice(0, 3);
// };


import React, { useState, useMemo } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Avatar,
  LinearProgress,
  Paper,
  Container
} from "@mui/material";
import { 
  AutoAwesome,
  PlayArrow,
  Menu,
  TrendingUp,
  Schedule,
  CheckCircle,
  Explore,
  Celebration,
  Whatshot,
  Restore,
  RocketLaunch,
  Psychology,
  Timeline,
  Star,
  ArrowForward,
  Bookmark,
  Bolt,
  SmartToy,
  School
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
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [activeSuggestion, setActiveSuggestion] = useState('continue');
  
  // Memoized calculations
  const learningInsights = useMemo(() => {
    const validSubtopics = Array.isArray(subtopics) ? subtopics : [];
    const totalSubtopics = validSubtopics.length;
    const completedSubtopics = validSubtopics.filter(sub => sub?.completed).length;
    const incompleteSubtopics = validSubtopics.filter(sub => !sub?.completed);
    
    // Consider topic completed when all subtopics are completed (13/13, 14/14, etc.)
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

  // Quick actions
  const quickActions = [
    {
      icon: <Bolt sx={{ fontSize: isMobile ? 18 : 20 }} />,
      name: 'Continue Learning',
      type: 'continue',
      subtitle: 'Pick up where you left',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: <Restore sx={{ fontSize: isMobile ? 18 : 20 }} />,
      name: 'Recent Topic',
      type: 'recent',
      subtitle: 'Jump back in',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    {
      icon: <Whatshot sx={{ fontSize: isMobile ? 18 : 20 }} />,
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

  // Topic selector at the top
  const renderTopicSelector = () => {
    if (!Array.isArray(topics) || topics.length <= 1) return null;

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

  // Progress card
  const renderProgressCard = () => {
    if (!selectedTopic) return null;

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

  // Quick suggestions
  const renderQuickActions = () => {
    if (learningInsights.isTopicCompleted) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
          Learning Suggestions
        </Typography>
        
        <Stack spacing={isMobile ? 1 : 2}>
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
                    transform: isMobile ? 'none' : 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    borderColor: action.color
                  }
                }}
                onClick={() => {
                  setActiveSuggestion(action.type);
                  handleQuickAction(action.type);
                }}
              >
                <CardContent sx={{ p: isMobile ? 2 : 2.5, '&:last-child': { pb: isMobile ? 2 : 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: isMobile ? 36 : 40,
                        height: isMobile ? 36 : 40,
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
                        <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="600" color="#1e293b" noWrap>
                          {action.name}
                        </Typography>
                        <ArrowForward sx={{ fontSize: 16, color: '#64748b', flexShrink: 0 }} />
                      </Box>
                      <Typography variant="caption" color="#64748b" sx={{ lineHeight: 1.2 }}>
                        {action.subtitle}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "caption" : "body2"} 
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

  // Subtopic list (simplified - only show if there are subtopics)
  const renderSubtopicList = () => {
    if (!Array.isArray(subtopics) || subtopics.length === 0 || learningInsights.isTopicCompleted) {
      return null;
    }

    // Show only first 3 incomplete subtopics for suggestions
    const displaySubtopics = learningInsights.incompleteSubtopics.slice(0, 3);

    if (displaySubtopics.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
          Continue With
        </Typography>
        
        <Stack spacing={1}>
          {displaySubtopics.map((subtopic, index) => (
            <Card
              key={subtopic?.name || index}
              sx={{
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                background: 'white',
                '&:hover': {
                  transform: isMobile ? 'none' : 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderColor: colorPalette[500]
                }
              }}
              onClick={() => onSubtopicSelect && onSubtopicSelect(subtopic)}
            >
              <CardContent sx={{ p: isMobile ? 2 : 2, '&:last-child': { pb: isMobile ? 2 : 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Box
                      sx={{
                        width: isMobile ? 32 : 36,
                        height: isMobile ? 32 : 36,
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colorPalette[500]}20 0%, ${colorPalette[600]}20 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        color: colorPalette[500]
                      }}
                    >
                      <School sx={{ fontSize: isMobile ? 16 : 18 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant={isMobile ? "body2" : "body1"} 
                        fontWeight="600" 
                        color="#1e293b"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {subtopic.name}
                      </Typography>
                      <Typography variant="caption" color="#64748b">
                        Ready to learn
                      </Typography>
                    </Box>
                  </Box>
                  <ArrowForward sx={{ fontSize: isMobile ? 16 : 18, color: colorPalette[500] }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  };

  // Completion celebration
  const renderCompletionCelebration = () => {
    if (!learningInsights.isTopicCompleted) return null;

    return (
      <Alert 
        icon={<Celebration />}
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          color: '#065f46',
          border: '1px solid #a7f3d0',
          borderRadius: 2,
          '& .MuiAlert-icon': { color: '#10b981' }
        }}
      >
        <Box>
          <Typography variant={isMobile ? "body2" : "body1"} fontWeight="700" gutterBottom>
            🎉 Course Completed!
          </Typography>
          <Typography variant={isMobile ? "caption" : "body2"} sx={{ opacity: 0.9, mb: 2 }}>
            You've successfully completed {selectedTopic}. Ready to explore more courses?
          </Typography>
          <Button
            variant="contained"
            size={isMobile ? "small" : "medium"}
            onClick={() => window.location.href = '/personalize'}
            startIcon={<Explore />}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: 1,
              whiteSpace: 'nowrap'
            }}
          >
            Explore More Courses
          </Button>
        </Box>
      </Alert>
    );
  };

  // Header
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
          {learningInsights.isTopicCompleted 
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
          {learningInsights.isTopicCompleted 
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

  return (
    <Fade in={true} timeout={400}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Mobile Menu Button */}
        {onOpenSidebar && (
          <Tooltip title="Open menu">
            <IconButton
              onClick={onOpenSidebar}
              sx={{
                position: 'fixed',
                top: isMobile ? 12 : 16,
                left: isMobile ? 12 : 16,
                width: isMobile ? 44 : 48,
                height: isMobile ? 44 : 48,
                display: { xs: 'flex', md: 'none' },
                background: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                color: colorPalette[600],
                zIndex: 1000,
                '&:hover': {
                  background: '#f8fafc',
                }
              }}
            >
              <Menu sx={{ fontSize: isMobile ? 20 : 24 }} />
            </IconButton>
          </Tooltip>
        )}

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
              
              {renderCompletionCelebration()}
              {renderProgressCard()}
              {renderQuickActions()}
              {renderSubtopicList()}

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