const { signJwt } = require('../configs/jwt');

/**
 * Set token cookie in response - FOR BACKEND DOMAIN ONLY
 * This cookie is set on render.com domain, not accessible by frontend
 */
 const setTokenCookie = (res, user) => {
  const token = signJwt({ id: user._id, email: user.email, name: user.name });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // true for HTTPS
    sameSite: 'none', // Required for cross-origin
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  console.log('✅ [SET TOKEN COOKIE] Cookie set for user:', user.email);
  return token;
};

module.exports = setTokenCookie;