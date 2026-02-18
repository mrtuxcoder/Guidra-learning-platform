import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Box, CircularProgress, Typography, alpha, useTheme } from "@mui/material";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import Explore from "./pages/Explore";
import CustomTopicSearch from "./pages/CustomTopicSearch";
import StudyTimer from "./pages/StudyTimer";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import OfflineIndicator from "./components/OfflineIndicator";
import PasswordSetupModal from "./components/PasswordSetupModal";
import { recordTimeSpent } from "./api";
import { usePasswordCheck } from "./hooks/usePasswordCheck";
import { useUser } from "./contexts/UserContext";
import { DailyRegenProvider } from "./contexts/DailyRegenContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TimerProvider } from "./contexts/TimerContext";

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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const location = useLocation();
  const appSessionStartRef = useRef(Date.now());
  const appTimerRef = useRef(null);

  // Get user from shared context - already fetching on mount
  const { user, isLoading: userLoading } = useUser();
  
  // Use the password check hook - now uses shared context
  const {
    needsPasswordSetup,
    loading: passwordLoading,
    setNeedsPasswordSetup,
  } = usePasswordCheck();

  // Determine if authenticated based on user context
  const isAuth = !!user;

  // Show password modal when needed
  useEffect(() => {
    if (isAuth && needsPasswordSetup && !passwordLoading) {
      setShowPasswordModal(true);
    }
  }, [isAuth, needsPasswordSetup, passwordLoading]);

  useEffect(() => {
    const clearTimer = () => {
      if (appTimerRef.current) {
        clearInterval(appTimerRef.current);
        appTimerRef.current = null;
      }
    };

    if (!isAuth) {
      clearTimer();
      return;
    }

    appSessionStartRef.current = Date.now();

    const trackAppTime = async () => {
      const now = Date.now();
      const durationMs = now - appSessionStartRef.current;
      appSessionStartRef.current = now;

      if (durationMs < 1000) return;

      try {
        await recordTimeSpent({ durationMs });
      } catch (error) {
        console.error("Failed to record app time:", error);
      }
    };

    appTimerRef.current = setInterval(trackAppTime, 60000);

    return () => {
      clearTimer();
      trackAppTime();
    };
  }, [isAuth]);

  const handlePasswordSetupSuccess = () => {
    setShowPasswordModal(false);
    setNeedsPasswordSetup(false);
  };

  // Show loading while user data is being fetched
  if (userLoading) {
    return <LoadingSpinner />;
  }

  // Show loading spinner for theme which might not be ready
  return (
    <ThemeProvider>
      <TimerProvider>
        <DailyRegenProvider>
          {/* Offline Indicator */}
          <OfflineIndicator />

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
          path="/study-timer"
          element={
            isAuth ? (
              <Layout>
                <StudyTimer />
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
      </TimerProvider>
    </ThemeProvider>
  );
}
