import { useState, useEffect, useCallback } from 'react';
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

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    try {
      setError("");
      
      // Use cache only if not forcing refresh and cache is recent (less than 30 seconds old)
      const cachedProfile = sessionStorage.getItem('userProfile');
      const cacheTimestamp = sessionStorage.getItem('userProfileTimestamp');
      const isCacheRecent = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 30000; // 30 seconds
      
      if (cachedProfile && !forceRefresh && isCacheRecent) {
        const parsedUser = JSON.parse(cachedProfile);
        setUser(parsedUser);
        setLoading(false);
        checkPasswordStatus(parsedUser);
        return;
      }

      const response = await getProfile();
      const userData = response.data?.user || response.data || response;
      
      const enhancedUserData = {
        ...userData,
        learningStyle: userData.learningStyle || "visual",
        progress: userData.progress || []
      };
      
      setUser(enhancedUserData);
      setLastUpdated(Date.now());
      
      // Update cache
      sessionStorage.setItem('userProfile', JSON.stringify(enhancedUserData));
      sessionStorage.setItem('userProfileTimestamp', Date.now().toString());
      
      // Check password status after fetching user
      checkPasswordStatus(enhancedUserData);
      
    } catch (err) {
      console.error("Profile fetch error:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired");
        navigate('/login');
      } else {
        setError(err.response?.data?.error || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const checkPasswordStatus = async (userData) => {
    try {
      if (userData && userData.authProvider === 'google' && !userData.password) {
        const { checkNeedsPasswordSetup } = await import('../../api');
        const passwordInfo = await checkNeedsPasswordSetup();
        
        if (passwordInfo.needsPasswordSetup) {
          setNeedsPasswordSetup(true);
          setTimeout(() => {
            setShowPasswordModal(true);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error checking password status:', error);
    }
  };

  const handleOAuthToken = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const source = urlParams.get('source');
    
    if (tokenFromUrl && source === 'google') {
      setFrontendCookie(tokenFromUrl);
      window.history.replaceState({}, '', '/profile');
      setTimeout(() => fetchProfile(true), 1000);
    }
  }, [fetchProfile]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      fetchProfile(true);
    }
  }, [fetchProfile]);

  const handleLogout = () => {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('userProfileTimestamp');
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

  // Effects
  useEffect(() => {
    fetchProfile();
    
    const interval = setInterval(() => {
      if (!loading) {
        fetchProfile(true);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [fetchProfile, loading]);

  useEffect(() => {
    handleOAuthToken();
  }, [handleOAuthToken]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

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
    handleRefresh
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
      totalSubtopics: 0
    };
  }

  const progress = user.progress;
  const totalTopics = progress.length;
  
  const completedTopics = progress.filter(topic => {
    if (topic.completed === true) return true;
    const subtopics = topic.subTopics || [];
    if (subtopics.length > 0 && subtopics.every(st => st.completed === true)) {
      return true;
    }
    if (topic.overallUnderstanding >= 4) return true;
    return false;
  }).length;

  const inProgressTopics = progress.filter(topic => {
    if (topic.completed === true) return false;
    const subtopics = topic.subTopics || [];
    const hasSomeProgress = subtopics.some(st => st.completed === true) || 
                          (topic.overallUnderstanding || 0) > 1;
    return hasSomeProgress;
  }).length;

  let totalSubtopics = 0;
  let completedSubtopics = 0;

  progress.forEach(topic => {
    const subtopics = topic.subTopics || [];
    totalSubtopics += subtopics.length;
    completedSubtopics += subtopics.filter(subtopic => 
      subtopic.completed === true
    ).length;
  });

  const progressPercentage = totalSubtopics > 0 ? 
    Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

  return {
    progressPercentage,
    totalTopics,
    completed: completedTopics,
    inProgress: inProgressTopics,
    completedSubtopics,
    totalSubtopics
  };
};

// Need to import completeLogout
import { completeLogout } from "../../api";