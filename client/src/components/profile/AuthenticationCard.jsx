import React from 'react';
import { Card, CardContent, Box, Typography, Alert, Button } from "@mui/material";

const AuthenticationCard = ({ user, onPasswordSetup }) => {
  if (!user?.authProvider === 'google' || user?.password) {
    return null;
  }

  return (
    <Card sx={{ 
      borderRadius: 3,
      border: '1px solid rgba(126, 87, 194, 0.15)',
      background: 'linear-gradient(135deg, rgba(126, 87, 194, 0.05) 0%, rgba(94, 53, 177, 0.05) 100%)',
      boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
              🔐
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Authentication Status
          </Typography>
        </Box>
        
        <Alert severity="info" sx={{ 
          borderRadius: 2,
          mb: 2,
          bgcolor: 'rgba(126, 87, 194, 0.08)',
          border: '1px solid rgba(126, 87, 194, 0.2)'
        }}>
          You're signed in with Google. Set a password to also login with email.
        </Alert>
        
        <Button
          variant="contained"
          fullWidth
          size="small"
          onClick={onPasswordSetup}
          sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            fontWeight: 600,
            py: 1,
            fontSize: '0.85rem',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 20px rgba(126, 87, 194, 0.3)',
            }
          }}
        >
          Set Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthenticationCard;