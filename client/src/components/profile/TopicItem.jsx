import React from "react";
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Collapse,
  Chip,
  Card,
  alpha
} from "@mui/material";
import { ExpandMore, FolderOpen, CheckCircle } from "@mui/icons-material";
import SubtopicItem from "./SubtopicItem";
import { 
  getSubtopicCompletion, 
  getTopicStatus, 
  getTopicName 
} from "./utils";

const TopicItem = ({ 
  topic, 
  topicIndex, 
  isExpanded, 
  onToggle 
}) => {
  const subtopics = topic.subtopics || topic.subTopics || [];
  const subtopicStats = getSubtopicCompletion(subtopics);
  const topicStatus = getTopicStatus(subtopics) || { color: 'default' }; // FIX: Add fallback

  // FIX: Safe status color with fallback
  const getStatusColor = (color) => {
    const colors = {
      success: { main: '#10b981', light: '#d1fae5' },
      warning: { main: '#f59e0b', light: '#fef3c7' },
      error: { main: '#ef4444', light: '#fee2e2' },
      info: { main: '#3b82f6', light: '#dbeafe' },
      default: { main: '#6b7280', light: '#f3f4f6' }
    };
    return colors[color] || colors.default;
  };

  const statusColor = getStatusColor(topicStatus.color || 'default');

  // FIX: Simple topic name extraction
  const getTopicDisplayName = (topic) => {
    // Try different possible field names from your MongoDB schema
    const topicName = topic.topicName || 
                     topic.topic || 
                     topic.name || 
                     `Topic ${topicIndex + 1}`;
    
    return topicName;
  };

  // DEBUG: Log the data being passed to SubtopicItem
  console.log("🎯 [TopicItem] All subtopics with quiz marks:");
  subtopics.forEach((subtopic, index) => {
    console.log(`   📝 Subtopic "${subtopic.name}":`, {
      quizMark: subtopic.quizMark,
      hasQuizMark: !!subtopic.quizMark,
      completed: subtopic.completed,
      understandingLevel: subtopic.understandingLevel
    });
  });

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: isExpanded ? statusColor.main : 'divider',
        background: isExpanded ? alpha(statusColor.main, 0.02) : 'white',
        boxShadow: isExpanded ? `0 8px 32px ${alpha(statusColor.main, 0.1)}` : '0 4px 20px rgba(0,0,0,0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 12px 40px ${alpha(statusColor.main, 0.15)}`,
          borderColor: statusColor.main,
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
        onClick={() => onToggle(topicIndex)}
      >
        {/* Icon */}
        <Box
          sx={{
            position: 'relative',
            width: 60,
            height: 60,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${statusColor.main} 0%, ${alpha(statusColor.main, 0.8)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0,
            boxShadow: `0 6px 20px ${alpha(statusColor.main, 0.3)}`,
          }}
        >
          <FolderOpen sx={{ fontSize: 28 }} />
          {subtopicStats.percentage === 100 && (
            <CheckCircle
              sx={{
                position: 'absolute',
                top: -6,
                right: -6,
                fontSize: 20,
                color: '#10b981',
                background: 'white',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              }}
            />
          )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            {/* FIX: Use the new function instead of getTopicName */}
            <Typography variant="h6" fontWeight="700" sx={{ 
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {getTopicDisplayName(topic)}
            </Typography>
            <Chip 
              label={`${subtopicStats.completed}/${subtopicStats.total}`}
              color={topicStatus.color || 'default'}
              variant="filled"
              sx={{ 
                fontWeight: 700,
                fontSize: '0.8rem',
                height: 28,
                background: `linear-gradient(135deg, ${statusColor.main} 0%, ${alpha(statusColor.main, 0.8)} 100%)`,
              }}
            />
          </Box>

          {/* Progress Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={subtopicStats.percentage}
              sx={{ 
                flex: 1, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(statusColor.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${statusColor.main} 0%, ${alpha(statusColor.main, 0.8)} 100%)`,
                  boxShadow: `0 2px 8px ${alpha(statusColor.main, 0.4)}`,
                }
              }}
            />
            <Typography variant="body2" fontWeight="700" color={statusColor.main} sx={{ minWidth: 45 }}>
              {subtopicStats.percentage}%
            </Typography>
          </Box>
        </Box>

        {/* Expand Button */}
        <IconButton 
          sx={{ 
            flexShrink: 0,
            background: alpha(statusColor.main, 0.1),
            color: statusColor.main,
            transform: isExpanded ? 'rotate(180deg)' : 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: alpha(statusColor.main, 0.2),
              transform: isExpanded ? 'rotate(180deg) scale(1.1)' : 'scale(1.1)',
            }
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>

      {/* Subtopic List */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 3, pt: 0 }}>
          {subtopics.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {subtopics.map((subtopic, subtopicIndex) => {
                // DEBUG: Log each subtopic being passed
                console.log(`🎯 [TopicItem-Map] Passing to SubtopicItem:`, subtopic);
                return (
                  <SubtopicItem 
                    key={subtopicIndex} 
                    subtopic={subtopic} 
                  />
                );
              })}
            </Box>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              background: alpha(statusColor.main, 0.03),
              borderRadius: 2,
              border: `1px dashed ${alpha(statusColor.main, 0.3)}`,
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No subtopics available for this topic yet.
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default TopicItem;