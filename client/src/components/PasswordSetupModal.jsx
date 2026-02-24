import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Typography,
  CircularProgress,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setPassword } from "../api/password";
import { setFrontendCookie } from "../api/utils/cookies";

const initialFormData = {
  newPassword: "",
  confirmPassword: "",
};

const PasswordSetupModal = ({ open, onClose, onSuccess, required = false }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const resetState = () => {
    setFormData(initialFormData);
    setErrors({});
    setServerError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setServerError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await setPassword({
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data && response.data.message) {
        if (response.data.token) {
          setFrontendCookie(response.data.token);
        }

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Password setup error:", error);
      setServerError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to set password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleClose = () => {
    if (loading || required) {
      return;
    }
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={required || loading}
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: theme.shadows[8],
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Set Password
        </Typography>
        {!required && (
          <IconButton
            onClick={handleClose}
            size="small"
            disabled={loading}
            aria-label="Close password setup"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent dividers sx={{ p: 2 }}>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Add a password to sign in with email and password.
            </Typography>
          </Alert>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              variant="outlined"
              size="medium"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              disabled={loading}
            />

            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              variant="outlined"
              size="medium"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              disabled={loading}
            />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
            Password must be at least 6 characters.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            py: 1.5,
            gap: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          {!required && (
            <Button onClick={handleClose} disabled={loading} variant="text">
              Later
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                <span>Saving...</span>
              </Box>
            ) : (
              "Save Password"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PasswordSetupModal;
