import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha
} from "@mui/material";
import { TrendingUp, CheckCircle, PlayCircle, ListAlt } from "@mui/icons-material";

const CircularProgressWithLabel = ({ value, size = 100, thickness = 4 }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{ 
          color: 'grey.100',
          position: 'absolute',
          left: 0,
        }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{
          color: value === 100 ? '#10b981' : '#3b82f6',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography 
          variant="h5" 
          component="div" 
          color="text.primary" 
          fontWeight="700"
        >
          {value}%
        </Typography>
      </Box>
    </Box>
  );
};

const StatBox = ({ icon: Icon, value, label, color, isMobile }) => (
  <Box sx={{ 
    textAlign: 'center', 
    p: isMobile ? 1 : 1.5,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: isMobile ? 32 : 40,
      height: isMobile ? 32 : 40,
      borderRadius: '50%',
      bgcolor: alpha(color, 0.1),
      color: color,
      mb: isMobile ? 0.5 : 1,
    }}>
      <Icon sx={{ fontSize: isMobile ? 16 : 20 }} />
    </Box>
    <Typography 
      variant={isMobile ? "body1" : "h6"} 
      color="text.primary" 
      fontWeight="600"
      sx={{ mb: 0.25, lineHeight: 1.2 }}
    >
      {value}
    </Typography>
    <Typography 
      variant="caption" 
      color="text.secondary" 
      sx={{ lineHeight: 1.2 }}
    >
      {label}
    </Typography>
  </Box>
);

const ProgressStats = ({ stats }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Debug: Check what stats we're receiving
  console.log('🔍 ProgressStats received stats:', stats);
  
  // Add fallbacks in case stats is undefined or missing properties
  const safeStats = stats || {
    progressPercentage: 0,
    totalTopics: 0,
    completed: 0,
    inProgress: 0,
    completedSubtopics: 0,
    totalSubtopics: 0
  };

  console.log('🔍 ProgressStats using safeStats:', safeStats);
  console.log('🎯 Circular progress value:', safeStats.progressPercentage);

  return (
    <Card
      sx={{
        mb: isMobile ? 2 : 3,
        background: 'white',
        border: '1px solid',
        borderColor: 'grey.200',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CardContent sx={{ 
        p: isMobile ? 2 : 3,
        width: '100%',
        maxWidth: isMobile ? '100%' : 400,
        mx: 'auto',
        textAlign: 'center'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: isMobile ? 2 : 3,
          gap: isMobile ? 1.5 : 2
        }}>
          <Box
            sx={{
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              borderRadius: 2,
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              border: `1px solid ${alpha('#3b82f6', 0.2)}`,
              flexShrink: 0,
            }}
          >
            <TrendingUp sx={{ fontSize: isMobile ? 18 : 22 }} />
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              fontWeight="600" 
              color="text.primary"
              textAlign="left"
            >
              Progress Overview
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              textAlign="left"
            >
              Your learning journey
            </Typography>
          </Box>
        </Box>

        {/* Progress Circle */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: isMobile ? 2 : 3,
        }}>
          <CircularProgressWithLabel 
            value={safeStats.progressPercentage || 0} 
            size={isMobile ? 80 : 120}
            thickness={isMobile ? 3 : 4}
          />
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 2 : 3 }}>
          <Grid item xs={6}>
            <StatBox
              icon={ListAlt}
              value={safeStats.totalTopics || 0}
              label="Topics"
              color="#3b82f6"
              isMobile={isMobile}
            />
          </Grid>
          <Grid item xs={6}>
            <StatBox
              icon={CheckCircle}
              value={safeStats.completed || 0}
              label="Completed"
              color="#10b981"
              isMobile={isMobile}
            />
          </Grid>
          <Grid item xs={6}>
            <StatBox
              icon={PlayCircle}
              value={safeStats.inProgress || 0}
              label="In Progress"
              color="#f59e0b"
              isMobile={isMobile}
            />
          </Grid>
          <Grid item xs={6}>
            <StatBox
              icon={ListAlt}
              value={`${safeStats.completedSubtopics || 0}/${safeStats.totalSubtopics || 0}`}
              label="Subtopics"
              color="#8b5cf6"
              isMobile={isMobile}
            />
          </Grid>
        </Grid>

        {/* Progress Summary */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: isMobile ? 0.75 : 1
          }}>
            <Typography 
              variant={isMobile ? "caption" : "body2"} 
              color="text.primary" 
              fontWeight="500"
            >
              Overall Progress
            </Typography>
            <Typography 
              variant={isMobile ? "caption" : "body2"} 
              fontWeight="600" 
              color="primary.main"
            >
              {safeStats.progressPercentage || 0}%
            </Typography>
          </Box>
          <Box sx={{ 
            width: '100%', 
            height: isMobile ? 4 : 6, 
            borderRadius: 2,
            backgroundColor: 'grey.100',
            overflow: 'hidden'
          }}>
            <Box 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                backgroundColor: '#3b82f6',
                width: `${safeStats.progressPercentage || 0}%`,
                transition: 'width 0.5s ease-in-out'
              }} 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;