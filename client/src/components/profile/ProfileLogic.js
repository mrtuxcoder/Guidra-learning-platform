import { useState, useEffect, useCallback, useRef } from "react";
import { getProfile, authHelpers, completeLogout } from "../../api";

const { setFrontendCookie } = authHelpers;

export const useProfileLogic = (navigate) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
          return;
        }

        const response = await getProfile();
        const userData = response.data?.user || response.data || response;

        const enhancedUserData = {
          ...userData,
          learningStyle: userData.learningStyle || "visual",
          progress: userData.progress || [],
        };

        setUser(enhancedUserData);

        // Update cache
        sessionStorage.setItem("userProfile", JSON.stringify(enhancedUserData));
        sessionStorage.setItem("userProfileTimestamp", Date.now().toString());

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
    fetchProfile,
    handleLogout,
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

// imports consolidated at top
