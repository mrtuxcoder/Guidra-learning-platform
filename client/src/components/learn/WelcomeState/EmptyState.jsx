import React from 'react';
import { Box, Typography, Button, Avatar } from "@mui/material";
import { Explore, School } from "@mui/icons-material";

const EmptyState = ({ colorPalette }) => {
  return (
    <Box sx={{ 
      textAlign: 'center', 
      py: 8,
      px: 2
    }}>
      <Avatar sx={{ 
        width: 120, 
        height: 120,
        background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
        margin: '0 auto 24px',
        border: '3px solid white',
        boxShadow: '0 8px 32px rgba(126, 87, 194, 0.3)',
      }}>
        <School sx={{ fontSize: 50 }} />
      </Avatar>
      
      <Typography 
        variant="h3" 
        fontWeight="800" 
        color="#1e293b"
        gutterBottom
        sx={{ mb: 2 }}
      >
        Welcome to Guidra!
      </Typography>
      
      <Typography 
        variant="h6" 
        color="#64748b"
        sx={{ 
          maxWidth: '500px', 
          margin: '0 auto 32px',
          lineHeight: 1.6
        }}
      >
        It looks like you don't have any courses yet. Start your learning journey by exploring available courses and topics.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => window.location.href = '/personalize'}
        startIcon={<Explore />}
        sx={{
          py: 2,
          px: 4,
          borderRadius: 2,
          fontSize: '1.1rem',
          fontWeight: '700',
          background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
          boxShadow: `0 8px 24px ${colorPalette[300]}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 32px ${colorPalette[400]}`,
          },
          transition: 'all 0.3s ease'
        }}
      >
        Explore Available Courses
      </Button>
    </Box>
  );
};

export default EmptyState;