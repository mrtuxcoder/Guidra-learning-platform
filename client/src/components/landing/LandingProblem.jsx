import React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { profileTheme } from "../profile/constants";

const problemPoints = [
  "Most AI answers are one-off and hard to revise later.",
  "Learners need a clear subtopic path, not random prompts.",
  "Progress, quiz performance, and understanding are rarely tracked together.",
  "Regeneration often creates inconsistency instead of stable study material.",
];

const LandingProblem = () => {
  const theme = useTheme();

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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          {problemPoints.map((point) => (
            <Box
              key={point}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${profileTheme.border}`,
                background: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.18 : 0.05
                ),
                height: "100%",
              }}
            >
              <Typography sx={{ color: "text.secondary" }}>{point}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LandingProblem;
