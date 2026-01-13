import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const LoadingState = ({ isDesktop, colorPalette }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress
          size={isDesktop ? 80 : 60}
          sx={{
            color: colorPalette[500],
            mb: 3,
          }}
        />
        <Typography
          variant={isDesktop ? "h5" : "h6"}
          fontWeight="600"
          color="#1e293b"
          gutterBottom
        >
          Loading Your Learning Dashboard
        </Typography>
        <Typography variant="body1" color="#64748b" sx={{ maxWidth: "400px" }}>
          Preparing your personalized learning experience...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingState;
