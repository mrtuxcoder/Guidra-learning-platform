import API from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// REGISTER
export const registerUser = async (userData) => {
  return await API.post("/user/register", userData);
}

// LOGIN
export const loginUser = async (credentials) => {
  return await API.post("/user/login", credentials);
};

// GET PROFILE
export const getProfile = async () => {
  return await API.get("/user/profile");
};

// CHECK USER EXISTS (for Google OAuth flow)
export const checkUserExists = async (email) => {
  return await API.get(`/user/check-user?email=${encodeURIComponent(email)}`);
};

// LOGOUT
export const logoutUser = async () => {
  return await API.post("/user/logout");
};

// Main OAuth handler
export const startGoogleOAuth = () => {
  console.log('🚀 [OAUTH] Starting Google OAuth...');
  console.log('🔍 [OAUTH] Current origin:', window.location.origin);
  
  const popup = window.open(
    `${import.meta.env.VITE_API_BASE_URL}/user/google`,
    'oauth_popup',
    'width=600,height=700,scrollbars=no,resizable=no'
  );

  if (!popup) {
    alert('Popup blocked! Please allow popups for this site.');
    return;
  }

  let messageReceived = false;

  const messageHandler = async (event) => {
    console.log('📨 [FRONTEND] Message received from:', event.origin);
    console.log('📨 [FRONTEND] Message data:', event.data);
    
    // SECURITY: Allow multiple origins
    const allowedOrigins = [
      'http://localhost:5173',      // Dev frontend
      'http://localhost:5000',      // Dev backend
      'https://guidra.vercel.app',  // Production frontend (NO trailing slash!)
      window.location.origin,       // Current origin (dynamic)
    ].filter(origin => origin); // Remove any undefined
    
    console.log('🔍 [FRONTEND] Allowed origins:', allowedOrigins);
    
    // Skip React DevTools messages and other non-OAuth messages
    if (!event.data || !event.data.type || !event.data.type.includes('OAUTH')) {
      console.log('🔍 [FRONTEND] Skipping non-OAuth message');
      return;
    }
    
    if (!allowedOrigins.includes(event.origin)) {
      console.warn('🔒 [FRONTEND] Ignoring message from unauthorized origin:', event.origin);
      return;
    }

    const { type, token, error, needsPersonalization, redirectPath } = event.data;
    
    if (type === 'OAUTH_SUCCESS' && token) {
      console.log('✅ [FRONTEND] OAuth success! Token received');
      messageReceived = true;
      
      try {
        window.removeEventListener('message', messageHandler);
        if (timeoutId) clearTimeout(timeoutId);
        
        // Set authToken cookie
        const maxAge = 7 * 24 * 60 * 60; // 1 week
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const secureFlag = isLocalhost ? '' : 'secure; ';
        
        document.cookie = `authToken=${token}; path=/; max-age=${maxAge}; ${secureFlag}samesite=lax`;
        
        console.log('✅ [FRONTEND] authToken cookie set successfully!');
        console.log('🔍 [FRONTEND] Cookies after setting:', document.cookie);
        
        // Redirect
        const finalPath = needsPersonalization ? '/personalize' : (redirectPath || '/profile');
        console.log('🔄 [FRONTEND] Redirecting to:', finalPath);
        window.location.href = finalPath;
        
      } catch (err) {
        console.error('❌ [FRONTEND] Failed to process OAuth success:', err);
        window.location.href = '/login?error=oauth_processing_failed';
      }
      
    } else if (type === 'OAUTH_ERROR') {
      console.error('❌ [FRONTEND] OAuth error:', error);
      messageReceived = true;
      window.removeEventListener('message', messageHandler);
      if (timeoutId) clearTimeout(timeoutId);
      window.location.href = `/login?error=oauth_failed&message=${encodeURIComponent(error || 'Unknown error')}`;
    }
  };

  window.addEventListener('message', messageHandler);

  // Timeout after 30 seconds
  const timeoutId = setTimeout(() => {
    if (!messageReceived) {
      console.log('⏰ [FRONTEND] OAuth timeout - no valid message received');
      window.removeEventListener('message', messageHandler);
      window.location.href = '/login?error=oauth_timeout';
    }
  }, 30000);
};

// Cookie helper functions
export const getAuthToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

export const removeAuthToken = () => {
  document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  console.log('✅ [FRONTEND] authToken cookie removed');
};

export const hasAuthToken = () => {
  return !!getAuthToken();
};

export const googleAuth = () => {
  console.warn('⚠️ [AUTH] Using deprecated googleAuth - use startGoogleOAuth instead');
  startGoogleOAuth();
};