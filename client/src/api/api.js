// /src/api/api.js
import axios from "axios";
import {
  getStoredToken,
  setFrontendCookie,
  removeFrontendCookie,
} from "./utils/cookies.js";
import { offlineCacheService } from "../services/offlineCacheService.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authHelpers = {
  setFrontendCookie,
  removeFrontendCookie,
  getStoredToken,
};

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

API.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      setFrontendCookie(response.data.token);
    }

    if (
      response.data?.message?.includes("logout") ||
      response.data?.clearFrontendCookie
    ) {
      removeFrontendCookie();
    }

    // Cache successful GET responses for offline access
    if (response.config.method === "get" && response.status === 200) {
      const cacheUrl = response.config.url;
      offlineCacheService.setCache(cacheUrl, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeFrontendCookie();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // If offline and request failed, try to return cached data
    if (!navigator.onLine && error.response?.status !== 401) {
      const cachedData = offlineCacheService.getCache(error.config.url);
      if (cachedData) {
        console.warn(
          "Offline: Returning cached data for",
          error.config.url
        );
        return Promise.resolve({
          ...error.response,
          data: cachedData.data,
          isOfflineCache: true,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default API;
