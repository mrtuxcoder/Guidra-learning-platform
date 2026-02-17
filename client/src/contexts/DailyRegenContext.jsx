import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getProfile } from '../api';

const DailyRegenContext = createContext();

export const useDailyRegen = () => {
  const context = useContext(DailyRegenContext);
  if (!context) {
    throw new Error('useDailyRegen must be used within DailyRegenProvider');
  }
  return context;
};

export const DailyRegenProvider = ({ children }) => {
  const [dailyRegenRemaining, setDailyRegenRemaining] = useState(6);
  const [dailyRegenResetAt, setDailyRegenResetAt] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch initial daily regen count from user profile
  useEffect(() => {
    const fetchDailyRegenCount = async () => {
      try {
        const response = await getProfile();
        const userData = response.data?.user || response.data || response;
        if (userData) {
          const dailyUsed = Number(userData.regenDailyCount || 0);
          setDailyRegenRemaining(Math.max(0, 6 - dailyUsed));
          setDailyRegenResetAt(userData.regenDailyResetAt || null);
        }
      } catch (error) {
        console.error('Failed to fetch daily regen count:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchDailyRegenCount();
  }, []);

  const updateDailyRegen = useCallback((nextRemaining, nextResetAt) => {
    if (typeof nextRemaining === 'number') {
      setDailyRegenRemaining(nextRemaining);
    } else {
      setDailyRegenRemaining((prev) => Math.max(0, prev - 1));
    }

    if (nextResetAt) {
      setDailyRegenResetAt(nextResetAt);
    }
  }, []);

  const decrementDailyRegen = useCallback(() => {
    setDailyRegenRemaining((prev) => Math.max(0, prev - 1));
  }, []);

  const value = {
    dailyRegenRemaining,
    dailyRegenResetAt,
    isInitialized,
    updateDailyRegen,
    decrementDailyRegen,
  };

  return (
    <DailyRegenContext.Provider value={value}>
      {children}
    </DailyRegenContext.Provider>
  );
};
