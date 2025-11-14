import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  Rating,
  CircularProgress
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  PlayArrow,
  Star
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
  progress
}) => {
  const getUnderstandingColor = (level) => {
    if (!level) return 'grey';
    if (level <= 2) return 'error';
    if (level <= 4) return 'warning';
    return 'success';
  };

  const SubtopicItem = ({ subtopic, index }) => (
    <ListItem 
      // ❌ Remove the 'button' attribute - it's not needed for ListItem
      selected={selectedSubtopic?.name === subtopic.name}
      onClick={() => onSubtopicSelect(subtopic)}
      disabled={updatingSubtopic === subtopic.name}
      sx={{ 
        borderRadius: 2,
        mb: 1,
        py: 2,
        backgroundColor: selectedSubtopic?.name === subtopic.name ? 'primary.main' : 'transparent',
        color: selectedSubtopic?.name === subtopic.name ? 'white' : 'text.primary',
        border: selectedSubtopic?.name === subtopic.name ? '2px solid' : '2px solid transparent',
        borderColor: 'primary.main',
        '&:hover': {
          backgroundColor: selectedSubtopic?.name === subtopic.name ? 'primary.dark' : 'action.hover',
        },
        cursor: 'pointer' // Add cursor pointer for better UX
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {updatingSubtopic === subtopic.name ? (
                <CircularProgress size={16} color="inherit" />
              ) : subtopic.completed ? (
                <CheckCircle color="inherit" fontSize="small" />
              ) : contentCache[subtopic.name] ? (
                <PlayArrow color="inherit" fontSize="small" />
              ) : (
                <RadioButtonUnchecked color="inherit" fontSize="small" />
              )}
            </ListItemIcon>
            <Typography variant="body2" fontWeight="600">
              {subtopic.name}
            </Typography>
          </Box>
          
          {subtopic.understandingLevel > 0 && (
            <Star sx={{ fontSize: 16, color: 'gold' }} />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Tooltip title="Rate your understanding">
            <span>
              <Rating
                value={subtopic.understandingLevel || 0}
                onChange={(event, newValue) => {
                  if (newValue !== null) onUpdateUnderstanding(subtopic, newValue);
                }}
                size="small"
                disabled={updatingSubtopic === subtopic.name}
                sx={{
                  '& .MuiRating-icon': {
                    color: selectedSubtopic?.name === subtopic.name ? 'white' : getUnderstandingColor(subtopic.understandingLevel)
                  }
                }}
              />
            </span>
          </Tooltip>
          
          {subtopic.completed && (
            <Chip 
              label="Completed" 
              size="small" 
              color="success"
              sx={{ 
                height: 20,
                '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
              }}
            />
          )}
        </Box>
      </Box>
    </ListItem>
  );

  const TopicItem = ({ topic, index }) => (
    <ListItem 
      // ❌ Remove the 'button' attribute here too
      onClick={() => onTopicSelect(topic.topic)}
      selected={selectedTopic === topic.topic}
      sx={{ 
        borderRadius: 2,
        mb: 1,
        backgroundColor: selectedTopic === topic.topic ? 'primary.light' : 'transparent',
        '&:hover': {
          backgroundColor: selectedTopic === topic.topic ? 'primary.light' : 'action.hover',
        },
        cursor: 'pointer' // Add cursor pointer
      }}
    >
      <ListItemText 
        primary={
          <Typography variant="body2" fontWeight="600">
            {topic.topic}
          </Typography>
        } 
        secondary={`${topic.subTopics?.filter(s => s.completed).length || 0}/${topic.subTopics?.length || 0} completed`}
      />
    </ListItem>
  );

  return (
    <Card sx={{ 
      width: '100%', 
      height: '100%',
      borderRadius: 3, 
      boxShadow: 3,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight="800" gutterBottom color="primary">
          📚 Learning Path
        </Typography>
        
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', p: 2, borderRadius: 2, mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight="600">
              Course Progress
            </Typography>
            <Chip 
              label={`${Math.round(progress)}%`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white'
              }
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
            {subtopics.filter(s => s.completed).length} of {subtopics.length} completed
          </Typography>
        </Card>
      </Box>

      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight="700" gutterBottom color="text.secondary">
          Your Topics
        </Typography>
        <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
          <List dense>
            {topics.map((topic, index) => (
              <TopicItem key={index} topic={topic} index={index} />
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Typography variant="subtitle1" fontWeight="700" gutterBottom color="text.secondary">
          Subtopics
        </Typography>
        <List sx={{ py: 0 }}>
          {subtopics.map((subtopic, index) => (
            <SubtopicItem key={index} subtopic={subtopic} index={index} />
          ))}
        </List>
      </Box>
    </Card>
  );
};

export default LearningSidebar;