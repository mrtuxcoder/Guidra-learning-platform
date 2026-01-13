import React, { useState } from "react";
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
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockResetIcon from "@mui/icons-material/LockReset";
import { setPassword } from "../api/password";
import { setFrontendCookie } from "../api/utils/cookies";

// Purple color palette
const purplePalette = {
  50: "#f3e5f5",
  100: "#e1bee7",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#9c27b0",
  600: "#8e24aa",
  700: "#7b1fa2",
  800: "#6a1b9a",
  900: "#4a148c",
  A100: "#ea80fc",
  A200: "#e040fb",
  A400: "#d500f9",
  A700: "#aa00ff",
};

const PasswordSetupModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

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
    setServerError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await setPassword({
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data && response.data.message) {
        // Success!
        if (response.data.token) {
          setFrontendCookie(response.data.token);
        }

        if (onSuccess) onSuccess();
        onClose();

        // Show success message
        alert(
          "🎉 Password set successfully! You can now login with email and password."
        );
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
    setFormData({ newPassword: "", confirmPassword: "" });
    setErrors({});
    setServerError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)",
          boxShadow: `0 20px 60px ${alpha(purplePalette[600], 0.15)}`,
          border: `1px solid ${alpha(purplePalette[300], 0.2)}`,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(90deg, #7E57C2 0%, #5E35B1 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <LockResetIcon sx={{ fontSize: 20, color: "white" }} />
          </Box>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              letterSpacing: "-0.5px",
            }}
          >
            Set Your Password
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "white",
            background: "rgba(255, 255, 255, 0.15)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.25)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          }}
        />
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${alpha("#d32f2f", 0.2)}`,
                background: "rgba(211, 47, 47, 0.05)",
                "& .MuiAlert-icon": {
                  color: "#d32f2f",
                },
              }}
            >
              {serverError}
            </Alert>
          )}

          <Alert
            severity="info"
            sx={{
              mb: 4,
              borderRadius: 2,
              border: `1px solid ${alpha(purplePalette[500], 0.2)}`,
              background: "rgba(126, 87, 194, 0.08)",
              "& .MuiAlert-icon": {
                color: purplePalette[600],
              },
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              You signed up with Google. Set a password to also login with email
              and password.
            </Typography>
          </Alert>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    sx={{
                      color: purplePalette[600],
                      "&:hover": {
                        background: alpha(purplePalette[600], 0.1),
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
                sx: {
                  borderRadius: 2,
                  background: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(purplePalette[300], 0.5),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: purplePalette[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: purplePalette[600],
                    borderWidth: 2,
                  },
                },
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                    sx={{
                      color: purplePalette[600],
                      "&:hover": {
                        background: alpha(purplePalette[600], 0.1),
                      },
                    }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
                sx: {
                  borderRadius: 2,
                  background: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(purplePalette[300], 0.5),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: purplePalette[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: purplePalette[600],
                    borderWidth: 2,
                  },
                },
              }}
              disabled={loading}
            />
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: alpha(purplePalette[50], 0.5),
              border: `1px solid ${alpha(purplePalette[200], 0.3)}`,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: purplePalette[500],
                }}
              />
              Password must be at least 6 characters long
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: 3,
          gap: 2,
          background: alpha(purplePalette[50], 0.3),
          borderTop: `1px solid ${alpha(purplePalette[200], 0.2)}`,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontSize: "0.95rem",
            fontWeight: 600,
            color: purplePalette[700],
            border: `1px solid ${alpha(purplePalette[400], 0.3)}`,
            background: "white",
            textTransform: "none",
            "&:hover": {
              background: alpha(purplePalette[50], 0.8),
              borderColor: purplePalette[500],
              transform: "translateY(-1px)",
              boxShadow: `0 4px 12px ${alpha(purplePalette[400], 0.15)}`,
            },
            "&:disabled": {
              color: alpha(purplePalette[700], 0.5),
              borderColor: alpha(purplePalette[400], 0.2),
            },
          }}
        >
          Maybe Later
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <LockResetIcon />
            )
          }
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontSize: "1rem",
            fontWeight: 700,
            background: `linear-gradient(90deg, ${purplePalette[600]} 0%, ${purplePalette[800]} 100%)`,
            boxShadow: `0 8px 20px ${alpha(purplePalette[600], 0.3)}`,
            textTransform: "none",
            letterSpacing: "0.5px",
            "&:hover": {
              background: `linear-gradient(90deg, ${purplePalette[700]} 0%, ${purplePalette[900]} 100%)`,
              boxShadow: `0 10px 25px ${alpha(purplePalette[600], 0.4)}`,
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: `0 4px 12px ${alpha(purplePalette[600], 0.3)}`,
            },
            "&:disabled": {
              background: `linear-gradient(90deg, ${alpha(
                purplePalette[600],
                0.5
              )} 0%, ${alpha(purplePalette[800], 0.5)} 100%)`,
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Setting Password..." : "Set Password"}
        </Button>
      </DialogActions>

      {/* Decorative bottom wave */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${purplePalette[600]} 0%, ${purplePalette[800]} 100%)`,
          opacity: 0.8,
        }}
      />
    </Dialog>
  );
};

export default PasswordSetupModal;
