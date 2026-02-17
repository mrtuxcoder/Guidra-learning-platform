import React from "react";
import { Box, Typography, Chip, Stack, useMediaQuery } from "@mui/material";

const TopicSelector = ({ topics, selectedTopic, onTopicSelect }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  if (!Array.isArray(topics) || topics.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant={isMobile ? "subtitle1" : "h6"}
        fontWeight="700"
        sx={{ mb: 2, color: "text.primary" }}
      >
        Choose a Topic
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {topics.map((topic, index) => {
          const topicName = topic?.topic || topic?.name || "Unnamed Topic";
          const isSelected = selectedTopic === topicName;

          return (
            <Chip
              key={index}
              label={topicName}
              onClick={() => onTopicSelect && onTopicSelect(topicName)}
              variant={isSelected ? "filled" : "outlined"}
              size={isMobile ? "small" : "medium"}
              sx={{
                mb: 1,
                background: isSelected
                  ? `linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)`
                  : "background.paper",
                color: isSelected ? "white" : "text.primary",
                borderColor: isSelected ? "#7c3aed" : "divider",
                fontWeight: "600",
                "&:hover": {
                  background: isSelected
                    ? "#7c3aed"
                    : (theme) => theme.palette.action.hover,
                },
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default TopicSelector;
