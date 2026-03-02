import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { getThemeGradient } from "../constants.jsx";

const Logo = ({ randomIcon, user, navigate }) => {
  const theme = useTheme();
  const mobileLabel = "Guidra";

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
      <Typography
        variant="h6"
        sx={{
          fontWeight: "800",
          background: getThemeGradient(randomIcon),
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "1rem", sm: "1.25rem" },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {mobileLabel}
      </Typography>
    </Box>
  );
};

export default Logo;
