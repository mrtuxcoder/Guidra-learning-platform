import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  LinearProgress,
  Alert,
  FormControlLabel,
  Switch,
  Chip,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  RestartAlt,
  NotificationsActive,
  Timer as TimerIcon,
  LocalFireDepartment,
  CheckCircle,
} from "@mui/icons-material";
import { useTimer } from "../contexts/TimerContext";
import { tokens } from "../theme/tokens";

const PRESET_MINUTES = [
  { value: "25", label: "25m Pomodoro" },
  { value: "40", label: "40m Deep Work" },
  { value: "60", label: "60m Mastery" },
];
const DAILY_SESSION_GOAL = 6;
const DAILY_SESSIONS_STORAGE_KEY = "timerDailySessions";

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const readDailySessions = (key) => {
  try {
    const raw = localStorage.getItem(DAILY_SESSIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return Number(parsed[key] || 0);
  } catch {
    return 0;
  }
};

const writeDailySessions = (key, value) => {
  try {
    const raw = localStorage.getItem(DAILY_SESSIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[key] = value;
    localStorage.setItem(DAILY_SESSIONS_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // noop
  }
};

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
};

const clampMinutes = (value) => {
  if (Number.isNaN(value)) return 1;
  return Math.min(Math.max(value, 1), 180);
};

export default function StudyTimer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {
    isActive,
    remainingSeconds,
    hasCompleted,
    setHasCompleted,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  } = useTimer();

  const [mode, setMode] = useState("25");
  const [customMinutes] = useState(30);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("timerNotificationsEnabled") === "true"
  );
  const [notificationMessage, setNotificationMessage] = useState("");
  const completionLoggedRef = useRef(false);

  const [todayKey, setTodayKey] = useState(getTodayKey);
  const [dailySessions, setDailySessions] = useState(() =>
    readDailySessions(getTodayKey())
  );

  const computedMinutes = useMemo(() => {
    if (mode === "custom") {
      return clampMinutes(customMinutes);
    }
    return Number(mode);
  }, [mode, customMinutes]);

  const progressValue =
    computedMinutes > 0
      ? Math.round(
          ((computedMinutes * 60 - remainingSeconds) /
            (computedMinutes * 60)) *
            100
        )
      : 0;
  const ringProgress = Math.max(0, Math.min(100, progressValue));
  const hasStarted = remainingSeconds < computedMinutes * 60;
  const primaryActionLabel = isActive
    ? "Pause Focus"
    : hasStarted
    ? "Resume Focus"
    : "Start Focus Session";

  useEffect(() => {
    if (hasCompleted && !completionLoggedRef.current) {
      setDailySessions((prev) => {
        const next = prev + 1;
        writeDailySessions(todayKey, next);
        return next;
      });

      completionLoggedRef.current = true;
    }

    if (!hasCompleted) {
      completionLoggedRef.current = false;
    }
  }, [hasCompleted, todayKey]);

  useEffect(() => {
    const syncDayAndSessions = () => {
      const nextTodayKey = getTodayKey();

      if (nextTodayKey !== todayKey) {
        setTodayKey(nextTodayKey);
        setDailySessions(readDailySessions(nextTodayKey));
        completionLoggedRef.current = false;
        return;
      }

      setDailySessions(readDailySessions(nextTodayKey));
    };

    syncDayAndSessions();
    const intervalId = setInterval(syncDayAndSessions, 60 * 1000);

    const handleStorage = (event) => {
      if (event.key === DAILY_SESSIONS_STORAGE_KEY) {
        syncDayAndSessions();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorage);
    };
  }, [todayKey]);

  const handleStartPause = () => {
    if (isActive) {
      pauseTimer();
    } else if (remainingSeconds > 0) {
      setHasCompleted(false);
      resumeTimer();
    } else {
      setHasCompleted(false);
      startTimer(computedMinutes);
    }
  };

  const handleReset = () => {
    setHasCompleted(false);
    resetTimer(computedMinutes);
  };

  const handleModeChange = (newMode) => {
    if (!isActive) {
      setMode(newMode);
      const minutes = Number(newMode) || computedMinutes;
      resetTimer(minutes);
    }
  };

  const handleNotificationsToggle = async () => {
    setNotificationMessage("");
    const nextValue = !notificationsEnabled;

    if (nextValue) {
      if (!("Notification" in window)) {
        setNotificationMessage("Notifications are not supported in this browser.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setNotificationMessage("Allow notifications to enable timer alerts.");
        return;
      }
    }

    setNotificationsEnabled(nextValue);
    localStorage.setItem(
      "timerNotificationsEnabled",
      nextValue ? "true" : "false"
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        py: { xs: 2.5, md: 3.5 },
        pb: { xs: 10, md: 4 },
      }}
    >
      <Container maxWidth="md" sx={{ maxWidth: { xs: "100%", sm: 580, md: 640 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          {/* Header */}
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                bgcolor: isDark
                  ? alpha(tokens.colors.primary.main, 0.16)
                  : alpha(tokens.colors.primary.main, 0.08),
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
              }}
            >
              <TimerIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                letterSpacing: "-0.02em",
                fontSize: { xs: "1.5rem", sm: "1.85rem" },
              }}
            >
              Study Timer
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontSize: "0.88rem" }}
            >
              Calm, distraction-free focus intervals designed for deep learning.
            </Typography>
          </Box>

          {/* Unified Digital Timer Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack alignItems="center" spacing={3}>
                {/* Status Indicator Row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Chip
                    label={`${computedMinutes} Min Session`}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "6px",
                      height: 24,
                      fontSize: "0.76rem",
                      bgcolor: isDark
                        ? alpha(tokens.colors.primary.main, 0.16)
                        : alpha(tokens.colors.primary.main, 0.08),
                      color: "primary.main",
                      border: "1px solid",
                      borderColor: alpha(tokens.colors.primary.main, 0.2),
                    }}
                  />

                  <Chip
                    label={isActive ? "Focusing" : hasStarted ? "Paused" : "Ready"}
                    size="small"
                    color={isActive ? "success" : hasStarted ? "warning" : "default"}
                    sx={{
                      fontWeight: 600,
                      borderRadius: "6px",
                      height: 24,
                      fontSize: "0.76rem",
                    }}
                  />
                </Box>

                {/* Minimal Digital Countdown Display */}
                <Box sx={{ textAlign: "center", py: 1, width: "100%" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "3.75rem", sm: "4.75rem" },
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      color: "text.primary",
                      fontVariantNumeric: "tabular-nums",
                      userSelect: "none",
                    }}
                  >
                    {formatTime(remainingSeconds)}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1.25,
                      color: "text.secondary",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontSize: "0.72rem",
                    }}
                  >
                    {isActive ? "Interval in progress" : hasStarted ? "Session paused" : "Ready to begin"}
                  </Typography>

                  {/* Thin Progress Bar */}
                  <Box sx={{ mt: 2.5, px: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={ringProgress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: isDark
                          ? alpha(tokens.colors.neutral[700], 0.5)
                          : alpha(tokens.colors.primary.main, 0.08),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 2,
                          bgcolor: isActive
                            ? "primary.main"
                            : hasStarted
                            ? "warning.main"
                            : "primary.main",
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Compact Duration Presets */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  {PRESET_MINUTES.map((preset) => {
                    const isSelected = mode === preset.value;
                    return (
                      <Chip
                        key={preset.value}
                        label={preset.label}
                        disabled={isActive}
                        clickable={!isActive}
                        onClick={() => handleModeChange(preset.value)}
                        sx={{
                          height: 32,
                          borderRadius: "6px",
                          fontWeight: isSelected ? 600 : 500,
                          fontSize: "0.8rem",
                          border: "1px solid",
                          borderColor: isSelected ? "primary.main" : "divider",
                          bgcolor: isSelected
                            ? isDark
                              ? alpha(tokens.colors.primary.main, 0.2)
                              : alpha(tokens.colors.primary.main, 0.08)
                            : "background.paper",
                          color: isSelected ? "primary.main" : "text.secondary",
                          transition: "all 0.15s ease",
                          "&:hover": {
                            borderColor: isSelected ? "primary.main" : "text.secondary",
                          },
                        }}
                      />
                    );
                  })}
                </Box>

                {/* Primary Action Controls */}
                <Stack direction="row" spacing={1.5} sx={{ width: "100%", pt: 0.5 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleStartPause}
                    startIcon={isActive ? <Pause /> : <PlayArrow />}
                    sx={{
                      height: 44,
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      textTransform: "none",
                      boxShadow: "none",
                      bgcolor: isActive ? "warning.main" : "primary.main",
                      "&:hover": {
                        bgcolor: isActive ? "warning.dark" : "primary.dark",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {primaryActionLabel}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    disabled={!hasStarted && remainingSeconds === computedMinutes * 60}
                    sx={{
                      width: 44,
                      minWidth: 44,
                      height: 44,
                      borderRadius: "8px",
                      borderColor: "divider",
                      color: "text.primary",
                      p: 0,
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: alpha(tokens.colors.primary.main, 0.06),
                      },
                    }}
                  >
                    <RestartAlt sx={{ fontSize: 20 }} />
                  </Button>
                </Stack>
              </Stack>
            </CardContent>

            {/* Integrated Understated Statistics & Settings Subpanel */}
            <Box
              sx={{
                px: { xs: 3, sm: 4 },
                py: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: isDark
                  ? alpha(tokens.colors.neutral[800], 0.3)
                  : alpha(tokens.colors.neutral[100], 0.6),
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* Daily Streak Indicator */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(theme.palette.warning.main, 0.12),
                    color: "warning.main",
                  }}
                >
                  <LocalFireDepartment sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.78rem" }}>
                      Daily Goal
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.74rem" }}>
                      {dailySessions} / {DAILY_SESSION_GOAL} blocks
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (dailySessions / DAILY_SESSION_GOAL) * 100)}
                    sx={{
                      width: 120,
                      height: 4,
                      mt: 0.5,
                      borderRadius: 2,
                      bgcolor: isDark
                        ? alpha(tokens.colors.neutral[700], 0.5)
                        : alpha(tokens.colors.primary.main, 0.1),
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        bgcolor: "warning.main",
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Sound & Notifications Toggle */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={notificationsEnabled}
                      onChange={handleNotificationsToggle}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <NotificationsActive sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.76rem" }}>
                        Completion alerts
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
              </Box>
            </Box>
          </Card>

          {/* Notification Info Alert */}
          {notificationMessage && (
            <Alert severity="info" sx={{ borderRadius: "6px", fontSize: "0.82rem", py: 0.5 }}>
              {notificationMessage}
            </Alert>
          )}

          {/* Completion Celebration Alert */}
          {hasCompleted && (
            <Alert
              icon={<CheckCircle sx={{ fontSize: 20 }} />}
              severity="success"
              onClose={() => setHasCompleted(false)}
              sx={{ borderRadius: "6px", fontSize: "0.84rem" }}
            >
              Session completed! Great work — start your next focus block when ready.
            </Alert>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
