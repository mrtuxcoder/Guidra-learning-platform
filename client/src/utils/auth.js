import API, { authHelpers } from '../api/api';

// Use the helpers from api.js
export const {
  setFrontendCookie,
  removeFrontendCookie,
  getFrontendCookie,
  getStoredToken
} = authHelpers;

/**
 * Check if frontend auth cookie exists
 */
export const hasAuthCookie = () => {
  const hasCookie = !!getFrontendCookie();
  return hasCookie;
};

/**
 * Enhanced authentication check - SIMPLIFIED
 */
export const isAuthenticated = async () => {
  try {
    // Make a direct API call to check auth status
    const response = await API.get("/user/profile", {
      validateStatus: (status) => status < 500
    });
    
    const isAuth = response.status === 200;

    if (isAuth && response.data?.user) {
      // If auth successful, ensure frontend cookie exists
      const token = getStoredToken();
      if (!token && response.data.token) {
        // If we got a new token, store it in frontend cookie only
        setFrontendCookie(response.data.token);
      }
      return true;
    }
    
    // Not authenticated
    return false;
    
  } catch (error) {
    // Clear tokens on network errors or auth failures
    if (error.response?.status === 401) {
      removeFrontendCookie();
    }
    
    return false;
  }
};

/**
 * Enhanced authentication check with user info
 */
export const isAuthenticatedWithInfo = async () => {
  try {
    const response = await API.get("/user/profile", {
      validateStatus: (status) => status < 500
    });
    
    const isAuth = response.status === 200;

    if (isAuth && response.data?.user) {
      // Check password status if authenticated
      let authInfo = null;
      try {
        const passwordResponse = await API.get("/user/password/status");
        authInfo = passwordResponse.data;
      } catch (passwordError) {
        // If password check fails, continue with basic auth
        authInfo = {
          authProvider: 'unknown',
          hasPassword: false,
          needsPasswordSetup: false
        };
      }
      
      // Ensure frontend cookie exists
      const token = getStoredToken();
      if (!token && response.data.token) {
        setFrontendCookie(response.data.token);
      }
      
      return {
        authenticated: true,
        user: response.data.user,
        authInfo: authInfo,
        token: response.data.token || token
      };
    }
    
    return { authenticated: false, user: null, authInfo: null, token: null };
    
  } catch (error) {
    if (error.response?.status === 401) {
      removeFrontendCookie();
    }
    return { authenticated: false, user: null, authInfo: null, token: null };
  }
};

/**
 * Check if Google OAuth user needs password setup
 */
export const checkNeedsPasswordSetup = async () => {
  try {
    const response = await API.get("/user/password/status");
    return {
      needsPasswordSetup: response.data.needsPasswordSetup || false,
      authProvider: response.data.authProvider,
      hasPassword: response.data.hasPassword
    };
  } catch (error) {
    console.error('Error checking password setup:', error);
    return {
      needsPasswordSetup: false,
      authProvider: null,
      hasPassword: false
    };
  }
};

/**
 * Set password for Google OAuth users
 */
export const setupPassword = async (passwordData) => {
  try {
    const response = await API.post("/user/password/set", passwordData);
    
    // Update frontend cookie if new token provided
    if (response.data.token) {
      setFrontendCookie(response.data.token);
    }
    
    return response;
  } catch (error) {
    console.error('Error setting password:', error);
    throw error;
  }
};

/**
 * Change existing password
 */
export const changePassword = async (passwordData) => {
  return await API.post("/user/password/change", passwordData);
};

/**
 * FAST logout process - Instant frontend cleanup
 */
export const completeLogout = async () => {
  // IMMEDIATELY clear frontend tokens and redirect
  removeFrontendCookie();
  clearAuthCache();
  
  // Redirect immediately without waiting for backend
  window.location.href = '/login';
  
  // Call backend logout in background (fire and forget)
  API.post("/user/logout").catch(err => {
    // Ignore errors, we've already cleaned up frontend
  });
};

/**
 * Quick auth check for route protection (non-blocking)
 */
export const checkAuthQuick = async () => {
  // If we have a frontend cookie, assume we're authenticated temporarily
  return hasAuthCookie();
};

/**
 * Handle manual login (for OAuth or direct token setting)
 */
export const handleManualLogin = (token, userData = null) => {
  setFrontendCookie(token);
};

/**
 * Login user with credentials
 */
export const loginUser = async (credentials) => {
  const response = await API.post("/user/login", credentials);
  
  // Store token if provided
  if (response.data.token) {
    setFrontendCookie(response.data.token);
  }
  
  return response;
};

/**
 * Register new user
 */
export const registerUser = async (userData) => {
  const response = await API.post("/user/register", userData);
  
  // Store token if provided
  if (response.data.token) {
    setFrontendCookie(response.data.token);
  }
  
  return response;
};

/**
 * Logout user (backend call)
 */
export const logoutUser = async () => {
  return await API.post("/user/logout");
};

/**
 * Get user profile
 */
export const getProfile = async () => {
  return await API.get("/user/profile");
};

// Cache functions
let authCache = {
  timestamp: 0,
  value: null,
  TTL: 60000 // 1 minute cache
};

export const clearAuthCache = () => {
  authCache = { timestamp: 0, value: null, TTL: 60000 };
};

export const clearAllTokens = () => {
  removeFrontendCookie();
  clearAuthCache();
  
  // Clear all possible cookie variations
  const domains = [window.location.hostname, '.' + window.location.hostname];
  domains.forEach(domain => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
  });
  
  ['token', 'auth', 'session', 'refreshToken'].forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

/**
 * Require authentication for protected routes
 */
export const requireAuth = async (redirectPath = '/login') => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

/**
 * Require guest for public routes
 */
export const requireGuest = async (redirectPath = '/profile') => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

/**
 * Debug function to see what's happening
 */
export const debugAuth = async () => {
  try {
    const response = await API.get("/user/profile", {
      validateStatus: (status) => status < 500
    });
    
    if (response.status !== 200) {
      console.log('Not authenticated');
    } else {
      console.log('Authenticated:', response.data.user);
    }
  } catch (error) {
    console.log('🔧 Error Details:', {
      status: error.response?.status,
      data: error.response?.data
    });
  }
};

/**
 * Initialize authentication and check password status
 * Returns complete auth state
 */
export const initializeAuth = async () => {
  try {
    // First check if we have a token
    const token = getStoredToken();
    
    if (!token) {
      return {
        authenticated: false,
        user: null,
        authInfo: null,
        token: null
      };
    }
    
    // Check authentication with profile
    const authResponse = await isAuthenticatedWithInfo();
    
    if (authResponse.authenticated) {
      return authResponse;
    }
    
    return {
      authenticated: false,
      user: null,
      authInfo: null,
      token: null
    };
    
  } catch (error) {
    console.error('Auth initialization error:', error);
    return {
      authenticated: false,
      user: null,
      authInfo: null,
      token: null
    };
  }
};

export default {
  // Core auth functions
  getStoredToken,
  isAuthenticated,
  isAuthenticatedWithInfo,
  checkAuthQuick,
  hasAuthCookie,
  initializeAuth,
  
  // User actions
  loginUser,
  registerUser,
  logoutUser,
  completeLogout,
  getProfile,
  
  // Password management
  checkNeedsPasswordSetup,
  setupPassword,
  changePassword,
  
  // Route guards
  requireAuth,
  requireGuest,
  
  // Utilities
  debugAuth,
  clearAllTokens,
  clearAuthCache,
  handleManualLogin,
  
  // Cookie helpers
  setFrontendCookie,
  removeFrontendCookie,
  getFrontendCookie
};