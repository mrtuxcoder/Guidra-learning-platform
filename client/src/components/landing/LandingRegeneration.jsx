import React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { profileTheme } from "../profile/constants";

const regenerationPoints = [
  "Regenerate lessons with selected teaching styles instead of random retries.",
  "Daily regeneration limits keep AI usage predictable and fair.",
  "Cached content is reused automatically for faster loading.",
  "Open full content by version when you want a previous output.",
  "Track generation counts per subtopic so retries stay intentional.",
  "When limits are reached, you can still continue with already cached subtopics.",
];

const LandingRegeneration = () => {
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
          Smart Regeneration
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
          {regenerationPoints.map((point) => (
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

export default LandingRegeneration;
