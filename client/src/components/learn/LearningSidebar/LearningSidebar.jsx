import React, { useState, useEffect, useMemo } from "react";
import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";
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
  onTopicSelect,
  onSubtopicSelect,
  colorPalette,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedTopic, setExpandedTopic] = useState(selectedTopic);

  // Sync expanded topic whenever selectedTopic changes
  useEffect(() => {
    if (selectedTopic) {
      setExpandedTopic(selectedTopic);
    }
  }, [selectedTopic]);

  // Sync the topics with the updated subtopics
  const syncedTopics = useMemo(() => {
    return syncTopicsWithSubtopics(topics, subtopics);
  }, [topics, subtopics]);

  const handleTopicClick = (topicName) => {
    onTopicSelect(topicName);
    if (expandedTopic !== topicName) {
      setExpandedTopic(topicName);
    }
  };

  const handleExpandClick = (topicName, event) => {
    event.stopPropagation();
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  const handleSubtopicClick = (subtopic, topicName) => {
    const parentTopic =
      topicName || findParentTopic(subtopic.name, syncedTopics);
    if (parentTopic && parentTopic !== selectedTopic) {
      onTopicSelect(parentTopic);
    }

    onSubtopicSelect(subtopic, parentTopic);

    if (isMobile) {
      setExpandedTopic(null);
    }
  };

  const findParentTopic = (subtopicName, topicsList) => {
    for (const topic of topicsList) {
      if (topic.subTopics?.some((sub) => sub.name === subtopicName)) {
        return topic.topic;
      }
    }
    return null;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: isMobile ? "100dvh" : "100%",
        minHeight: isMobile ? "100dvh" : "auto",
        borderRadius: { xs: 0, md: "10px" },
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        border: { xs: "none", md: "1px solid" },
        borderColor: { xs: "none", md: "divider" },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Header />

      {/* Topics Section with Progress */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
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
    </Paper>
  );
};

export default LearningSidebar;