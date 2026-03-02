import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { RocketLaunch } from "@mui/icons-material";

const LoadingState = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentGradient = `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`;

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: isDark
          ? `radial-gradient(circle at top, ${alpha(
              theme.palette.primary.main,
              0.2
            )} 0%, ${theme.palette.background.default} 60%)`
          : `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.08
            )} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Box sx={{ textAlign: "center", px: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: accentGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)", opacity: 1 },
              "50%": { transform: "scale(1.05)", opacity: 0.8 },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
          }}
        >
          <RocketLaunch sx={{ fontSize: 32, color: "white" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            background: accentGradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Loading Your Journey...
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          Preparing your learning dashboard
        </Typography>
      </Box>
    </Container>
  );
};

export default LoadingState;
