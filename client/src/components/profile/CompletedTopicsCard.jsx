import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { profileTheme, cardSx } from "./constants";

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
    return null;
  }

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "1rem", sm: "1.125rem" },
            background: profileTheme.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Completed Topics
        </Typography>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {completedTopics.slice(0, 4).map((topic) => {
            const topicName = getTopicName(topic);

            return (
              <Grid item xs={12} sm={6} key={topicName} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${profileTheme.border}`,
                    background: "rgba(126, 87, 194, 0.05)",
                    height: "100%",
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={{ width: "100%" }}
                  >
                    <Chip
                      label="Completed"
                      size="small"
                      sx={{
                        background: "rgba(16, 185, 129, 0.12)",
                        color: "#059669",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        alignSelf: { xs: "flex-start", sm: "center" },
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1e293b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {topicName}
                    </Typography>
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onRecall?.(topicName)}
                    fullWidth={isMobile}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 600,
                      alignSelf: { xs: "stretch", sm: "flex-start" },
                      borderColor: "rgba(126, 87, 194, 0.3)",
                      color: profileTheme.primary,
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
