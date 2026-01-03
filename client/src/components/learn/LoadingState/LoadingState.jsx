import React from 'react';
import { Box, Fade, useTheme, useMediaQuery } from "@mui/material";
import ContentLoading from "./ContentLoading";
import InitialLoading from "./InitialLoading";

const LoadingState = ({ isContentLoading = false, source = "ai", colorPalette }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Content Loading State - Modern Design
  if (isContentLoading) {
    return (
      <ContentLoading 
        source={source} 
        isMobile={isMobile} 
        colorPalette={colorPalette}
      />
    );
  }

  // Initial Loading State - Full Screen
  return (
    <InitialLoading isMobile={isMobile} colorPalette={colorPalette} />
  );
};

export default LoadingState;