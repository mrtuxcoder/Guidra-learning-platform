import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";

const progressItems = [
  {
    title: "Topic completion",
    detail: "Automatically calculated from subtopics.",
  },
  {
    title: "Understanding level",
    detail: "Track your level on a 1–5 scale.",
  },
  {
    title: "Quiz performance",
    detail: "Scores are saved for later review.",
  },
];

const LandingProgress = () => {
  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background:
          "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, rgba(124,58,237,0.02) 100%)",
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
          Progress Tracking
        </Typography>
        <Grid container spacing={2.5}>
          {progressItems.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(124,58,237,0.15)",
                  background: "white",
                  height: "100%",
                }}
              >
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: "#4B5563" }}>{item.detail}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingProgress;
