import React from "react";
import { Box } from "@mui/material";

const AnimatedProgressBar = ({
  width = 400,
  height = 6,
  color,
  gradientEnd,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: height,
        background: `${color || "rgba(124, 58, 237, 0.1)"}`,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        maxWidth: width,
        margin: "0 auto",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "60%",
          background: `linear-gradient(90deg, ${color || "#7C3AED"} 0%, ${
            gradientEnd || "#5E35B1"
          } 100%)`,
          borderRadius: 3,
          animation: "progress 2s ease-in-out infinite",
          "@keyframes progress": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(250%)" },
          },
        },
      }}
    />
  );
};

export default AnimatedProgressBar;
