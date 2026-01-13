import React from "react";
import { Box, Typography } from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";
import { getThemeGradient } from "../constants.jsx";

const Logo = ({ randomIcon, user, navigate }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexShrink: 0,
        cursor: "pointer",
        flex: user ? 1 : "none",
      }}
      onClick={() => navigate(user ? "/learn" : "/")}
      data-tour="logo"
    >
      <Box
        sx={{
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          borderRadius: { xs: 1.5, sm: 2.5 },
          background: getThemeGradient(randomIcon),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexShrink: 0,
        }}
      >
        {randomIcon?.icon || (
          <RocketLaunch sx={{ fontSize: { xs: 16, sm: 20 } }} />
        )}
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: "800",
          background: getThemeGradient(randomIcon),
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          whiteSpace: "nowrap",
        }}
      >
        Guidra
      </Typography>
    </Box>
  );
};

export default Logo;
