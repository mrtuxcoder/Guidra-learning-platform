// Utility functions for CustomTopicSearch

export const getRetrySuggestion = (error) => {
  if (!error) return "";

  if (error.includes("not suitable") || error.includes("try")) {
    return "Try using more specific terms or different wording";
  }

  return "Try rephrasing your topic or using more specific keywords";
};

export const validateSearchQuery = (query) => {
  if (!query || query.trim().length === 0) {
    return {
      valid: false,
      error: "Please enter a topic to search"
    };
  }

  if (query.trim().length < 3) {
    return {
      valid: false,
      error: "Topic must be at least 3 characters long"
    };
  }

  return {
    valid: true,
    error: null
  };
};

export const extractSubtopicData = (response) => {
  try {
    const data = response?.data?.data;
    
    if (!data) {
      throw new Error("No data received from server");
    }

    return {
      subtopics: data.subTopics || [],
      generatedContent: response.data,
      customTopic: data.topic || ""
    };
  } catch (error) {
    throw new Error("Failed to extract subtopic data: " + error.message);
  }
};