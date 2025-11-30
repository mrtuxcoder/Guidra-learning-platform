import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useScrollTrigger,
  Slide,
  Chip,
  Badge,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Person,
  School,
  Explore,
  RocketLaunch,
  Psychology,
  AutoAwesome,
  EmojiObjects,
  TrendingUp,
  Lightbulb,
  Book,
  Star,
  PsychologyAlt,
  School as LearnIcon,
  Search,
  Close,
  NavigateNext,
  NavigateBefore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfile } from '../api/auth';
import { completeLogout } from '../utils/auth';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [randomIcon, setRandomIcon] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [activeTourStep, setActiveTourStep] = useState(0);

  // Array of 10 random icons with colors
  const iconSet = [
    { icon: <RocketLaunch sx={{ fontSize: 20 }} />, color: '#7E57C2' },
    { icon: <Psychology sx={{ fontSize: 20 }} />, color: '#5E35B1' },
    { icon: <AutoAwesome sx={{ fontSize: 20 }} />, color: '#3949AB' },
    { icon: <EmojiObjects sx={{ fontSize: 20 }} />, color: '#6A1B9A' },
    { icon: <TrendingUp sx={{ fontSize: 20 }} />, color: '#4527A0' },
    { icon: <Lightbulb sx={{ fontSize: 20 }} />, color: '#5C6BC0' },
    { icon: <Book sx={{ fontSize: 20 }} />, color: '#8E24AA' },
    { icon: <Star sx={{ fontSize: 20 }} />, color: '#7B1FA2' },
    { icon: <PsychologyAlt sx={{ fontSize: 20 }} />, color: '#673AB7' },
    { icon: <LearnIcon sx={{ fontSize: 20 }} />, color: '#9C27B0' }
  ];

  // Tour steps for both mobile and desktop
  const tourSteps = [
    {
      label: 'Welcome to Guidra!',
      description: 'Let me show you around your new learning platform.',
      target: 'logo',
      position: 'center'
    },
    {
      label: 'Your Learning Hub',
      description: 'Start learning with structured courses and track your progress.',
      target: 'learn',
      position: isMobile ? 'bottom' : 'right'
    },
    {
      label: 'Explore Courses',
      description: 'Discover new topics and expand your knowledge.',
      target: 'explore',
      position: isMobile ? 'bottom' : 'right'
    },
    {
      label: 'Custom Topics (BETA)',
      description: 'Create personalized learning paths on any topic you choose.',
      target: 'custom-topic',
      position: isMobile ? 'bottom' : 'right'
    },
    {
      label: 'Your Profile',
      description: 'View your progress, achievements, and learning statistics.',
      target: 'profile',
      position: isMobile ? 'bottom' : 'right'
    },
    {
      label: 'Ready to Learn!',
      description: "You're all set! Start your learning journey now.",
      target: 'user-menu',
      position: isMobile ? 'top' : 'left'
    }
  ];

  // Set random icon on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * iconSet.length);
    setRandomIcon(iconSet[randomIndex]);
  }, []);

  // Check if tour has been shown before
  const hasSeenTour = () => {
    return localStorage.getItem('guidra-tour-completed') === 'true';
  };

  // Mark tour as completed
  const completeTour = () => {
    localStorage.setItem('guidra-tour-completed', 'true');
  };

  // Show tour only once for new users
  useEffect(() => {
    if (user && !hasSeenTour() && !isLoading) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        setTourOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading]);

  // Optimized auth check with no caching for fresh data
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    completeLogout();
  };

  const isActive = (path) => location.pathname === path;

  // Updated navItems to include Custom Topic with beta tag
  const navItems = [
    { path: '/learn', label: 'Learn', icon: <School sx={{ fontSize: 20 }} /> },
    { path: '/personalize', label: 'Explore', icon: <Explore sx={{ fontSize: 20 }} /> },
    { path: '/custom-topic', label: 'Custom Topic', icon: <Search sx={{ fontSize: 20 }} />, beta: true },
    { path: '/profile', label: 'Profile', icon: <Person sx={{ fontSize: 20 }} /> }
  ];

  const purpleTheme = {
    primary: '#7E57C2',
    primaryLight: '#B39DDB',
    primaryDark: '#5E35B1',
    gradient: randomIcon ? `linear-gradient(135deg, ${randomIcon.color} 0%, #5E35B1 100%)` : 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
    lightBg: '#F3E5F5',
    subtleBg: '#FAF7FE'
  };

  // Tour handlers
  const handleTourNext = () => {
    if (activeTourStep < tourSteps.length - 1) {
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

  // Get current tour step target element
  const getTourTargetElement = (targetId) => {
    switch (targetId) {
      case 'logo':
        return document.querySelector('[data-tour="logo"]');
      case 'learn':
        return document.querySelector('[data-tour="learn"]');
      case 'explore':
        return document.querySelector('[data-tour="explore"]');
      case 'custom-topic':
        return document.querySelector('[data-tour="custom-topic"]');
      case 'profile':
        return document.querySelector('[data-tour="profile"]');
      case 'user-menu':
        return document.querySelector('[data-tour="user-menu"]');
      default:
        return null;
    }
  };

  // Avatar component - clickable in both desktop and mobile
  const renderUserAvatar = () => {
    if (isLoading) {
      return (
        <IconButton
          size="small"
          disabled
          sx={{
            border: `2px solid ${purpleTheme.primaryLight}20`,
            bgcolor: 'white',
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
          }}
        >
          <CircularProgress 
            size={20} 
            sx={{ 
              color: purpleTheme.primary,
            }} 
          />
        </IconButton>
      );
    }

    if (user) {
      return (
        <IconButton
          size="small"
          aria-label="user menu"
          onClick={handleUserMenu}
          data-tour="user-menu"
          sx={{
            border: `2px solid ${purpleTheme.primaryLight}30`,
            bgcolor: 'white',
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            '&:hover': {
              bgcolor: purpleTheme.lightBg,
            },
            cursor: 'pointer',
          }}
        >
          <Badge
            color="success"
            variant="dot"
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Avatar 
              sx={{ 
                width: { xs: 28, sm: 32 }, 
                height: { xs: 28, sm: 32 }, 
                background: purpleTheme.gradient,
                fontWeight: '700',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
              }}
            >
              {getUserInitial()}
            </Avatar>
          </Badge>
        </IconButton>
      );
    }

    return null;
  };

  // Remove user info chip completely
  const renderUserInfo = () => {
    return null;
  };

  // Auth buttons (only show when not loading and no user)
  const renderAuthButtons = () => {
    if (isLoading) {
      return null;
    }

    if (!user) {
      return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/login')}
            sx={{
              fontWeight: '600',
              borderRadius: 2,
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 0.5, sm: 0.75 },
              color: purpleTheme.primary,
              border: `1px solid ${purpleTheme.primaryLight}40`,
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              minWidth: 'auto',
              '&:hover': {
                bgcolor: purpleTheme.lightBg,
              },
            }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              borderRadius: 2,
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 0.5, sm: 0.75 },
              fontWeight: '700',
              background: purpleTheme.gradient,
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              minWidth: 'auto',
              '&:hover': {
                background: purpleTheme.gradient,
                opacity: 0.9,
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      );
    }

    return null;
  };

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
            {/* Logo/Brand - Always clickable */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                flexShrink: 0,
                cursor: 'pointer',
                flex: user ? 1 : 'none'
              }}
              onClick={() => navigate(user ? '/learn' : '/')}
              data-tour="logo"
            >
              <Box sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                borderRadius: { xs: 1.5, sm: 2.5 },
                background: purpleTheme.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                {randomIcon?.icon || <RocketLaunch sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              </Box>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: '800',
                  background: purpleTheme.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  whiteSpace: 'nowrap'
                }}
              >
                Guidra
              </Typography>
            </Box>

            {/* Show only loader while auth is loading */}
            {isLoading && (
              <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: purpleTheme.primary,
                  }} 
                />
              </Box>
            )}

            {/* Desktop Navigation - Only show when user is loaded and authenticated */}
            {user && !isLoading && (
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                flexGrow: 1, 
                gap: 0.5,
                justifyContent: 'center',
                mx: 2
              }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    data-tour={item.path.replace('/', '')}
                    sx={{
                      fontWeight: isActive(item.path) ? '700' : '500',
                      borderRadius: 2,
                      px: 2,
                      py: 0.75,
                      color: isActive(item.path) ? purpleTheme.primaryDark : 'text.secondary',
                      bgcolor: isActive(item.path) ? purpleTheme.lightBg : 'transparent',
                      border: isActive(item.path) ? `1px solid ${purpleTheme.primaryLight}20` : '1px solid transparent',
                      minWidth: 'auto',
                      fontSize: '0.9rem',
                      position: 'relative',
                      '&:hover': {
                        bgcolor: isActive(item.path) ? purpleTheme.lightBg : 'rgba(126, 87, 194, 0.04)',
                      },
                    }}
                  >
                    {item.label}
                    {item.beta && (
                      <Chip
                        label="BETA"
                        size="small"
                        sx={{
                          ml: 1,
                          height: 16,
                          fontSize: '0.6rem',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          '& .MuiChip-label': {
                            px: 0.75,
                            py: 0.25
                          }
                        }}
                      />
                    )}
                  </Button>
                ))}
              </Box>
            )}

            {/* Spacer - Only show when user is logged in and on desktop */}
            {user && !isLoading && (
              <Box sx={{ 
                display: { xs: 'none', md: 'block' },
                flexGrow: 1 
              }} />
            )}

            {/* User Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              {renderUserInfo()}
              {!isLoading && renderUserAvatar()}
              {renderAuthButtons()}

              {/* User Menu - Show in both desktop and mobile when user is logged in */}
              {user && !isLoading && (
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      minWidth: 180,
                      border: `1px solid ${purpleTheme.primaryLight}20`,
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* Navigation items for mobile */}
                  {isMobile && navItems.map((item) => (
                    <MenuItem 
                      key={item.path} 
                      onClick={() => { navigate(item.path); handleClose(); }}
                      data-tour={item.path.replace('/', '')}
                      sx={{ 
                        py: 1.25,
                        '&:hover': {
                          bgcolor: purpleTheme.lightBg
                        }
                      }}
                    >
                      <Box sx={{ mr: 1.5, color: purpleTheme.primary }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        {item.label}
                      </Typography>
                      {item.beta && (
                        <Chip
                          label="BETA"
                          size="small"
                          sx={{
                            ml: 1,
                            height: 16,
                            fontSize: '0.55rem',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            '& .MuiChip-label': {
                              px: 0.5,
                              py: 0.125
                            }
                          }}
                        />
                      )}
                    </MenuItem>
                  ))}
                  
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                      py: 1.25, 
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'rgba(211, 47, 47, 0.04)'
                      }
                    }}
                  >
                    <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>
                      Sign Out
                    </Typography>
                  </MenuItem>
                </Menu>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Tour Dialog */}
      <Dialog
        open={tourOpen}
        onClose={handleTourSkip}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
          }
        }}
      >
        <DialogContent sx={{ p: 4, pb: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: purpleTheme.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}>
              <RocketLaunch sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight="800" gutterBottom sx={{
              background: purpleTheme.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {tourSteps[activeTourStep].label}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tourSteps[activeTourStep].description}
            </Typography>
          </Box>

          {/* Progress indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            {tourSteps.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === activeTourStep ? purpleTheme.primary : 'grey.300',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Button
            onClick={handleTourSkip}
            sx={{
              color: 'text.secondary',
              fontWeight: '600'
            }}
          >
            Skip Tour
          </Button>
          
          <Box sx={{ flex: 1 }} />
          
          {activeTourStep > 0 && (
            <Button
              onClick={handleTourBack}
              startIcon={<NavigateBefore />}
              sx={{
                color: purpleTheme.primary,
                fontWeight: '600'
              }}
            >
              Back
            </Button>
          )}
          
          <Button
            variant="contained"
            onClick={handleTourNext}
            endIcon={activeTourStep === tourSteps.length - 1 ? null : <NavigateNext />}
            sx={{
              background: purpleTheme.gradient,
              fontWeight: '700',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: purpleTheme.gradient,
                opacity: 0.9
              }
            }}
          >
            {activeTourStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}