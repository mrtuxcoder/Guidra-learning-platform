import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";

const steps = [
  {
    title: "Choose a topic or upload a syllabus",
    detail: "Pick a subject or provide your syllabus outline.",
  },
  {
    title: "Receive structured lessons",
    detail: "Guidra builds subtopics, explanations, and key concepts.",
  },
  {
    title: "Revise with quizzes and summaries",
    detail: "Use quizzes, mindmaps, and mark-based answers.",
  },
];

const LandingHowItWorks = () => {
  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: "white" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          How It Works
        </Typography>
        <Grid container spacing={2.5}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={step.title}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(124,58,237,0.15)",
                  height: "100%",
                  background: "rgba(124,58,237,0.03)",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: "#5E35B1", fontWeight: 600 }}
                >
                  Step {index + 1}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, mt: 0.5 }}
                >
                  {step.title}
                </Typography>
                <Typography sx={{ color: "#4B5563" }}>{step.detail}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingHowItWorks;
