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
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2.5, md: 5 },
        pb: { xs: 12, md: 8 },
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: tokens.radii.lg,
                bgcolor: isDark
                  ? alpha(tokens.colors.primary.main, 0.16)
                  : alpha(tokens.colors.primary.main, 0.1),
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
                border: "1px solid",
                borderColor: isDark
                  ? alpha(tokens.colors.primary.main, 0.3)
                  : alpha(tokens.colors.primary.main, 0.2),
              }}
            >
              <TimerIcon sx={{ fontSize: 28 }} />
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
              sx={{ mt: 0.5, fontSize: "0.9rem" }}
            >
              Calm, distraction-free focus intervals designed for deep learning.
            </Typography>
          </Box>

          {/* Main Timer Display Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: tokens.radii.lg,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: isDark
                ? tokens.shadows.dark.card
                : tokens.shadows.light.card,
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack alignItems="center" spacing={3}>
                {/* Status Indicator Chip */}
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
                      fontWeight: 700,
                      borderRadius: tokens.radii.full,
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
                      fontWeight: 700,
                      borderRadius: tokens.radii.full,
                    }}
                  />
                </Box>

                {/* Circular Progress Ring */}
                <Box
                  sx={{
                    width: { xs: 240, sm: 260 },
                    height: { xs: 240, sm: 260 },
                    borderRadius: "50%",
                    p: "10px",
                    background: `conic-gradient(${tokens.colors.primary.main} ${ringProgress}%, ${
                      isDark
                        ? alpha(tokens.colors.neutral[700], 0.6)
                        : alpha(tokens.colors.primary.main, 0.1)
                    } ${ringProgress}% 100%)`,
                    boxShadow: isDark
                      ? `0 0 24px ${alpha(tokens.colors.primary.main, 0.2)}`
                      : `0 0 24px ${alpha(tokens.colors.primary.main, 0.08)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.4s ease",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      bgcolor: "background.paper",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "3.2rem", sm: "3.6rem" },
                        fontWeight: 800,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                        color: "text.primary",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatTime(remainingSeconds)}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        color: "text.secondary",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {isActive ? "Remaining" : hasStarted ? "Paused" : "Tap Start"}
                    </Typography>
                  </Box>
                </Box>

                {/* Preset Duration Buttons */}
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
                          height: 36,
                          borderRadius: tokens.radii.full,
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "0.82rem",
                          border: "1px solid",
                          borderColor: isSelected ? "primary.main" : "divider",
                          bgcolor: isSelected
                            ? isDark
                              ? alpha(tokens.colors.primary.main, 0.2)
                              : alpha(tokens.colors.primary.main, 0.1)
                            : "background.default",
                          color: isSelected ? "primary.main" : "text.secondary",
                        }}
                      />
                    );
                  })}
                </Box>

                {/* Primary Action Buttons */}
                <Stack direction="row" spacing={1.5} sx={{ width: "100%", pt: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleStartPause}
                    startIcon={isActive ? <Pause /> : <PlayArrow />}
                    sx={{
                      py: 1.35,
                      borderRadius: tokens.radii.md,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      bgcolor: isActive ? "warning.main" : "primary.main",
                      "&:hover": {
                        bgcolor: isActive ? "warning.dark" : "primary.dark",
                      },
                    }}
                  >
                    {primaryActionLabel}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleReset}
                    disabled={!hasStarted && remainingSeconds === computedMinutes * 60}
                    sx={{
                      px: 2.5,
                      borderRadius: tokens.radii.md,
                      fontWeight: 600,
                      textTransform: "none",
                      borderColor: "divider",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: alpha(tokens.colors.primary.main, 0.06),
                      },
                    }}
                  >
                    <RestartAlt />
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Daily Goal Streak Tracker */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: tokens.radii.md,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalFireDepartment sx={{ color: "warning.main", fontSize: 22 }} />
                <Typography variant="subtitle2" fontWeight={700}>
                  Daily Focus Goal
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                {dailySessions} / {DAILY_SESSION_GOAL} Blocks
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={Math.min(100, (dailySessions / DAILY_SESSION_GOAL) * 100)}
              sx={{
                height: 8,
                borderRadius: tokens.radii.full,
                bgcolor: isDark
                  ? alpha(tokens.colors.neutral[700], 0.5)
                  : alpha(tokens.colors.primary.main, 0.1),
                "& .MuiLinearProgress-bar": {
                  borderRadius: tokens.radii.full,
                  bgcolor: "warning.main",
                },
              }}
            />
          </Paper>

          {/* Settings & Notifications Toggle */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: tokens.radii.md,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={handleNotificationsToggle}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <NotificationsActive sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography variant="body2" fontWeight={600}>
                    Sound & Browser Alerts on Completion
                  </Typography>
                </Box>
              }
              sx={{ ml: 0, width: "100%", justifyContent: "space-between" }}
            />

            {notificationMessage && (
              <Alert severity="info" sx={{ mt: 1.5, borderRadius: tokens.radii.sm }}>
                {notificationMessage}
              </Alert>
            )}
          </Paper>

          {/* Completion Celebration Alert */}
          {hasCompleted && (
            <Alert
              icon={<CheckCircle />}
              severity="success"
              onClose={() => setHasCompleted(false)}
              sx={{ borderRadius: tokens.radii.md }}
            >
              Session completed! Great work — start your next focus block when ready.
            </Alert>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
