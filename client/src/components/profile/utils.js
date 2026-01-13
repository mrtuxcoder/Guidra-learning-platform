// utils.js should only contain plain JavaScript, no JSX

export const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  } catch (error) {
    return null;
  }
};

export const clearAllTokens = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const getLearningStyleInfo = (style, learningStyles) => {
  return learningStyles.find((ls) => ls.value === style) || learningStyles[0];
};

export const getProgressStats = (user) => {
  if (!user?.progress || !Array.isArray(user.progress)) {
    return {
      totalTopics: 0,
      completed: 0,
      inProgress: 0,
      totalSubtopics: 0,
      completedSubtopics: 0,
      progressPercentage: 0,
    };
  }

  const totalTopics = user.progress.length;
  let completedTopics = 0;
  let totalSubtopics = 0;
  let completedSubtopics = 0;

  user.progress.forEach((topic) => {
    const subtopics = topic.subtopics || topic.subTopics || [];
    totalSubtopics += subtopics.length;

    const topicCompletedSubtopics = subtopics.filter(
      (sub) =>
        sub.completed ||
        sub.isCompleted ||
        sub.understanding?.level >= 4 ||
        sub.status === "completed"
    ).length;

    completedSubtopics += topicCompletedSubtopics;

    if (subtopics.length > 0 && topicCompletedSubtopics === subtopics.length) {
      completedTopics++;
    }
  });

  const inProgressTopics = totalTopics - completedTopics;
  const progressPercentage =
    totalSubtopics > 0
      ? Math.round((completedSubtopics / totalSubtopics) * 100)
      : 0;

  return {
    totalTopics,
    completed: completedTopics,
    inProgress: inProgressTopics,
    totalSubtopics,
    completedSubtopics,
    progressPercentage,
  };
};

export const getSubtopicCompletion = (subtopics) => {
  if (!subtopics || !Array.isArray(subtopics) || subtopics.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completed = subtopics.filter(
    (sub) =>
      sub.completed ||
      sub.isCompleted ||
      sub.understanding?.level >= 4 ||
      sub.status === "completed"
  ).length;

  const percentage = Math.round((completed / subtopics.length) * 100);

  return { completed, total: subtopics.length, percentage };
};

export const isSubtopicCompleted = (subtopic) => {
  return (
    subtopic.completed ||
    subtopic.isCompleted ||
    subtopic.understanding?.level >= 4 ||
    subtopic.status === "completed"
  );
};

// Remove JSX from this function - just return the data
export const getUnderstandingLevel = (subtopic, understandingLevels) => {
  const isCompleted = isSubtopicCompleted(subtopic);

  if (isCompleted) {
    return {
      label: "Completed",
      color: "success",
      icon: "TaskAlt", // Return string instead of JSX
      level: "completed",
    };
  }

  const level = subtopic.understanding?.level || subtopic.level || 1;
  return understandingLevels[level] || understandingLevels[1];
};

export const getTopicStatus = (subtopics) => {
  if (!subtopics || !Array.isArray(subtopics) || subtopics.length === 0) {
    return { status: "not-started", color: "default" };
  }

  const completedCount = subtopics.filter((sub) =>
    isSubtopicCompleted(sub)
  ).length;

  if (completedCount === 0) return { status: "not-started", color: "default" };
  if (completedCount === subtopics.length)
    return { status: "completed", color: "success" };
  return { status: "in-progress", color: "warning" };
};

export const getTopicName = (topic) => {
  return topic.topic || topic.name || topic.title || "Unnamed Topic";
};

export const getSubtopicName = (subtopic) => {
  return (
    subtopic.name || subtopic.title || subtopic.subtopic || "Unnamed Subtopic"
  );
};

export const getLastReviewed = (subtopic) => {
  return (
    subtopic.understanding?.lastReviewed ||
    subtopic.lastReviewed ||
    subtopic.updatedAt ||
    subtopic.completedAt
  );
};

//new for stats

// utils.js - Add these new functions with different names

// NEW: Fixed progress stats calculation that counts topics as completed only when ALL subtopics are completed
export const getStrictProgressStats = (user) => {
  if (!user?.progress || !Array.isArray(user.progress)) {
    return {
      totalTopics: 0,
      completed: 0,
      inProgress: 0,
      totalSubtopics: 0,
      completedSubtopics: 0,
      progressPercentage: 0,
    };
  }

  const totalTopics = user.progress.length;
  let completedTopics = 0;
  let inProgressTopics = 0;
  let totalSubtopics = 0;
  let completedSubtopics = 0;

  user.progress.forEach((topic) => {
    const subtopics = topic.subtopics || topic.subTopics || [];
    const totalSubtopicCount = subtopics.length;
    const completedSubtopicCount = subtopics.filter(
      (sub) => sub.completed === true
    ).length;

    totalSubtopics += totalSubtopicCount;
    completedSubtopics += completedSubtopicCount;

    // A topic is completed only when ALL its subtopics are completed
    if (
      totalSubtopicCount > 0 &&
      completedSubtopicCount === totalSubtopicCount
    ) {
      completedTopics++;
    }
    // A topic is in progress if it has at least one completed subtopic but not all are completed
    else if (totalSubtopicCount > 0 && completedSubtopicCount > 0) {
      inProgressTopics++;
    }
  });

  const progressPercentage =
    totalSubtopics > 0
      ? Math.round((completedSubtopics / totalSubtopics) * 100)
      : 0;

  return {
    totalTopics,
    completed: completedTopics,
    inProgress: inProgressTopics,
    totalSubtopics,
    completedSubtopics,
    progressPercentage,
  };
};

// NEW: Transform MongoDB progress data for TopicsProgress component with quiz marks
export const transformProgressDataWithQuiz = (progress) => {
  if (!progress || !Array.isArray(progress)) return [];

  return progress.map((topic, index) => {
    const subtopics = topic.subTopics || topic.subtopics || [];

    return {
      id: topic._id || index,
      topicName: topic.topic || topic.name || `Topic ${index + 1}`,
      understandingLevel: topic.overallUnderstanding || 1,
      completionPercentage: calculateStrictTopicCompletion(topic),
      score: Math.round((topic.overallUnderstanding || 1) * 20),
      completed: (topic.overallUnderstanding || 0) >= 4,
      lastUpdated: topic.lastAccessed || new Date().toISOString().split("T")[0],
      subtopics: subtopics.map((subtopic, subIndex) => ({
        id: subtopic._id || subIndex,
        name: subtopic.name || subtopic.title || `Subtopic ${subIndex + 1}`,
        completed: subtopic.completed || false,
        completionPercentage: subtopic.completed ? 100 : 0,
        difficulty: getDifficultyFromUnderstandingLevel(
          subtopic.understandingLevel
        ),
        score: Math.round((subtopic.understandingLevel || 1) * 20),
        // Include quiz marks data
        quizMark: subtopic.quizMark || null,
        understandingLevel: subtopic.understandingLevel || 1,
        lastReviewed: subtopic.lastReviewed || topic.lastAccessed,
      })),
    };
  });
};

// NEW: Helper function to calculate topic completion percentage (strict)
export const calculateStrictTopicCompletion = (topic) => {
  const subtopics = topic.subTopics || topic.subtopics || [];
  if (subtopics.length === 0) return 0;

  const completed = subtopics.filter((sub) => sub.completed).length;
  return Math.round((completed / subtopics.length) * 100);
};

// NEW: Helper function to convert understanding level to difficulty
export const getDifficultyFromUnderstandingLevel = (level) => {
  if (level >= 4) return "Easy";
  if (level >= 2) return "Medium";
  return "Hard";
};
