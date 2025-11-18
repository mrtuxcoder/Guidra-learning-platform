import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Frontend cookie helpers
const setFrontendCookie = (token, days = 7) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `authToken=${token}; path=/; max-age=${maxAge}; secure; samesite=lax`;
  console.log('🍪 [API] Frontend cookie set');
};

const removeFrontendCookie = () => {
  document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax';
  console.log('🍪 [API] Frontend cookie removed');
};

const getFrontendCookie = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

const getStoredToken = () => {
  // Only check frontend cookie (no localStorage)
  return getFrontendCookie();
};

// Request interceptor
API.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add Authorization header if we have a token from frontend cookie
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 [API] Added Authorization header');
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    // Check if response contains a token (login/register/success endpoints)
    if (response.data?.token) {
      const token = response.data.token;
      
      // Store token ONLY in frontend cookie (no localStorage)
      setFrontendCookie(token);
      console.log('✅ [API] Token stored in frontend cookie');
    }
    
    // Check if logout response - clear frontend tokens
    if (response.data?.message?.includes('logout') || response.data?.clearFrontendCookie) {
      removeFrontendCookie();
      console.log('✅ [API] Frontend tokens cleared after logout');
    }
    
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    // Auto-logout on 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('🔐 [API] 401 Unauthorized - clearing tokens');
      removeFrontendCookie();
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Export cookie helpers for use in auth.js
export const authHelpers = {
  setFrontendCookie,
  removeFrontendCookie,
  getFrontendCookie,
  getStoredToken
};

export default API;