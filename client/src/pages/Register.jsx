import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, startGoogleOAuth } from "../api/auth";
import AuthLayout from "../components/auth/AuthLayout";
import AuthForm from "../components/auth/AuthForm";
import { registerFeatures } from "../components/auth/constants.jsx";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      setError("");
      window.location.href = "/explore";
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError("");
    startGoogleOAuth();
  };

  // OAuth Error Handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      let msg = 'Authentication failed.';
      if (error === 'auth_failed') msg = 'Google authentication failed.';
      if (error === 'no_user') msg = 'Unable to retrieve user info.';
      
      setError(msg);
      window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    }
  }, []);

  return (
    <AuthLayout
      formType="REGISTER"
      features={registerFeatures}
      sidebarTitle="Start learning with clean, structured AI lessons tailored for beginners."
    >
      <AuthForm
        formType="REGISTER"
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