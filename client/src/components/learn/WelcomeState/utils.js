// Utility functions for WelcomeState

export const calculateLearningInsights = (subtopics) => {
  const validSubtopics = Array.isArray(subtopics) ? subtopics : [];
  const totalSubtopics = validSubtopics.length;
  const completedSubtopics = validSubtopics.filter(
    (sub) => sub?.completed
  ).length;
  const incompleteSubtopics = validSubtopics.filter((sub) => !sub?.completed);

  // Consider topic completed when all subtopics are completed
  const isTopicCompleted =
    totalSubtopics > 0 && completedSubtopics === totalSubtopics;
  const progressPercentage =
    totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;
  const hasIncompleteTopics = incompleteSubtopics.length > 0;
  const firstIncompleteSubtopic = incompleteSubtopics[0] || null;

  return {
    totalSubtopics,
    completedSubtopics,
    incompleteSubtopics,
    progressPercentage,
    isTopicCompleted,
    hasIncompleteTopics,
    firstIncompleteSubtopic,
  };
};

export const getRecentlyAccessedSubtopics = (contentCache, subtopics) => {
  try {
    if (!contentCache || typeof contentCache !== "object") return [];
    if (!Array.isArray(subtopics)) return [];

    const cachedEntries = Object.entries(contentCache);
    const recentlyAccessed = cachedEntries
      .sort(([, a], [, b]) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 3)
      .map(([key]) => {
        const subtopicName = key.split("-")[1];
        return subtopics.find((sub) => sub && sub.name === subtopicName);
      })
      .filter(Boolean);

    return recentlyAccessed;
  } catch {
    return [];
  }
};

export const getHighPrioritySubtopics = (subtopics, generationCounts) => {
  try {
    if (!Array.isArray(subtopics)) return [];
    const validGenerationCounts = generationCounts || {};

    const incomplete = subtopics.filter((sub) => sub && !sub.completed);
    return incomplete
      .sort((a, b) => {
        const aScore =
          (validGenerationCounts[a.name] || 0) + (a.understandingLevel || 0);
        const bScore =
          (validGenerationCounts[b.name] || 0) + (b.understandingLevel || 0);
        return aScore - bScore;
      })
      .slice(0, 3);
  } catch {
    return [];
  }
};

export const getRecommendedTopics = (topics, currentTopic) => {
  try {
    if (!Array.isArray(topics)) return [];
    return topics
      .filter((topic) => topic && (topic.topic || topic.name) !== currentTopic)
      .slice(0, 3);
  } catch {
    return [];
  }
};

export const getSubtopicForAction = (
  actionType,
  learningInsights,
  suggestions
) => {
  switch (actionType) {
    case "continue":
      return learningInsights.firstIncompleteSubtopic;
    case "recent":
      return suggestions.recentlyAccessed[0];
    case "priority":
      return suggestions.highPrioritySubtopics[0];
    default:
      return null;
  }
};

export const getMostRecentIncompleteSubtopic = (subtopics) => {
  if (!Array.isArray(subtopics) || subtopics.length === 0) return null;

  const incomplete = subtopics.filter((sub) => sub && !sub.completed);
  if (incomplete.length === 0) return null;

  return incomplete
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.lastReviewed || a.updatedAt || 0).getTime();
      const bTime = new Date(b.lastReviewed || b.updatedAt || 0).getTime();
      return bTime - aTime;
    })[0];
};
