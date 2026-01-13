// Utility functions for LearningSidebar

export const syncTopicsWithSubtopics = (topics, subtopics) => {
  if (!topics.length || !subtopics.length) return topics;

  return topics.map((topic) => {
    // Find subtopics that belong to this topic and merge with updated data
    const updatedSubTopics =
      topic.subTopics?.map((subtopic) => {
        const updatedSubtopic = subtopics.find(
          (sub) => sub.name === subtopic.name
        );
        return updatedSubtopic || subtopic;
      }) || [];

    return {
      ...topic,
      subTopics: updatedSubTopics,
    };
  });
};

export const findParentTopic = (subtopicName, topicsList) => {
  for (const topic of topicsList) {
    if (topic.subTopics?.some((sub) => sub.name === subtopicName)) {
      return topic.topic;
    }
  }
  return null;
};

export const calculateTopicProgress = (topic) => {
  const completedCount =
    topic.subTopics?.filter((s) => s.completed).length || 0;
  const totalCount = topic.subTopics?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return {
    completedCount,
    totalCount,
    progress,
    percentage: Math.round(progress),
  };
};

export const hasSubtopicContent = (
  subtopicName,
  selectedTopic,
  contentCache
) => {
  return (
    contentCache[`${selectedTopic}-${subtopicName}`] ||
    contentCache[subtopicName]
  );
};

export const getSubtopicStatus = (subtopic, contentCache, selectedTopic) => {
  const hasContent = hasSubtopicContent(
    subtopic.name,
    selectedTopic,
    contentCache
  );
  const isCompleted = subtopic.completed;

  return {
    hasContent,
    isCompleted,
    isLoading: false, // Add loading state if needed
  };
};
