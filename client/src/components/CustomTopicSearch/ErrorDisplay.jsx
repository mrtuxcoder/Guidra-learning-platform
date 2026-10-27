import React from "react";
import { Alert, Typography, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const ErrorDisplay = ({ error }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!error) return null;

  const getRetrySuggestion = () => {
    if (!error) return null;

    if (error.includes("not suitable") || error.includes("try")) {
      return "Try using more specific terms or a well-known technical concept.";
    }

    return "Try rephrasing your topic with keywords like 'Introduction to...' or 'Fundamentals'.";
  };

  return (
    <Box sx={{ mt: 1.5 }}>
      <Alert
        severity="error"
        sx={{
          borderRadius: "6px",
          mb: 1,
          fontSize: "0.85rem",
          border: "1px solid",
          borderColor: alpha(theme.palette.error.main, isDark ? 0.3 : 0.2),
          bgcolor: isDark
            ? alpha(theme.palette.error.main, 0.12)
            : alpha(theme.palette.error.main, 0.06),
        }}
      >
        {error}
      </Alert>

      <Typography
        variant="body2"
        sx={{
          textAlign: "left",
          color: "text.secondary",
          fontSize: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: 0.75,
        }}
      >
        <Box component="span" sx={{ color: "warning.main", fontWeight: 700 }}>Tip:</Box>
        {getRetrySuggestion()}
      </Typography>
    </Box>
  );
};

export default ErrorDisplay;
