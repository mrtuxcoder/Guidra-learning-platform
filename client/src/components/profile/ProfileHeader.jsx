import React from "react";
import {
  Paper,
  Typography,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  alpha
} from "@mui/material";
import { Email } from "@mui/icons-material";

const ProfileHeader = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: isMobile ? 3 : 4,
        mb: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
        color: "white",
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${alpha('#fff', 0.08)} 0%, transparent 70%)`,
          borderRadius: '50%',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        gap: isMobile ? 3 : 4,
        position: 'relative',
        zIndex: 1,
        textAlign: isMobile ? 'center' : 'left'
      }}>
        
        {/* Avatar with Glow Effect */}
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              background: `linear-gradient(45deg, ${alpha('#fff', 0.3)}, ${alpha('#fff', 0.1)})`,
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite alternate',
            }}
          />
          <Avatar
            sx={{
              width: isMobile ? 100 : 120,
              height: isMobile ? 100 : 120,
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255,255,255,0.3)',
              fontSize: isMobile ? '2.5rem' : '3rem',
              fontWeight: 'bold',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
        </Box>

        {/* User Info */}
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            fontWeight="700" 
            gutterBottom
            sx={{
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #fff 30%, #f8f9fa 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.2
            }}
          >
            {user?.name || "Explorer"}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            <Email sx={{ 
              opacity: 0.9, 
              fontSize: isMobile ? 20 : 24,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ 
                opacity: 0.9, 
                fontWeight: 400,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {user?.email || "Ready to learn! 🚀"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.05); opacity: 0.6; }
        }
      `}</style>
    </Paper>
  );
};

export default ProfileHeader;