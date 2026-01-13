import React, { useState, useMemo } from "react";
import { Box, Card, useTheme, useMediaQuery, alpha } from "@mui/material";
import Header from "./Header";
import TopicItem from "./TopicItem";
import { syncTopicsWithSubtopics } from "./utils";

const LearningSidebar = ({
  topics,
  subtopics,
  selectedTopic,
  selectedSubtopic,
  updatingSubtopic,
  contentCache,
  generationCounts,
  onTopicSelect,
  onSubtopicSelect,
  onUpdateUnderstanding,
  progress,
  colorPalette,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedTopic, setExpandedTopic] = useState(null);

  // Sync the topics with the updated subtopics
  const syncedTopics = useMemo(() => {
    return syncTopicsWithSubtopics(topics, subtopics);
  }, [topics, subtopics]);

  const handleTopicClick = (topicName) => {
    onTopicSelect(topicName);
    // Only auto-expand on mobile if it's not already expanded
    if (isMobile && expandedTopic !== topicName) {
      setExpandedTopic(topicName);
    }
  };

  const handleExpandClick = (topicName, event) => {
    event.stopPropagation(); // Prevent topic selection when clicking expand icon
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  const handleSubtopicClick = (subtopic, topicName) => {
    // First select the parent topic
    const parentTopic =
      topicName || findParentTopic(subtopic.name, syncedTopics);
    if (parentTopic && parentTopic !== selectedTopic) {
      onTopicSelect(parentTopic);
    }

    // Then select the subtopic
    onSubtopicSelect(subtopic);

    // Close the topic when a subtopic is selected on mobile
    if (isMobile) {
      setExpandedTopic(null);
    }
  };

  // Helper function to find parent topic
  const findParentTopic = (subtopicName, topicsList) => {
    for (const topic of topicsList) {
      if (topic.subTopics?.some((sub) => sub.name === subtopicName)) {
        return topic.topic;
      }
    }
    return null;
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: { xs: 0, md: 2 },
        boxShadow: { xs: "none", md: "0 2px 24px rgba(126, 87, 194, 0.08)" },
        display: "flex",
        flexDirection: "column",
        background: "white",
        border: { xs: "none", md: `1px solid ${colorPalette[100]}` },
        position: "relative",
        overflow: "hidden",
        "& ::-webkit-scrollbar": {
          width: "6px",
        },
        "& ::-webkit-scrollbar-track": {
          background: colorPalette[50],
          borderRadius: "3px",
        },
        "& ::-webkit-scrollbar-thumb": {
          background: colorPalette[200],
          borderRadius: "3px",
          transition: "background 0.2s ease",
        },
        "& ::-webkit-scrollbar-thumb:hover": {
          background: colorPalette[300],
        },
        "& *": {
          scrollbarWidth: "thin",
          scrollbarColor: `${colorPalette[200]} ${colorPalette[50]}`,
        },
      }}
    >
      {/* Header Section */}
      <Header colorPalette={colorPalette} />

      {/* Topics Section with Progress */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2.5,
        }}
      >
        <Box>
          {syncedTopics.map((topic, index) => (
            <TopicItem
              key={index}
              topic={topic}
              index={index}
              isSelected={selectedTopic === topic.topic}
              isExpanded={expandedTopic === topic.topic}
              onTopicClick={handleTopicClick}
              onExpandClick={handleExpandClick}
              onSubtopicClick={handleSubtopicClick}
              selectedSubtopic={selectedSubtopic}
              updatingSubtopic={updatingSubtopic}
              contentCache={contentCache}
              colorPalette={colorPalette}
            />
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default LearningSidebar;
