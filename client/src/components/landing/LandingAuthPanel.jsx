import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { profileTheme } from "../profile/constants";

const LandingAuthPanel = ({
  activeTab,
  onTabChange,
  formData,
  onChange,
  onSubmit,
  onGoogleLogin,
  loading,
  googleLoading,
  error,
}) => {
  const isRegister = activeTab === "register";
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${profileTheme.border}`,
        background: "background.paper",
        p: { xs: 2, sm: 2.5, md: 3.5, lg: 4 },
        maxWidth: { xs: "100%", sm: 560, md: 640 },
        width: { xs: "100%", md: "100%" },
        mx: "auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 1.5,
          fontSize: { xs: "1.25rem", md: "1.45rem" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {isRegister ? "Create your account" : "Sign in to Guidra"}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 2,
          textAlign: { xs: "center", md: "left" },
          display: { xs: "block", md: "none" },
        }}
      >
        Continue where you left off and keep your progress synced.
      </Typography>

      <ToggleButtonGroup
        exclusive
        value={activeTab}
        onChange={(event, nextValue) => {
          if (nextValue) onTabChange(nextValue);
        }}
        fullWidth
        sx={{
          mb: 1.75,
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontWeight: 600,
            py: { xs: 1, md: 0.85 },
            borderColor: profileTheme.border,
            color: "text.secondary",
            "&.Mui-selected": {
              background: alpha(profileTheme.primary, isDark ? 0.24 : 0.12),
              color: isDark
                ? profileTheme.primaryLight
                : profileTheme.primaryDark,
            },
          },
        }}
      >
        <ToggleButton value="login">Login</ToggleButton>
        <ToggleButton value="register">Register</ToggleButton>
      </ToggleButtonGroup>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "grid", gap: { xs: 1.5, md: 2.2 } }}
      >
        {isRegister && (
          <TextField
            label="Full name"
            name="name"
            value={formData.name || ""}
            onChange={onChange}
            fullWidth
            required
            size={isDesktop ? "medium" : "small"}
          />
        )}
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={onChange}
          fullWidth
          required
          size={isDesktop ? "medium" : "small"}
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password || ""}
          onChange={onChange}
          fullWidth
          required
          size={isDesktop ? "medium" : "small"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {isRegister && (
          <TextField
            label="Confirm password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword || ""}
            onChange={onChange}
            fullWidth
            required
            size={isDesktop ? "medium" : "small"}
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
        )}

        {error && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: alpha(theme.palette.error.main, 0.12),
              color: "error.main",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
            py: { xs: 1.15, md: 1.35 },
            fontSize: { xs: "0.95rem", md: "1rem" },
            background: profileTheme.gradient,
          }}
        >
          {loading
            ? "Please wait..."
            : isRegister
            ? "Create Account"
            : "Login"}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Button
        variant="outlined"
        fullWidth
        disabled={googleLoading}
        onClick={onGoogleLogin}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          fontWeight: 600,
          py: { xs: 1.15, md: 1.25 },
          fontSize: { xs: "0.92rem", md: "0.98rem" },
          borderColor: "rgba(126,87,194,0.4)",
          color: isDark ? profileTheme.primaryLight : profileTheme.primaryDark,
        }}
      >
        {googleLoading ? "Connecting..." : "Continue with Google"}
      </Button>
    </Paper>
  );
};

export default LandingAuthPanel;
