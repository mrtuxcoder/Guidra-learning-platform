// Token management utilities - HTTP-ONLY COOKIE VERSION
import API from '../api/api'; // Import your configured axios instance

/**
 * Check if user is authenticated by trying to access profile
 * This is async because we need to make an API call to verify the cookie
 */
export const isAuthenticated = async () => {
  try {
    // Use your configured API instance that has withCredentials: true
    const response = await API.get("/user/profile");
    return response.status === 200;
  } catch (error) {
    console.log('🔐 [AUTH] Authentication check failed:', error.response?.status);
    return false;
  }
};

/**
 * Get cookie value by name (only works for non-HTTP-only cookies)
 * Note: HTTP-only cookies cannot be read by JavaScript
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop().split(';').shift();
    return token || null;
  }
  return null;
};

/**
 * Clear authentication token from cookie - COMPREHENSIVE VERSION
 */
export const clearAllTokens = () => {
  console.log('🔐 [AUTH] Clearing all tokens...');
  
  // Clear HTTP-only cookie from all possible paths and domains
  const domains = [
    window.location.hostname,
    '.' + window.location.hostname, // subdomains
    'localhost',
    '.localhost'
  ];
  
  const paths = ['/', '/api', '/user'];
  
  domains.forEach(domain => {
    paths.forEach(path => {
      // Expire the cookie
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
      // Also try without domain for localhost
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    });
  });
  
  // Additional cleanup for any residual tokens
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  console.log('🔐 [AUTH] All tokens cleared from cookies');
  console.log('🔐 [AUTH] Remaining cookies:', document.cookie);
};

/**
 * Call backend logout endpoint to clear server-side session
 */
export const logoutBackend = async () => {
  try {
    console.log('🔐 [AUTH] Calling backend logout endpoint...');
    const response = await API.get("/user/logout");
    console.log('✅ [AUTH] Backend logout successful');
    return response;
  } catch (error) {
    console.error('❌ [AUTH] Backend logout failed:', error);
    throw error;
  }
};

/**
 * Complete logout process - both client and server
 */
export const completeLogout = async () => {
  try {
    // 1. Call backend logout first
    await logoutBackend();
  } catch (error) {
    console.log('🔐 [AUTH] Continuing with client-side logout despite backend error');
  } finally {
    // 2. Always clear client-side tokens
    clearAllTokens();
    
    // 3. Force reload to ensure clean state
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }
};

/**
 * Redirect to login if not authenticated
 */
export const requireAuth = async (redirectPath = '/login') => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    console.log('🔐 [AUTH] Authentication required, redirecting to login');
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

/**
 * Redirect to home if already authenticated
 */
export const requireGuest = async (redirectPath = '/profile') => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    console.log('🔐 [AUTH] User already authenticated, redirecting to profile');
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

/**
 * Debug function to check auth status
 */
export const debugAuth = async () => {
  const authenticated = await isAuthenticated();
  console.group('🔐 Authentication Debug (HTTP-Only Cookie)');
  console.log('Authenticated:', authenticated);
  console.log('All Cookies:', document.cookie);
  console.log('Has token cookie:', document.cookie.includes('token='));
  console.groupEnd();
  return { isAuthenticated: authenticated };
};

// These functions are not needed for HTTP-only cookie approach
export const getToken = () => {
  console.log('⚠️ [AUTH] getToken called - HTTP-only cookies cannot be read');
  return null;
};

export const setToken = () => {
  console.log('⚠️ [AUTH] setToken called - Cookies are set by backend');
};

export const getUserData = () => null;
export const setUserData = () => {};
export const isTokenExpiring = () => true;

export const getAuthStatus = async () => {
  const isAuthenticated = await isAuthenticated();
  return { 
    isAuthenticated, 
    token: null, 
    user: null, 
    tokenSource: 'cookie',
    isExpiring: false 
  };
};

export default {
  getToken,
  isAuthenticated,
  getCookie,
  clearAllTokens,
  logoutBackend,
  completeLogout,
  setToken,
  getUserData,
  setUserData,
  isTokenExpiring,
  requireAuth,
  requireGuest,
  getAuthStatus,
  debugAuth
};