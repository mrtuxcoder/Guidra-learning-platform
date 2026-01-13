import React from "react";
import { Box, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

const Header = () => {
  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "20px",
            background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AutoAwesome sx={{ fontSize: 40, color: "white" }} />
        </Box>
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
        }}
      >
        Learn Anything
      </Typography>

      <Typography sx={{ color: "text.secondary", mb: 2 }}>
        Type a topic and get a clear, step-by-step learning path instantly.
      </Typography>
    </Box>
  );
};

export default Header;
