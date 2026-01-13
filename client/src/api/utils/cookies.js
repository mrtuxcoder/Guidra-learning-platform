// /src/api/utils/cookies.js - SIMPLIFIED
export const setFrontendCookie = (token, days = 7) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `authToken=${token}; path=/; max-age=${maxAge}; secure; samesite=lax`;
};

export const removeFrontendCookie = () => {
  document.cookie =
    "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax";
};

export const getFrontendCookie = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
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
