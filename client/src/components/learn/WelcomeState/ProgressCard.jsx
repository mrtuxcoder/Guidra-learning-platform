import React from 'react';
import { Card, Box, Typography, Chip, LinearProgress, useMediaQuery } from "@mui/material";

const ProgressCard = ({ selectedTopic, learningInsights, colorPalette }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  
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

export default ProgressCard;