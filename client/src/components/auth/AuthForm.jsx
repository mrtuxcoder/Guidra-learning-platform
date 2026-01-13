import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Email,
  LockOutlined,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import SubmitButton from "./SubmitButton";

const AuthForm = ({
  formType,
  formData,
  onChange,
  onSubmit,
  googleLoading,
  onGoogleLogin,
  loading,
  error,
  showDivider = true,
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isRegister = formType === "REGISTER";
  const config = isRegister
    ? {
        title: "Create Account",
        subtitle: "Join Guidra and start your journey.",
        submitText: "Create Account",
        linkText: "Already have an account?",
        linkAction: "Sign In",
        linkTo: "/login",
      }
    : {
        title: "Welcome Back",
        subtitle: "Please enter your details to sign in.",
        submitText: "Sign In",
        linkText: "Don't have an account?",
        linkAction: "Sign Up",
        linkTo: "/register",
      };

  const fields = [
    ...(isRegister
      ? [
          {
            name: "name",
            label: "Full Name",
            type: "text",
            icon: <Person sx={{ color: "#C084FC" }} />,
            showPasswordToggle: false,
          },
        ]
      : []),
    {
      name: "email",
      label: "Email",
      type: "email",
      icon: <Email sx={{ color: "#C084FC" }} />,
      showPasswordToggle: false,
    },
    {
      name: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      icon: <LockOutlined sx={{ color: "#C084FC" }} />,
      showPasswordToggle: true,
      toggleState: showPassword,
      toggleSetter: setShowPassword,
    },
    ...(isRegister
      ? [
          {
            name: "confirmPassword",
            label: "Confirm Password",
            type: showConfirmPassword ? "text" : "password",
            icon: <LockOutlined sx={{ color: "#C084FC" }} />,
            showPasswordToggle: true,
            toggleState: showConfirmPassword,
            toggleSetter: setShowConfirmPassword,
          },
        ]
      : []),
  ];

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="800"
          sx={{ color: "#6B21A8", mb: 1 }}
        >
          {config.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {config.subtitle}
        </Typography>
      </Box>

      <GoogleButton
        loading={googleLoading}
        onClick={onGoogleLogin}
        text={isRegister ? "Sign up with Google" : "Continue with Google"}
      />

      {showDivider && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.200" }} />
          <Typography
            variant="caption"
            sx={{ px: 2, color: "text.secondary", fontWeight: 600 }}
          >
            OR EMAIL
          </Typography>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.200" }} />
        </Box>
      )}

      <Box component="form" onSubmit={onSubmit}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={onChange}
            required
            sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{field.icon}</InputAdornment>
              ),
              ...(field.showPasswordToggle && {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => field.toggleSetter(!field.toggleState)}
                      edge="end"
                    >
                      {field.toggleState ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }),
            }}
          />
        ))}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <SubmitButton
          loading={loading}
          disabled={googleLoading}
          text={config.submitText}
          type="submit"
        />

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {config.linkText}{" "}
            <Link
              component="button"
              type="button"
              onClick={() => navigate(config.linkTo)}
              sx={{
                fontWeight: 700,
                color: "#7C3AED",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {config.linkAction}
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default AuthForm;
