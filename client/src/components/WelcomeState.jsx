import React from 'react';
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
  Divider,
  Alert
} from "@mui/material";
import { 
  AutoAwesome,
  School,
  PlayArrow,
  Menu,
  TrendingUp,
  Schedule,
  Star,
  Lightbulb,
  CheckCircle,
  Explore,
  Celebration
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
  // Calculate learning insights
  const totalSubtopics = subtopics.length;
  const completedSubtopics = subtopics.filter(sub => sub.completed).length;
  const incompleteSubtopics = subtopics.filter(sub => !sub.completed);
  const progressPercentage = totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;
  
  // Check completion status
  const isTopicCompleted = totalSubtopics > 0 && incompleteSubtopics.length === 0;
  const hasIncompleteTopics = incompleteSubtopics.length > 0;
  const hasMultipleTopics = topics && topics.length > 1;

  // Find learning suggestions
  const firstIncompleteSubtopic = incompleteSubtopics[0];
  const recentlyAccessed = getRecentlyAccessedSubtopics(contentCache, subtopics);
  const highPrioritySubtopics = getHighPrioritySubtopics(subtopics, generationCounts);
  const recommendedTopics = getRecommendedTopics(topics, selectedTopic);

  const handleQuickStart = (subtopic) => {
    if (onSubtopicSelect) {
      onSubtopicSelect(subtopic);
    }
  };

  const handleTopicChange = (topic) => {
    if (onTopicSelect) {
      onTopicSelect(topic.topic || topic.name);
    }
  };

  const handleExplorePersonalize = () => {
    // Navigate to personalize page
    window.location.href = '/personalize';
  };

  const renderCompletionCelebration = () => {
    if (!isTopicCompleted) return null;

    return (
      <Box sx={{ width: '100%', mb: 3 }}>
        <Alert 
          severity="success"
          icon={<Celebration />}
          sx={{
            borderRadius: 2,
            backgroundColor: `${colorPalette[50]} !important`,
            color: colorPalette[800],
            border: `1px solid ${colorPalette[200]}`,
            '& .MuiAlert-icon': {
              color: colorPalette[600],
            }
          }}
        >
          <Typography variant="body1" fontWeight="600">
            🎉 Topic Completed!
          </Typography>
          <Typography variant="body2">
            You've mastered all subtopics in {selectedTopic}. Ready for your next challenge?
          </Typography>
        </Alert>

        <Button
          variant="contained"
          size="large"
          onClick={handleExplorePersonalize}
          startIcon={<Explore />}
          sx={{
            mt: 2,
            py: 1.2,
            px: 3,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
            width: '100%'
          }}
        >
          Explore More Courses
        </Button>
      </Box>
    );
  };

  const renderLearningSuggestions = () => {
    if (isTopicCompleted || !hasIncompleteTopics) return null;

    return (
      <Box sx={{ mt: 3, width: '100%' }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: colorPalette[700] }}>
          Learning Suggestions
        </Typography>
        
        <Stack spacing={1}>
          {/* Continue with First Incomplete */}
          {firstIncompleteSubtopic && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleQuickStart(firstIncompleteSubtopic)}
              startIcon={<PlayArrow />}
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 2,
                borderColor: colorPalette[200],
                color: colorPalette[700],
                '&:hover': {
                  borderColor: colorPalette[500],
                  backgroundColor: colorPalette[50]
                }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="600">
                  Continue: {firstIncompleteSubtopic.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Next topic in your learning path
                </Typography>
              </Box>
            </Button>
          )}

          {/* Recently Accessed */}
          {recentlyAccessed.length > 0 && recentlyAccessed[0]?.name !== firstIncompleteSubtopic?.name && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleQuickStart(recentlyAccessed[0])}
              startIcon={<Schedule />}
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 2,
                borderColor: colorPalette[200],
                color: colorPalette[700],
                '&:hover': {
                  borderColor: colorPalette[500],
                  backgroundColor: colorPalette[50]
                }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="600">
                  Recent: {recentlyAccessed[0].name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Continue from last session
                </Typography>
              </Box>
            </Button>
          )}

          {/* High Priority */}
          {highPrioritySubtopics.length > 0 && highPrioritySubtopics[0]?.name !== firstIncompleteSubtopic?.name && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleQuickStart(highPrioritySubtopics[0])}
              startIcon={<TrendingUp />}
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 2,
                borderColor: colorPalette[200],
                color: colorPalette[700],
                '&:hover': {
                  borderColor: colorPalette[500],
                  backgroundColor: colorPalette[50]
                }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="600">
                  Priority: {highPrioritySubtopics[0].name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Needs more practice
                </Typography>
              </Box>
            </Button>
          )}
        </Stack>
      </Box>
    );
  };

  const renderTopicSelector = () => {
    if (!hasMultipleTopics) return null;

    return (
      <Box sx={{ mt: 3, width: '100%' }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: colorPalette[700] }}>
          Switch Topic
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {recommendedTopics.map((topic, index) => (
            <Chip
              key={index}
              label={topic.topic || topic.name}
              onClick={() => handleTopicChange(topic)}
              variant={selectedTopic === (topic.topic || topic.name) ? "filled" : "outlined"}
              sx={{
                mb: 1,
                backgroundColor: selectedTopic === (topic.topic || topic.name) ? colorPalette[500] : 'transparent',
                color: selectedTopic === (topic.topic || topic.name) ? 'white' : colorPalette[700],
                borderColor: colorPalette[300],
                '&:hover': {
                  backgroundColor: selectedTopic === (topic.topic || topic.name) ? colorPalette[600] : colorPalette[50],
                }
              }}
            />
          ))}
        </Stack>
      </Box>
    );
  };

  const renderProgress = () => {
    if (!selectedTopic || totalSubtopics === 0) return null;

    return (
      <Box sx={{ mt: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Progress
          </Typography>
          <Typography variant="body2" fontWeight="600" color={colorPalette[600]}>
            {completedSubtopics}/{totalSubtopics} completed
            {isTopicCompleted && <CheckCircle sx={{ fontSize: 16, ml: 0.5 }} />}
          </Typography>
        </Box>
        <Box sx={{ 
          width: '100%', 
          height: 6, 
          backgroundColor: colorPalette[100], 
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <Box 
            sx={{ 
              height: '100%', 
              backgroundColor: isTopicCompleted ? colorPalette[600] : colorPalette[500],
              borderRadius: 3,
              width: `${progressPercentage}%`,
              transition: 'width 0.3s ease'
            }} 
          />
        </Box>
        {isTopicCompleted && (
          <Typography variant="caption" color={colorPalette[600]} sx={{ mt: 0.5, display: 'block' }}>
            🎉 Excellent! You've completed this topic
          </Typography>
        )}
      </Box>
    );
  };

  const renderContent = () => {
    if (isTopicCompleted) {
      return (
        <>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colorPalette[600]} 0%, ${colorPalette[800]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 8px 25px rgba(126, 87, 194, 0.4)',
                border: '3px solid white'
              }}
            >
              <Celebration sx={{ fontSize: 36, color: 'white' }} />
            </Box>
          </Box>

          <Typography variant="h5" fontWeight="700" sx={{ color: colorPalette[700], mb: 1 }}>
            Topic Mastered!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
            Congratulations! You've successfully completed <strong>{selectedTopic}</strong>. 
            {hasMultipleTopics ? ' Ready to explore another topic?' : ' Ready for your next challenge?'}
          </Typography>

          {renderProgress()}
        </>
      );
    }

    if (isReady && subtopicName) {
      return (
        <>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
                border: '3px solid white'
              }}
            >
              <School sx={{ fontSize: 36, color: 'white' }} />
            </Box>
          </Box>

          <Typography variant="h5" fontWeight="700" sx={{ color: colorPalette[700], mb: 1 }}>
            Ready to Learn
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
            Start learning <strong>{subtopicName}</strong> with personalized AI content.
          </Typography>

          {renderProgress()}

          <Button
            variant="contained"
            size="large"
            onClick={onGenerateContent}
            startIcon={<AutoAwesome />}
            sx={{
              mt: 2,
              py: 1.2,
              px: 3,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
              minWidth: 200
            }}
          >
            Start Learning
          </Button>
        </>
      );
    }

    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
              border: '3px solid white'
            }}
          >
            <Lightbulb sx={{ fontSize: 36, color: 'white' }} />
          </Box>
        </Box>

        <Typography variant="h5" fontWeight="700" sx={{ color: colorPalette[700], mb: 1 }}>
          {hasIncompleteTopics ? 'Continue Learning' : 'Welcome to Guidra'}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
          {hasIncompleteTopics 
            ? `You're ${Math.round(progressPercentage)}% through "${selectedTopic}". Continue your journey to mastery.`
            : 'Select a topic to begin your personalized learning experience with AI-powered content.'
          }
        </Typography>

        {renderProgress()}

        {hasIncompleteTopics && (
          <Button
            variant="contained"
            size="large"
            onClick={() => handleQuickStart(firstIncompleteSubtopic)}
            startIcon={<PlayArrow />}
            sx={{
              mt: 2,
              py: 1.2,
              px: 3,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
              minWidth: 200
            }}
          >
            Continue Learning
          </Button>
        )}
      </>
    );
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        width: '100%',
        p: 2,
        position: 'relative'
      }}>
        {/* Menu Button */}
        {onOpenSidebar && (
          <Tooltip title="Open menu">
            <IconButton
              onClick={onOpenSidebar}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                width: 40,
                height: 40,
                display: { xs: 'flex', md: 'none' },
                borderRadius: '10px',
                background: 'rgba(126, 87, 194, 0.1)',
                color: colorPalette[600],
                '&:hover': {
                  background: 'rgba(126, 87, 194, 0.2)',
                }
              }}
            >
              <Menu sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}

        <Card sx={{ 
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          p: 3,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(126, 87, 194, 0.1)',
          border: '1px solid rgba(126, 87, 194, 0.1)',
        }}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            {renderContent()}
            {isTopicCompleted && renderCompletionCelebration()}
            {renderLearningSuggestions()}
            {renderTopicSelector()}
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

// Helper functions
const getRecentlyAccessedSubtopics = (contentCache, subtopics) => {
  const cachedEntries = Object.entries(contentCache);
  const recentlyAccessed = cachedEntries
    .sort(([, a], [, b]) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 3)
    .map(([key]) => {
      const subtopicName = key.split('-')[1];
      return subtopics.find(sub => sub.name === subtopicName);
    })
    .filter(Boolean);
  
  return recentlyAccessed;
};

const getHighPrioritySubtopics = (subtopics, generationCounts) => {
  const incomplete = subtopics.filter(sub => !sub.completed);
  return incomplete
    .sort((a, b) => {
      const aScore = (generationCounts[a.name] || 0) + (a.understandingLevel || 0);
      const bScore = (generationCounts[b.name] || 0) + (b.understandingLevel || 0);
      return aScore - bScore; // Lower score = higher priority
    })
    .slice(0, 3);
};

const getRecommendedTopics = (topics, currentTopic) => {
  if (!topics || topics.length === 0) return [];
  
  return topics
    .filter(topic => (topic.topic || topic.name) !== currentTopic)
    .slice(0, 3);
};

export default WelcomeState;