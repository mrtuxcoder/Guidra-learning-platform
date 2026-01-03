import React from 'react';
import { Card, CardContent, Box, Typography, Grid, Button } from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";

const LearningJourneyCard = ({ stats, onLaunchLesson }) => {
  return (
    <Card sx={{ 
      borderRadius: 3,
      border: '1px solid rgba(126, 87, 194, 0.15)',
      background: 'white',
      boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
    }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Box sx={{
            width: { xs: 50, sm: 60 },
            height: { xs: 50, sm: 60 },
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2
          }}>
            <RocketLaunch sx={{ 
              fontSize: { xs: 24, sm: 28 }, 
              color: 'white' 
            }} />
          </Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            lineHeight: 1.2
          }}>
            Your Learning Journey
          </Typography>
          <Typography variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.85rem', sm: '1rem' },
              lineHeight: 1.5
            }}
          >
            Keep up the great work! You're making amazing progress.
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 3 } }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              textAlign: 'center', 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3,
              background: 'rgba(126, 87, 194, 0.05)',
              border: '1px solid rgba(126, 87, 194, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: '#7E57C2',
                mb: 1,
                lineHeight: 1
              }}>
                {stats.progressPercentage}%
              </Typography>
              <Typography variant="body1" 
                fontWeight={600} 
                color="text.primary"
                sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
              >
                Overall Progress
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              textAlign: 'center', 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3,
              background: 'rgba(126, 87, 194, 0.05)',
              border: '1px solid rgba(126, 87, 194, 0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: '#5E35B1',
                mb: 1,
                lineHeight: 1
              }}>
                {stats.inProgress}
              </Typography>
              <Typography variant="body1" 
                fontWeight={600} 
                color="text.primary"
                sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
              >
                In Progress
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<RocketLaunch />}
          onClick={onLaunchLesson}
          sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            fontWeight: 700,
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.9rem', sm: '1rem' },
            boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(126, 87, 194, 0.4)',
            }
          }}
        >
          Launch Next Lesson
        </Button>
      </CardContent>
    </Card>
  );
};

export default LearningJourneyCard;