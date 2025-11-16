// Token management utilities - HTTP-ONLY COOKIE VERSION
import API from '../api/api';

/**
 * Check authentication by making API call - this is the ONLY reliable way
 * for HTTP-only cookies since they can't be read by JavaScript
 */
export const isAuthenticated = async () => {
  try {
    // Make a lightweight request to check auth status
    const response = await API.get("/user/profile", {
      timeout: 3000,
      validateStatus: (status) => status < 500 // Don't throw on 401/403
    });
    
    console.log('🔐 [AUTH] Auth check response status:', response.status);
    return response.status === 200;
  } catch (error) {
    console.log('🔐 [AUTH] Authentication check failed:', error.response?.status || error.message);
    
    // If it's a network error or timeout, we can't determine auth status
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.log('🔐 [AUTH] Network issue - assuming not authenticated for safety');
      return false;
    }
    
    return false;
  }
};

/**
 * Quick synchronous check - THIS CANNOT DETECT HTTP-ONLY COOKIES
 * Only use this for non-critical UI decisions, not for authentication
 */
export const hasAuthCookie = () => {
  if (typeof document === 'undefined') return false;
  
  console.log('🔐 [AUTH] Available cookies:', document.cookie);
  
  // This will only find NON-HTTP-ONLY cookies
  // HTTP-only cookies are invisible to JavaScript
  const hasCookie = document.cookie.includes('token=') || 
                   document.cookie.includes('auth=') ||
                   document.cookie.includes('session=');
  
  console.log('🔐 [AUTH] Has visible auth cookie:', hasCookie);
  return hasCookie;
};

/**
 * Enhanced authentication check with caching
 */
let authCache = {
  timestamp: 0,
  value: null,
  TTL: 60000 // 1 minute cache
};

export const checkAuthWithCache = async () => {
  const now = Date.now();
  
  // Return cached result if still valid
  if (authCache.value !== null && (now - authCache.timestamp) < authCache.TTL) {
    return authCache.value;
  }
  
  const isAuth = await isAuthenticated();
  
  // Cache the result
  authCache = {
    timestamp: now,
    value: isAuth
  };
  
  return isAuth;
};

/**
 * Clear authentication cache
 */
export const clearAuthCache = () => {
  authCache = { timestamp: 0, value: null, TTL: 60000 };
};

/**
 * Get cookie value by name (only works for non-HTTP-only cookies)
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
 * Clear authentication token from cookie
 */
export const clearAllTokens = () => {
  console.log('🔐 [AUTH] Clearing all tokens...');
  
  // Clear auth cache immediately
  clearAuthCache();
  
  // Clear any potential cookies (both HTTP-only and regular)
  // Note: This only clears cookies that are accessible to JavaScript
  const domains = [
    window.location.hostname,
    '.' + window.location.hostname,
  ];
  
  // Add localhost variants if needed
  if (window.location.hostname === 'localhost') {
    domains.push('localhost', '.localhost');
  }
  
  domains.forEach(domain => {
    // Clear with domain
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    // Clear without domain
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  
  // Clear any other potential auth cookies
  ['auth', 'session', 'refreshToken'].forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  
  console.log('🔐 [AUTH] Client-side tokens cleared');
};

/**
 * Call backend logout endpoint to clear server-side session
 */
export const logoutBackend = async () => {
  try {
    console.log('🔐 [AUTH] Calling backend logout endpoint...');
    const response = await API.get("/user/logout", {
      timeout: 5000
    });
    console.log('✅ [AUTH] Backend logout successful');
    return response;
  } catch (error) {
    console.error('❌ [AUTH] Backend logout failed:', error);
    // Don't throw - we still want to clear client-side tokens
    return null;
  }
};

/**
 * Complete logout process - both client and server
 */
export const completeLogout = async () => {
  try {
    // Clear cache first
    clearAuthCache();
    
    // Try backend logout but don't wait too long
    const logoutPromise = logoutBackend();
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
    
    await Promise.race([logoutPromise, timeoutPromise]);
  } catch (error) {
    console.log('🔐 [AUTH] Logout completed with minor issues');
  } finally {
    // Always clear client-side tokens
    clearAllTokens();
    
    // Redirect to login
    window.location.href = '/login';
  }
};

/**
 * IMPORTANT: For HTTP-only cookies, we CANNOT rely on sync checks
 * Always use async isAuthenticated() for actual auth decisions
 */
export const requireAuth = async (redirectPath = '/login') => {
  // For HTTP-only cookies, we MUST make an API call
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    console.log('🔐 [AUTH] Authentication failed, redirecting to login');
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
  const [hasCookie, isAuth] = await Promise.all([
    Promise.resolve(hasAuthCookie()),
    isAuthenticated()
  ]);
  
  console.group('🔐 Authentication Debug (HTTP-Only Cookie)');
  console.log('Has Visible Auth Cookie:', hasCookie);
  console.log('Is Actually Authenticated (API check):', isAuth);
  console.log('All Visible Cookies:', document.cookie);
  console.log('Auth Cache:', authCache);
  console.groupEnd();
  
  return { 
    hasVisibleAuthCookie: hasCookie, 
    isAuthenticated: isAuth,
    visibleCookies: document.cookie 
  };
};

// Legacy functions for compatibility
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
  const isAuth = await isAuthenticated();
  
  return { 
    isAuthenticated: isAuth, 
    hasVisibleAuthCookie: hasAuthCookie(),
    token: null, 
    user: null, 
    tokenSource: 'http-only-cookie',
    isExpiring: false 
  };
};

export default {
  getToken,
  isAuthenticated,
  checkAuthWithCache,
  hasAuthCookie,
  clearAuthCache,
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