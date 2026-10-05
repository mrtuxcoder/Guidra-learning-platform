import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { getProfile } from "../api";
import { getStoredToken } from "../api/utils/cookies";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const fetchTimeoutRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchUserProfile = useCallback(async (forceRefresh = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      return;
    }

    // Skip if cache is recent (less than 30 seconds) and not forcing refresh
    if (lastFetchTime && !forceRefresh && Date.now() - lastFetchTime < 30000) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      const response = await getProfile();
      const userData = response.data?.user || response.data || response;
      const authInfoData = response.data?.authInfo || null;
      
      setUser(userData);
      setAuthInfo(authInfoData);
      setLastFetchTime(Date.now());
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      if (err.response?.status === 401) {
        setUser(null);
        setAuthInfo(null);
      }
      setError(err.response?.data?.error || 'Failed to load user profile');
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [lastFetchTime]);

  // Single fetch on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Refetch when window becomes visible and data is stale
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only refetch if cache is older than 1 minute
        const isStale = !lastFetchTime || Date.now() - lastFetchTime > 60000;
        if (isStale) {
          fetchUserProfile(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastFetchTime, fetchUserProfile]);

  // Refetch when auth token exists but user isn't loaded
  useEffect(() => {
    const token = getStoredToken();
    if (token && !user && !isLoading) {
      fetchUserProfile(true);
    }
  }, [user, isLoading, fetchUserProfile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        authInfo,
        isLoading,
        error,
        fetchUserProfile,
        lastFetchTime,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

