import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Menu } from "@mui/icons-material";

const MobileMenuButton = ({ onOpenSidebar, colorPalette }) => {
  if (!onOpenSidebar) return null;

  return (
    <Tooltip title="Open menu">
      <IconButton
        onClick={onOpenSidebar}
        sx={{
          position: "fixed",
          top: 12,
          left: 12,
          width: 44,
          height: 44,
          background: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          color: colorPalette[600],
          zIndex: 1000,
          "&:hover": {
            background: "#f8fafc",
          },
        }}
      >
        <Menu sx={{ fontSize: 20 }} />
      </IconButton>
    </Tooltip>
  );
};

export default MobileMenuButton;
