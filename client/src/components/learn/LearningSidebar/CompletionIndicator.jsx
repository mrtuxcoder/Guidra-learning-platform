import React from "react";
import { Box } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const CompletionIndicator = ({ completed, isSelected, colorPalette }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: 20,
        height: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {completed ? (
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: colorPalette[600],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 2px 8px ${colorPalette[600]}40`,
            animation: "scaleIn 0.3s ease-out",
            "@keyframes scaleIn": {
              "0%": { transform: "scale(0)" },
              "70%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 12,
              color: "white",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: `2px solid ${colorPalette[200]}`,
            backgroundColor: "white",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: colorPalette[300],
            },
          }}
        />
      )}
    </Box>
  );
};

export default CompletionIndicator;
