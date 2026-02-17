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

const regenerationPoints = [
  "Regenerate only the explanation, quiz, mindmap, or examples.",
  "AI usage is controlled and component-based.",
  "Versioned caching keeps previous outputs available.",
];

const LandingRegeneration = () => {
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
          Smart Regeneration
        </Typography>
        <Grid container spacing={2.5} alignItems="stretch">
          {regenerationPoints.map((point) => (
            <Grid
              item
              xs={12}
              md={4}
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
                  height: "100%",
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

export default LandingRegeneration;
