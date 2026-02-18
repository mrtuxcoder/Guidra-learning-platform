import { useState, useEffect, useCallback, useRef } from "react";
import { getProfile } from "../../api";
import { hasAuthCookie } from "../../api";
import { authHelpers } from "../../api";

const { setFrontendCookie } = authHelpers;

export const useProfileLogic = (navigate) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const hasMountedRef = useRef(false);

  const fetchProfile = useCallback(
    async (forceRefresh = false) => {
      try {
        setError("");

        // Use cache only if not forcing refresh and cache is recent (less than 30 seconds old)
        const cachedProfile = sessionStorage.getItem("userProfile");
        const cacheTimestamp = sessionStorage.getItem("userProfileTimestamp");
        const isCacheRecent =
          cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < 30000; // 30 seconds

        if (cachedProfile && !forceRefresh && isCacheRecent) {
          const parsedUser = JSON.parse(cachedProfile);
          setUser(parsedUser);
          setLoading(false);
          checkPasswordStatus(parsedUser);
          return;
        }

        const response = await getProfile();
        const userData = response.data?.user || response.data || response;
        const authInfo = response.data?.authInfo;

        const enhancedUserData = {
          ...userData,
          learningStyle: userData.learningStyle || "visual",
          progress: userData.progress || [],
        };

        setUser(enhancedUserData);
        setLastUpdated(Date.now());

        // Update cache
        sessionStorage.setItem("userProfile", JSON.stringify(enhancedUserData));
        sessionStorage.setItem("userProfileTimestamp", Date.now().toString());

        // Check password status from the unified response (no separate API call needed)
        checkPasswordStatus(enhancedUserData, authInfo);
      } catch (err) {
        console.error("Profile fetch error:", err);

        if (err.response?.status === 401) {
          setError("Session expired");
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const checkPasswordStatus = async (userData, authInfo = null) => {
    try {
      // Use authInfo from the unified /me response if available
      if (authInfo && authInfo.needsPasswordSetup) {
        setNeedsPasswordSetup(true);
        setTimeout(() => {
          setShowPasswordModal(true);
        }, 2000);
      } else if (
        userData &&
        userData.authProvider === "google" &&
        !userData.password
      ) {
        // Fallback for cases where authInfo is not provided (legacy)
        const { checkNeedsPasswordSetup } = await import("../../api");
        const passwordInfo = await checkNeedsPasswordSetup();

        if (passwordInfo.needsPasswordSetup) {
          setNeedsPasswordSetup(true);
          setTimeout(() => {
            setShowPasswordModal(true);
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error checking password status:", error);
    }
  };

  const handleOAuthToken = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const source = urlParams.get("source");

    if (tokenFromUrl && source === "google") {
      setFrontendCookie(tokenFromUrl);
      window.history.replaceState({}, "", "/profile");
      // Force refresh after OAuth redirect
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userProfile");
    sessionStorage.removeItem("userProfileTimestamp");
    completeLogout();
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setNeedsPasswordSetup(false);
    fetchProfile(true);
  };

  const handlePasswordSetupClick = () => {
    setShowPasswordModal(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchProfile(true);
  };

  // Main effect - only runs once on mount
  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;

    fetchProfile();
  }, []); // Empty dependency array - runs ONCE on mount only

  // Handle OAuth redirect
  useEffect(() => {
    handleOAuthToken();
  }, []); // Run once on mount

  // Visibility change listener - check if data is stale when tab becomes active
  useEffect(() => {
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        const cacheTimestamp = sessionStorage.getItem("userProfileTimestamp");
        const isStale =
          !cacheTimestamp || Date.now() - parseInt(cacheTimestamp) > 60000;
        if (isStale) {
          fetchProfile(true);
        }
      }
    };

    document.addEventListener("visibilitychange", visibilityHandler);
    return () => {
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, [fetchProfile]);

  return {
    user,
    loading,
    error,
    showPasswordModal,
    needsPasswordSetup,
    setShowPasswordModal,
    fetchProfile,
    handleLogout,
    handlePasswordSuccess,
    handlePasswordSetupClick,
    handleRefresh,
  };
};

// Helper function that was in the original Profile.jsx
export const getProgressStats = (user) => {
  if (!user?.progress || !Array.isArray(user.progress)) {
    return {
      progressPercentage: 0,
      totalTopics: 0,
      completed: 0,
      inProgress: 0,
      completedSubtopics: 0,
      totalSubtopics: 0,
    };
  }

  const progress = user.progress;
  const totalTopics = progress.length;

  const completedTopics = progress.filter((topic) => {
    if (topic.completed === true) return true;
    const subtopics = topic.subTopics || [];
    if (
      subtopics.length > 0 &&
      subtopics.every((st) => st.completed === true)
    ) {
      return true;
    }
    if (topic.overallUnderstanding >= 4) return true;
    return false;
  }).length;

  const inProgressTopics = progress.filter((topic) => {
    if (topic.completed === true) return false;
    const subtopics = topic.subTopics || [];
    const hasSomeProgress =
      subtopics.some((st) => st.completed === true) ||
      (topic.overallUnderstanding || 0) > 1;
    return hasSomeProgress;
  }).length;

  let totalSubtopics = 0;
  let completedSubtopics = 0;

  progress.forEach((topic) => {
    const subtopics = topic.subTopics || [];
    totalSubtopics += subtopics.length;
    completedSubtopics += subtopics.filter(
      (subtopic) => subtopic.completed === true
    ).length;
  });

  const progressPercentage =
    totalSubtopics > 0
      ? Math.round((completedSubtopics / totalSubtopics) * 100)
      : 0;

  return {
    progressPercentage,
    totalTopics,
    completed: completedTopics,
    inProgress: inProgressTopics,
    completedSubtopics,
    totalSubtopics,
  };
};

// Need to import completeLogout
import { completeLogout } from "../../api";
