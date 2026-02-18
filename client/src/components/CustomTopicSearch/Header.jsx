import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AutoAwesome } from "@mui/icons-material";

const Header = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "20px",
            background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isDark
              ? "0 16px 36px rgba(0, 0, 0, 0.35)"
              : "0 16px 36px rgba(94, 53, 177, 0.2)",
          }}
        >
          <AutoAwesome sx={{ fontSize: 40, color: "white" }} />
        </Box>
      </Box>

      <Typography
        variant="overline"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.3em",
          color: "text.secondary",
          display: "block",
          mb: 1,
        }}
      >
        CUSTOM LEARN
      </Typography>

      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1.5,
          fontSize: { xs: "2rem", sm: "2.6rem", md: "3rem" },
          lineHeight: 1.1,
        }}
      >
        Learn Anything, Your Way
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mb: 2,
          maxWidth: 480,
          fontSize: { xs: "0.95rem", sm: "1rem" },
          mx: "auto",
        }}
      >
        Build a personalized learning path with clear, step-by-step lessons.
        Start with a topic or pick a curated idea.
      </Typography>

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 0.75,
          borderRadius: "999px",
          background: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1),
          border: `1px solid ${alpha(
            theme.palette.primary.main,
            isDark ? 0.35 : 0.18
          )}`,
          color: "text.primary",
          fontWeight: 600,
          fontSize: "0.85rem",
          mx: "auto",
        }}
      >
        Structured lessons · 10–15 steps
      </Box>
    </Box>
  );
};

export default Header;
