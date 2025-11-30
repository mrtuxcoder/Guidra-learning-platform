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

  // Progress card - Updated for desktop with square shapes
  const renderProgressCard = () => {
    if (!selectedTopic) return null;

    return (
      <Card sx={{ 
        mb: 3, 
        p: isMobile ? 2 : 3,
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: isDesktop ? 2 : 2, // Square corners on desktop
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
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              borderRadius: isDesktop ? 1 : 4, // Square corners on desktop
            }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={learningInsights.progressPercentage}
            sx={{
              height: isMobile ? 6 : 8,
              borderRadius: isDesktop ? 0 : 4, // Square corners on desktop
              backgroundColor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                background: learningInsights.isTopicCompleted 
                  ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                  : `linear-gradient(90deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`,
                borderRadius: isDesktop ? 0 : 4, // Square corners on desktop
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

  // Quick suggestions - Updated for desktop with square shapes and wider alignment
  const renderQuickActions = () => {
    if (learningInsights.isTopicCompleted) return null;

    if (isDesktop) {
      // Desktop layout with square shapes and wider columns
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#1e293b' }}>
            Learning Suggestions
          </Typography>
          
          <Grid container spacing={3}>
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
                <Grid item xs={12} md={4} key={action.type}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: `2px solid #e2e8f0`,
                      borderRadius: 2, // Square corners
                      transition: 'all 0.2s ease',
                      background: 'white',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                        borderColor: action.color
                      }
                    }}
                    onClick={() => {
                      setActiveSuggestion(action.type);
                      handleQuickAction(action.type);
                    }}
                  >
                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2, // Square corners
                            background: action.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                          }}
                        >
                          {React.cloneElement(action.icon, { 
                            sx: { fontSize: 24, color: 'white' } 
                          })}
                        </Box>
                        
                        <Typography variant="subtitle1" fontWeight="700" color="#1e293b" gutterBottom>
                          {action.name}
                        </Typography>
                        
                        <Typography variant="body2" color="#64748b" sx={{ mb: 2, lineHeight: 1.4 }}>
                          {action.subtitle}
                        </Typography>
                        
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <Typography 
                            variant="body2" 
                            color="#1e293b" 
                            sx={{ 
                              fontWeight: '600',
                              p: 2,
                              background: '#f8fafc',
                              borderRadius: 1, // Square corners
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            {subtopic.name}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      );
    }

    // Mobile layout (unchanged)
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
                        <ArrowForward sx={{ fontSize: 16, color: '#64748b', flexShrink: 0 }} />
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

  // Subtopic list (simplified - only show if there are subtopics) - Updated for desktop
  const renderSubtopicList = () => {
    if (!Array.isArray(subtopics) || subtopics.length === 0 || learningInsights.isTopicCompleted) {
      return null;
    }

    // Show only first 3 incomplete subtopics for suggestions
    const displaySubtopics = learningInsights.incompleteSubtopics.slice(0, 3);

    if (displaySubtopics.length === 0) return null;

    if (isDesktop) {
      // Desktop layout with square cards
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#1e293b' }}>
            Continue With
          </Typography>
          
          <Grid container spacing={2}>
            {displaySubtopics.map((subtopic, index) => (
              <Grid item xs={12} md={4} key={subtopic?.name || index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2, // Square corners
                    transition: 'all 0.2s ease',
                    background: 'white',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      borderColor: colorPalette[500]
                    }
                  }}
                  onClick={() => onSubtopicSelect && onSubtopicSelect(subtopic)}
                >
                  <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2, // Square corners
                            background: `linear-gradient(135deg, ${colorPalette[500]}20 0%, ${colorPalette[600]}20 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            color: colorPalette[500]
                          }}
                        >
                          <School sx={{ fontSize: 20 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body1" 
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
                      <ArrowForward sx={{ fontSize: 20, color: colorPalette[500] }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    // Mobile layout (unchanged)
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
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
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderColor: colorPalette[500]
                }
              }}
              onClick={() => onSubtopicSelect && onSubtopicSelect(subtopic)}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colorPalette[500]}20 0%, ${colorPalette[600]}20 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        color: colorPalette[500]
                      }}
                    >
                      <School sx={{ fontSize: 16 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
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
                  <ArrowForward sx={{ fontSize: 16, color: colorPalette[500] }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  };

  // Completion celebration - Updated for desktop with square shapes
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
          borderRadius: isDesktop ? 2 : 2, // Square corners on desktop
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
              borderRadius: isDesktop ? 1 : 1, // Square corners on desktop
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
        flexDirection: 'column',
        // Modern scrollbar styles
        '& ::-webkit-scrollbar': {
          width: '8px',
        },
        '& ::-webkit-scrollbar-track': {
          background: '#f1f5f9',
          borderRadius: '4px',
        },
        '& ::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '4px',
          '&:hover': {
            background: '#94a3b8',
          },
        },
        '& *': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9',
        },
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
              px: isMobile ? 2 : isDesktop ? 4 : 2, // Wider padding on desktop
              maxWidth: isDesktop ? '1200px' : '100%', // Wider container on desktop
            }}
          >
            <Box sx={{ 
              maxWidth: isDesktop ? '100%' : '100%', // Full width on desktop
              margin: '0 auto'
            }}>
              {/* Topic Selector at the top */}
              {renderTopicSelector()}
              
              {renderCompletionCelebration()}
              {renderProgressCard()}
              {renderQuickActions()}
              {renderSubtopicList()}

              {/* Main CTA Button - Updated for desktop with square shape */}
              {isReady && !learningInsights.isTopicCompleted && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGenerateContent}
                  startIcon={<AutoAwesome />}
                  sx={{
                    width: '100%',
                    py: isMobile ? 1.5 : 2.5,
                    borderRadius: isDesktop ? 2 : 2, // Square corners on desktop
                    fontSize: isMobile ? '1rem' : '1.2rem',
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