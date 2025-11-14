import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Card
} from "@mui/material";
import { RocketLaunch, TrendingUp } from "@mui/icons-material";

const MissionStep = ({ formData, handleInputChange, theme }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.main, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
        🗺️ Choose Your Learning Adventure!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 3, md: 4 } }}>
        What amazing skill or knowledge do you want to conquer today?
      </Typography>

      {/* Fixed Grid for MUI v6 */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={4} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.secondary.main }}>
              <RocketLaunch sx={{ mr: 1 }} />
              Your Learning Quest 🎯
            </Typography>
            <TextField
              fullWidth
              label="What do you want to master?"
              placeholder="e.g., Machine Learning Magic, Web Development Wizardry, Spanish Fluency..."
              value={formData.topic}
              onChange={handleInputChange('topic')}
              sx={{ mb: 2 }}
              helperText="Be specific! What exactly do you want to conquer?"
            />

            <TextField
              fullWidth
              label="Your Why & Motivation 💫"
              multiline
              rows={4}
              placeholder="Tell us your story! Why this topic? Career growth? Personal passion? Impress friends? 🌟"
              value={formData.reasonForLearning}
              onChange={handleInputChange('reasonForLearning')}
              helperText="This fuels our AI to create content that truly resonates with you!"
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={4} sx={{ p: 3, height: '100%', borderRadius: 3, background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 1 }} />
              Motivation Boost! 🚀
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, mb: 3 }}>
              "The expert in anything was once a beginner." - Helen Hayes
            </Typography>
            
            {formData.topic && (
              <Box sx={{ p: 2, background: 'rgba(255,255,255,0.2)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.3)' }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                  "I'm learning {formData.topic} because..."
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {formData.reasonForLearning || "Share your motivation to unlock personalized content! 🔓"}
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MissionStep;