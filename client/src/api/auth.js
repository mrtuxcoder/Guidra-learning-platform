// /src/api/auth.js - DEDUPLICATED
import API, { authHelpers } from "./api";
import { clearAllTokens, clearAuthCache } from "./utils/cookies.js";

export const { setFrontendCookie, removeFrontendCookie, getStoredToken } =
  authHelpers;

export const getFrontendCookie = () => {
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

      return {
        authenticated: true,
        user: response.data.user,
        authInfo: authInfo,
        token: null,
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

    return response;
  } catch (error) {
    console.error("Error setting password:", error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  return await API.put("/api/v1/users/me/password/change", passwordData);
};

export const completeLogout = async () => {
  removeFrontendCookie();

  window.location.href = "/login";

  API.post("/api/v1/auth/logout").catch(() => {});
};

export const handleManualLogin = () => {};

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
  const resolvedApiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || window.location.origin;
  window.location.assign(`${resolvedApiBaseUrl}/api/v1/auth/google`);
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
