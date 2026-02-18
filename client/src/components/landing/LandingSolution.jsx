import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { profileTheme } from "../profile/constants";

const solutionSteps = [
  {
    title: "Choose or customize a topic",
    detail: "Pick from recommended subjects or add your own custom learning topic.",
  },
  {
    title: "Select your teaching style",
    detail: "Choose how you want content generated—detailed, concise, visual, or academic.",
  },
  {
    title: "Get structured content",
    detail: "Guidra builds a complete learning path with explanation, mindmap, and examples.",
  },
  {
    title: "Practice with interactive quizzes",
    detail: "Test your understanding with AI-generated quizzes and track your performance.",
  },
  {
    title: "Study with focus timer",
    detail: "Use the built-in study timer to maintain focused sessions and track time spent.",
  },
  {
    title: "Review and regenerate",
    detail: "Access all content versions, regenerate components, and compare different approaches.",
  },
];

const LandingSolution = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(
                theme.palette.primary.main,
                0.16
              )} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
            : "linear-gradient(180deg, rgba(126,87,194,0.05) 0%, rgba(126,87,194,0.1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
          }}
        >
          How Guidra Works
        </Typography>
        <Grid container spacing={2.5}>
          {solutionSteps.map((step, index) => (
            <Grid
              item
              xs={12}
              md={6}
              key={step.title}
              sx={isMobile ? { width: "100%" } : undefined}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "background.paper",
                  border: `1px solid ${profileTheme.border}`,
                  height: "100%",
                  ...(isMobile && {
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                  }),
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: isDark
                      ? profileTheme.primaryLight
                      : profileTheme.primaryDark,
                    fontWeight: 600,
                  }}
                >
                  Step {index + 1}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, mt: 0.5 }}
                >
                  {step.title}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {step.detail}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingSolution;
