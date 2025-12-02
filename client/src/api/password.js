// api/password.js
import API from "./api";

// Check if user needs password setup
export const checkPasswordStatus = async () => {
  return await API.get("/user/password/status");
};

// Set password for Google OAuth users
export const setPassword = async (passwordData) => {
  return await API.post("/user/password/set", passwordData);
};

// Change existing password
export const changePassword = async (passwordData) => {
  return await API.post("/user/password/change", passwordData);
};