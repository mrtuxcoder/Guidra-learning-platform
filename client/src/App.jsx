import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, alpha, useTheme } from "@mui/material";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import Explore from "./pages/Explore";
import CustomTopicSearch from "./pages/CustomTopicSearch";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import PasswordSetupModal from "./components/PasswordSetupModal";
import { hasAuthCookie, isAuthenticated } from "./api";
import { usePasswordCheck } from "./hooks/usePasswordCheck";
import { DailyRegenProvider } from "./contexts/DailyRegenContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Loading component
const LoadingSpinner = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 1.5,
        background: isDark
          ? `radial-gradient(circle at top, ${alpha(
              theme.palette.primary.main,
              0.2
            )} 0%, ${theme.palette.background.default} 55%)`
          : "linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)",
        color: "text.primary",
      }}
    >
      <CircularProgress sx={{ color: theme.palette.primary.main }} />
      <Typography variant="h6" fontWeight={700}>
        Checking authentication...
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Please wait
      </Typography>
    </Box>
  );
};

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const location = useLocation();

  // Use the password check hook
  const {
    needsPasswordSetup,
    loading: passwordLoading,
    setNeedsPasswordSetup,
  } = usePasswordCheck();

  // Check auth on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  // Re-check auth only when moving between auth/non-auth routes
  useEffect(() => {
    const isAuthRoute = [
      "/profile",
      "/explore",
      "/learn",
      "/custom-topic",
    ].includes(location.pathname);
    const isNonAuthRoute = ["/", "/login", "/register"].includes(
      location.pathname
    );

    if ((isAuth && isNonAuthRoute) || (!isAuth && isAuthRoute)) {
      checkAuth();
    }
  }, [location.pathname]);

  // Show password modal when needed
  useEffect(() => {
    if (isAuth && needsPasswordSetup && !passwordLoading) {
      setShowPasswordModal(true);
    }
  }, [isAuth, needsPasswordSetup, passwordLoading]);

  const checkAuth = async () => {
    try {
      // Use quick check for initial load, full check for auth routes
      const shouldFullCheck = [
        "/profile",
        "/explore",
        "/learn",
        "/custom-topic",
      ].includes(location.pathname);
      const authenticated = shouldFullCheck
        ? await isAuthenticated() // Makes API call to verify token
        : hasAuthCookie(); // Just checks cookie presence (no API call)

      setIsAuth(authenticated);
    } catch (error) {
      console.error("🔐 [APP] Auth check error:", error);
      setIsAuth(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const handlePasswordSetupSuccess = () => {
    setShowPasswordModal(false);
    setNeedsPasswordSetup(false);
    // Optionally refresh user data
    checkAuth();
  };

  // Show loading while checking auth
  return (
    <ThemeProvider>
      {!authChecked ? (
        <LoadingSpinner />
      ) : (
        <DailyRegenProvider>
          {/* Password Setup Modal */}
          <PasswordSetupModal
            open={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            onSuccess={handlePasswordSetupSuccess}
          />

          <Routes>
        {/* Public routes - only accessible when not logged in */}
        <Route
          path="/"
          element={!isAuth ? <Landing /> : <Navigate to="/profile" replace />}
        />
        <Route
          path="/login"
          element={!isAuth ? <Landing /> : <Navigate to="/profile" replace />}
        />
        <Route
          path="/register"
          element={!isAuth ? <Landing /> : <Navigate to="/profile" replace />}
        />

        {/* Protected routes - only accessible when logged in */}
        <Route
          path="/profile"
          element={
            isAuth ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/explore"
          element={
            isAuth ? (
              <Layout>
                <Explore />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/learn"
          element={
            isAuth ? (
              <Layout>
                <Learn />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/custom-topic"
          element={
            isAuth ? (
              <Layout>
                <CustomTopicSearch />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuth ? (
              <Layout>
                <Settings />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all route */}
        <Route
          path="*"
          element={<Navigate to={isAuth ? "/profile" : "/login"} replace />}
        />
          </Routes>
        </DailyRegenProvider>
      )}
    </ThemeProvider>
  );
}
