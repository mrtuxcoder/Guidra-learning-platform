import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";

const regenerationPoints = [
  "Regenerate only the explanation, quiz, mindmap, or examples.",
  "AI usage is controlled and component-based.",
  "Versioned caching keeps previous outputs available.",
];

const LandingRegeneration = () => {
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
          Smart Regeneration
        </Typography>
        <Grid container spacing={2.5}>
          {regenerationPoints.map((point) => (
            <Grid item xs={12} md={4} key={point}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(124,58,237,0.15)",
                  background: "rgba(124,58,237,0.03)",
                  height: "100%",
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

export default LandingRegeneration;
