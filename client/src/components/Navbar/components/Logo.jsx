import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  RocketLaunch,
  Explore,
  Search,
  AccessTime,
  Person,
  Settings,
  School,
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import { getThemeGradient } from "../constants.jsx";

const Logo = ({ randomIcon, user, navigate }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const pageMeta = {
    "/learn": {
      label: "Learn",
      icon: <School sx={{ fontSize: { xs: 16, sm: 20 } }} />,
    },
    "/explore": {
      label: "Explore",
      icon: <Explore sx={{ fontSize: { xs: 16, sm: 20 } }} />,
    },
    "/custom-topic": {
      label: "Custom Topic",
      icon: <Search sx={{ fontSize: { xs: 16, sm: 20 } }} />,
    },
    "/study-timer": {
      label: "Study Timer",
      icon: <AccessTime sx={{ fontSize: { xs: 16, sm: 20 } }} />,
    },
    "/profile": {
      label: "Profile",
      icon: <Person sx={{ fontSize: { xs: 16, sm: 20 } }} />,
    },
    "/settings": {
      label: "Settings",
      icon: <Settings sx={{ fontSize: { xs: 16, sm: 20 } }} />,
    },
  };

  const activeMeta = pageMeta[location.pathname];
  const mobileLabel = user && isMobile && activeMeta ? activeMeta.label : "Guidra";
  const mobileIcon = user && isMobile && activeMeta ? activeMeta.icon : null;

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
        {mobileIcon ||
          randomIcon?.icon || (
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
