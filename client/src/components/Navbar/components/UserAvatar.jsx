import React from "react";
import { IconButton, Avatar, Badge, CircularProgress } from "@mui/material";
import { getThemeGradient, purpleTheme } from "../constants.jsx";

const UserAvatar = ({
  isLoading,
  user,
  randomIcon,
  getUserInitial,
  handleUserMenu,
}) => {
  if (isLoading) {
    return (
      <IconButton
        size="small"
        disabled
        sx={{
          border: `2px solid ${purpleTheme.primaryLight}20`,
          bgcolor: "white",
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
        }}
      >
        <CircularProgress
          size={20}
          sx={{
            color: purpleTheme.primary,
          }}
        />
      </IconButton>
    );
  }

  if (user) {
    return (
      <IconButton
        size="small"
        aria-label="user menu"
        onClick={handleUserMenu}
        data-tour="user-menu"
        sx={{
          border: `2px solid ${purpleTheme.primaryLight}30`,
          bgcolor: "white",
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          "&:hover": {
            bgcolor: purpleTheme.lightBg,
          },
          cursor: "pointer",
        }}
      >
        <Badge
          color="success"
          variant="dot"
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Avatar
            sx={{
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              background: getThemeGradient(randomIcon),
              fontWeight: "700",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            {getUserInitial()}
          </Avatar>
        </Badge>
      </IconButton>
    );
  }

  return null;
};

export default UserAvatar;
