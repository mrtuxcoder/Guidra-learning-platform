import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Box, Typography, Chip } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { navItems, purpleTheme } from "../constants.jsx";
import { useTimer } from "../../../contexts/TimerContext";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
};

const UserMenu = ({
  anchorEl,
  isMobile,
  handleMenuClose,
  navigate,
  handleLogout,
}) => {
  const { isActive: timerActive, remainingSeconds } = useTimer();
  const [showTimer, setShowTimer] = useState(false);

  // Check localStorage preference for showing timer
  useEffect(() => {
    const showTimerInNavbar = localStorage.getItem("showTimerInNavbar") === "true";
    setShowTimer(showTimerInNavbar);

    // Listen for storage changes (when toggled in Settings from different tab)
    const handleStorageChange = () => {
      const updated = localStorage.getItem("showTimerInNavbar") === "true";
      setShowTimer(updated);
    };

    // Listen for custom event (when toggled in Settings same window)
    const handleTimerToggle = () => {
      const updated = localStorage.getItem("showTimerInNavbar") === "true";
      setShowTimer(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("timerNavbarToggle", handleTimerToggle);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("timerNavbarToggle", handleTimerToggle);
    };
  }, []);

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
      {/* Navigation items for mobile */}
      {isMobile &&
        navItems.map((item) => {
          const isTimerItem = item.path === "/study-timer";
          const shouldShowTimerCountdown = isTimerItem && showTimer && timerActive;
          
          return (
            <MenuItem
              key={item.path}
              onClick={() => {
                navigate(item.path);
                handleMenuClose();
              }}
              data-tour={item.path.replace("/", "")}
              sx={{
                py: 1.25,
                "&:hover": {
                  bgcolor: purpleTheme.lightBg,
                },
              }}
            >
              <Box sx={{ mr: 1.5, color: purpleTheme.primary }}>{item.icon}</Box>
              <Typography variant="body2" sx={{ fontWeight: "500" }}>
                {shouldShowTimerCountdown ? formatTime(remainingSeconds) : item.label}
              </Typography>
              {item.beta && (
                <Chip
                  label="BETA"
                  size="small"
                  sx={{
                    ml: 1,
                    height: 16,
                    fontSize: "0.55rem",
                    fontWeight: "700",
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    "& .MuiChip-label": {
                      px: 0.5,
                      py: 0.125,
                    },
                  }}
                />
              )}
            </MenuItem>
          );
        })}

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
