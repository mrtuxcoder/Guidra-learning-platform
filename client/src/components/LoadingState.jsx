
import React from 'react';
import { 
  Box, 
  Typography,
  Fade
} from "@mui/material";

const LoadingState = ({ isContentLoading = false, source = "ai" }) => {
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
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 6,
            height: 6,
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
                transform: 'translateY(-20px) rotate(180deg)',
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
            height: '400px',
            flexDirection: 'column', 
            gap: 4,
            background: 'linear-gradient(135deg, #FAF7FE 0%, #F3E8FF 50%, #E9D5FF 100%)',
            borderRadius: 3,
            p: 4,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(124, 58, 237, 0.1)',
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.1)',
          }}
        >
          <FloatingParticles />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <GradientLoader size={100} speed={1.5} />
            
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
                  fontSize: 32,
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

          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h5" 
              fontWeight="700"
              sx={{ 
                background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5
              }}
            >
              {source === "cache" ? "Loading Your Content" : "Crafting Your Lesson"}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6B7280',
                maxWidth: 300,
                lineHeight: 1.6
              }}
            >
              {source === "cache" 
                ? "Retrieving your personalized learning materials..." 
                : "Generating AI-powered content tailored just for you..."}
            </Typography>

            {/* Progress Dots */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
              {[0, 1, 2].map((dot) => (
                <Box
                  key={dot}
                  sx={{
                    width: 8,
                    height: 8,
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
          flexDirection: 'column', 
          gap: 4,
          background: 'linear-gradient(135deg, #FAF7FE 0%, #F3E8FF 30%, #FFFFFF 70%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <FloatingParticles />
        
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Animated Logo/Brand */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
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
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                🚀
              </Typography>
            </Box>
          </Box>

          {/* Main Loader */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            <GradientLoader size={120} speed={2} />
            
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
                  fontSize: 40,
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
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <Typography 
              variant="h4" 
              fontWeight="800"
              sx={{ 
                background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '1.75rem', sm: '2rem' }
              }}
            >
              Preparing Your Learning Journey
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#6B7280',
                fontWeight: '400',
                mb: 3,
                lineHeight: 1.6
              }}
            >
              Setting up your personalized educational experience...
            </Typography>

            {/* Animated Progress Bar */}
            <Box sx={{ 
              width: '100%', 
              height: 6, 
              background: 'rgba(124, 58, 237, 0.1)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
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