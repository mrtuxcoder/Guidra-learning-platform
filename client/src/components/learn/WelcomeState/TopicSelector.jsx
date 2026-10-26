import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";

const TopicSelector = ({ topics, selectedTopic, onTopicSelect }) => {
  if (!Array.isArray(topics) || topics.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.75rem",
          mb: 1.25,
        }}
      >
        Select Course
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
              size="small"
              sx={{
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "0.82rem",
                py: 1.75,
                px: 0.5,
                bgcolor: isSelected
                  ? "primary.main"
                  : "background.paper",
                color: isSelected ? "#FFFFFF" : "text.primary",
                border: "1px solid",
                borderColor: isSelected ? "primary.main" : "divider",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: isSelected
                    ? "primary.dark"
                    : "action.hover",
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
