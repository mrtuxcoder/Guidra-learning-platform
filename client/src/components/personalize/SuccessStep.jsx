import React from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "./styledComponents";
import { Celebration, CheckCircle } from "@mui/icons-material";

const SuccessStep = ({ formData, apiResponse, handleStartLearning, theme }) => {
  const navigate = useNavigate();

  const handleStartLearningClick = () => {
    console.log("🚀 Start Learning button clicked!");
    
    // First try the passed function
    if (handleStartLearning && typeof handleStartLearning === 'function') {
      console.log("✅ Using passed handleStartLearning function");
      handleStartLearning();
    } 
    // Fallback: use navigate directly
    else if (navigate) {
      console.log("🔄 Using navigate directly");
      navigate('/profile');
    }
    // Final fallback: use window.location
    else {
      console.log("🌐 Using window.location fallback");
      window.location.href = '/profile';
    }
  };

  return (
    <Box sx={{ mt: 6, textAlign: 'center' }}>
      <Celebration sx={{ fontSize: { xs: 80, md: 100 }, color: theme.palette.success.main, mb: 3 }} />
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: theme.palette.success.main, fontSize: { xs: '2rem', md: '3rem' } }}>
        Mission Accomplished! 🎊
      </Typography>
      
      <Card elevation={5} sx={{ maxWidth: 600, mx: 'auto', mb: 5, p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <CheckCircle sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
            {apiResponse?.message || "Success! 🎉"}
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, fontSize: '1.1rem' }}>
          Your personalized learning path for <strong style={{ color: theme.palette.primary.main }}>{formData.topic}</strong> has been successfully created!
        </Typography>

        {apiResponse?.data?.subTopics && (
          <Box sx={{ mt: 3, p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="600" color="primary.main" sx={{ mb: 2 }}>
              🎯 Generated {apiResponse.data.subTopics.length} subtopics:
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {apiResponse.data.subTopics.slice(0, 5).map((subtopic, index) => (
                <Grid key={index}>
                  <Chip
                    label={subtopic.name}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </Grid>
              ))}
              {apiResponse.data.subTopics.length > 5 && (
                <Grid>
                  <Chip
                    label={`+${apiResponse.data.subTopics.length - 5} more`}
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        <Box sx={{ p: 2, background: 'rgba(16, 185, 129, 0.05)', borderRadius: 2, border: '1px solid rgba(16, 185, 129, 0.1)', mt: 3 }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: theme.palette.success.main }}>
            ✨ Your personalized content is ready! Start your learning journey now.
          </Typography>
        </Box>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <StyledButton
          variant="contained"
          size="large"
          onClick={handleStartLearningClick}
          sx={{
            background: 'linear-gradient(45deg, #10B981 30%, #34D399 90%)',
            color: 'white',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
            }
          }}
        >
          Start Learning {formData.topic} 🚀
        </StyledButton>
      </Box>
    </Box>
  );
};

export default SuccessStep;