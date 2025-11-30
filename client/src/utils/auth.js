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
 * Complete logout process - FIXED
 */
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
   
  });
  
 
};

/**
 * Quick auth check for route protection (non-blocking)
 */
export const checkAuthQuick = async () => {
  // If we have a frontend cookie, assume we're authenticated temporarily
  return hasAuthCookie();
};

// Your existing functions
export const handleManualLogin = (token, userData = null) => {
  setFrontendCookie(token);

};

export const loginUser = async (credentials) => {
  const response = await API.post("/user/login", credentials);
  return response;
};

export const registerUser = async (userData) => {
  const response = await API.post("/user/register", userData);
  return response;
};

export const logoutUser = async () => {
  return await API.post("/user/logout");
};

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

export const requireAuth = async (redirectPath = '/login') => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
   
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

export const requireGuest = async (redirectPath = '/profile') => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
  
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

// Debug function to see what's happening
export const debugAuth = async () => {

  
  try {
    const response = await API.get("/user/profile", {
      validateStatus: (status) => status < 500
    });
    if (response.status !== 200) {
    }
  } catch (error) {
    console.log('🔧 Error Details:', {
      status: error.response?.status,
      data: error.response?.data
    });
  }
  
  console.groupEnd();
};

export default {
  getStoredToken,
  isAuthenticated,
  checkAuthQuick,
  hasAuthCookie,
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  completeLogout,
  requireAuth,
  requireGuest,
  debugAuth,
  clearAllTokens,
  handleManualLogin
};