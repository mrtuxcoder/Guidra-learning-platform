import React from "react";
import { Box, Tooltip, Avatar, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import { AutoAwesome, AccessTime, NotificationsActive } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { purpleTheme } from "../constants";
import { useTimer } from "../../../contexts/TimerContext";

const DAILY_REGEN_LIMIT = 6;
const formatTimer = (totalSeconds) => {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const DailyRegenBadge = ({ remaining, isLoading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isActive: timerActive, remainingSeconds, selectedMinutes, hasCompleted } = useTimer();
  const [showTimer, setShowTimer] = React.useState(false);
  const [showTimerInNavbar, setShowTimerInNavbar] = React.useState(
    localStorage.getItem("showTimerInNavbar") === "true"
  );

  React.useEffect(() => {
    const handleStorageChange = () => {
      setShowTimerInNavbar(localStorage.getItem("showTimerInNavbar") === "true");
    };

    const handleTimerToggle = () => {
      setShowTimerInNavbar(localStorage.getItem("showTimerInNavbar") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("timerNavbarToggle", handleTimerToggle);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("timerNavbarToggle", handleTimerToggle);
    };
  }, []);

  const canShowTimerView = isMobile && showTimerInNavbar;

  React.useEffect(() => {
    if (!canShowTimerView) {
      setShowTimer(false);
      return;
    }

    if (!timerActive && !hasCompleted) {
      setShowTimer(false);
    }
  }, [canShowTimerView, timerActive, hasCompleted]);

  if (isLoading) return null;

  const isLow = remaining <= 2;
  const isOut = remaining === 0;
  const totalSessionSeconds = Math.max(60, (Number(selectedMinutes) || 1) * 60);
  const safeRemaining = Math.max(0, Number(remainingSeconds) || 0);
  const elapsed = Math.max(0, totalSessionSeconds - safeRemaining);
  const progressValue = Math.max(
    0,
    Math.min(100, (elapsed / totalSessionSeconds) * 100)
  );
  const handleToggle = () => {
    if (!canShowTimerView) return;
    setShowTimer((prev) => !prev);
  };

  return (
    <Tooltip
      title={
        canShowTimerView && hasCompleted
          ? "Timer ended"
          : canShowTimerView && showTimer
          ? timerActive
            ? `Study timer: ${formatTimer(safeRemaining)}`
            : "Study timer is not running"
          : isOut
          ? "Daily regeneration limit reached. Resets at midnight."
          : `${remaining}/${DAILY_REGEN_LIMIT} regenerations remaining today`
      }
      arrow
      placement="bottom"
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
        }}
      >
        <Avatar
          onClick={handleToggle}
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            fontSize: { xs: "0.875rem", sm: "0.95rem" },
            fontWeight: 700,
            bgcolor: hasCompleted
              ? "rgba(255, 193, 7, 0.16)"
              : showTimer
              ? "rgba(2, 136, 209, 0.14)"
              : isOut
              ? "rgba(211, 47, 47, 0.1)"
              : isLow
              ? "rgba(237, 108, 2, 0.1)"
              : `${purpleTheme.primaryLight}20`,
            color: hasCompleted
              ? "warning.dark"
              : showTimer
              ? "info.main"
              : isOut
              ? "error.main"
              : isLow
              ? "warning.main"
              : purpleTheme.primaryDark,
            border: `2px solid ${
              hasCompleted
                ? "rgba(255, 193, 7, 0.45)"
                : showTimer
                ? "rgba(2, 136, 209, 0.4)"
                : isOut
                ? "rgba(211, 47, 47, 0.4)"
                : isLow
                ? "rgba(237, 108, 2, 0.4)"
                : `${purpleTheme.primaryLight}50`
            }`,
            cursor: canShowTimerView ? "pointer" : "default",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: hasCompleted
                ? "rgba(255, 193, 7, 0.22)"
                : showTimer
                ? "rgba(2, 136, 209, 0.2)"
                : isOut
                ? "rgba(211, 47, 47, 0.15)"
                : isLow
                ? "rgba(237, 108, 2, 0.15)"
                : `${purpleTheme.primaryLight}30`,
              transform: "scale(1.05)",
            },
          }}
        >
          {canShowTimerView && hasCompleted ? (
            <NotificationsActive
              sx={{
                fontSize: { xs: 18, sm: 20 },
                animation: "bellSwing 0.7s ease-in-out infinite",
                transformOrigin: "top center",
                "@keyframes bellSwing": {
                  "0%": { transform: "rotate(0deg)" },
                  "25%": { transform: "rotate(16deg)" },
                  "50%": { transform: "rotate(-14deg)" },
                  "75%": { transform: "rotate(8deg)" },
                  "100%": { transform: "rotate(0deg)" },
                },
              }}
            />
          ) : canShowTimerView && showTimer ? (
            <Box sx={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={isMobile ? 24 : 28}
                thickness={2.2}
                sx={{ color: "rgba(0, 0, 0, 0.18)", position: "absolute" }}
              />
              <CircularProgress
                variant="determinate"
                value={progressValue}
                size={isMobile ? 24 : 28}
                thickness={2.2}
                sx={{ color: purpleTheme.primaryDark, position: "absolute" }}
              />
              <Typography sx={{ fontSize: { xs: "0.52rem", sm: "0.58rem" }, fontWeight: 700, lineHeight: 1, color: "#111111" }}>
                {formatTimer(safeRemaining)}
              </Typography>
            </Box>
          ) : (
            `${remaining}/${DAILY_REGEN_LIMIT}`
          )}
        </Avatar>
        {canShowTimerView && hasCompleted ? (
          <NotificationsActive
            sx={{
              position: "absolute",
              bottom: -2,
              right: -2,
              fontSize: { xs: 14, sm: 16 },
              color: "warning.main",
              bgcolor: "background.paper",
              borderRadius: "50%",
              padding: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          />
        ) : canShowTimerView && showTimer ? (
          <AccessTime
            sx={{
              position: "absolute",
              bottom: -2,
              right: -2,
              fontSize: { xs: 14, sm: 16 },
              color: purpleTheme.primaryDark,
              bgcolor: "background.paper",
              borderRadius: "50%",
              padding: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          />
        ) : (
          <AutoAwesome
            sx={{
              position: "absolute",
              bottom: -2,
              right: -2,
              fontSize: { xs: 14, sm: 16 },
              color: isOut
                ? "error.main"
                : isLow
                ? "warning.main"
                : purpleTheme.primary,
              bgcolor: "background.paper",
              borderRadius: "50%",
              padding: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default DailyRegenBadge;
