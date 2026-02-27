import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Tooltip,
} from "@mui/material";
import { navItems } from "../constants.jsx";
import { useTimer } from "../../../contexts/TimerContext";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
};

const MobileFooterNav = ({ isActive, navigate, user }) => {
  const theme = useTheme();
  const location = useLocation();
  const isDark = theme.palette.mode === "dark";
  const { isActive: timerActive, remainingSeconds } = useTimer();
  const [showTimer, setShowTimer] = useState(false);
  const [hideOnLearnOverlay, setHideOnLearnOverlay] = useState(false);

  useEffect(() => {
    const showTimerInNavbar = localStorage.getItem("showTimerInNavbar") === "true";
    setShowTimer(showTimerInNavbar);

    const handleStorageChange = () => {
      const updated = localStorage.getItem("showTimerInNavbar") === "true";
      setShowTimer(updated);
    };

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

  useEffect(() => {
    const handleLearnFooterOverlayState = (event) => {
      setHideOnLearnOverlay(Boolean(event.detail?.hideNav));
    };

    window.addEventListener(
      "learnFooterOverlayState",
      handleLearnFooterOverlayState
    );

    return () => {
      window.removeEventListener(
        "learnFooterOverlayState",
        handleLearnFooterOverlayState
      );
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/learn") {
      setHideOnLearnOverlay(false);
    }
  }, [location.pathname]);

  if (!user) return null;
  if (location.pathname === "/learn" && hideOnLearnOverlay) return null;

  const isLearnCompactNav = location.pathname === "/learn";

  const orderedPaths = [
    "/study-timer",
    "/custom-topic",
    "/learn",
    "/explore",
    "/profile",
  ];
  const orderedNavItems = orderedPaths
    .map((path) => navItems.find((item) => item.path === path))
    .filter(Boolean);

  const activePath = orderedNavItems.find((item) => isActive(item.path))?.path || false;

  return (
    <Paper
      elevation={8}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        backdropFilter: "blur(12px)",
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <BottomNavigation
        showLabels={false}
        value={activePath}
        onChange={(_, newValue) => {
          if (newValue) {
            navigate(newValue);
          }
        }}
        sx={{
          bgcolor: "transparent",
          height: isLearnCompactNav ? 58 : 66,
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            maxWidth: "none",
            flex: 1,
            color: "text.secondary",
            px: isLearnCompactNav ? 0 : 0.25,
            py: isLearnCompactNav ? 0.25 : 0.5,
            borderRadius: 2,
            mx: isLearnCompactNav ? 0.15 : 0.35,
            opacity: isLearnCompactNav ? 0.85 : 1,
            "& .MuiSvgIcon-root": {
              fontSize: isLearnCompactNav ? "1.45rem" : "1.8rem",
              transition: "transform 0.2s ease, color 0.2s ease",
            },
            "&.Mui-selected": {
              color: isDark
                ? theme.palette.primary.light
                : theme.palette.primary.main,
              opacity: isLearnCompactNav ? 0.95 : 1,
              "& .MuiSvgIcon-root": {
                fontSize: isLearnCompactNav ? "1.6rem" : "2rem",
              },
            },
          },
          "& .MuiBottomNavigationAction-label, & .MuiBottomNavigationAction-label.Mui-selected": {
            fontSize: "0.62rem",
          },
        }}
      >
        {orderedNavItems.map((item) => {
          const isTimerItem = item.path === "/study-timer";
          const shouldShowTimerCountdown = isTimerItem && showTimer && timerActive;
          const tooltipLabel = shouldShowTimerCountdown
            ? `Timer: ${formatTime(remainingSeconds)}`
            : item.label;

          return (
            <BottomNavigationAction
              key={item.path}
              value={item.path}
              aria-label={item.label}
              icon={
                <Tooltip title={tooltipLabel} arrow>
                  <span>{item.icon}</span>
                </Tooltip>
              }
              label=" "
              data-tour={item.path.replace("/", "")}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileFooterNav;