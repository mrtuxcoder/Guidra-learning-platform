import React from "react";
import { Box, Typography, Button, Avatar, Stack } from "@mui/material";
import { Explore, School, AutoAwesome } from "@mui/icons-material";

const EmptyState = ({ colorPalette }) => {
  return (
    <Box
      sx={{
        position: "relative",
        textAlign: "center",
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 3 },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -80,
          right: -120,
          width: 240,
          height: 240,
          background: `radial-gradient(circle, ${colorPalette[200]} 0%, transparent 65%)`,
          opacity: 0.8,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -120,
          left: -80,
          width: 260,
          height: 260,
          background: `radial-gradient(circle, ${colorPalette[100]} 0%, transparent 70%)`,
          opacity: 0.9,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={2.5} alignItems="center">
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.85)",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "text.primary",
              fontFamily: '"Space Grotesk", "Manrope", "Segoe UI", sans-serif',
            }}
          >
            <AutoAwesome sx={{ fontSize: 18, color: colorPalette[600] }} />
            Your learning hub
          </Box>

          <Avatar
            sx={{
              width: { xs: 96, sm: 110 },
              height: { xs: 96, sm: 110 },
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
              border: (theme) => theme.palette.mode === "dark" ? "3px solid rgba(255,255,255,0.1)" : "3px solid white",
              boxShadow: "0 10px 30px rgba(126, 87, 194, 0.35)",
            }}
          >
            <School sx={{ fontSize: 46 }} />
          </Avatar>

          <Box>
            <Typography
              variant="h3"
              fontWeight={800}
              color="text.primary"
              sx={{
                mb: 1.2,
                fontSize: { xs: "2rem", sm: "2.4rem" },
                lineHeight: 1.1,
                fontFamily:
                  '"Space Grotesk", "Manrope", "Segoe UI", sans-serif',
              }}
            >
              Start with your first course
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.6,
                fontSize: { xs: "0.98rem", sm: "1.05rem" },
                fontFamily: '"Manrope", "Segoe UI", sans-serif',
              }}
            >
              We will build a path around your goals. Pick a topic and Guidra
              will craft a personalized learning plan with guided lessons.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: "100%", maxWidth: 360 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => (window.location.href = "/explore")}
              startIcon={<Explore />}
              sx={{
                py: 1.6,
                px: 3,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 700,
                background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
                boxShadow: `0 10px 24px ${colorPalette[300]}`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 14px 32px ${colorPalette[400]}`,
                },
                transition: "all 0.3s ease",
              }}
              fullWidth
            >
              Explore courses
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default EmptyState;
