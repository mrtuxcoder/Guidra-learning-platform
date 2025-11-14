import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Person,
  School,
  Menu as MenuIcon,
  Dashboard,
  Explore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfile, logoutUser } from '../api/auth';
import { clearAllTokens } from '../utils/auth';

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
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('🔍 Checking authentication status...');
    
    try {
      setLoading(true);
      console.log('📡 Fetching user data from API...');
      const response = await getProfile();
      console.log('✅ API Response:', response);
      
      const userData = response.data?.user || response.data || response;
      console.log('👤 User data from API:', userData);
      
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ API fetch failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const getUserInitial = () => {
    if (!user) return 'U';
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.name) return user.name.split(' ')[0];
    if (user.email) return user.email.split('@')[0];
    return 'Learner';
  };

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 [PROFILE] Logging out...');
      await logoutUser();
    } catch (error) {
      console.error('❌ [PROFILE] Backend logout failed:', error);
    } finally {
      // Always clear client-side tokens
      clearAllTokens();
      
      // Force redirect to login
      window.location.href = '/login';
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/learn', label: 'Learn', icon: <School /> },
    { path: '/personalize', label: 'Explore', icon: <Explore /> },
    { path: '/profile', label: 'Profile', icon: <Person /> }
  ];

  // Don't render until auth check is complete
  if (!authChecked) {
    return (
      <HideOnScroll>
        <AppBar 
          position="sticky" 
          sx={{ 
            bgcolor: 'background.paper', 
            color: 'text.primary', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.98)',
            borderBottom: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Toolbar sx={{ minHeight: '64px!important', py: 1, justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    );
  }

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'background.paper', 
          color: 'text.primary', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.98)',
          borderBottom: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Toolbar sx={{ minHeight: '64px!important', py: 1 }}>
          {/* Logo/Brand */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              flexGrow: 0, 
              mr: 4,
              cursor: 'pointer'
            }}
            onClick={() => navigate(user ? '/learn' : '/')}
          >
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              AI
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: '700',
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Guidra
            </Typography>
          </Box>

          {/* Desktop Navigation - Only show when user is logged in */}
          {user && (
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              flexGrow: 1, 
              gap: 1,
              ml: 2 
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    fontWeight: isActive(item.path) ? '700' : '500',
                    borderRadius: 2,
                    px: 2.5,
                    py: 1,
                    color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive(item.path) ? 'primary.50' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive(item.path) ? 'primary.100' : 'grey.50',
                    },
                    transition: 'all 0.2s ease-in-out',
                    minWidth: 'auto'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* User Menu */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Welcome Message */}
              <Box sx={{ 
                display: { xs: 'none', lg: 'flex' }, 
                alignItems: 'center', 
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 2,
                bgcolor: 'grey.50'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: '500',
                    color: 'text.secondary'
                  }}
                >
                  Welcome,
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: '600',
                    color: 'primary.main'
                  }}
                >
                  {getUserDisplayName()}
                </Typography>
                {loading && (
                  <CircularProgress size={14} sx={{ ml: 1 }} />
                )}
              </Box>

              {/* User Avatar & Menu */}
              <IconButton
                size="medium"
                aria-label="user menu"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleUserMenu}
                disabled={loading}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.300',
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: 'grey.50',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'primary.main',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    {getUserInitial()}
                  </Avatar>
                )}
              </IconButton>

              {/* Mobile Menu Button */}
              <IconButton
                size="medium"
                aria-label="mobile menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMobileMenu}
                sx={{ display: { md: 'none' }, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>

              {/* Desktop User Menu */}
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 160,
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => navigate('/learn')} sx={{ py: 1 }}>
                  <School sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2">Learn</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/personalize')} sx={{ py: 1 }}>
                  <Explore sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2">Explore</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/profile')} sx={{ py: 1 }}>
                  <Person sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1, color: 'error.main' }}>
                  <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                  <Typography variant="body2">Sign Out</Typography>
                </MenuItem>
              </Menu>

              {/* Mobile Menu */}
              <Menu
                id="mobile-menu"
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 160,
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.path} 
                    onClick={() => { navigate(item.path); handleClose(); }}
                    sx={{ py: 1 }}
                  >
                    {React.cloneElement(item.icon, { sx: { mr: 1.5, fontSize: 20 } })}
                    <Typography variant="body2">
                      {item.label}
                    </Typography>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout} sx={{ py: 1, color: 'error.main' }}>
                  <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                  <Typography variant="body2">Sign Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            /* Auth Buttons for non-logged in users */
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  fontWeight: '500',
                  borderRadius: 2,
                  px: 2.5,
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'grey.50'
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}