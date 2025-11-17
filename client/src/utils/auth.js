// // Token management utilities - HTTP-ONLY COOKIE VERSION
// import API from '../api/api';

// /**
//  * Check authentication by making API call - this is the ONLY reliable way
//  * for HTTP-only cookies since they can't be read by JavaScript
//  */
// export const isAuthenticated = async () => {
//   try {
//     // Make a lightweight request to check auth status
//     const response = await API.get("/user/profile", {
//       timeout: 3000,
//       validateStatus: (status) => status < 500 // Don't throw on 401/403
//     });
    
//     console.log('🔐 [AUTH] Auth check response status:', response.status);
//     return response.status === 200;
//   } catch (error) {
//     console.log('🔐 [AUTH] Authentication check failed:', error.response?.status || error.message);
    
//     // If it's a network error or timeout, we can't determine auth status
//     if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
//       console.log('🔐 [AUTH] Network issue - assuming not authenticated for safety');
//       return false;
//     }
    
//     return false;
//   }
// };

// /**
//  * Quick synchronous check - THIS CANNOT DETECT HTTP-ONLY COOKIES
//  * Only use this for non-critical UI decisions, not for authentication
//  */
// export const hasAuthCookie = () => {
//   if (typeof document === 'undefined') return false;
  
//   console.log('🔐 [AUTH] Available cookies:', document.cookie);
  
//   // This will only find NON-HTTP-ONLY cookies
//   // HTTP-only cookies are invisible to JavaScript
//   const hasCookie = document.cookie.includes('token=') || 
//                    document.cookie.includes('auth=') ||
//                    document.cookie.includes('session=');
  
//   console.log('🔐 [AUTH] Has visible auth cookie:', hasCookie);
//   return hasCookie;
// };

// /**
//  * Enhanced authentication check with caching
//  */
// let authCache = {
//   timestamp: 0,
//   value: null,
//   TTL: 60000 // 1 minute cache
// };

// export const checkAuthWithCache = async () => {
//   const now = Date.now();
  
//   // Return cached result if still valid
//   if (authCache.value !== null && (now - authCache.timestamp) < authCache.TTL) {
//     return authCache.value;
//   }
  
//   const isAuth = await isAuthenticated();
  
//   // Cache the result
//   authCache = {
//     timestamp: now,
//     value: isAuth
//   };
  
//   return isAuth;
// };

// /**
//  * Clear authentication cache
//  */
// export const clearAuthCache = () => {
//   authCache = { timestamp: 0, value: null, TTL: 60000 };
// };

// /**
//  * Get cookie value by name (only works for non-HTTP-only cookies)
//  */
// export const getCookie = (name) => {
//   if (typeof document === 'undefined') return null;
  
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) {
//     const token = parts.pop().split(';').shift();
//     return token || null;
//   }
//   return null;
// };

// /**
//  * Clear authentication token from cookie
//  */
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

// /**
//  * Call backend logout endpoint to clear server-side session
//  */
// export const logoutBackend = async () => {
//   try {
//     console.log('🔐 [AUTH] Calling backend logout endpoint...');
//     const response = await API.get("/user/logout", {
//       timeout: 5000
//     });
//     console.log('✅ [AUTH] Backend logout successful');
//     return response;
//   } catch (error) {
//     console.error('❌ [AUTH] Backend logout failed:', error);
//     // Don't throw - we still want to clear client-side tokens
//     return null;
//   }
// };

// /**
//  * Complete logout process - both client and server
//  */
// export const completeLogout = async () => {
//   try {
//     // Clear cache first
//     clearAuthCache();
    
//     // Try backend logout but don't wait too long
//     const logoutPromise = logoutBackend();
//     const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
    
//     await Promise.race([logoutPromise, timeoutPromise]);
//   } catch (error) {
//     console.log('🔐 [AUTH] Logout completed with minor issues');
//   } finally {
//     // Always clear client-side tokens
//     clearAllTokens();
    
//     // Redirect to login
//     window.location.href = '/login';
//   }
// };

// /**
//  * IMPORTANT: For HTTP-only cookies, we CANNOT rely on sync checks
//  * Always use async isAuthenticated() for actual auth decisions
//  */
// export const requireAuth = async (redirectPath = '/login') => {
//   // For HTTP-only cookies, we MUST make an API call
//   const authenticated = await isAuthenticated();
//   if (!authenticated) {
//     console.log('🔐 [AUTH] Authentication failed, redirecting to login');
//     window.location.href = redirectPath;
//     return false;
//   }
//   return true;
// };

// /**
//  * Redirect to home if already authenticated
//  */
// export const requireGuest = async (redirectPath = '/profile') => {
//   const authenticated = await isAuthenticated();
//   if (authenticated) {
//     console.log('🔐 [AUTH] User already authenticated, redirecting to profile');
//     window.location.href = redirectPath;
//     return false;
//   }
//   return true;
// };

// /**
//  * Enhanced debug function to check auth status
//  */
// export const debugAuth = async () => {
//   console.group('🔐 [AUTH DEBUG] Starting comprehensive auth check...');
  
//   // Check visible cookies first
//   const hasCookie = hasAuthCookie();
//   console.log('🍪 Visible Auth Cookie:', hasCookie);
//   console.log('📋 All Visible Cookies:', document.cookie);
  
//   // Check API authentication
//   let isAuth = false;
//   let apiError = null;
  
//   try {
//     const response = await API.get("/user/profile", {
//       timeout: 3000,
//       validateStatus: (status) => status < 500
//     });
    
//     isAuth = response.status === 200;
//     console.log('✅ API Auth Check:', isAuth, 'Status:', response.status);
    
//     if (isAuth) {
//       console.log('👤 User data available:', !!response.data?.user);
//     }
    
//   } catch (error) {
//     apiError = error;
//     console.log('❌ API Auth Check Failed:', {
//       status: error.response?.status,
//       message: error.message,
//       code: error.code
//     });
//   }
  
//   // Check if we're in cross-origin scenario
//   const isCrossOrigin = window.location.origin !== API.defaults.baseURL?.replace('/api', '');
//   console.log('🌐 Cross-Origin Scenario:', isCrossOrigin);
//   console.log('🏠 Frontend Origin:', window.location.origin);
//   console.log('🔗 Backend Origin:', API.defaults.baseURL?.replace('/api', ''));
  
//   console.groupEnd();
  
//   return { 
//     hasVisibleAuthCookie: hasCookie, 
//     isAuthenticated: isAuth,
//     apiError: apiError,
//     isCrossOrigin: isCrossOrigin,
//     visibleCookies: document.cookie,
//     frontendOrigin: window.location.origin,
//     backendOrigin: API.defaults.baseURL?.replace('/api', '')
//   };
// };

// // Legacy functions for compatibility
// export const getToken = () => {
//   console.log('⚠️ [AUTH] getToken called - HTTP-only cookies cannot be read');
//   return null;
// };

// export const setToken = () => {
//   console.log('⚠️ [AUTH] setToken called - Cookies are set by backend');
// };

// export const getUserData = () => null;
// export const setUserData = () => {};
// export const isTokenExpiring = () => true;

// export const getAuthStatus = async () => {
//   const isAuth = await isAuthenticated();
  
//   return { 
//     isAuthenticated: isAuth, 
//     hasVisibleAuthCookie: hasAuthCookie(),
//     token: null, 
//     user: null, 
//     tokenSource: 'http-only-cookie',
//     isExpiring: false 
//   };
// };

// export default {
//   getToken,
//   isAuthenticated,
//   checkAuthWithCache,
//   hasAuthCookie,
//   clearAuthCache,
//   getCookie,
//   clearAllTokens,
//   logoutBackend,
//   completeLogout,
//   setToken,
//   getUserData,
//   setUserData,
//   isTokenExpiring,
//   requireAuth,
//   requireGuest,
//   getAuthStatus,
//   debugAuth
// };


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
  return !!getFrontendCookie();
};

/**
 * Enhanced authentication check
 */
export const isAuthenticated = async () => {
  // Quick sync check first - does frontend cookie exist?
  const hasCookie = hasAuthCookie();
  console.log('🔐 [AUTH] Frontend cookie exists:', hasCookie);
  
  if (!hasCookie) {
    return false;
  }
  
  // We have a cookie, verify with backend
  try {
    const response = await API.get("/user/profile", {
      timeout: 3000,
      validateStatus: (status) => status < 500
    });
    
    const isAuth = response.status === 200;
    console.log('🔐 [AUTH] Backend verification:', isAuth);
    
    if (!isAuth) {
      // Backend says not auth, remove frontend tokens
      removeFrontendCookie();
      localStorage.removeItem('authToken');
    }
    
    return isAuth;
  } catch (error) {
    console.log('🔐 [AUTH] Auth check failed:', error.message);
    
    // If it's a 401, clear tokens
    if (error.response?.status === 401) {
      removeFrontendCookie();
      localStorage.removeItem('authToken');
    }
    
    return false;
  }
};

/**
 * Complete logout process
 */
export const completeLogout = async () => {
  try {
    console.log('🔐 [AUTH] Starting complete logout...');
    
    // Call backend logout
    await API.post("/user/logout");
    
    console.log('✅ [AUTH] Backend logout successful');
  } catch (error) {
    console.log('🔐 [AUTH] Backend logout failed, continuing with frontend cleanup...');
  } finally {
    // Frontend tokens are automatically cleared by the interceptor
    // But we'll clear cache and redirect
    clearAuthCache();
    
    // Short delay to ensure tokens are cleared
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }
};

/**
 * Manual login handler (for direct token storage)
 */
export const handleManualLogin = (token, userData = null) => {
  setFrontendCookie(token);
  localStorage.setItem('authToken', token);
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  console.log('✅ [AUTH] Manual login - tokens stored');
};

// Keep your existing functions but they'll now use the updated API
export const loginUser = async (credentials) => {
  const response = await API.post("/user/login", credentials);
  // Token is automatically handled by the interceptor
  return response;
};

export const registerUser = async (userData) => {
  const response = await API.post("/user/register", userData);
  // Token is automatically handled by the interceptor
  return response;
};

export const logoutUser = async () => {
  return await API.post("/user/logout");
};

// Your existing functions remain the same but will work with the new system
export const clearAuthCache = () => {
  // Your existing implementation
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
  console.group('🔐 [AUTH DEBUG]');
  console.log('🍪 Frontend Cookie:', getFrontendCookie() ? 'Exists' : 'Missing');
  console.log('💾 LocalStorage Token:', localStorage.getItem('authToken') ? 'Exists' : 'Missing');
  console.log('📋 All Cookies:', document.cookie);
  
  try {
    const response = await API.get("/user/profile", {
      validateStatus: (status) => status < 500
    });
    console.log('✅ Backend Auth Check:', response.status === 200 ? 'Authenticated' : 'Not Authenticated');
  } catch (error) {
    console.log('❌ Backend Check Failed:', error.message);
  }
  
  console.groupEnd();
};

export default {
  getStoredToken,
  isAuthenticated,
  hasAuthCookie,
  loginUser,
  registerUser,
  logoutUser,
  completeLogout,
  requireAuth,
  requireGuest,
  debugAuth,
  clearAllTokens,
  handleManualLogin
};