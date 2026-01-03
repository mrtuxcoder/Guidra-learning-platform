import React from 'react';
import { Box, ListItem, Typography, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CompletionIndicator from "./CompletionIndicator";

const SubtopicItem = ({
  subtopic,
  index,
  topicName,
  isSelected,
  isUpdating,
  hasContent,
  onSubtopicClick,
  colorPalette
}) => {
  return (
    <ListItem 
      selected={isSelected}
      onClick={onSubtopicClick}
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
      {isUpdating && <LoadingOverlay colorPalette={colorPalette} />}

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
            colorPalette={colorPalette}
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

// Loading Overlay Component
const LoadingOverlay = ({ colorPalette }) => (
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
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}
    />
  </Box>
);

export default SubtopicItem;