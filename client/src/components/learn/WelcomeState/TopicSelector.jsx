import React from 'react';
import { Box, Typography, Chip, Stack, useMediaQuery } from "@mui/material";

const TopicSelector = ({ topics, selectedTopic, onTopicSelect }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  
  if (!Array.isArray(topics) || topics.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="700" sx={{ mb: 2, color: '#1e293b' }}>
        Choose a Topic
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {topics.map((topic, index) => {
          const topicName = topic?.topic || topic?.name || 'Unnamed Topic';
          const isSelected = selectedTopic === topicName;
          
          return (
            <Chip
              key={index}
              label={topicName}
              onClick={() => onTopicSelect && onTopicSelect(topicName)}
              variant={isSelected ? "filled" : "outlined"}
              size={isMobile ? "small" : "medium"}
              sx={{
                mb: 1,
                background: isSelected 
                  ? `linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)`
                  : 'white',
                color: isSelected ? 'white' : '#475569',
                borderColor: isSelected ? '#7c3aed' : '#e2e8f0',
                fontWeight: '600',
                '&:hover': {
                  background: isSelected ? '#7c3aed' : '#f8fafc',
                }
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default TopicSelector;