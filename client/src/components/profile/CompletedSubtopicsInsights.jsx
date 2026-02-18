import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { AccessTime, Checklist, Quiz } from "@mui/icons-material";
import { profileTheme, cardSx } from "./constants";

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
              background: profileTheme.gradient,
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
                background: profileTheme.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
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
              background: "rgba(126, 87, 194, 0.08)",
              color: profileTheme.primary,
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
              color: "#059669",
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
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            {topSubtopics.map((subtopic) => {
              const accuracy = getAccuracy(subtopic.quizMark);
              return (
                <Box
                  key={`${subtopic.topic}-${subtopic.name}`}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: `1px solid ${profileTheme.border}`,
                    background: "rgba(126, 87, 194, 0.04)",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ mb: 0.25 }}
                  >
                    {subtopic.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {subtopic.topic}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label={formatDuration(subtopic.timeSpentMs)}
                      sx={{
                        background: "rgba(126, 87, 194, 0.1)",
                        color: profileTheme.primary,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      size="small"
                      label={
                        accuracy === null
                          ? "No quiz"
                          : `${accuracy}% quiz`
                      }
                      sx={{
                        background: "rgba(59, 130, 246, 0.12)",
                        color: "#2563eb",
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                </Box>
              );
            })}
          </Stack>
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
