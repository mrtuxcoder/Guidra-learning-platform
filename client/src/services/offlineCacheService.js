/**
 * Offline Cache Service
 * Stores API responses in localStorage for offline access
 */

const CACHE_PREFIX = "guidra_api_cache_";
const CACHE_EXPIRY_PREFIX = "guidra_api_expiry_";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const offlineCacheService = {
  /**
   * Generate cache key for a URL
   */
  getCacheKey: (url) => {
    return `${CACHE_PREFIX}${btoa(url)}`;
  },

  /**
   * Generate expiry key for a URL
   */
  getExpiryKey: (url) => {
    return `${CACHE_EXPIRY_PREFIX}${btoa(url)}`;
  },

  /**
   * Store API response in localStorage
   */
  setCache: (url, data) => {
    try {
      const cacheKey = offlineCacheService.getCacheKey(url);
      const expiryKey = offlineCacheService.getExpiryKey(url);
      const expiresAt = Date.now() + CACHE_DURATION;

      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(expiryKey, expiresAt.toString());
    } catch (error) {
      console.warn("Failed to cache data:", error);
    }
  },

  /**
   * Get cached API response from localStorage
   */
  getCache: (url) => {
    try {
      const cacheKey = offlineCacheService.getCacheKey(url);
      const expiryKey = offlineCacheService.getExpiryKey(url);

      const expiresAt = localStorage.getItem(expiryKey);
      if (!expiresAt || Date.now() > parseInt(expiresAt)) {
        offlineCacheService.clearCache(url);
        return null;
      }

      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn("Failed to retrieve cached data:", error);
      return null;
    }
  },

  /**
   * Clear cache for a specific URL
   */
  clearCache: (url) => {
    try {
      const cacheKey = offlineCacheService.getCacheKey(url);
      const expiryKey = offlineCacheService.getExpiryKey(url);
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(expiryKey);
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  },

  /**
   * Clear all cached data
   */
  clearAllCache: () => {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          keys.push(key);
        }
      }
      keys.forEach((key) => localStorage.removeItem(key));

      const expiryKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_EXPIRY_PREFIX)) {
          expiryKeys.push(key);
        }
      }
      expiryKeys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn("Failed to clear all cache:", error);
    }
  },
};
