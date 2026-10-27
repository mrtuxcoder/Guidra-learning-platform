import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AutoAwesome } from "@mui/icons-material";
import { tokens } from "../../theme/tokens";

const Header = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
      {/* Subtle Icon Badge */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "8px",
          bgcolor: isDark
            ? alpha(tokens.colors.primary.main, 0.15)
            : alpha(tokens.colors.primary.main, 0.08),
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 1.5,
          border: "1px solid",
          borderColor: isDark
            ? alpha(tokens.colors.primary.main, 0.25)
            : alpha(tokens.colors.primary.main, 0.15),
        }}
      >
        <AutoAwesome sx={{ fontSize: 20 }} />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          letterSpacing: "-0.015em",
          color: "text.primary",
          mb: 0.75,
          fontSize: { xs: "1.4rem", sm: "1.75rem", md: "1.95rem" },
        }}
      >
        Create Learning Path
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mb: 2,
          maxWidth: 480,
          fontSize: { xs: "0.88rem", sm: "0.95rem" },
          lineHeight: 1.6,
          mx: "auto",
        }}
      >
        Build a personalized curriculum with clear, step-by-step lessons and interactive quizzes on any topic.
      </Typography>

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.4,
          borderRadius: "999px",
          bgcolor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
          border: "1px solid",
          borderColor: "divider",
          color: "text.secondary",
          fontWeight: 600,
          fontSize: "0.78rem",
          mx: "auto",
        }}
      >
        Structured lessons • 10–15 steps
      </Box>
    </Box>
  );
};

export default Header;
