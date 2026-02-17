import React from "react";
import { Box, Container, Typography, Grid, alpha, useTheme } from "@mui/material";

const features = [
  "Structured Content Generation",
  "Academic Mode (Exam-ready answers)",
  "Versioned Caching System",
  "Minimal and Focused Interface",
  "Smart Regeneration",
  "Exam Practice Mode",
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
        <Grid container spacing={2.5}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature}>
              <Box
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
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingFeatures;
