import React from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { purpleTheme } from "../constants.jsx";

const UserMenu = ({
  anchorEl,
  handleMenuClose,
  handleLogout,
}) => {
  return (
    <Menu
      id="user-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 4,
        sx: {
          mt: 1,
          borderRadius: 2,
          minWidth: 180,
          border: `1px solid ${purpleTheme.primaryLight}20`,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        onClick={handleLogout}
        sx={{
          py: 1.25,
          color: "error.main",
          "&:hover": {
            bgcolor: "rgba(211, 47, 47, 0.04)",
          },
        }}
      >
        <Logout sx={{ mr: 1.5, fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: "500" }}>
          Sign Out
        </Typography>
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
