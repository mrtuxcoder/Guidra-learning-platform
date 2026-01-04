// /src/api/api.js
import axios from "axios";
import { 
  getStoredToken, 
  setFrontendCookie, 
  removeFrontendCookie 
} from './utils/cookies.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Re-export cookie helpers
export const authHelpers = {
  setFrontendCookie,
  removeFrontendCookie,
  getFrontendCookie: () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  },
  getStoredToken,
};

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      setFrontendCookie(response.data.token);
    }
    
    if (response.data?.message?.includes('logout') || response.data?.clearFrontendCookie) {
      removeFrontendCookie();
    }
    
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeFrontendCookie();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;