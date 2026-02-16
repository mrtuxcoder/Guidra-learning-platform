import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";

const problemPoints = [
  "Chatbot replies are long and unstructured.",
  "No saved progress or clear learning path.",
  "Revision is scattered and hard to organize.",
  "Responses are overwhelming for study use.",
];

const LandingProblem = () => {
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
          The Problem
        </Typography>
        <Grid container spacing={2.5}>
          {problemPoints.map((point) => (
            <Grid item xs={12} sm={6} key={point}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(124,58,237,0.12)",
                  background: "rgba(124,58,237,0.03)",
                }}
              >
                <Typography sx={{ color: "#4B5563" }}>{point}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingProblem;
