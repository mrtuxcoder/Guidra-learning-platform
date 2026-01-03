import React from 'react';
import { Box, LinearProgress } from "@mui/material";

const ProgressBar = ({ progress, colorPalette, sx }) => {
  return (
    <Box sx={{ px: 2, mt: 0.5, ...sx }}>
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
  );
};

export default ProgressBar;