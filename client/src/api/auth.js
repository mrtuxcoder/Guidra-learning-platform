import API from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// REGISTER
export const registerUser = async (userData) => {
  console.log(API_BASE_URL)
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

// GOOGLE OAUTH - Initiate Google authentication
export const googleAuth = () => {
  const googleAuthUrl = `${API_BASE_URL}/user/google`;
  window.location.href = googleAuthUrl;
};

// CHECK USER EXISTS (for Google OAuth flow)
export const checkUserExists = async (email) => {
  return await API.get(`/user/check-user?email=${encodeURIComponent(email)}`);
};

// GOOGLE OAUTH SUCCESS (if you need to handle success callback via API)
export const googleAuthSuccess = async () => {
  return await API.get("/user/google/success");
};

// LOGOUT
export const logoutUser = async () => {
  return await API.post("/user/logout");
};

// Add this to your /api/auth.js file
export const googleSuccess = async () => {
  return await API.get("/user/google/success");
};