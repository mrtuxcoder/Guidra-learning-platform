import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
} from "@mui/material";
import {
  RocketLaunch,
  NavigateNext,
  NavigateBefore,
} from "@mui/icons-material";
import { getThemeGradient } from "../constants.jsx";

// Tour steps
const tourSteps = [
  {
    label: "Welcome to Guidra!",
    description: "Let me show you around your new learning platform.",
  },
  {
    label: "Your Learning Hub",
    description:
      "Start learning with structured courses and track your progress.",
  },
  {
    label: "Explore Courses",
    description: "Discover new topics and expand your knowledge.",
  },
  {
    label: "Custom Topics (BETA)",
    description: "Create personalized learning paths on any topic you choose.",
  },
  {
    label: "Your Profile",
    description: "View your progress, achievements, and learning statistics.",
  },
  {
    label: "Ready to Learn!",
    description: "You're all set! Start your learning journey now.",
  },
];

const OnboardingTour = ({
  open,
  activeTourStep,
  handleTourSkip,
  handleTourBack,
  handleTourNext,
  handleTourComplete,
  randomIcon,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleTourSkip}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)",
        },
      }}
    >
      <DialogContent sx={{ p: 4, pb: 2 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: getThemeGradient(randomIcon),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <RocketLaunch sx={{ fontSize: 28, color: "white" }} />
          </Box>
          <Typography
            variant="h5"
            fontWeight="800"
            gutterBottom
            sx={{
              background: getThemeGradient(randomIcon),
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {tourSteps[activeTourStep].label}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {tourSteps[activeTourStep].description}
          </Typography>
        </Box>

        {/* Progress indicator */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          {tourSteps.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: index === activeTourStep ? "#7E57C2" : "grey.300",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button
          onClick={handleTourSkip}
          sx={{
            color: "text.secondary",
            fontWeight: "600",
          }}
        >
          Skip Tour
        </Button>

        <Box sx={{ flex: 1 }} />

        {activeTourStep > 0 && (
          <Button
            onClick={handleTourBack}
            startIcon={<NavigateBefore />}
            sx={{
              color: "#7E57C2",
              fontWeight: "600",
            }}
          >
            Back
          </Button>
        )}

        <Button
          variant="contained"
          onClick={handleTourNext}
          endIcon={
            activeTourStep === tourSteps.length - 1 ? null : <NavigateNext />
          }
          sx={{
            background: getThemeGradient(randomIcon),
            fontWeight: "700",
            borderRadius: 2,
            px: 3,
            "&:hover": {
              background: getThemeGradient(randomIcon),
              opacity: 0.9,
            },
          }}
        >
          {activeTourStep === tourSteps.length - 1 ? "Get Started" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OnboardingTour;
