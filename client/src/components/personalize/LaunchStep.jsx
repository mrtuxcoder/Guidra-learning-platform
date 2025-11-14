import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  Alert
} from "@mui/material";
import { learningStyles, tonePreferences, difficultyLevels } from "./constants";
import { AutoAwesome, RocketLaunch } from "@mui/icons-material";

const LaunchStep = ({ formData, theme }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.main, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
        🚀 Ready for Liftoff!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 3, md: 4 } }}>
        Review your epic learning configuration. Everything looks amazing!
      </Typography>

      {/* Fixed Grid for MUI v6 */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={4} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.primary.main }}>
              <AutoAwesome sx={{ mr: 1 }} />
              Your Learning Superpowers
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Learning Style:</Typography>
              <Chip 
                label={learningStyles.find(ls => ls.value === formData.learningStyle)?.label}
                color="primary"
                sx={{ mt: 0.5, fontWeight: 600 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Guide Vibe:</Typography>
              <Chip 
                label={tonePreferences.find(t => t.value === formData.tonePreference)?.label}
                color="secondary"
                sx={{ mt: 0.5, fontWeight: 600 }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Challenge Level:</Typography>
              <Chip 
                label={difficultyLevels.find(d => d.value === formData.difficultyPreference)?.label}
                color="success"
                sx={{ mt: 0.5, fontWeight: 600 }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={4} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.secondary.main }}>
              <RocketLaunch sx={{ mr: 1 }} />
              Your Learning Mission
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Quest:</Typography>
              <Typography variant="body1" fontWeight="600">{formData.topic}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Your Why:</Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic', mt: 1, p: 1, background: 'rgba(255,107,107,0.05)', borderRadius: 1 }}>
                "{formData.reasonForLearning}"
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3, borderRadius: 3 }}>
        🎉 Get ready! Our AI is about to craft your personalized learning universe!
      </Alert>
    </Box>
  );
};

export default LaunchStep;