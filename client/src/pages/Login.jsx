import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, startGoogleOAuth } from "../api";
import { hasAuthCookie } from "../api";
import AuthLayout from "../components/auth/AuthLayout";
import AuthForm from "../components/auth/AuthForm";
import { loginFeatures } from "../components/auth/constants.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkInitialAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasOAuthError = urlParams.get("error");
      if (hasAuthCookie() && !hasOAuthError) {
        navigate("/profile");
      } else {
        setAuthChecked(true);
      }
    };
    checkInitialAuth();
  }, [navigate]);

  // Handle OAuth errors
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      setAuthChecked(true);
      setError("Authentication failed. Please try again.");
      window.history.replaceState(
        {},
        document.title,
        window.location.origin + window.location.pathname
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser({ email: formData.email, password: formData.password });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError("");
    startGoogleOAuth();
  };

  if (!authChecked) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#581C87",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={40} sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <AuthLayout
      formType="LOGIN"
      features={loginFeatures}
      sidebarTitle="Access your saved courses, cached lessons, and progress."
    >
      <AuthForm
        formType="LOGIN"
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        googleLoading={googleLoading}
        onGoogleLogin={handleGoogleLogin}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}

// Need to import Box and CircularProgress for loading state
import { Box, CircularProgress } from "@mui/material";
