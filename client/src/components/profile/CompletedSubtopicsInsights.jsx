import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AccessTime, Checklist, Quiz } from "@mui/icons-material";
import { cardSx } from "./constants";

const formatDuration = (ms) => {
  if (!ms || ms <= 0) return "0m";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getAccuracy = (quizMark = {}) => {
  const total = quizMark.total || 0;
  if (!total) return null;
  const correct = quizMark.correct || 0;
  return Math.round((correct / total) * 100);
};

const buildInsights = ({ completedCount, avgTimeMs, avgAccuracy, appTimeMs }) => {
  const insights = [];

  if (completedCount === 0) {
    return ["Complete a subtopic to unlock personalized insights."];
  }

  if (avgTimeMs > 0) {
    insights.push(`Your average focus time is ${formatDuration(avgTimeMs)} per subtopic.`);
  }

  if (avgAccuracy !== null) {
    const accuracyNote =
      avgAccuracy >= 85
        ? "Strong quiz accuracy. Keep challenging yourself."
        : avgAccuracy >= 70
        ? "Solid quiz results. A quick review can push you higher."
        : "Quiz accuracy is building. Try revisiting tricky areas.";
    insights.push(accuracyNote);
  }

  if (appTimeMs > 0) {
    insights.push(`Total time in app: ${formatDuration(appTimeMs)}.`);
  }

  return insights;
};

const CompletedSubtopicsInsights = ({ progress = [], appTimeMs = 0 }) => {
  const {
    completedSubtopics,
    totalTimeMs,
    averageTimeMs,
    averageAccuracy,
  } = useMemo(() => {
    const items = [];

    progress.forEach((topic) => {
      const topicName = topic?.topic || topic?.name || "Untitled";
      const subtopics = topic?.subTopics || [];
      subtopics.forEach((subtopic) => {
        if (subtopic?.completed) {
          items.push({
            topic: topicName,
            name: subtopic?.name || "Untitled",
            timeSpentMs: subtopic?.timeSpentMs || 0,
            quizMark: subtopic?.quizMark || {},
          });
        }
      });
    });

    const totalTime = items.reduce((sum, item) => sum + item.timeSpentMs, 0);
    const accuracyValues = items
      .map((item) => getAccuracy(item.quizMark))
      .filter((value) => value !== null);
    const avgAccuracy =
      accuracyValues.length > 0
        ? Math.round(
            accuracyValues.reduce((sum, value) => sum + value, 0) /
              accuracyValues.length
          )
        : null;

    return {
      completedSubtopics: items,
      totalTimeMs: totalTime,
      averageTimeMs: items.length ? Math.round(totalTime / items.length) : 0,
      averageAccuracy: avgAccuracy,
    };
  }, [progress]);

  const topSubtopics = [...completedSubtopics]
    .sort((a, b) => b.timeSpentMs - a.timeSpentMs)
    .slice(0, 5);

  const insights = buildInsights({
    completedCount: completedSubtopics.length,
    avgTimeMs: averageTimeMs,
    avgAccuracy: averageAccuracy,
    appTimeMs,
  });

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checklist sx={{ fontSize: 20, color: "white" }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Completed Subtopics
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Time spent and quiz performance
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            icon={<AccessTime />}
            label={`Total ${formatDuration(totalTimeMs)}`}
            size="small"
            sx={{
              background: "rgba(126, 87, 194, 0.1)",
              color: "primary.main",
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<Quiz />}
            label={
              averageAccuracy === null
                ? "No quiz data"
                : `Avg ${averageAccuracy}% quiz`
            }
            size="small"
            sx={{
              background: "rgba(16, 185, 129, 0.12)",
              color: "success.main",
              fontWeight: 600,
            }}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {topSubtopics.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No completed subtopics yet. Finish a lesson to see stats here.
          </Typography>
        ) : (
          <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, px: 1.5, mb: 2 }}>
            <List disablePadding>
              {topSubtopics.map((subtopic, index) => {
                const accuracy = getAccuracy(subtopic.quizMark);
                return (
                  <React.Fragment key={`${subtopic.topic}-${subtopic.name}`}>
                    <ListItem disableGutters sx={{ py: 1.2, gap: 1 }}>
                      <ListItemText
                        primary={subtopic.name}
                        secondary={subtopic.topic}
                        primaryTypographyProps={{ fontWeight: 700, noWrap: true }}
                        secondaryTypographyProps={{ variant: "caption", noWrap: true }}
                      />
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={formatDuration(subtopic.timeSpentMs)}
                          sx={{
                            background: "rgba(126, 87, 194, 0.1)",
                            color: "primary.main",
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          size="small"
                          label={accuracy === null ? "No quiz" : `${accuracy}%`}
                          sx={{
                            background: "rgba(59, 130, 246, 0.12)",
                            color: "info.main",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                    </ListItem>
                    {index < topSubtopics.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={0.75}>
          {insights.map((insight, index) => (
            <Typography
              key={index}
              variant="body2"
              color="text.secondary"
            >
              {insight}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CompletedSubtopicsInsights;
