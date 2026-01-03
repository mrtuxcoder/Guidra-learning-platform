import React from 'react';
import { Container, Box, Typography } from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";

const LoadingState = () => {
  return (
    <Container maxWidth="xl" sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)'
    }}>
      <Box sx={{ textAlign: 'center', px: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.05)', opacity: 0.8 },
              '100%': { transform: 'scale(1)', opacity: 1 }
            }
          }}
        >
          <RocketLaunch sx={{ fontSize: 32, color: 'white' }} />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: 700,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          Loading Your Journey...
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Preparing your learning dashboard
        </Typography>
      </Box>
    </Container>
  );
};

export default LoadingState;