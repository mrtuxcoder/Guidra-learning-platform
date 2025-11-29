import React from 'react';
import { 
  Box, 
  Typography,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";

const LoadingState = ({ isContentLoading = false, source = "ai" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Modern Gradient Loader Component
  const GradientLoader = ({ size = 80, speed = 2 }) => (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `conic-gradient(
          from 0deg at 50% 50%,
          #7C3AED 0%,
          #8B5CF6 25%,
          #A78BFA 50%,
          #C4B5FD 75%,
          #7C3AED 100%
        )`,
        animation: `spin ${speed}s linear infinite`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 4,
          borderRadius: '50%',
          background: 'white',
        },
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }}
    />
  );

  // Floating Particles Background
  const FloatingParticles = () => (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {[...Array(isMobile ? 8 : 15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: isMobile ? 4 : 6,
            height: isMobile ? 4 : 6,
            borderRadius: '50%',
            background: `rgba(124, 58, 237, ${0.3 + (i % 3) * 0.2})`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            '@keyframes float': {
              '0%, 100%': { 
                transform: 'translateY(0px) rotate(0deg)',
                opacity: 0.7
              },
              '50%': { 
                transform: `translateY(${isMobile ? -15 : -20}px) rotate(180deg)`,
                opacity: 1
              }
            }
          }}
        />
      ))}
    </Box>
  );

  // Content Loading State - Modern Design
  if (isContentLoading) {
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
            background: 'linear-gradient(135deg, #FAF7FE 0%, #F3E8FF 50%, #E9D5FF 100%)',
            borderRadius: isMobile ? 2 : 3,
            p: isMobile ? 2 : 4,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(124, 58, 237, 0.1)',
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.1)',
            boxSizing: 'border-box'
          }}
        >
          <FloatingParticles />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <GradientLoader size={isMobile ? 80 : 100} speed={1.5} />
            
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
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
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
                background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
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
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: isMobile ? 1.5 : 2 }}>
              {[0, 1, 2].map((dot) => (
                <Box
                  key={dot}
                  sx={{
                    width: isMobile ? 6 : 8,
                    height: isMobile ? 6 : 8,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)`,
                    animation: `bounce 1.4s ease-in-out ${dot * 0.16}s infinite both`,
                    '@keyframes bounce': {
                      '0%, 80%, 100%': { 
                        transform: 'scale(0.8)',
                        opacity: 0.5
                      },
                      '40%': { 
                        transform: 'scale(1)',
                        opacity: 1
                      }
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Fade>
    );
  }

  // Initial Loading State - Full Screen
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
          background: 'linear-gradient(135deg, #FAF7FE 0%, #F3E8FF 30%, #FFFFFF 70%)',
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
        <FloatingParticles />
        
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          {/* Animated Logo/Brand */}
          <Box sx={{ mb: isMobile ? 3 : 4 }}>
            <Box
              sx={{
                width: isMobile ? 80 : 120,
                height: isMobile ? 80 : 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: isMobile ? 2 : 3,
                animation: 'gentlePulse 3s ease-in-out infinite',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
                '@keyframes gentlePulse': {
                  '0%, 100%': { 
                    transform: 'scale(1) rotate(0deg)',
                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)'
                  },
                  '50%': { 
                    transform: 'scale(1.05) rotate(5deg)',
                    boxShadow: '0 12px 40px rgba(124, 58, 237, 0.3)'
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
            <GradientLoader size={isMobile ? 80 : 120} speed={2} />
            
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
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
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
                background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
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
            <Box sx={{ 
              width: '100%', 
              height: isMobile ? 4 : 6, 
              background: 'rgba(124, 58, 237, 0.1)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              maxWidth: isMobile ? 280 : 400,
              margin: '0 auto',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '60%',
                background: 'linear-gradient(90deg, #7C3AED 0%, #5E35B1 100%)',
                borderRadius: 3,
                animation: 'progress 2s ease-in-out infinite',
                '@keyframes progress': {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(250%)' }
                }
              }
            }} />
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingState;