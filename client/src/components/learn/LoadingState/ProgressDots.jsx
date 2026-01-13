import React from "react";
import { Box } from "@mui/material";

const ProgressDots = ({ count = 3, color, isMobile, sx }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, ...sx }}>
      {[...Array(count)].map((_, dot) => (
        <Box
          key={dot}
          sx={{
            width: isMobile ? 6 : 8,
            height: isMobile ? 6 : 8,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color || "#7C3AED"} 0%, ${
              color || "#5E35B1"
            } 100%)`,
            animation: `bounce 1.4s ease-in-out ${dot * 0.16}s infinite both`,
            "@keyframes bounce": {
              "0%, 80%, 100%": {
                transform: "scale(0.8)",
                opacity: 0.5,
              },
              "40%": {
                transform: "scale(1)",
                opacity: 1,
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default ProgressDots;
