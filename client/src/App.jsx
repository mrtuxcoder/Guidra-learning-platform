import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Box, CircularProgress, Typography, alpha, useTheme } from "@mui/material";
import Layout from "./components/Layout";
import OfflineIndicator from "./components/OfflineIndicator";
import { useUser } from "./contexts/UserContext";
import { DailyRegenProvider } from "./contexts/DailyRegenContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TimerProvider } from "./contexts/TimerContext";

const Landing = lazy(() => import("./pages/Landing"));
const Profile = lazy(() => import("./pages/Profile"));
const Learn = lazy(() => import("./pages/Learn"));
const Explore = lazy(() => import("./pages/Explore"));
const CustomTopicSearch = lazy(() => import("./pages/CustomTopicSearch"));
const StudyTimer = lazy(() => import("./pages/StudyTimer"));
const Settings = lazy(() => import("./pages/Settings"));

const LAST_PROTECTED_ROUTE_KEY = "guidra:last-protected-route";
const PROTECTED_ROUTE_PATHS = [
  "/profile",
  "/explore",
  "/learn",
  "/custom-topic",
  "/study-timer",
  "/settings",
];

const isProtectedRoutePath = (pathname) => {
  if (!pathname) return false;
  return PROTECTED_ROUTE_PATHS.some(
    (routePath) => pathname === routePath || pathname.startsWith(`${routePath}/`)
  );
};

const getLastProtectedRoute = () => {
  try {
    const storedRoute = sessionStorage.getItem(LAST_PROTECTED_ROUTE_KEY);
    if (!storedRoute) return null;

    const parsedUrl = new URL(storedRoute, window.location.origin);
    if (!isProtectedRoutePath(parsedUrl.pathname)) return null;

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return null;
  }
};

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

const RouteLoading = () => (
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

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  // Get user from shared context - already fetching on mount
  const { user, isLoading: userLoading } = useUser();

  // Determine if authenticated based on user context
  const isAuth = !!user;
  const authedHomeRoute = getLastProtectedRoute() || "/profile";

  useEffect(() => {
    if (!isAuth) {
      sessionStorage.removeItem(LAST_PROTECTED_ROUTE_KEY);
      return;
    }

    const { pathname, search, hash } = location;
    if (!isProtectedRoutePath(pathname)) return;

    sessionStorage.setItem(
      LAST_PROTECTED_ROUTE_KEY,
      `${pathname}${search}${hash}`
    );
  }, [isAuth, location.pathname, location.search, location.hash]);

  // Show loading while user data is being fetched
  if (userLoading) {
    return <LoadingSpinner />;
  }

  // Show loading spinner for theme which might not be ready
  return (
    <TimerProvider>
      <DailyRegenProvider>
        {/* Offline Indicator */}
        <OfflineIndicator />

        <Suspense fallback={<RouteLoading />}>
          <Routes>
          {/* Public routes - only accessible when not logged in */}
          <Route
          path="/"
              element={!isAuth ? <Landing /> : <Navigate to={authedHomeRoute} replace />}
        />
        <Route
          path="/login"
              element={!isAuth ? <Landing /> : <Navigate to={authedHomeRoute} replace />}
        />
        <Route
          path="/register"
              element={!isAuth ? <Landing /> : <Navigate to={authedHomeRoute} replace />}
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
          element={<Navigate to={isAuth ? authedHomeRoute : "/login"} replace />}
        />
          </Routes>
        </Suspense>
      </DailyRegenProvider>
    </TimerProvider>
  );
}
