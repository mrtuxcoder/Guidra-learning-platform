import React from "react";
import { Alert, Typography, Box } from "@mui/material";

const ErrorDisplay = ({ error }) => {
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
      <Alert severity="error" sx={{ borderRadius: "12px", mb: 1 }}>
        {error}
      </Alert>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "#7C3AED",
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
