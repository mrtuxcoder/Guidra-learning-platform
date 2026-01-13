import React from "react";
import { Box, Button, Chip } from "@mui/material";
import { navItems, purpleTheme } from "../constants.jsx";

const NavigationItems = ({ isMobile, isActive, navigate, user }) => {
  if (!user) return null;

  if (isMobile) {
    return null; // Mobile nav items are in the UserMenu
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        gap: 0.5,
        justifyContent: "center",
        mx: 2,
      }}
    >
      {navItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => navigate(item.path)}
          startIcon={item.icon}
          data-tour={item.path.replace("/", "")}
          sx={{
            fontWeight: isActive(item.path) ? "700" : "500",
            borderRadius: 2,
            px: 2,
            py: 0.75,
            color: isActive(item.path)
              ? purpleTheme.primaryDark
              : "text.secondary",
            bgcolor: isActive(item.path) ? purpleTheme.lightBg : "transparent",
            border: isActive(item.path)
              ? `1px solid ${purpleTheme.primaryLight}20`
              : "1px solid transparent",
            minWidth: "auto",
            fontSize: "0.9rem",
            position: "relative",
            "&:hover": {
              bgcolor: isActive(item.path)
                ? purpleTheme.lightBg
                : "rgba(126, 87, 194, 0.04)",
            },
          }}
        >
          {item.label}
          {item.beta && (
            <Chip
              label="BETA"
              size="small"
              sx={{
                ml: 1,
                height: 16,
                fontSize: "0.6rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
                "& .MuiChip-label": {
                  px: 0.75,
                  py: 0.25,
                },
              }}
            />
          )}
        </Button>
      ))}
    </Box>
  );
};

export default NavigationItems;
