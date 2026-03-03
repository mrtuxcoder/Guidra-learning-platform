import React from "react";
import { Box, Container, Typography, alpha, useTheme } from "@mui/material";

const features = [
  "Curated Topic Library + Search",
  "Custom Topic Validation & Path Generation",
  "Structured Subtopic Learning Flow",
  "Teaching Style Regeneration",
  "Content Caching & Version History",
  "Quiz Submission and Performance Tracking",
  "Understanding Level Updates (1-5)",
  "Recall Mode for Completed Topics",
  "Daily Regeneration Limits",
  "Focus Study Timer",
  "Profile Insights & Analysis",
  "PWA-Friendly Mobile Experience",
];

const LandingFeatures = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(
                theme.palette.primary.main,
                0.16
              )} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`
            : "linear-gradient(180deg, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.02) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          Features
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          {features.map((feature) => (
            <Box
              key={feature}
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: "background.paper",
                border: `1px solid ${alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.3 : 0.15
                )}`,
                height: "100%",
              }}
            >
              <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LandingFeatures;
