// /src/api/auth.js - DEDUPLICATED
import API, { authHelpers } from "./api";
import { clearAllTokens, clearAuthCache } from "./utils/cookies.js";

export const { setFrontendCookie, removeFrontendCookie, getStoredToken } =
  authHelpers;

export const getFrontendCookie = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
};

export const hasAuthCookie = () => {
  return !!getFrontendCookie();
};

export const registerUser = async (userData) => {
  return await API.post("/api/v1/auth/register", userData);
};

export const loginUser = async (credentials) => {
  const response = await API.post("/api/v1/auth/login", credentials);
  return response;
};

export const getProfile = async () => {
  return await API.get("/api/v1/users/me");
};

export const checkUserExists = async (email) => {
  return await API.get(
    `/api/v1/users/check?email=${encodeURIComponent(email)}`
  );
};

export const updateUserPreferences = async (preferencesData) => {
  return await API.put("/api/v1/users/me/preferences", preferencesData);
};

export const logoutUser = async () => {
  return await API.post("/api/v1/auth/logout");
};

export const isAuthenticated = async () => {
  try {
    const response = await API.get("/api/v1/users/me", {
      validateStatus: (status) => status < 500,
    });

    const isAuth = response.status === 200;

    if (isAuth && response.data?.user) {
      const token = getStoredToken();
      if (!token && response.data.token) {
        setFrontendCookie(response.data.token);
      }
      return true;
    }

    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      removeFrontendCookie();
    }
    return false;
  }
};

export const isAuthenticatedWithInfo = async () => {
  try {
    const response = await API.get("/api/v1/users/me", {
      validateStatus: (status) => status < 500,
    });

    const isAuth = response.status === 200;

    if (isAuth && response.data?.user) {
      // authInfo is now included in the /me response
      const authInfo = response.data?.authInfo || {
        authProvider: "unknown",
        hasPassword: false,
        needsPasswordSetup: false,
      };

      const token = getStoredToken();
      if (!token && response.data.token) {
        setFrontendCookie(response.data.token);
      }

      return {
        authenticated: true,
        user: response.data.user,
        authInfo: authInfo,
        token: response.data.token || token,
      };
    }

    return { authenticated: false, user: null, authInfo: null, token: null };
  } catch (error) {
    if (error.response?.status === 401) {
      removeFrontendCookie();
    }
    return { authenticated: false, user: null, authInfo: null, token: null };
  }
};

export const checkNeedsPasswordSetup = async () => {
  try {
    const response = await API.get("/api/v1/users/me/password/status");
    return {
      needsPasswordSetup: response.data.needsPasswordSetup || false,
      authProvider: response.data.authProvider,
      hasPassword: response.data.hasPassword,
    };
  } catch (error) {
    console.error("Error checking password setup:", error);
    return {
      needsPasswordSetup: false,
      authProvider: null,
      hasPassword: false,
    };
  }
};

export const setupPassword = async (passwordData) => {
  try {
    const response = await API.post(
      "/api/v1/users/me/password/set",
      passwordData
    );

    if (response.data.token) {
      setFrontendCookie(response.data.token);
    }

    return response;
  } catch (error) {
    console.error("Error setting password:", error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  return await API.post("/api/v1/users/me/password/change", passwordData);
};

export const completeLogout = async () => {
  removeFrontendCookie();

  window.location.href = "/login";

  API.post("/api/v1/auth/logout").catch(() => {});
};

export const handleManualLogin = (token, userData = null) => {
  setFrontendCookie(token);
};

export const requireAuth = async (redirectPath = "/login") => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

export const requireGuest = async (redirectPath = "/profile") => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

export const debugAuth = async () => {
  try {
    const response = await API.get("/api/v1/users/me", {
      validateStatus: (status) => status < 500,
    });

    if (response.status !== 200) {
      console.log("Not authenticated");
    } else {
      console.log("Authenticated:", response.data.user);
    }
  } catch (error) {
    console.log("🔧 Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
    });
  }
};

export const initializeAuth = async () => {
  try {
    const token = getStoredToken();

    if (!token) {
      return {
        authenticated: false,
        user: null,
        authInfo: null,
        token: null,
      };
    }

    const authResponse = await isAuthenticatedWithInfo();

    if (authResponse.authenticated) {
      return authResponse;
    }

    return {
      authenticated: false,
      user: null,
      authInfo: null,
      token: null,
    };
  } catch (error) {
    console.error("Auth initialization error:", error);
    return {
      authenticated: false,
      user: null,
      authInfo: null,
      token: null,
    };
  }
};

export const startGoogleOAuth = () => {
  const popup = window.open(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/google`,
    "oauth_popup",
    "width=600,height=700,scrollbars=no,resizable=no"
  );

  if (!popup) {
    alert("Popup blocked! Please allow popups for this site.");
    return;
  }

  let messageReceived = false;

  const messageHandler = async (event) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5000",
      "https://guidra.vercel.app",
      "https://guidra-learning-platform.onrender.com",
      window.location.origin,
    ].filter((origin) => origin);

    if (!event.data || !event.data.type || !event.data.type.includes("OAUTH")) {
      return;
    }

    if (!allowedOrigins.includes(event.origin)) {
      return;
    }

    const { type, token, error, needsPersonalization, redirectPath } =
      event.data;

    if (type === "OAUTH_SUCCESS" && token) {
      messageReceived = true;

      try {
        window.removeEventListener("message", messageHandler);
        if (timeoutId) clearTimeout(timeoutId);

        const maxAge = 7 * 24 * 60 * 60;
        const isLocalhost =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const secureFlag = isLocalhost ? "" : "secure; ";

        document.cookie = `authToken=${token}; path=/; max-age=${maxAge}; ${secureFlag}samesite=lax`;

        const finalPath = needsPersonalization
          ? "/explore"
          : redirectPath || "/profile";
        window.location.href = finalPath;
      } catch (err) {
        window.location.href = "/login?error=oauth_processing_failed";
      }
    } else if (type === "OAUTH_ERROR") {
      messageReceived = true;
      window.removeEventListener("message", messageHandler);
      if (timeoutId) clearTimeout(timeoutId);
      window.location.href = `/login?error=oauth_failed&message=${encodeURIComponent(
        error || "Unknown error"
      )}`;
    }
  };

  window.addEventListener("message", messageHandler);

  const timeoutId = setTimeout(() => {
    if (!messageReceived) {
      window.removeEventListener("message", messageHandler);
      window.location.href = "/login?error=oauth_timeout";
    }
  }, 60000);
};

export { clearAllTokens, clearAuthCache };

export default {
  getStoredToken,
  getFrontendCookie,
  isAuthenticated,
  isAuthenticatedWithInfo,
  hasAuthCookie,
  initializeAuth,

  loginUser,
  registerUser,
  logoutUser,
  completeLogout,
  getProfile,
  checkUserExists,

  checkNeedsPasswordSetup,
  setupPassword,
  changePassword,

  startGoogleOAuth,

  requireAuth,
  requireGuest,

  debugAuth,
  clearAllTokens,
  clearAuthCache,
  handleManualLogin,

  setFrontendCookie,
  removeFrontendCookie,
};
