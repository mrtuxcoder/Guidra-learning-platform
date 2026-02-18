import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUser } from './UserContext';

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

  // Get user data from the shared UserContext instead of fetching independently
  const { user } = useUser();

  // Update daily regen count when user data is available
  useEffect(() => {
    if (user) {
      const dailyUsed = Number(user.regenDailyCount || 0);
      setDailyRegenRemaining(Math.max(0, 6 - dailyUsed));
      setDailyRegenResetAt(user.regenDailyResetAt || null);
    }
  }, [user]);

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
    updateDailyRegen,
    decrementDailyRegen,
  };

  return (
    <DailyRegenContext.Provider value={value}>
      {children}
    </DailyRegenContext.Provider>
  );
};
