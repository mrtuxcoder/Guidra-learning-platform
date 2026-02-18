import React, { useState, useEffect } from "react";
import { Box, Button, Chip, alpha, useTheme } from "@mui/material";
import { navItems, purpleTheme } from "../constants.jsx";
import { useTimer } from "../../../contexts/TimerContext";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
};

const NavigationItems = ({ isMobile, isActive, navigate, user }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
      {navItems.map((item) => {
        // Check if this is the timer item and should display countdown
        const isTimerItem = item.path === "/study-timer";
        const shouldShowTimerCountdown = isTimerItem && showTimer && timerActive;
        
        return (
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
                ? isDark
                  ? theme.palette.primary.light
                  : purpleTheme.primaryDark
                : "text.secondary",
              bgcolor: isActive(item.path)
                ? isDark
                  ? alpha(theme.palette.primary.main, 0.18)
                  : purpleTheme.lightBg
                : "transparent",
              border: isActive(item.path)
                ? `1px solid ${
                    isDark
                      ? alpha(theme.palette.primary.main, 0.35)
                      : `${purpleTheme.primaryLight}20`
                  }`
                : "1px solid transparent",
              minWidth: "auto",
              fontSize: "0.9rem",
              position: "relative",
              "&:hover": {
                bgcolor: isActive(item.path)
                  ? isDark
                    ? alpha(theme.palette.primary.main, 0.22)
                    : purpleTheme.lightBg
                  : isDark
                    ? alpha(theme.palette.primary.main, 0.12)
                    : "rgba(126, 87, 194, 0.04)",
              },
            }}
          >
            {shouldShowTimerCountdown ? formatTime(remainingSeconds) : item.label}
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
        );
      })}
    </Box>
  );
};

export default NavigationItems;
