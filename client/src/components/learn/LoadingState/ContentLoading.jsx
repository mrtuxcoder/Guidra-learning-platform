import React from 'react';
import { Box, Typography, Fade } from "@mui/material";
import GradientLoader from "./GradientLoader";
import FloatingParticles from "./FloatingParticles";
import ProgressDots from "./ProgressDots";

const ContentLoading = ({ source, isMobile, colorPalette }) => {
  const gradientColors = colorPalette ? {
    start: colorPalette[700] || '#7C3AED',
    mid: colorPalette[500] || '#8B5CF6',
    end: colorPalette[400] || '#A78BFA',
    light: colorPalette[300] || '#C4B5FD'
  } : {
    start: '#7C3AED',
    mid: '#8B5CF6',
    end: '#A78BFA',
    light: '#C4B5FD'
  };

  const backgroundGradient = colorPalette ? 
    `linear-gradient(135deg, ${colorPalette[50]} 0%, ${colorPalette[100]} 50%, ${colorPalette[200]} 100%)` :
    'linear-gradient(135deg, #FAF7FE 0%, #F3E8FF 50%, #E9D5FF 100%)';

  return (
    <Fade in={true} timeout={600}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          minHeight: isMobile ? '300px' : '400px',
          width: '100%',
          flexDirection: 'column', 
          gap: isMobile ? 3 : 4,
          background: backgroundGradient,
          borderRadius: isMobile ? 2 : 3,
          p: isMobile ? 2 : 4,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${(colorPalette?.[400] || '#7C3AED')}20`,
          boxShadow: `0 8px 32px ${(colorPalette?.[400] || '#7C3AED')}20`,
          boxSizing: 'border-box'
        }}
      >
        <FloatingParticles 
          count={isMobile ? 8 : 15}
          color={colorPalette?.[400] || '#7C3AED'}
          isMobile={isMobile}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <GradientLoader 
            size={isMobile ? 80 : 100} 
            speed={1.5}
            colors={gradientColors}
          />
          
          {/* Animated Icon */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                '50%': { opacity: 0.8, transform: 'translate(-50%, -50%) scale(1.1)' },
              }
            }}
          >
            <Typography 
              sx={{ 
                fontSize: isMobile ? 24 : 32,
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {source === "cache" ? "📚" : "✨"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"}
            fontWeight="700"
            sx={{ 
              background: `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: isMobile ? 1 : 1.5,
              fontSize: isMobile ? '1.1rem' : '1.5rem'
            }}
          >
            {source === "cache" ? "Loading Your Content" : "Crafting Your Lesson"}
          </Typography>
          
          <Typography 
            variant={isMobile ? "body2" : "body1"}
            sx={{ 
              color: '#6B7280',
              maxWidth: isMobile ? 280 : 300,
              lineHeight: 1.6,
              margin: '0 auto',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            {source === "cache" 
              ? "Retrieving your personalized learning materials..." 
              : "Generating AI-powered content tailored just for you..."}
          </Typography>

          {/* Progress Dots */}
          <ProgressDots 
            count={3}
            color={gradientColors.start}
            isMobile={isMobile}
            sx={{ mt: isMobile ? 1.5 : 2 }}
          />
        </Box>
      </Box>
    </Fade>
  );
};

export default ContentLoading;