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

const problemPoints = [
  "Chatbot replies are long and unstructured.",
  "No saved progress or clear learning path.",
  "Revision is scattered and hard to organize.",
  "Responses are overwhelming for study use.",
];

const LandingProblem = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: "background.paper" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
          }}
        >
          The Problem
        </Typography>
        <Grid container spacing={2.5}>
          {problemPoints.map((point) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={point}
              sx={isMobile ? { width: "100%" } : undefined}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${profileTheme.border}`,
                  background: alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === "dark" ? 0.18 : 0.05
                  ),
                  ...(isMobile && {
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                  }),
                }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  {point}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingProblem;
