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
  console.log('🍪 [AUTH] Frontend cookie exists:', hasCookie);
  return hasCookie;
};

/**
 * Enhanced authentication check - SIMPLIFIED
 */
export const isAuthenticated = async () => {
  try {
    console.log('🔐 [AUTH] Starting authentication check...');
    
    // Make a direct API call to check auth status
    const response = await API.get("/user/profile", {
      timeout: 5000,
      validateStatus: (status) => status < 500 // Don't throw on 401/403
    });
    
    const isAuth = response.status === 200;
    console.log('🔐 [AUTH] Backend verification result:', isAuth);
    
    if (isAuth && response.data?.user) {
      // If auth successful, ensure frontend cookie exists
      const token = getStoredToken();
      if (!token && response.data.token) {
        // If we got a new token, store it
        setFrontendCookie(response.data.token);
        localStorage.setItem('authToken', response.data.token);
      }
      return true;
    }
    
    // Not authenticated
    console.log('🔐 [AUTH] Not authenticated, status:', response.status);
    return false;
    
  } catch (error) {
    console.log('🔐 [AUTH] Auth check failed:', error.message);
    
    // Clear tokens on network errors or auth failures
    if (error.response?.status === 401 || error.code === 'NETWORK_ERROR') {
      removeFrontendCookie();
      localStorage.removeItem('authToken');
    }
    
    return false;
  }
};

/**
 * Complete logout process - FIXED
 */
export const completeLogout = async () => {
  try {
    console.log('🔐 [AUTH] Starting complete logout...');
    
    // Clear frontend tokens FIRST
    removeFrontendCookie();
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    clearAuthCache();
    
    // Then call backend logout (but don't block on it)
    await API.post("/user/logout").catch(err => {
      console.log('🔐 [AUTH] Backend logout failed (non-critical):', err.message);
    });
    
    console.log('✅ [AUTH] Logout completed');
  } catch (error) {
    console.log('🔐 [AUTH] Logout error (non-critical):', error);
  } finally {
    // Always redirect
    window.location.href = '/login';
  }
};

/**
 * Quick auth check for route protection (non-blocking)
 */
export const checkAuthQuick = async () => {
  // If we have a frontend cookie, assume we're authenticated temporarily
  // The full check will happen in the profile page
  return hasAuthCookie();
};

// Your existing functions
export const handleManualLogin = (token, userData = null) => {
  setFrontendCookie(token);
  localStorage.setItem('authToken', token);
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  console.log('✅ [AUTH] Manual login - tokens stored');
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
  console.log('🔐 [AUTH] Auth cache cleared');
};

export const clearAllTokens = () => {
  console.log('🔐 [AUTH] Clearing all tokens...');
  removeFrontendCookie();
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
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
    console.log('🔐 [AUTH] Authentication failed, redirecting to login');
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

export const requireGuest = async (redirectPath = '/profile') => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    console.log('🔐 [AUTH] User already authenticated, redirecting to profile');
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

// Debug function to see what's happening
export const debugAuth = async () => {
  console.group('🔐 [AUTH DEBUG]');
  console.log('🍪 Frontend Cookie:', getFrontendCookie() ? 'Exists' : 'Missing');
  console.log('💾 LocalStorage Token:', localStorage.getItem('authToken') ? 'Exists' : 'Missing');
  console.log('📋 All Cookies:', document.cookie);
  
  try {
    const response = await API.get("/user/profile", {
      validateStatus: (status) => status < 500
    });
    console.log('✅ Backend Auth Check:', response.status === 200 ? 'Authenticated' : 'Not Authenticated');
    console.log('📊 Response Status:', response.status);
    if (response.status !== 200) {
      console.log('❌ Response Data:', response.data);
    }
  } catch (error) {
    console.log('❌ Backend Check Failed:', error.message);
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