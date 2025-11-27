

import React from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Fade
} from "@mui/material";
import { 
  AutoAwesome, 
  Cached,
  School 
} from "@mui/icons-material";

const LoadingState = ({ isContentLoading = false, source = "ai" }) => {
  // Content Loading State
  if (isContentLoading) {
    return (
      <Fade in={true} timeout={500}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '300px', 
            flexDirection: 'column', 
            gap: 3,
            background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
            borderRadius: 3,
            p: 3
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
              }} 
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {source === "cache" ? (
                <Cached 
                  sx={{ 
                    fontSize: 24,
                    color: 'rgba(255,255,255,0.9)',
                  }} 
                />
              ) : (
                <AutoAwesome 
                  sx={{ 
                    fontSize: 24,
                    color: 'rgba(255,255,255,0.9)',
                  }} 
                />
              )}
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              fontWeight="600"
              sx={{ 
                color: 'white',
                mb: 1
              }}
            >
              {source === "cache" ? "Loading Content" : "Generating Lesson"}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {source === "cache" 
                ? "Getting your saved content..." 
                : "Creating personalized learning material..."}
            </Typography>
          </Box>
        </Box>
      </Fade>
    );
  }

  // Initial Loading State
  return (
    <Fade in={true} timeout={500}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          flexDirection: 'column', 
          gap: 3,
          background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress 
            size={80} 
            thickness={4}
            sx={{ 
              color: '#7C3AED',
            }} 
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <School 
              sx={{ 
                fontSize: 32,
                color: '#7C3AED',
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h5" 
            fontWeight="700"
            sx={{ 
              color: '#7C3AED',
              mb: 1
            }}
          >
            Preparing Learning
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            Loading your personalized experience...
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingState;