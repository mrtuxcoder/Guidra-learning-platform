import React from 'react';
import { Box, Button } from '@mui/material';
import { purpleTheme, getThemeGradient } from '../constants.jsx';

const AuthButtons = ({ isLoading, user, navigate, randomIcon }) => {
  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // If user exists (logged in), don't show auth buttons
  if (user) {
    return null;
  }

  // Only show auth buttons when NOT loading and user is NOT logged in
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
      <Button
        color="inherit"
        onClick={() => navigate('/login')}
        sx={{
          fontWeight: '600',
          borderRadius: 2,
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 0.5, sm: 0.75 },
          color: purpleTheme.primary,
          border: `1px solid ${purpleTheme.primaryLight}40`,
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          minWidth: 'auto',
          '&:hover': {
            bgcolor: purpleTheme.lightBg,
          },
        }}
      >
        Sign In
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate('/register')}
        sx={{
          borderRadius: 2,
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 0.5, sm: 0.75 },
          fontWeight: '700',
          background: getThemeGradient(randomIcon),
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          minWidth: 'auto',
          '&:hover': {
            background: getThemeGradient(randomIcon),
            opacity: 0.9,
          },
        }}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default AuthButtons;