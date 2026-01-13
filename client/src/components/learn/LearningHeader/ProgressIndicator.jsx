import React from "react";
import { Box } from "@mui/material";

const ProgressIndicator = ({ currentIndex, totalSubtopics, colorPalette }) => {
  const progress = ((currentIndex + 1) / totalSubtopics) * 100;

  return (
    <Box
      component="span"
      sx={{
        position: "absolute",
        top: -4,
        left: "50%",
        transform: "translateX(-50%)",
        background: `linear-gradient(90deg, ${
          colorPalette?.[500] || "#7e57c2"
        } 0%, ${colorPalette?.[600] || "#6d48b5"} 100%)`,
        height: "2px",
        width: `${progress}%`,
        maxWidth: "260px",
        borderRadius: "1px",
        boxShadow: "0 1px 4px rgba(126, 87, 194, 0.3)",
        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    />
  );
};

export default ProgressIndicator;
