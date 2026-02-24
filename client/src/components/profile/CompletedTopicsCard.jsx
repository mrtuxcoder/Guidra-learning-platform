import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { cardSx } from "./constants";

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

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "1rem", sm: "1.125rem" },
          }}
        >
          Completed Topics
        </Typography>
        {completedTopics.length === 0 ? (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              py: 3,
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              textAlign: "center",
            }}
          >
            <CheckCircleOutline sx={{ color: "text.disabled", fontSize: 28 }} />
            <Box>
              <Typography variant="body1" fontWeight={600}>
                No topics are completed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Complete a topic to see it here.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, px: 1.5 }}>
            <List disablePadding>
              {completedTopics.slice(0, 4).map((topic, index) => {
                const topicName = getTopicName(topic);

                return (
                  <React.Fragment key={topicName}>
                    <ListItem
                      disableGutters
                      sx={{
                        py: 1.25,
                        gap: 1.25,
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                      }}
                    >
                      <ListItemText
                        primary={topicName}
                        secondary="Completed topic"
                        primaryTypographyProps={{
                          fontWeight: 700,
                          noWrap: true,
                        }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                      <Chip
                        label="Completed"
                        size="small"
                        sx={{
                          background: "rgba(16, 185, 129, 0.12)",
                          color: "success.main",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onRecall?.(topicName)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 600,
                          borderColor: "primary.light",
                          color: "primary.main",
                          whiteSpace: "nowrap",
                          ml: { xs: "auto", sm: 0 },
                        }}
                      >
                        Recall
                      </Button>
                    </ListItem>
                    {index < Math.min(completedTopics.length, 4) - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedTopicsCard;
