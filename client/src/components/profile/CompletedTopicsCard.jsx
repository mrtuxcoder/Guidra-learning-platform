import React from "react";
import { Card, CardContent, Box, Typography, Button, Stack } from "@mui/material";

const isTopicCompleted = (topic) => {
  if (!topic) return false;
  if (topic.completed === true) return true;

  const subtopics = topic.subTopics || topic.subtopics || [];
  if (subtopics.length > 0) {
    return subtopics.every((sub) => sub && sub.completed === true);
  }

  return (topic.overallUnderstanding || 0) >= 4;
};

const getTopicName = (topic) =>
  topic?.topic || topic?.name || topic?.title || "Untitled Topic";

const CompletedTopicsCard = ({ progress = [], onRecall }) => {
  const completedTopics = progress.filter(isTopicCompleted);

  if (completedTopics.length === 0) {
    return null;
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(126, 87, 194, 0.15)",
        background: "white",
        boxShadow: "0 8px 32px rgba(126, 87, 194, 0.08)",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "1rem", sm: "1.125rem" },
            background: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Completed Topics
        </Typography>

        <Stack spacing={1.5}>
          {completedTopics.slice(0, 4).map((topic) => {
            const topicName = getTopicName(topic);

            return (
              <Box
                key={topicName}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid rgba(126, 87, 194, 0.12)",
                  background: "rgba(126, 87, 194, 0.04)",
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {topicName}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onRecall?.(topicName)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 600,
                    borderColor: "rgba(126, 87, 194, 0.3)",
                    color: "#7E57C2",
                  }}
                >
                  Recall
                </Button>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CompletedTopicsCard;
