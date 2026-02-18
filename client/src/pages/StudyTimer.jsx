import { useMemo, useState } from "react";
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
} from "@mui/material";
import { AccessTime, PlayArrow, Pause, RestartAlt } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTimer } from "../contexts/TimerContext";

const PRESET_MINUTES = [25, 40];

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
    selectedMinutes,
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

  const handleStartPause = () => {
    if (isActive) {
      pauseTimer();
    } else if (remainingSeconds > 0) {
      resumeTimer();
    } else {
      startTimer(computedMinutes);
    }
  };

  const handleReset = () => {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
              boxShadow: "0 12px 28px rgba(126, 87, 194, 0.25)",
            }}
          >
            <AccessTime sx={{ fontSize: 30, color: "white" }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Study Timer
          </Typography>
          <Typography color="text.secondary">
            Set a session, focus in the app, and get notified when time is up.
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: 1.5,
                }}
              >
                {PRESET_MINUTES.map((minutes) => (
                  <Button
                    key={minutes}
                    variant={mode === String(minutes) ? "contained" : "outlined"}
                    onClick={() => handleModeChange(String(minutes))}
                    disabled={isActive}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: "none",
                      background:
                        mode === String(minutes)
                          ? "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)"
                          : "transparent",
                      color:
                        mode === String(minutes)
                          ? "white"
                          : theme.palette.text.primary,
                    }}
                  >
                    {minutes} minutes
                  </Button>
                ))}

                <TextField
                  label="Custom (min)"
                  type="number"
                  value={customMinutes}
                  onChange={handleCustomChange}
                  disabled={isActive}
                  InputProps={{ inputProps: { min: 1, max: 180 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  background: isDark
                    ? "rgba(15, 15, 23, 0.8)"
                    : "rgba(124, 58, 237, 0.04)",
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.12
                  )}`,
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{ mb: 1 }}
                >
                  {formatTime(remainingSeconds)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
                    },
                  }}
                />
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleStartPause}
                  startIcon={isActive ? <Pause /> : <PlayArrow />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
                  }}
                >
                  {isActive ? "Pause" : remainingSeconds < computedMinutes * 60 ? "Resume" : "Start"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RestartAlt />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    color: theme.palette.primary.main,
                  }}
                >
                  Reset
                </Button>
              </Stack>

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={handleNotificationsToggle}
                    />
                  }
                  label="Timer notifications"
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
      </Container>
    </Box>
  );
}
