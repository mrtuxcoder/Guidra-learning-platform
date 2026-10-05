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
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  updateUserPreferences,
  createPassword,
  updatePassword,
  getPasswordStatus,
} from "../api";
import { setFrontendCookie } from "../api/utils/cookies";
import { useUser } from "../contexts/UserContext";
import { profileTheme, cardSx } from "../components/profile/constants";
import { useThemeMode } from "../contexts/ThemeContext";

const toneOptions = [
  { value: "neutral", label: "Neutral" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "concise", label: "Concise" },
];

const Settings = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { user, authInfo } = useUser(); // Get user from shared context
  const [isLoading, setIsLoading] = useState(!user); // Loading when no user yet
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

  // Use shared user context instead of fetching independently
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
        const status = response?.data || {};

        if (!isActive) return;

        setPasswordStatus({
          hasPassword: !!status.hasPassword,
          authProvider: status.authProvider || null,
          needsPasswordSetup: !!status.needsPasswordSetup,
        });
      } catch {
        // keep existing status fallback from authInfo
      }
    };

    if (user) {
      fetchLivePasswordStatus();
    }

    return () => {
      isActive = false;
    };
  }, [user]);

  const handlePreferenceChange = (event) => {
    const { name, value } = event.target || {};
    if (!name) {
      return;
    }

    setPreferences((prev) =>
      prev[name] === value
        ? prev
        : {
            ...prev,
            [name]: value,
          }
    );
  };

  const handleSavePreferences = async () => {
    setSaveMessage("");
    setSaveError("");

    const payload = {
      reasonForLearning:
        preferences.reasonForLearning?.trim() || "",
      tonePreference: preferences.tonePreference || "neutral",
    };

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
    
    // Dispatch custom event for same-window updates
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
        <CircularProgress sx={{ color: profileTheme.primary }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2, md: 5 },
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.3rem", sm: "1.8rem" },
              background: profileTheme.gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Settings
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.35, fontSize: { xs: "0.82rem", sm: "0.875rem" } }}
          >
            Manage your learning preferences and account security.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 2, md: 3 },
            mb: { xs: 2, md: 3 },
          }}
        >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "1rem", sm: "1.12rem" } }}>
          Learning Preferences
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Reason for learning"
            name="reasonForLearning"
            value={preferences.reasonForLearning}
            onChange={handlePreferenceChange}
            multiline
            minRows={3}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="tone-preference-label">Tone preference</InputLabel>
            <Select
              labelId="tone-preference-label"
              label="Tone preference"
              name="tonePreference"
              value={preferences.tonePreference}
              onChange={handlePreferenceChange}
            >
              {toneOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {saveMessage && <Alert severity="success">{saveMessage}</Alert>}
          {saveError && <Alert severity="error">{saveError}</Alert>}

          <Box>
            <Button
              variant="contained"
              onClick={handleSavePreferences}
              disabled={isSaving}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 700,
                background: profileTheme.gradient,
              }}
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </Box>
        </Stack>
        </Paper>

        {/* Appearance Settings */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 2, md: 3 },
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "1rem", sm: "1.12rem" } }}>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: "0.92rem", sm: "1rem" } }}>
                  Dark Mode
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  Switch between light and dark theme
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === "dark"}
                    onChange={toggleTheme}
                    color="primary"
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1,
                borderTop: "1px solid",
                borderColor: "divider",
                pt: 2,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: "0.92rem", sm: "1rem" } }}>
                  Timer in Navbar
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  Show live countdown in the navigation bar
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={showTimerInNavbar}
                    onChange={handleTimerNavbarToggle}
                    color="primary"
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 2, md: 3 },
          }}
        >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "1rem", sm: "1.12rem" } }}>
          Password
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 2, fontSize: { xs: "0.82rem", sm: "0.9rem" } }}>
          {passwordStatus.needsPasswordSetup || !passwordStatus.hasPassword
            ? "Set a password to enable email login."
            : "Update your existing password."}
        </Typography>

        <Stack spacing={2}>
          {!passwordStatus.needsPasswordSetup && passwordStatus.hasPassword && (
            <TextField
              label="Current password"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          <TextField
            label="New password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm new password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {passwordMessage && (
            <Alert severity="success">{passwordMessage}</Alert>
          )}
          {passwordError && <Alert severity="error">{passwordError}</Alert>}

          <Divider />
          <Box>
            <Button
              variant="outlined"
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
                borderColor: theme.palette.primary.main,
                color: profileTheme.primaryDark,
              }}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </Box>
        </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Settings;
