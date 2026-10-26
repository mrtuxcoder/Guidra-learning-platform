import React from "react";
import { Box } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const CompletionIndicator = ({ completed, isSelected }) => {
  if (completed) {
    return (
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: "success.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CheckCircle sx={{ fontSize: 13, color: "white" }} />
      </Box>
    );
  }

  if (isSelected) {
    return (
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "2px solid",
          borderColor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "primary.main",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: "1.5px solid",
        borderColor: "divider",
        flexShrink: 0,
      }}
    />
  );
};

export default CompletionIndicator;