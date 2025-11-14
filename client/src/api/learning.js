

import API from './api';

export const personalizeAndGenerate = async (personalizationData) => {
  const response = await API.post('/learn/new', personalizationData);
  return response;
};

export const getSubtopics = async (topic) => {
  const response = await API.get(`/learn/subtopics/${encodeURIComponent(topic)}`);
  return response;
};

export const teachSubtopic = async (data) => {
  const response = await API.post('/learn/teach', data);
  return response;
};

export const regenerateContent = async (data) => {
  const response = await API.post('/learn/regenerate', data);
  return response;
};

export const updateSubtopicProgress = async (data) => {
  const response = await API.put('/learn/progress', data);
  return response;
};

export const generateTeachingContent = async (data) => {
  const response = await API.post('/learn/teach', data);
  return response;
};

// Generation count routes
export const updateGenerationCount = async (data) => {
  const response = await API.put('/user/progress/generation-count', data);
  return response;
};

export const incrementGenerationCount = async (data) => {
  const response = await API.put('/user/progress/increment-generation', data);
  return response;
};

export const getGenerationCount = async (topic, subtopic) => {
  const response = await API.get(`/user/progress/generation-count?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`);
  return response;
};

// NEW: Quiz marks routes
export const updateQuizMarks = async (data) => {
  const response = await API.put('/user/progress/quiz-marks', data);
  return response;
};

export const getQuizMarks = async (topic, subtopic) => {
  const response = await API.get(`/user/progress/quiz-marks?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`);
  return response;
};

export const clearQuizMarks = async (data) => {
  const response = await API.delete('/user/progress/quiz-marks', { data });
  return response;
};

// Additional progress routes (if needed)
export const addOrUpdateTopic = async (data) => {
  const response = await API.post('/user/progress/topic', data);
  return response;
};

export const getUserProgress = async () => {
  const response = await API.get('/user/progress');
  return response;
};

export const updateUnderstandingLevel = async (data) => {
  const response = await API.put('/user/progress/understanding', data);
  return response;
};

export const markSubtopicComplete = async (data) => {
  const response = await API.put('/user/progress/complete', data);
  return response;
};

export const markTopicComplete = async (data) => {
  const response = await API.put('/user/progress/topic/complete', data);
  return response;
};