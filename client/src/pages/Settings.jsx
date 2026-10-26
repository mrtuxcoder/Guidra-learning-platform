import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Tune,
  Palette,
  Lock,
} from "@mui/icons-material";
import {
  updateUserPreferences,
  createPassword,
  updatePassword,
  getPasswordStatus,
} from "../api";
import { setFrontendCookie } from "../api/utils/cookies";
import { useUser } from "../contexts/UserContext";
import { useThemeMode } from "../contexts/ThemeContext";
import { tokens } from "../theme/tokens";

const toneOptions = [
  { value: "neutral", label: "Neutral (Balanced and direct)" },
  { value: "friendly", label: "Friendly (Warm and encouraging)" },
  { value: "formal", label: "Formal (Academic and precise)" },
  { value: "concise", label: "Concise (Fast and bulleted)" },
];

export default function Settings() {
  const { mode, toggleTheme } = useThemeMode();
  const { user, authInfo } = useUser();
  const [isLoading, setIsLoading] = useState(!user);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({
    hasPassword: false,
    authProvider: null,
    needsPasswordSetup: false,
  });

  const [preferences, setPreferences] = useState({
    reasonForLearning: "",
    tonePreference: "neutral",
  });

  const [showTimerInNavbar, setShowTimerInNavbar] = useState(
    localStorage.getItem("showTimerInNavbar") === "true"
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setPreferences({
        reasonForLearning: user?.reasonForLearning || "",
        tonePreference: user?.tonePreference || "neutral",
      });

      setPasswordStatus({
        hasPassword: authInfo?.hasPassword || false,
        authProvider: authInfo?.authProvider || null,
        needsPasswordSetup: authInfo?.needsPasswordSetup || false,
      });

      setIsLoading(false);
    }
  }, [user, authInfo]);

  useEffect(() => {
    let isActive = true;

    const fetchLivePasswordStatus = async () => {
      try {
        const response = await getPasswordStatus();
        if (!isActive) return;
        const data = response?.data || {};
        setPasswordStatus({
          hasPassword: !!data.hasPassword,
          authProvider: data.authProvider || null,
          needsPasswordSetup: !!data.needsPasswordSetup,
        });
      } catch {
        // Silent fallback
      }
    };

    fetchLivePasswordStatus();
    return () => {
      isActive = false;
    };
  }, []);

  const handlePreferenceChange = (event) => {
    const { name, value } = event.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePreferences = async () => {
    setSaveMessage("");
    setSaveError("");

    const payload = {};
    if (preferences.reasonForLearning) {
      payload.reasonForLearning = preferences.reasonForLearning.trim();
    }
    if (preferences.tonePreference) {
      payload.tonePreference = preferences.tonePreference;
    }

    if (!payload.reasonForLearning && !payload.tonePreference) {
      setSaveError("Please add at least one preference.");
      return;
    }

    try {
      setIsSaving(true);
      await updateUserPreferences(payload);
      setSaveMessage("Preferences updated successfully.");
    } catch (error) {
      setSaveError(
        error.response?.data?.error || "Failed to update preferences"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimerNavbarToggle = () => {
    const newValue = !showTimerInNavbar;
    setShowTimerInNavbar(newValue);
    localStorage.setItem("showTimerInNavbar", newValue ? "true" : "false");
    window.dispatchEvent(new Event("timerNavbarToggle"));
  };

  const handlePasswordChange = (event) => {
    setPasswordForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdatePassword = async () => {
    setPasswordMessage("");
    setPasswordError("");

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Please fill all required password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setIsUpdatingPassword(true);

      const statusResponse = await getPasswordStatus();
      const latestStatus = statusResponse?.data || {};
      const requiresSetup =
        !!latestStatus.needsPasswordSetup || !latestStatus.hasPassword;

      setPasswordStatus({
        hasPassword: !!latestStatus.hasPassword,
        authProvider: latestStatus.authProvider || null,
        needsPasswordSetup: !!latestStatus.needsPasswordSetup,
      });

      let passwordResponse;

      if (requiresSetup) {
        passwordResponse = await createPassword({
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        });
      } else {
        if (!passwordForm.currentPassword) {
          setPasswordError("Please enter your current password.");
          setIsUpdatingPassword(false);
          return;
        }
        passwordResponse = await updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        });
      }

      const nextToken = passwordResponse?.data?.token;
      if (nextToken) {
        setFrontendCookie(nextToken);
      }

      const successMessage =
        passwordResponse?.data?.message || "Password updated successfully.";
      setPasswordMessage(successMessage);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setPasswordStatus((prev) => ({
        ...prev,
        hasPassword: true,
        needsPasswordSetup: false,
      }));
    } catch (error) {
      setPasswordError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

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
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                letterSpacing: "-0.02em",
                fontSize: { xs: "1.5rem", sm: "1.85rem" },
              }}
            >
              Settings
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontSize: "0.9rem" }}
            >
              Manage your learning preferences, UI theme, and account security.
            </Typography>
          </Box>

          {/* Section 1: Learning Preferences */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: tokens.radii.lg,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
              <Tune sx={{ color: "primary.main", fontSize: 22 }} />
              <Typography variant="h6" fontWeight={700}>
                Learning Preferences
              </Typography>
            </Box>

            <Stack spacing={2.5}>
              <TextField
                label="Why are you learning?"
                name="reasonForLearning"
                value={preferences.reasonForLearning}
                onChange={handlePreferenceChange}
                placeholder="e.g. Preparing for full-stack engineering interviews..."
                multiline
                minRows={3}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: tokens.radii.md,
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel id="tone-preference-label">AI Explanation Tone</InputLabel>
                <Select
                  labelId="tone-preference-label"
                  label="AI Explanation Tone"
                  name="tonePreference"
                  value={preferences.tonePreference}
                  onChange={handlePreferenceChange}
                  sx={{ borderRadius: tokens.radii.md }}
                >
                  {toneOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {saveMessage && (
                <Alert severity="success" sx={{ borderRadius: tokens.radii.sm }}>
                  {saveMessage}
                </Alert>
              )}
              {saveError && (
                <Alert severity="error" sx={{ borderRadius: tokens.radii.sm }}>
                  {saveError}
                </Alert>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  sx={{
                    borderRadius: tokens.radii.md,
                    fontWeight: 700,
                    textTransform: "none",
                    px: 3,
                    py: 1,
                  }}
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </Box>
            </Stack>
          </Paper>

          {/* Section 2: Appearance & Focus */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: tokens.radii.lg,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
              <Palette sx={{ color: "primary.main", fontSize: 22 }} />
              <Typography variant="h6" fontWeight={700}>
                Appearance & Focus
              </Typography>
            </Box>

            <Stack spacing={2} divider={<Divider />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Dark Mode
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Switch between Calm Studio light and deep slate dark theme
                  </Typography>
                </Box>
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleTheme}
                  color="primary"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Show Timer in Navigation Bar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Display real-time countdown when focus sessions are active
                  </Typography>
                </Box>
                <Switch
                  checked={showTimerInNavbar}
                  onChange={handleTimerNavbarToggle}
                  color="primary"
                />
              </Box>
            </Stack>
          </Paper>

          {/* Section 3: Password & Security */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: tokens.radii.lg,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
              <Lock sx={{ color: "primary.main", fontSize: 22 }} />
              <Typography variant="h6" fontWeight={700}>
                Password & Security
              </Typography>
            </Box>

            <Stack spacing={2.5}>
              {!passwordStatus.needsPasswordSetup && (
                <TextField
                  label="Current Password"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: tokens.radii.md } }}
                />
              )}

              <TextField
                label={passwordStatus.needsPasswordSetup ? "New Password" : "New Password"}
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: tokens.radii.md } }}
              />

              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: tokens.radii.md } }}
              />

              {passwordMessage && (
                <Alert severity="success" sx={{ borderRadius: tokens.radii.sm }}>
                  {passwordMessage}
                </Alert>
              )}
              {passwordError && (
                <Alert severity="error" sx={{ borderRadius: tokens.radii.sm }}>
                  {passwordError}
                </Alert>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                  sx={{
                    borderRadius: tokens.radii.md,
                    fontWeight: 700,
                    textTransform: "none",
                    px: 3,
                    py: 1,
                  }}
                >
                  {isUpdatingPassword
                    ? "Updating..."
                    : passwordStatus.needsPasswordSetup
                    ? "Set Password"
                    : "Update Password"}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
