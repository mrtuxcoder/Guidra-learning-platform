import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

// Import custom components
import HideOnScroll from './components/HideOnScroll';
import Logo from './components/Logo';
import NavigationItems from './components/NavigationItems';
import UserAvatar from './components/UserAvatar';
import AuthButtons from './components/AuthButtons';
import UserMenu from './components/UserMenu';
import OnboardingTour from './components/OnboardingTour';

// Import hooks and constants
import { useNavbar } from './hooks/useNavbar';
import { purpleTheme } from './constants';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    user,
    anchorEl,
    isLoading,
    randomIcon,
    tourOpen,
    activeTourStep,
    getUserInitial,
    handleUserMenu,
    handleMenuClose,
    handleLogout,
    isActive,
    handleTourNext,
    handleTourBack,
    handleTourComplete,
    handleTourSkip,
  } = useNavbar(navigate, location, isMobile);

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="sticky" 
          sx={{ 
            bgcolor: 'background.paper',
            background: `linear-gradient(135deg, ${purpleTheme.subtleBg} 0%, #FFFFFF 100%)`,
            color: 'text.primary',
            boxShadow: '0 1px 8px rgba(126, 87, 194, 0.08)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: 'rgba(126, 87, 194, 0.12)',
          }}
        >
          <Toolbar sx={{ 
            minHeight: { xs: '56px!important', sm: '64px!important' }, 
            py: 0.5, 
            px: { xs: 1, sm: 2 },
            gap: { xs: 1, sm: 2 }
          }}>
            {/* Logo - always shown */}
            <Logo randomIcon={randomIcon} user={user} navigate={navigate} />

            {/* Desktop Navigation - only shown when user is loaded and logged in */}
            {!isLoading && user && (
              <NavigationItems 
                isMobile={isMobile} 
                isActive={isActive} 
                navigate={navigate} 
                user={user} 
              />
            )}

            {/* Spacer - Only show when user is logged in and not loading */}
            {!isLoading && user && (
              <Box sx={{ 
                display: { xs: 'none', md: 'block' },
                flexGrow: 1 
              }} />
            )}

            {/* User Section - This box remains in layout for consistent spacing */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              flexShrink: 0,
              minWidth: isLoading ? '40px' : 'auto' // Maintain consistent width while loading
            }}>
              <UserAvatar
                isLoading={isLoading}
                user={user}
                randomIcon={randomIcon}
                getUserInitial={getUserInitial}
                handleUserMenu={handleUserMenu}
              />
              
              <AuthButtons
                isLoading={isLoading}
                user={user}
                navigate={navigate}
                randomIcon={randomIcon}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* User Menu */}
      <UserMenu
        anchorEl={anchorEl}
        isMobile={isMobile}
        handleMenuClose={handleMenuClose}
        navigate={navigate}
        handleLogout={handleLogout}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        open={tourOpen}
        activeTourStep={activeTourStep}
        handleTourSkip={handleTourSkip}
        handleTourBack={handleTourBack}
        handleTourNext={handleTourNext}
        handleTourComplete={handleTourComplete}
        randomIcon={randomIcon}
      />
    </>
  );
};

export default Navbar;