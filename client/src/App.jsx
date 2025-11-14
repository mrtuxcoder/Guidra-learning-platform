import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import Personalize from "./pages/Personalize";
import Layout from "./components/Layout";
import { isAuthenticated } from "./utils/auth";

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
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
    } catch (error) {
      setIsAuth(false);
    } finally {
      setAuthChecked(true);
    }
  };

  // Show loading while checking auth
  if (!authChecked) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        <Route path="/personalize" element={
          isAuth ? (
            <Layout>
              <Personalize />
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

        {/* Catch all route */}
        <Route path="*" element={
          <Navigate to={isAuth ? "/profile" : "/login"} replace />
        } />
      </Routes>
    </ThemeProvider>
  );
}

