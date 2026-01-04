// /src/api/index.js - CLEAN VERSION
import API, { authHelpers } from './api.js';
import * as authService from './auth.js';
import * as learningService from './learning.js';
import * as passwordService from './password.js';

// Export services individually
export {
  API,
  authHelpers,
  authService,
  learningService,
  passwordService,
};

// Export frequently used auth functions
export const {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  checkUserExists,
  startGoogleOAuth,
  googleAuth,
  getAuthToken,
  removeAuthToken,
  hasAuthToken,
  hasAuthCookie,
  isAuthenticated,
  isAuthenticatedWithInfo,
  checkNeedsPasswordSetup,
  setupPassword,
  completeLogout,
  checkAuthQuick,
  handleManualLogin,
  requireAuth,
  requireGuest,
  debugAuth,
  initializeAuth,
  clearAllTokens,
  clearAuthCache,
} = authService;

// Export learning functions
export const {
  personalizeAndGenerate,
  getSubtopics,
  validateTopic,
  updateLearningPreferences,
  teachSubtopic,
  regenerateContent,
  updateSubtopicProgress,
  generateTeachingContent,
  generateMermaidMindmap,
  fixMermaidSyntax,
  getContentHistory,
  clearContentCache,
  updateGenerationCount,
  incrementGenerationCount,
  getGenerationCount,
  updateQuizMarks,
  getQuizMarks,
  clearQuizMarks,
  addOrUpdateTopic,
  getUserProgress,
  updateUnderstandingLevel,
  markSubtopicComplete,
  markTopicComplete,
} = learningService;

// Export password functions (renamed to avoid conflicts)
export const {
  getPasswordStatus,
  createPassword,
  updatePassword,
} = passwordService;

// Default export
export default {
  API,
  auth: authService,
  learning: learningService,
  password: passwordService,
  helpers: authHelpers,
  
  // Most used functions for convenience
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  isAuthenticated,
  hasAuthCookie,
};