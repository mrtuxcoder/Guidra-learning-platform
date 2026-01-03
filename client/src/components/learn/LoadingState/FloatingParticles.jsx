import React from 'react';
import { Box } from "@mui/material";

const FloatingParticles = ({ count, color, isMobile }) => {
  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {[...Array(count || 15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: isMobile ? 4 : 6,
            height: isMobile ? 4 : 6,
            borderRadius: '50%',
            background: `${color || 'rgba(124, 58, 237, 0.3)'}${30 + (i % 3) * 20}`,
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
};

export default FloatingParticles;