import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Card,
  useTheme,
  useMediaQuery,
  alpha,
  LinearProgress,
  Collapse,
  IconButton
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  ExpandMore,
  ExpandLess
} from "@mui/icons-material";

const LearningSidebar = ({
  topics,
  subtopics,
  selectedTopic,
  selectedSubtopic,
  updatingSubtopic,
  contentCache,
  generationCounts,
  onTopicSelect,
  onSubtopicSelect,
  onUpdateUnderstanding,
  progress,
  colorPalette
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedTopic, setExpandedTopic] = useState(null);

  // Sync the topics with the updated subtopics
  const syncedTopics = useMemo(() => {
    if (!topics.length || !subtopics.length) return topics;
    
    return topics.map(topic => {
      // Find subtopics that belong to this topic and merge with updated data
      const updatedSubTopics = topic.subTopics?.map(subtopic => {
        const updatedSubtopic = subtopics.find(sub => sub.name === subtopic.name);
        return updatedSubtopic || subtopic;
      }) || [];
      
      return {
        ...topic,
        subTopics: updatedSubTopics
      };
    });
  }, [topics, subtopics]);

  const handleTopicClick = (topicName) => {
    onTopicSelect(topicName);
    // Only auto-expand on mobile if it's not already expanded
    if (isMobile && expandedTopic !== topicName) {
      setExpandedTopic(topicName);
    }
  };

  const handleExpandClick = (topicName, event) => {
    event.stopPropagation(); // Prevent topic selection when clicking expand icon
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  // Find the parent topic for a subtopic
  const findParentTopic = (subtopicName) => {
    for (const topic of syncedTopics) {
      if (topic.subTopics?.some(sub => sub.name === subtopicName)) {
        return topic.topic;
      }
    }
    return null;
  };

  const handleSubtopicClick = (subtopic, topicName) => {
    // First select the parent topic
    const parentTopic = topicName || findParentTopic(subtopic.name);
    if (parentTopic && parentTopic !== selectedTopic) {
      onTopicSelect(parentTopic);
    }
    
    // Then select the subtopic
    onSubtopicSelect(subtopic);
    
    // Close the topic when a subtopic is selected on mobile
    if (isMobile) {
      setExpandedTopic(null);
    }
  };

  // Premium completion indicator
  const CompletionIndicator = ({ completed, isSelected }) => (
    <Box
      sx={{
        position: 'relative',
        width: 20,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {completed ? (
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: colorPalette[600],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 8px ${alpha(colorPalette[600], 0.3)}`,
            animation: 'scaleIn 0.3s ease-out',
            '@keyframes scaleIn': {
              '0%': { transform: 'scale(0)' },
              '70%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' }
            }
          }}
        >
          <CheckCircle 
            sx={{ 
              fontSize: 12, 
              color: 'white'
            }} 
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: `2px solid ${colorPalette[200]}`,
            backgroundColor: 'white',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: colorPalette[300],
            }
          }}
        />
      )}
    </Box>
  );

  const SubtopicItem = ({ subtopic, index, topicName }) => {
    const hasContent = contentCache[`${selectedTopic}-${subtopic.name}`] || contentCache[subtopic.name];
    const isSelected = selectedSubtopic?.name === subtopic.name;
    const isUpdating = updatingSubtopic === subtopic.name;

    return (
      <ListItem 
        selected={isSelected}
        onClick={() => handleSubtopicClick(subtopic, topicName)}
        disabled={isUpdating}
        sx={{ 
          borderRadius: 1,
          py: 1.25,
          px: 3,
          backgroundColor: isSelected ? alpha(colorPalette[50], 0.8) : 'transparent',
          color: 'text.primary',
          border: 'none',
          position: 'relative',
          '&:hover': {
            backgroundColor: alpha(colorPalette[50], 0.6),
          },
          '&.Mui-disabled': {
            opacity: 0.5,
            pointerEvents: 'none'
          },
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          borderLeft: isSelected ? `3px solid ${colorPalette[500]}` : '3px solid transparent'
        }}
      >
        {/* Loading overlay */}
        {isUpdating && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: `2px solid ${colorPalette[100]}`,
                borderTop: `2px solid ${colorPalette[600]}`,
                animation: 'spin 1s linear infinite'
              }}
            />
          </Box>
        )}

        <Box sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2
          }}>
            {/* Completion Indicator */}
            <CompletionIndicator 
              completed={subtopic.completed} 
              isSelected={isSelected}
            />

            {/* Subtopic Name */}
            <Typography 
              variant="body2" 
              fontWeight="400"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                fontSize: '0.85rem',
                color: isSelected ? colorPalette[700] : 'text.primary',
                lineHeight: 1.4
              }}
            >
              {subtopic.name}
            </Typography>

            {/* Status Indicator */}
            {hasContent && !isUpdating && (
              <Tooltip title="Content ready">
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: colorPalette[500],
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      </ListItem>
    );
  };

  const TopicItem = ({ topic, index }) => {
    const isSelected = selectedTopic === topic.topic;
    const isExpanded = expandedTopic === topic.topic;
    const completedCount = topic.subTopics?.filter(s => s.completed).length || 0;
    const totalCount = topic.subTopics?.length || 0;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
      <Box sx={{ mb: 1.5 }}>
        {/* Topic Header */}
        <ListItem 
          onClick={() => handleTopicClick(topic.topic)}
          selected={isSelected}
          sx={{ 
            borderRadius: 1,
            py: 1.5,
            px: 2,
            backgroundColor: isSelected ? alpha(colorPalette[50], 0.8) : 'transparent',
            border: `1px solid ${isSelected ? colorPalette[300] : colorPalette[100]}`,
            position: 'relative',
            '&:hover': {
              backgroundColor: alpha(colorPalette[50], 0.6),
              borderColor: colorPalette[200],
            },
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography 
                  variant="body2" 
                  fontWeight="600"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: isSelected ? colorPalette[700] : 'text.primary',
                    fontSize: '0.9rem'
                  }}
                >
                  {topic.topic}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={(event) => handleExpandClick(topic.topic, event)}
                  sx={{ 
                    color: colorPalette[500],
                    transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <ExpandMore />
                </IconButton>
              </Box>
            } 
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight="500"
                >
                  {completedCount}/{totalCount} completed
                </Typography>
                <Typography 
                  variant="caption" 
                  color={colorPalette[600]} 
                  fontWeight="600"
                >
                  {Math.round(progress)}%
                </Typography>
              </Box>
            }
            sx={{ my: 0, width: '100%' }}
          />
        </ListItem>
        
        {/* Progress Bar */}
        <Box sx={{ px: 2, mt: 0.5 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 3, 
              borderRadius: 2,
              backgroundColor: colorPalette[100],
              '& .MuiLinearProgress-bar': {
                backgroundColor: colorPalette[500],
                borderRadius: 2,
              }
            }}
          />
        </Box>

        {/* Subtopic Collapse */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List sx={{ py: 0.5, pl: 1 }}>
            {topic.subTopics?.map((subtopic, subIndex) => (
              <SubtopicItem 
                key={subIndex} 
                subtopic={subtopic} 
                index={subIndex}
                topicName={topic.topic}
              />
            ))}
          </List>
        </Collapse>
      </Box>
    );
  };

  return (
    <Card sx={{ 
      width: '100%', 
      height: '100%',
      borderRadius: { xs: 0, md: 2 },
      boxShadow: { xs: 'none', md: '0 2px 24px rgba(126, 87, 194, 0.08)' },
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      border: { xs: 'none', md: `1px solid ${colorPalette[100]}` },
      position: 'relative',
      overflow: 'hidden',
      '& ::-webkit-scrollbar': {
        width: '6px',
      },
      '& ::-webkit-scrollbar-track': {
        background: colorPalette[50],
        borderRadius: '3px',
      },
      '& ::-webkit-scrollbar-thumb': {
        background: colorPalette[200],
        borderRadius: '3px',
        transition: 'background 0.2s ease',
      },
      '& ::-webkit-scrollbar-thumb:hover': {
        background: colorPalette[300],
      },
      '& *': {
        scrollbarWidth: 'thin',
        scrollbarColor: `${colorPalette[200]} ${colorPalette[50]}`,
      }
    }}>
      {/* Header Section */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${colorPalette[100]}`,
        background: 'white'
      }}>
        <Typography 
          variant="h6" 
          fontWeight="700" 
          sx={{ 
            color: colorPalette[700],
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '6px',
              backgroundColor: colorPalette[600],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: 'white',
              fontWeight: 'bold',
              boxShadow: `0 2px 8px ${alpha(colorPalette[600], 0.3)}`
            }}
          >
            ●
          </Box>
          Course Content
        </Typography>
      </Box>

      {/* Topics Section with Progress */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 2.5
      }}>
        <Box>
          {syncedTopics.map((topic, index) => (
            <TopicItem key={index} topic={topic} index={index} />
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default LearningSidebar;