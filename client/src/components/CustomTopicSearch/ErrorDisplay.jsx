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
      return "Try using more specific terms or different wording";
    }

    return "Try rephrasing your topic or using more specific keywords";
  };

  return (
    <Box>
      <Alert
        severity="error"
        sx={{
          borderRadius: "14px",
          mb: 1.5,
          border: `1px solid ${alpha(theme.palette.error.main, 0.4)}`,
          background: isDark
            ? alpha(theme.palette.error.main, 0.12)
            : alpha(theme.palette.error.main, 0.08),
        }}
      >
        {error}
      </Alert>

      <Typography
        variant="body2"
        sx={{
          textAlign: "left",
          color: theme.palette.primary.main,
          fontStyle: "italic",
          fontWeight: 500,
        }}
      >
        💡 {getRetrySuggestion()}
      </Typography>
    </Box>
  );
};

export default ErrorDisplay;
