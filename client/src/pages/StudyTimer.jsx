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
  useMediaQuery,
  Chip,
  Divider,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  RestartAlt,
  NotificationsActive,
  Timer,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTimer } from "../contexts/TimerContext";

const PRESET_MINUTES = [25, 40, 60];
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    isActive,
    remainingSeconds,
    selectedMinutes,
    hasCompleted,
    setHasCompleted,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setCustomMinutes: updateCustomMinutes,
  } = useTimer();

  const [mode, setMode] = useState("25");
  const [customMinutes, setCustomMinutes] = useState(30);
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
    ? "Pause Session"
    : hasStarted
    ? "Resume Focus Session"
    : "Start Focus Session";

  const dailyProgressPercent = Math.min(
    100,
    Math.round((dailySessions / DAILY_SESSION_GOAL) * 100)
  );

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

  const handleCustomChange = (event) => {
    const value = Number(event.target.value);
    setCustomMinutes(value);
    setMode("custom");
    if (!isActive) {
      updateCustomMinutes(value);
    }
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

  if (!isMobile) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: { xs: 1.5, md: 4 },
        }}
      >
        <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2.5 } }}>
          <Stack spacing={1.5}>
            <Box sx={{ px: 0.5, pt: 0.5, pb: 1 }}>
              <Typography variant="h5" fontWeight={700}>
                Study Timer
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.92rem" }}>
                Focus session with pause, resume, and notifications.
              </Typography>
            </Box>

            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      label={`${computedMinutes} min focus`}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      label={isActive ? "Running" : hasStarted ? "Paused" : "Ready"}
                      color={isActive ? "success" : "default"}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      textAlign: "center",
                      py: { xs: 1.2, sm: 1.8 },
                      px: 1,
                      borderRadius: 2.5,
                      background: alpha(theme.palette.primary.main, 0.04),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "3rem", sm: "3.4rem" },
                        lineHeight: 1,
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatTime(remainingSeconds)}
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: "0.8rem" }}>
                      {selectedMinutes} minute session
                    </Typography>
                  </Box>

                  <Box>
                    <LinearProgress
                      variant="determinate"
                      value={progressValue}
                      sx={{
                        height: 9,
                        borderRadius: 10,
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 10,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        mt: 0.7,
                        display: "flex",
                        justifyContent: "space-between",
                        color: "text.secondary",
                        fontSize: "0.75rem",
                      }}
                    >
                      <span>Progress</span>
                      <span>{Math.max(0, progressValue)}%</span>
                    </Box>
                  </Box>

                  <Stack spacing={1.2}>
                    <Button
                      variant="contained"
                      onClick={handleStartPause}
                      startIcon={isActive ? <Pause /> : <PlayArrow />}
                      sx={{
                        py: 1.45,
                        borderRadius: 2,
                        fontWeight: 800,
                        textTransform: "none",
                      }}
                    >
                      {primaryActionLabel}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      startIcon={<RestartAlt />}
                      sx={{
                        py: 1.1,
                        borderRadius: 2,
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      Reset Session
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack spacing={1.6}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Session Length
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
                      gap: 1,
                    }}
                  >
                    {PRESET_MINUTES.map((minutes) => (
                      <Button
                        key={minutes}
                        variant={mode === String(minutes) ? "contained" : "outlined"}
                        onClick={() => handleModeChange(String(minutes))}
                        disabled={isActive}
                        sx={{
                          py: 1.1,
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        {minutes} min
                      </Button>
                    ))}

                    <TextField
                      label="Custom"
                      type="number"
                      value={customMinutes}
                      onChange={handleCustomChange}
                      disabled={isActive}
                      InputProps={{ inputProps: { min: 1, max: 180 } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontWeight: 600,
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationsEnabled}
                          onChange={handleNotificationsToggle}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          <NotificationsActive sx={{ fontSize: 18, color: "text.secondary" }} />
                          <Typography sx={{ fontSize: "0.95rem" }}>Timer notifications</Typography>
                        </Box>
                      }
                      sx={{ ml: 0 }}
                    />

                    {notificationMessage && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        {notificationMessage}
                      </Alert>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {hasCompleted && (
              <Alert
                severity="success"
                onClose={() => setHasCompleted(false)}
                sx={{ borderRadius: 2 }}
              >
                Session completed. Great work — start your next focus block when ready.
              </Alert>
            )}
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pt: 1.5,
        pb: 10,
      }}
    >
      <Container maxWidth="sm" sx={{ px: 2 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              px: 0.5,
              py: 0.5,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "1.45rem", fontWeight: 700, color: "text.primary" }}>
                Focus Timer
              </Typography>
              <Typography sx={{ mt: 0.35, fontSize: "0.84rem", color: "text.secondary" }}>
                Stay focused. One session at a time.
              </Typography>
            </Box>
          </Box>

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            }}
          >
            <Stack alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  borderRadius: "50%",
                  p: "12px",
                  background: `conic-gradient(${theme.palette.primary.main} ${ringProgress}%, ${alpha(
                    theme.palette.primary.main,
                    0.14
                  )} ${ringProgress}% 100%)`,
                  boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.18)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    bgcolor: "background.paper",
                    boxShadow: isDark
                      ? `0 10px 24px ${alpha(theme.palette.common.black, 0.36)}`
                      : `0 12px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Chip
                    icon={<Timer sx={{ fontSize: "0.9rem !important" }} />}
                    label="Focus Session"
                    size="small"
                    sx={{
                      mb: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: "primary.main",
                      fontWeight: 600,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "2.4rem",
                      fontWeight: 800,
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                      color: "text.primary",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatTime(remainingSeconds)}
                  </Typography>
                  <Typography sx={{ mt: 0.7, color: "text.secondary", fontSize: "0.8rem" }}>
                    {computedMinutes} min session
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1.1} sx={{ width: "100%", mt: 0.6 }}>
                <Button
                  variant="contained"
                  onClick={handleStartPause}
                  startIcon={isActive ? <Pause /> : <PlayArrow />}
                  sx={{
                    height: 50,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.98rem",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: "none",
                  }}
                >
                  {primaryActionLabel}
                </Button>
                <Button
                  variant="text"
                  onClick={handleReset}
                  startIcon={<RestartAlt />}
                  sx={{
                    height: 42,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "text.secondary",
                    bgcolor: "action.hover",
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Typography sx={{ fontSize: "0.97rem", fontWeight: 700, color: "text.primary" }}>
                  Session Settings
                </Typography>

                <Stack direction="row" spacing={1}>
                  {PRESET_MINUTES.map((minutes) => {
                    const active = mode === String(minutes);
                    return (
                      <Chip
                        key={minutes}
                        label={`${minutes} min`}
                        clickable
                        disabled={isActive}
                        onClick={() => handleModeChange(String(minutes))}
                        sx={{
                          height: 34,
                          borderRadius: "999px",
                          bgcolor: active
                            ? alpha(theme.palette.primary.main, 0.12)
                            : "action.hover",
                          color: active ? "primary.main" : "text.secondary",
                          border: "1px solid",
                          borderColor: active
                            ? alpha(theme.palette.primary.main, 0.45)
                            : theme.palette.divider,
                          fontWeight: active ? 700 : 600,
                        }}
                      />
                    );
                  })}
                </Stack>

                <TextField
                  label="Custom minutes"
                  type="number"
                  value={customMinutes}
                  onChange={handleCustomChange}
                  disabled={isActive}
                  InputProps={{ inputProps: { min: 1, max: 180 } }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "background.paper",
                    },
                  }}
                />

                <Divider />

                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsEnabled}
                        onChange={handleNotificationsToggle}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                        End session notification
                      </Typography>
                    }
                    sx={{ ml: 0, mr: 0, width: "100%", justifyContent: "space-between" }}
                  />

                  {notificationMessage && (
                    <Alert severity="info" sx={{ mt: 1, borderRadius: 2 }}>
                      {notificationMessage}
                    </Alert>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1.1}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.94rem", fontWeight: 700, color: "text.primary" }}>
                    Today&apos;s Focus
                  </Typography>
                  <Typography sx={{ fontSize: "0.82rem", color: "text.secondary", fontWeight: 600 }}>
                    {dailySessions} / {DAILY_SESSION_GOAL} sessions completed
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={dailyProgressPercent}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    },
                  }}
                />
              </Stack>
            </CardContent>
          </Card>

          {hasCompleted && (
            <Alert
              severity="success"
              onClose={() => setHasCompleted(false)}
              sx={{ borderRadius: 2 }}
            >
              Great work. One focused session completed.
            </Alert>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
