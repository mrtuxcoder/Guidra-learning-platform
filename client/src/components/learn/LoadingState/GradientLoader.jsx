import React from "react";
import { Box } from "@mui/material";

const GradientLoader = ({ size = 80, speed = 2, colors }) => {
  const {
    start = "#7C3AED",
    mid = "#8B5CF6",
    end = "#A78BFA",
    light = "#C4B5FD",
  } = colors || {};

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `conic-gradient(
          from 0deg at 50% 50%,
          ${start} 0%,
          ${mid} 25%,
          ${end} 50%,
          ${light} 75%,
          ${start} 100%
        )`,
        animation: `spin ${speed}s linear infinite`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 4,
          borderRadius: "50%",
          background: "white",
        },
        "@keyframes spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      }}
    />
  );
};

export default GradientLoader;
