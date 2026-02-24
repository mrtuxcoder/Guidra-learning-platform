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
  "Regenerate specific components (explanation, quiz, mindmap, examples) with different styles.",
  "AI usage is controlled and tracked daily to manage costs and quality.",
  "Full content versioning—access all generated versions and compare them side-by-side.",
  "Retrieve complete generated content from multiple versions in one place.",
  "Component-level regeneration with teaching style customization.",
  "Smart caching system keeps your learning efficient and fast.",
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
