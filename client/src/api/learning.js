import API from "./api";

// Learning routes
export const personalizeAndGenerate = async (personalizationData) => {
  const response = await API.post(
    "/api/v1/learning/topics",
    personalizationData
  );
  return response;
};

export const getSubtopics = async (topic) => {
  const response = await API.get(
    `/api/v1/learning/topics/${encodeURIComponent(topic)}/subtopics`
  );
  return response;
};

export const validateTopic = async (topic) => {
  const response = await API.post("/api/v1/learning/topics/validate", {
    topic,
  });
  return response;
};

export const updateLearningPreferences = async (preferencesData) => {
  const response = await API.put(
    "/api/v1/learning/preferences",
    preferencesData
  );
  return response;
};

// Content routes
export const teachSubtopic = async (data) => {
  const response = await API.post("/api/v1/content/teach", data);
  console.log(response)
  return response;
};

export const regenerateContent = async (data) => {
  const response = await API.post("/api/v1/content/regenerate", data);
  return response;
};

export const updateSubtopicProgress = async (data) => {
  const response = await API.put("/api/v1/progress/subtopics/complete", data);
  return response;
};

export const generateTeachingContent = async (data) => {
  const response = await API.post("/api/v1/content/teach", data);
  console.log(response)
  return response;
};

export const generateComponent = async (data) => {
  const response = await API.post("/api/v1/content/component/regenerate", data);
  return response;
};

export const getComponentVersions = async (data) => {
  const response = await API.post("/api/v1/content/component/versions", data);
  return response;
};

export const getComponentVersion = async (data) => {
  const response = await API.post("/api/v1/content/component/version", data);
  return response;
};

export const getContentHistory = async () => {
  const response = await API.get("/api/v1/content/history");
  return response;
};

export const clearContentCache = async () => {
  const response = await API.delete("/api/v1/content/cache");
  return response;
};

export const incrementGenerationCount = async (data) => {
  const response = await API.put(
    "/api/v1/progress/generation-count/increment",
    data
  );
  return response;
};

export const getGenerationCount = async (topic, subtopic) => {
  const response = await API.get(
    `/api/v1/progress/generation-count?topic=${encodeURIComponent(
      topic
    )}&subtopic=${encodeURIComponent(subtopic)}`
  );
  return response;
};

export const getGenerationCounts = async (topic) => {
  const response = await API.get(
    `/api/v1/progress/generation-counts?topic=${encodeURIComponent(topic)}`
  );
  return response;
};

export const updateQuizMarks = async (data) => {
  const response = await API.put("/api/v1/progress/quizzes", data);
  return response;
};

export const getQuizMarks = async (topic, subtopic) => {
  const response = await API.get(
    `/api/v1/progress/quizzes?topic=${encodeURIComponent(
      topic
    )}&subtopic=${encodeURIComponent(subtopic)}`
  );
  return response;
};

export const clearQuizMarks = async (data) => {
  const response = await API.delete("/api/v1/progress/quizzes", { data });
  return response;
};

export const getUserProgress = async () => {
  const response = await API.get("/api/v1/progress");
  return response;
};

export const updateUnderstandingLevel = async (data) => {
  const response = await API.put("/api/v1/progress/understanding", data);
  return response;
};

export const markTopicComplete = async (topic) => {
  const response = await API.put(
    `/api/v1/progress/topics/${encodeURIComponent(topic)}/complete`
  );
  return response;
};
