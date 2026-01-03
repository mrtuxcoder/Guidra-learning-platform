import React from 'react';
import { Box, Typography, Fade } from "@mui/material";
import GradientLoader from "./GradientLoader";
import FloatingParticles from "./FloatingParticles";
import AnimatedProgressBar from "./AnimatedProgressBar";

const InitialLoading = ({ isMobile, colorPalette }) => {
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
    `linear-gradient(135deg, ${colorPalette[50]} 0%, ${colorPalette[100]} 30%, #FFFFFF 70%)` :
    'linear-gradient(135deg, #FAF7FE 0%, #F3E8FF 30%, #FFFFFF 70%)';

  return (
    <Fade in={true} timeout={800}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: '100vw',
          flexDirection: 'column', 
          gap: isMobile ? 3 : 4,
          background: backgroundGradient,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          p: isMobile ? 2 : 3,
          boxSizing: 'border-box'
        }}
      >
        <FloatingParticles 
          count={isMobile ? 8 : 15}
          color={colorPalette?.[400] || '#7C3AED'}
          isMobile={isMobile}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          {/* Animated Logo/Brand */}
          <Box sx={{ mb: isMobile ? 3 : 4 }}>
            <Box
              sx={{
                width: isMobile ? 80 : 120,
                height: isMobile ? 80 : 120,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: isMobile ? 2 : 3,
                animation: 'gentlePulse 3s ease-in-out infinite',
                boxShadow: `0 8px 32px ${gradientColors.start}40`,
                '@keyframes gentlePulse': {
                  '0%, 100%': { 
                    transform: 'scale(1) rotate(0deg)',
                    boxShadow: `0 8px 32px ${gradientColors.start}40`
                  },
                  '50%': { 
                    transform: 'scale(1.05) rotate(5deg)',
                    boxShadow: `0 12px 40px ${gradientColors.start}60`
                  }
                }
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: isMobile ? 32 : 48,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                🚀
              </Typography>
            </Box>
          </Box>

          {/* Main Loader */}
          <Box sx={{ position: 'relative', mb: isMobile ? 3 : 4 }}>
            <GradientLoader 
              size={isMobile ? 80 : 120} 
              speed={2}
              colors={gradientColors}
            />
            
            {/* Center Icon */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: isMobile ? 28 : 40,
                  background: `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'glow 2s ease-in-out infinite alternate',
                  '@keyframes glow': {
                    '0%': { opacity: 0.8 },
                    '100%': { opacity: 1 }
                  }
                }}
              >
                💫
              </Typography>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ maxWidth: isMobile ? '100%' : 400, mx: 'auto', px: isMobile ? 1 : 0 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              fontWeight="800"
              sx={{ 
                background: `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: isMobile ? 1.5 : 2,
                fontSize: isMobile ? '1.5rem' : '2rem',
                lineHeight: 1.2
              }}
            >
              Preparing Your Learning Journey
            </Typography>
            
            <Typography 
              variant={isMobile ? "body1" : "h6"}
              sx={{ 
                color: '#6B7280',
                fontWeight: '400',
                mb: isMobile ? 2 : 3,
                lineHeight: 1.6,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Setting up your personalized educational experience...
            </Typography>

            {/* Animated Progress Bar */}
            <AnimatedProgressBar 
              width={isMobile ? 280 : 400}
              height={isMobile ? 4 : 6}
              color={gradientColors.start}
              gradientEnd={gradientColors.end}
            />
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default InitialLoading;