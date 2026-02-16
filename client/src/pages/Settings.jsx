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
} from "@mui/material";
import {
  getProfile,
  updateUserPreferences,
  getPasswordStatus,
  createPassword,
  updatePassword,
} from "../api";

const toneOptions = [
  { value: "neutral", label: "Neutral" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "concise", label: "Concise" },
];

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [profileResponse, passwordResponse] = await Promise.all([
          getProfile(),
          getPasswordStatus(),
        ]);

        const userData = profileResponse.data?.user || profileResponse.data;
        setPreferences({
          reasonForLearning: userData?.reasonForLearning || "",
          tonePreference: userData?.tonePreference || "neutral",
        });

        setPasswordStatus({
          hasPassword: passwordResponse.data?.hasPassword || false,
          authProvider: passwordResponse.data?.authProvider || null,
          needsPasswordSetup: passwordResponse.data?.needsPasswordSetup || false,
        });
      } catch (error) {
        setProfileError(
          error.response?.data?.error || "Failed to load settings"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

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

      if (passwordStatus.needsPasswordSetup || !passwordStatus.hasPassword) {
        await createPassword({
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        });
      } else {
        if (!passwordForm.currentPassword) {
          setPasswordError("Please enter your current password.");
          setIsUpdatingPassword(false);
          return;
        }

        await updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        });
      }

      setPasswordMessage("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      const statusResponse = await getPasswordStatus();
      setPasswordStatus({
        hasPassword: statusResponse.data?.hasPassword || false,
        authProvider: statusResponse.data?.authProvider || null,
        needsPasswordSetup: statusResponse.data?.needsPasswordSetup || false,
      });
    } catch (error) {
      setPasswordError(
        error.response?.data?.error || "Failed to update password"
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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        Settings
      </Typography>

      {profileError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {profileError}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: "1px solid rgba(124,58,237,0.12)",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
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
                background:
                  "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
              }}
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Password
        </Typography>
        <Typography sx={{ color: "#6B7280", mb: 2 }}>
          {passwordStatus.needsPasswordSetup || !passwordStatus.hasPassword
            ? "Set a password to enable email login."
            : "Update your existing password."}
        </Typography>

        <Stack spacing={2}>
          {!passwordStatus.needsPasswordSetup && passwordStatus.hasPassword && (
            <TextField
              label="Current password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
            />
          )}
          <TextField
            label="New password"
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            fullWidth
          />
          <TextField
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
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
                borderColor: "rgba(124,58,237,0.4)",
                color: "#5E35B1",
              }}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Settings;
