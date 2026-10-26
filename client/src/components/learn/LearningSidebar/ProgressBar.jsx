import React from "react";
import { Box, LinearProgress } from "@mui/material";

const ProgressBar = ({ progress, sx }) => {
  return (
    <Box sx={{ px: 1.5, mt: 0.75, ...sx }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          borderRadius: "999px",
          bgcolor: "action.hover",
          "& .MuiLinearProgress-bar": {
            bgcolor: progress === 100 ? "success.main" : "primary.main",
            borderRadius: "999px",
          },
        }}
      />
    </Box>
  );
};

export default ProgressBar;