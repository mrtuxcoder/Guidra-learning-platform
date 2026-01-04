import API from "./api";

// Check if user needs password setup
export const checkPasswordStatus = async () => {
  return await API.get("/api/v1/users/me/password/status");
};

// Set password for Google OAuth users
export const setPassword = async (passwordData) => {
  return await API.post("/api/v1/users/me/password/set", passwordData);
};

// Change existing password
export const changePassword = async (passwordData) => {
  return await API.put("/api/v1/users/me/password/change", passwordData);
};