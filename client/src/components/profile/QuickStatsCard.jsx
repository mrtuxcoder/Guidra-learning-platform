import React from 'react';
import { Card, CardContent, Box, Typography, Grid, Divider } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const QuickStatsCard = ({ stats }) => {
  return (
    <Card sx={{ 
      borderRadius: 3,
      border: '1px solid rgba(126, 87, 194, 0.15)',
      background: 'white',
      boxShadow: '0 8px 32px rgba(126, 87, 194, 0.08)'
    }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp sx={{ fontSize: 20, color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Quick Stats
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: '#7E57C2',
                mb: 1,
                lineHeight: 1
              }}>
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Topics Mastered
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: '#5E35B1',
                mb: 1,
                lineHeight: 1
              }}>
                {stats.completedSubtopics}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Subtopics Done
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Keep learning every day!
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;