// /src/api/index.js - UPDATED
import API, { authHelpers } from "./api.js";
import * as authService from "./auth.js";
import * as learningService from "./learning.js";
import * as passwordService from "./password.js";

export { API, authHelpers, authService, learningService, passwordService };

export const {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  checkUserExists,
  startGoogleOAuth,
  getFrontendCookie,
  hasAuthCookie,
  isAuthenticated,
  isAuthenticatedWithInfo,
  updateUserPreferences,
  checkNeedsPasswordSetup,
  setupPassword,
  completeLogout,
  handleManualLogin,
  requireAuth,
  requireGuest,
  debugAuth,
  initializeAuth,
  clearAllTokens,
  clearAuthCache,
} = authService;

export const {
  personalizeAndGenerate,
  getSubtopics,
  validateTopic,
  updateLearningPreferences,
  teachSubtopic,
  regenerateContent,
  updateSubtopicProgress,
  generateTeachingContent,
  generateComponent,
  getComponentVersions,
  getComponentVersion,
  getContentHistory,
  clearContentCache,
  getCachedSubtopics,
  incrementGenerationCount,
  getGenerationCount,
  getGenerationCounts,
  updateQuizMarks,
  getQuizMarks,
  clearQuizMarks,
  getUserProgress,
  updateUnderstandingLevel,
  markTopicComplete,
  getAvailableVersions,
  getFullContentByVersion,
  getLatestFullContent,
  compareContentVersions,
  getContentVersionHistory,
  analyzeQuizAnswers,
  getTopicAnalysis,
  getAllAnalysis,
} = learningService;

export const { getPasswordStatus, createPassword, updatePassword } =
  passwordService;

export default {
  API,
  auth: authService,
  learning: learningService,
  password: passwordService,
  helpers: authHelpers,

  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  isAuthenticated,
  hasAuthCookie,
  getFrontendCookie,
};
