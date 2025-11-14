import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { StyledButton } from "./styledComponents";
import { ChevronLeft, ChevronRight, RocketLaunch } from "@mui/icons-material";

const StepperNavigation = ({ 
  activeStep, 
  loading, 
  isStepValid, 
  handleBack, 
  handleNext, 
  handleSubmit, 
  theme 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      mt: 6, 
      borderTop: `1px solid ${theme.palette.divider}`, 
      pt: 3,
      px: { xs: 0, sm: 2 }
    }}>
      <StyledButton
        disabled={activeStep === 0 || loading}
        onClick={handleBack}
        startIcon={<ChevronLeft />}
        variant="outlined"
      >
        Previous
      </StyledButton>
      
      <StyledButton
        variant="contained"
        onClick={activeStep === 2 ? handleSubmit : handleNext}
        disabled={!isStepValid() || loading}
        endIcon={activeStep === 2 ? <RocketLaunch /> : <ChevronRight />}
        sx={{ 
          background: activeStep === 2 
            ? `linear-gradient(45deg, ${theme.palette.success.main} 30%, #30E8BF 90%)` 
            : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          }
        }}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: 'white' }} />
        ) : activeStep === 2 ? 'Create Learning Path! 🚀' : 'Continue Adventure!'}
      </StyledButton>
    </Box>
  );
};

export default StepperNavigation;