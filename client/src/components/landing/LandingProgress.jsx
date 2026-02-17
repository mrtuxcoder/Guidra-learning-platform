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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(
                theme.palette.primary.main,
                0.16
              )} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`
            : "linear-gradient(180deg, rgba(126,87,194,0.08) 0%, rgba(126,87,194,0.02) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
          }}
        >
          Progress Tracking
        </Typography>
        <Grid container spacing={2.5} alignItems="stretch">
          {progressItems.map((item) => (
            <Grid
              item
              xs={12}
              md={4}
              key={item.title}
              sx={isMobile ? { width: "100%" } : undefined}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${profileTheme.border}`,
                  background: "background.paper",
                  height: "100%",
                  ...(isMobile && {
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                  }),
                }}
              >
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {item.detail}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingProgress;
