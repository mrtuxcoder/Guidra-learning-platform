import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../../../api';
import { completeLogout } from '../../../api';
import { iconSet } from '../constants.jsx';
import { useDailyRegen } from '../../../contexts/DailyRegenContext';

export const useNavbar = (navigate, location, isMobile) => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [randomIcon, setRandomIcon] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [activeTourStep, setActiveTourStep] = useState(0);
  
  // Use daily regen context
  const { dailyRegenRemaining } = useDailyRegen();

  // Set random icon on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * iconSet.length);
    setRandomIcon(iconSet[randomIndex]);
  }, []);

  // Check if tour has been shown before
  const hasSeenTour = useCallback(() => {
    return localStorage.getItem('guidra-tour-completed') === 'true';
  }, []);

  // Mark tour as completed
  const completeTour = useCallback(() => {
    localStorage.setItem('guidra-tour-completed', 'true');
  }, []);

  // Show tour only once for new users
  useEffect(() => {
    if (user && !hasSeenTour() && !isLoading) {
      const timer = setTimeout(() => {
        setTourOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, hasSeenTour]);

  // Optimized auth check
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getProfile();
      const userData = response.data?.user || response.data || response;
      
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const getUserInitial = () => {
    if (!user) return 'U';
    return user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    completeLogout();
  };

  const isActive = (path) => location.pathname === path;

  // Tour handlers
  const handleTourNext = () => {
    if (activeTourStep < 5) { // 5 is the last step index (6 steps total, 0-5)
      setActiveTourStep(activeTourStep + 1);
    } else {
      handleTourComplete();
    }
  };

  const handleTourBack = () => {
    if (activeTourStep > 0) {
      setActiveTourStep(activeTourStep - 1);
    }
  };

  const handleTourComplete = () => {
    setTourOpen(false);
    completeTour();
  };

  const handleTourSkip = () => {
    setTourOpen(false);
    completeTour();
  };

  return {
    user,
    anchorEl,
    isLoading,
    randomIcon,
    tourOpen,
    activeTourStep,
    dailyRegenRemaining,
    getUserInitial,
    handleUserMenu,
    handleMenuClose,
    handleLogout,
    isActive,
    handleTourNext,
    handleTourBack,
    handleTourComplete,
    handleTourSkip,
    setTourOpen,
    setActiveTourStep
  };
};