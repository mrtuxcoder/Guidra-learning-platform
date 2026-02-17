import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from "@mui/material";
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

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${profileTheme.border}`,
        background: "white",
        p: { xs: 2.5, md: 3 },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        {isRegister ? "Create your account" : "Sign in to Guidra"}
      </Typography>

      <ToggleButtonGroup
        exclusive
        value={activeTab}
        onChange={(event, nextValue) => {
          if (nextValue) onTabChange(nextValue);
        }}
        fullWidth
        sx={{
          mb: 2,
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontWeight: 600,
            borderColor: profileTheme.border,
            color: "#475569",
            "&.Mui-selected": {
              background: "rgba(126,87,194,0.12)",
              color: profileTheme.primaryDark,
            },
          },
        }}
      >
        <ToggleButton value="login">Login</ToggleButton>
        <ToggleButton value="register">Register</ToggleButton>
      </ToggleButtonGroup>

      <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
        {isRegister && (
          <TextField
            label="Full name"
            name="name"
            value={formData.name || ""}
            onChange={onChange}
            fullWidth
            required
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
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password || ""}
          onChange={onChange}
          fullWidth
          required
        />
        {isRegister && (
          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword || ""}
            onChange={onChange}
            fullWidth
            required
          />
        )}

        {error && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: "rgba(220,38,38,0.08)",
              color: "#B91C1C",
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
          borderColor: "rgba(126,87,194,0.4)",
          color: profileTheme.primaryDark,
        }}
      >
        {googleLoading ? "Connecting..." : "Continue with Google"}
      </Button>
    </Paper>
  );
};

export default LandingAuthPanel;
