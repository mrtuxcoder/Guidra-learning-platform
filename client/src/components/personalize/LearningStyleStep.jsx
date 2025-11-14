import React from "react";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Chip
} from "@mui/material";
import { EliteCard } from "./styledComponents";
import { learningStyles, tonePreferences, difficultyLevels } from "./constants";
import { Lightbulb, GpsFixed, Palette, Psychology, School } from "@mui/icons-material";

const LearningStyleStep = ({ formData, handleStyleSelect, handleInputChange, theme }) => {
  // Define icons directly in the component
  const styleWithIcons = learningStyles.map((style, index) => {
    const icons = [<Palette />, <Psychology />, <School />];
    return {
      ...style,
      icon: icons[index] || <Palette />
    };
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.main, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
        🎯 Discover Your Learning Superpower!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 3, md: 4 } }}>
        Which learning hero are you? Choose your style and let the magic begin! ✨
      </Typography>

      {/* Fixed Grid for MUI v6 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {styleWithIcons.map((style) => (
          <Grid key={style.value} size={{ xs: 12, sm: 6, md: 4 }}>
            <EliteCard
              onClick={() => handleStyleSelect(style.value)}
              isSelected={formData.learningStyle === style.value}
              elevation={4}
              sx={{ p: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 2, color: 'primary.main', fontSize: 40 }}>
                  {React.cloneElement(style.icon, { sx: { fontSize: 36 } })}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {style.label}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {style.description}
              </Typography>
            </EliteCard>
          </Grid>
        ))}
      </Grid>
      
      {/* Fixed Grid for form controls */}
      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Choose Your Guide's Vibe</InputLabel>
            <Select
              value={formData.tonePreference}
              label="Choose Your Guide's Vibe"
              onChange={handleInputChange('tonePreference')}
            >
              {tonePreferences.map((tone) => (
                <MenuItem key={tone.value} value={tone.value}>
                  {tone.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Adventure Difficulty</InputLabel>
            <Select
              value={formData.difficultyPreference}
              label="Adventure Difficulty"
              onChange={handleInputChange('difficultyPreference')}
            >
              {difficultyLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3} sx={{ p: 3, height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Lightbulb sx={{ mr: 1 }} />
              Pro Tip! 💡
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              The right learning style can make complex topics feel like a fun puzzle! 
              We'll use your preferences to create the perfect learning experience.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {formData.learningStyle && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Chip 
            label={`You're a ${learningStyles.find(ls => ls.value === formData.learningStyle)?.label.toLowerCase()}! Get ready for an amazing journey! 🚀`}
            color="secondary" 
            variant="filled"
            icon={<GpsFixed />}
            sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, padding: '10px 15px', height: 'auto' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default LearningStyleStep;