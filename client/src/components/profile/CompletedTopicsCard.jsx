import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const completedTopics = progress.filter(isTopicCompleted);

  if (completedTopics.length === 0) {
    return (
      <Card sx={cardSx}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Completed Topics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No completed topics yet. Keep learning to see your finished topics here.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Completed Topics
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {completedTopics.length} topic{completedTopics.length !== 1 ? "s" : ""} completed
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ width: "100%" }}>
          {completedTopics.map((topic) => {
            const topicName = getTopicName(topic);
            const subtopics = topic.subTopics || topic.subtopics || [];
            const subCount = subtopics.length;
            const completedSubCount = subtopics.filter((s) => s.completed).length;

            return (
              <Grid item xs={12} sm={6} md={4} key={topicName}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default",
                    height: "100%",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Chip
                        label="Completed"
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: "success.main",
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          height: 22,
                        }}
                      />
                      {subCount > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {completedSubCount}/{subCount} subtopics
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                      }}
                    >
                      {topicName}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onRecall?.(topicName)}
                    fullWidth={isMobile}
                    sx={{
                      textTransform: "none",
                      borderRadius: "6px",
                      fontWeight: 600,
                      borderColor: "divider",
                      color: "text.primary",
                      alignSelf: { xs: "stretch", sm: "flex-start" },
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  >
                    Recall Topic
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompletedTopicsCard;
