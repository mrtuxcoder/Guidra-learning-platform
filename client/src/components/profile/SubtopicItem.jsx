import React from "react";
import {
  Box,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress
} from "@mui/material";
import { 
  TaskAlt,
  RadioButtonUnchecked,
  PlayArrow,
  Star,
  Schedule,
  Quiz
} from "@mui/icons-material";
import { 
  isSubtopicCompleted, 
  getUnderstandingLevel, 
  getSubtopicName, 
  getLastReviewed 
} from "./utils";
import { understandingLevels } from "./constants";

// Map icon names to actual components
const iconComponents = {
  TaskAlt: TaskAlt,
  RadioButtonUnchecked: RadioButtonUnchecked,
  PlayArrow: PlayArrow,
  Star: Star
};

const SubtopicItem = ({ subtopic }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery('(max-width:480px)');

  const isCompleted = isSubtopicCompleted(subtopic);
  const understanding = getUnderstandingLevel(subtopic, understandingLevels);
  const lastReviewed = getLastReviewed(subtopic);
  
  // Get quiz marks if available
  const hasQuizMarks = subtopic.quizMark && subtopic.quizMark.total > 0;
  const quizCorrect = hasQuizMarks ? subtopic.quizMark.correct : 0;
  const quizTotal = hasQuizMarks ? subtopic.quizMark.total : 0;
  const quizPercentage = hasQuizMarks ? subtopic.quizMark.percentage : 0;
  
  const IconComponent = iconComponents[understanding.icon] || TaskAlt;

  // DEBUG: Log the quiz mark data
  console.log("🎯 [SubtopicItem] Quiz marks:", {
    name: getSubtopicName(subtopic),
    hasQuizMarks,
    quizCorrect,
    quizTotal,
    quizPercentage,
    quizMark: subtopic.quizMark
  });

  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        p: isSmallMobile ? 2 : isMobile ? 2.5 : 3,
        mb: isSmallMobile ? 1.5 : isMobile ? 2 : 1.5,
        borderRadius: 2,
        backgroundColor: isCompleted ? 'success.light' : 'background.paper',
        border: '1px solid',
        borderColor: isCompleted ? 'success.main' : 'divider',
        transition: 'all 0.3s ease',
        width: '100%',
        minHeight: isSmallMobile ? 70 : isMobile ? 80 : 85,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        '&:hover': {
          backgroundColor: isCompleted ? 'success.light' : 'action.hover',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      {/* Icon Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: isSmallMobile ? 32 : isMobile ? 36 : 40,
        height: isSmallMobile ? 32 : isMobile ? 36 : 40,
        borderRadius: '50%',
        bgcolor: isCompleted ? 'success.main' : 'grey.50',
        color: isCompleted ? 'white' : 'text.secondary',
        mr: isSmallMobile ? 2 : isMobile ? 2.5 : 3,
        flexShrink: 0,
        border: isCompleted ? '2px solid' : '1px solid',
        borderColor: isCompleted ? 'success.dark' : 'divider',
      }}>
        {isCompleted ? (
          <TaskAlt sx={{ fontSize: isSmallMobile ? 16 : isMobile ? 18 : 20 }} />
        ) : (
          <IconComponent sx={{ fontSize: isSmallMobile ? 16 : isMobile ? 18 : 20 }} />
        )}
      </Box>

      {/* Content Section */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: isSmallMobile ? 0.75 : 1,
        width: '100%',
        minWidth: 0
      }}>
        
        {/* Top Row - Title and Completion Status */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1,
          width: '100%'
        }}>
          <Typography 
            variant={isMobile ? "body1" : "body2"}
            fontWeight="600"
            sx={{ 
              color: isCompleted ? 'success.dark' : 'text.primary',
              lineHeight: 1.3,
              flex: 1,
              pr: 1,
              wordBreak: 'break-word',
              fontSize: isSmallMobile ? '0.9rem' : isMobile ? '1rem' : '0.95rem'
            }}
          >
            {getSubtopicName(subtopic)}
          </Typography>

          {/* Completion Status */}
          {isCompleted && (
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0
            }}>
              <TaskAlt 
                sx={{ 
                  fontSize: isSmallMobile ? 16 : 18,
                  color: 'success.main',
                }} 
              />
              {!isSmallMobile && (
                <Typography 
                  variant="caption" 
                  color="success.main"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}
                >
                  Done
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Middle Row - Quiz Marks (NEW SECTION) */}
        {hasQuizMarks && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: '100%'
          }}>
            {/* Quiz Icon and Score */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              flexShrink: 0
            }}>
              <Quiz 
                sx={{ 
                  fontSize: isSmallMobile ? 14 : 16,
                  color: quizPercentage >= 70 ? 'success.main' : 
                         quizPercentage >= 50 ? 'warning.main' : 'error.main'
                }} 
              />
              <Typography 
                variant="caption" 
                fontWeight="600"
                sx={{ 
                  fontSize: isSmallMobile ? '0.7rem' : '0.75rem',
                  color: quizPercentage >= 70 ? 'success.main' : 
                         quizPercentage >= 50 ? 'warning.main' : 'error.main'
                }}
              >
                {quizCorrect}/{quizTotal}
              </Typography>
            </Box>

            {/* Quiz Progress Bar */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center',
              gap: 1
            }}>
              <LinearProgress 
                variant="determinate" 
                value={quizPercentage}
                sx={{ 
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: quizPercentage >= 70 ? 'success.main' : 
                                    quizPercentage >= 50 ? 'warning.main' : 'error.main',
                    borderRadius: 3
                  }
                }}
              />
              
              {/* Percentage (hidden on very small screens) */}
              {!isSmallMobile && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    minWidth: 30,
                    textAlign: 'right'
                  }}
                >
                  {quizPercentage}%
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Bottom Row - Understanding Level and Date */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          width: '100%',
          flexWrap: isSmallMobile ? 'wrap' : 'nowrap'
        }}>
          
          {/* Left Side - Understanding Level */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1
          }}>
            <Chip
              label={understanding.label}
              size="small"
              color={understanding.color}
              variant={isCompleted ? "filled" : "outlined"}
              sx={{ 
                fontWeight: 600,
                fontSize: isSmallMobile ? '0.7rem' : '0.75rem',
                height: isSmallMobile ? 24 : 26,
                minWidth: isSmallMobile ? 60 : 70
              }}
            />
            
            {/* Progress Indicator */}
            {!isCompleted && !isSmallMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%',
                  backgroundColor: understanding.color === 'success' ? 'success.main' :
                                  understanding.color === 'warning' ? 'warning.main' :
                                  understanding.color === 'info' ? 'info.main' : 'grey.500',
                }} />
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem' }}
                >
                  In progress
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right Side - Date */}
          {lastReviewed && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              flexShrink: 0
            }}>
              {!isSmallMobile && (
                <Schedule 
                  sx={{ 
                    fontSize: 14,
                    color: 'text.secondary',
                    opacity: 0.7
                  }} 
                />
              )}
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontSize: isSmallMobile ? '0.7rem' : '0.75rem',
                  fontWeight: 500,
                }}
              >
                {new Date(lastReviewed).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: isSmallMobile ? undefined : 'numeric'
                })}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SubtopicItem;