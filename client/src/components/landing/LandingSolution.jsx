import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";

const solutionSteps = [
  {
    title: "Choose a topic",
    detail: "Pick a subject you want to learn clearly.",
  },
  {
    title: "Get structured subtopics",
    detail: "Guidra builds a predictable learning flow.",
  },
  {
    title: "Study explanation and mindmap",
    detail: "Focused content for understanding and recall.",
  },
  {
    title: "Take the quiz",
    detail: "Quick checks to reinforce concepts.",
  },
  {
    title: "Track progress",
    detail: "See completion and understanding levels.",
  },
];

const LandingSolution = () => {
  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background:
          "linear-gradient(180deg, rgba(124,58,237,0.03) 0%, rgba(124,58,237,0.08) 100%)",
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
          How Guidra Works
        </Typography>
        <Grid container spacing={2.5}>
          {solutionSteps.map((step, index) => (
            <Grid item xs={12} md={6} key={step.title}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "white",
                  border: "1px solid rgba(124,58,237,0.15)",
                  height: "100%",
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

export default LandingSolution;
