import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Fade } from "@mui/material";
import { alpha } from "@mui/material";
import { CATEGORY_DATA } from './constants.jsx';
import { cardStyles } from './styles';

const CourseCard = ({ topic, isSelected, onSelect, index }) => {
  const categoryData = CATEGORY_DATA[topic.category];
  
  return (
    <Fade in timeout={400 + index * 50}>
      <Card 
        sx={cardStyles.card(isSelected, categoryData.color)}
        onClick={() => onSelect(topic.id)}
      >
        <CardContent sx={cardStyles.cardContent}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 1.5,
            flexShrink: 0
          }}>
            <Chip
              label={categoryData.name}
              size="small"
              sx={{
                backgroundColor: alpha(categoryData.color, 0.1),
                color: categoryData.color,
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                height: { xs: '20px', sm: '24px' }
              }}
            />
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              flexShrink: 0,
              backgroundColor: alpha('#7C3AED', 0.1),
              borderRadius: 1,
              px: 0.75,
              py: 0.25
            }}>
              <Typography variant="caption" fontWeight={600} fontSize={{ xs: '0.65rem', sm: '0.75rem' }} color="#7C3AED">
                {topic.popularity}%
              </Typography>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="h6" 
              fontWeight={700} 
              sx={{ 
                mb: 1, 
                lineHeight: 1.3,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              {topic.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                lineHeight: 1.4,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                flex: 1
              }}
            >
              {topic.description}
            </Typography>
          </Box>

          {/* Selection Indicator */}
          {isSelected && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: { xs: 16, sm: 20 },
                height: { xs: 16, sm: 20 },
                borderRadius: '50%',
                background: categoryData.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: { xs: '10px', sm: '12px' },
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(126, 87, 194, 0.3)'
              }}
            >
              ✓
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default CourseCard;