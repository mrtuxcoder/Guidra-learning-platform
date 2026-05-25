import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";
import { profileTheme, cardSx } from "./constants";

const LearningJourneyCard = ({ stats, onLaunchLesson }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          sx={{ mb: { xs: 2.5, sm: 3 } }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: { xs: 44, sm: 52 },
                height: { xs: 44, sm: 52 },
                borderRadius: "50%",
                background: profileTheme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RocketLaunch
                sx={{
                  fontSize: { xs: 22, sm: 26 },
                  color: "white",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.4rem", sm: "1.7rem", md: "1.9rem" },
                  background: profileTheme.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                Your Learning Journey
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
              >
                Keep up the great work and stay on track.
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Button
              variant="contained"
              size="large"
              startIcon={<RocketLaunch />}
              onClick={onLaunchLesson}
              sx={{
                borderRadius: 3,
                background: profileTheme.gradient,
                fontWeight: 700,
                px: 3,
                py: 1.5,
                fontSize: "0.95rem",
                boxShadow: "0 8px 24px rgba(126, 87, 194, 0.25)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(126, 87, 194, 0.35)",
                },
              }}
            >
              Launch Next Lesson
            </Button>
          )}
        </Stack>

        <Grid
          container
          spacing={2}
          alignItems="stretch"
          sx={{ mb: { xs: 2, sm: 3 }, width: "100%" }}
        >
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: "rgba(126, 87, 194, 0.06)",
                border: `1px solid ${profileTheme.border}`,
                height: "100%",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: 0.6, fontSize: "0.65rem" }}
              >
                OVERALL PROGRESS
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  color: profileTheme.primary,
                  lineHeight: 1,
                  mt: 0.75,
                }}
              >
                {stats.progressPercentage}%
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                color="text.primary"
                sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
              >
                Overall Progress
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: "rgba(126, 87, 194, 0.06)",
                border: `1px solid ${profileTheme.border}`,
                height: "100%",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: 0.6, fontSize: "0.65rem" }}
              >
                IN PROGRESS
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  color: profileTheme.primaryDark,
                  lineHeight: 1,
                  mt: 0.75,
                }}
              >
                {stats.inProgress}
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                color="text.primary"
                sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
              >
                In Progress
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {isMobile && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<RocketLaunch />}
            onClick={onLaunchLesson}
            sx={{
              borderRadius: 3,
              background: profileTheme.gradient,
              fontWeight: 700,
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
              boxShadow: "0 8px 24px rgba(126, 87, 194, 0.25)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(126, 87, 194, 0.35)",
              },
            }}
          >
            Launch Next Lesson
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningJourneyCard;
