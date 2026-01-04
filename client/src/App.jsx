import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import Explore from "./pages/Explore";
import CustomTopicSearch from "./pages/CustomTopicSearch";
import Layout from "./components/Layout";
import PasswordSetupModal from "./components/PasswordSetupModal"; // ADD THIS
import { checkAuthQuick, isAuthenticated } from "./utils/auth";
import { usePasswordCheck } from "./hooks/usePasswordCheck"; // ADD THIS

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column',
    gap: '10px'
  }}>
    <div>Checking authentication...</div>
    <div style={{ fontSize: '12px', color: '#666' }}>Please wait</div>
  </div>
);

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const location = useLocation();
  
  // Use the password check hook
  const { 
    needsPasswordSetup, 
    loading: passwordLoading,
    setNeedsPasswordSetup 
  } = usePasswordCheck();

  // Check auth on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  // Re-check auth only when moving between auth/non-auth routes
  useEffect(() => {
    const isAuthRoute = ['/profile', '/explore', '/learn', '/custom-topic'].includes(location.pathname);
    const isNonAuthRoute = ['/', '/login', '/register'].includes(location.pathname);
    
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
      const shouldFullCheck = ['/profile', '/explore', '/learn', '/custom-topic'].includes(location.pathname);
      const authenticated = shouldFullCheck 
        ? await isAuthenticated() 
        : await checkAuthQuick();
      
      setIsAuth(authenticated);
    } catch (error) {
      console.error('🔐 [APP] Auth check error:', error);
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
  if (!authChecked) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Password Setup Modal */}
      <PasswordSetupModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSetupSuccess}
      />
      
      <Routes>
        {/* Public routes - only accessible when not logged in */}
        <Route path="/" element={!isAuth ? <Login /> : <Navigate to="/profile" replace />} />
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/profile" replace />} />
        <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/profile" replace />} />
        
        {/* Protected routes - only accessible when logged in */}
        <Route path="/profile" element={
          isAuth ? (
            <Layout>
              <Profile />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/explore" element={
          isAuth ? (
            <Layout>
              <Explore />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/learn" element={
          isAuth ? (
            <Layout>
              <Learn />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/custom-topic" element={
          isAuth ? (
            <Layout>
              <CustomTopicSearch />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Catch all route */}
        <Route path="*" element={
          <Navigate to={isAuth ? "/profile" : "/login"} replace />
        } />
      </Routes>
    </ThemeProvider>
  );
}