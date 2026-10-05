// /src/api/utils/cookies.js - SIMPLIFIED
export const setFrontendCookie = (token) => {
  return token;
};

export const removeFrontendCookie = () => {
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isHttps ? "secure; " : "";

  document.cookie = `authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${secureFlag}samesite=lax`;
};

export const getFrontendCookie = () => {
  return null;
};

export const getStoredToken = () => {
  return getFrontendCookie();
};

export const createCache = (ttl = 60000) => {
  let cache = { timestamp: 0, value: null };

  return {
    set: (value) => {
      cache = { timestamp: Date.now(), value };
    },
    get: () => {
      if (Date.now() - cache.timestamp > ttl) {
        cache = { timestamp: 0, value: null };
      }
      return cache.value;
    },
    clear: () => {
      cache = { timestamp: 0, value: null };
    },
    has: () => {
      return Date.now() - cache.timestamp <= ttl && cache.value !== null;
    },
  };
};

export const authCache = createCache(60000);

export const clearAuthCache = () => {
  authCache.clear();
};

export const clearAllTokens = () => {
  removeFrontendCookie();
  authCache.clear();

  const domains = [window.location.hostname, "." + window.location.hostname];
  domains.forEach((domain) => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
  });

  ["token", "auth", "session", "refreshToken"].forEach((cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};
