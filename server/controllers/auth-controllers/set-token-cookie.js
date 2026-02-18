const { signJwt } = require("../../configs/jwt");

const getTokenCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

/**
 * Set token cookie in response - FOR BACKEND DOMAIN ONLY
 * This cookie is set on render.com domain, not accessible by frontend
 */
const setTokenCookie = (res, user) => {
  const token = signJwt({ id: user._id, email: user.email, name: user.name });

  res.cookie("token", token, getTokenCookieOptions());

  console.log("✅ [SET TOKEN COOKIE] Cookie set for user:", user.email);
  return token;
};

module.exports = {
  setTokenCookie,
  getTokenCookieOptions,
};
