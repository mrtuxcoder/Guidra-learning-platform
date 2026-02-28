import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Fade,
  LinearProgress,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  alpha,
  IconButton,
  useTheme,
} from "@mui/material";
import { ArrowForward, MenuBook, School } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import TopicSelector from "./TopicSelector";
import ProgressCard from "./ProgressCard";
import QuickActions from "./QuickActions";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import {
  getRecentlyAccessedSubtopics,
  getHighPrioritySubtopics,
  getRecommendedTopics,
  calculateLearningInsights,
  getMostRecentIncompleteSubtopic,
} from "./utils";

const WelcomeState = ({
  subtopicName,
  isReady = false,
  onGenerateContent,
  subtopics = [],
  topics = [],
  selectedTopic,
  onNavigateToFirstIncomplete,
  onTopicSelect,
  onSubtopicSelect,
  onOpenSidebar,
  progress = 0,
  generationCounts = {},
  contentCache = {},
  isDataLoading = false,
  isRecalledTopic = false,
  isMobile = false,
  colorPalette = {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
  },
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";
  const [activeSuggestion, setActiveSuggestion] = useState("continue");

  // Memoized calculations
  const learningInsights = useMemo(() => {
    return calculateLearningInsights(subtopics);
  }, [subtopics]);

  const suggestions = useMemo(() => {
    return {
      recentlyAccessed: getRecentlyAccessedSubtopics(contentCache, subtopics),
      highPrioritySubtopics: getHighPrioritySubtopics(
        subtopics,
        generationCounts
      ),
      recommendedTopics: getRecommendedTopics(topics, selectedTopic),
    };
  }, [contentCache, subtopics, generationCounts, topics, selectedTopic]);

  const mostRecentIncompleteSubtopic = useMemo(() => {
    return (
      getMostRecentIncompleteSubtopic(subtopics) ||
      learningInsights.firstIncompleteSubtopic
    );
  }, [subtopics, learningInsights.firstIncompleteSubtopic]);

  const inProgressTopicName = useMemo(() => {
    if (!Array.isArray(topics) || topics.length === 0) {
      return selectedTopic || "";
    }

    const inProgressTopic = topics.find((topic) => {
      const subtopicList = topic?.subTopics || topic?.subtopics || [];
      return subtopicList.some((sub) => sub && !sub.completed);
    });

    return (
      inProgressTopic?.topic ||
      inProgressTopic?.name ||
      selectedTopic ||
      ""
    );
  }, [topics, selectedTopic]);

  // Check if we have any topics at all
  const hasTopics = Array.isArray(topics) && topics.length > 0;

  const normalizedSelectedTopic = useMemo(() => {
    if (selectedTopic) return selectedTopic;
    const firstTopic = topics?.[0];
    return firstTopic?.topic || firstTopic?.name || "Python Programming";
  }, [selectedTopic, topics]);

  const primarySubtopic = useMemo(() => {
    return mostRecentIncompleteSubtopic || learningInsights.firstIncompleteSubtopic;
  }, [mostRecentIncompleteSubtopic, learningInsights.firstIncompleteSubtopic]);

  const progressPercent = Math.round(learningInsights.progressPercentage || 0);
  const completedCount = learningInsights.completedSubtopics || 0;
  const totalCount = learningInsights.totalSubtopics || 0;

  const handleContinueLearning = () => {
    if (primarySubtopic && onSubtopicSelect) {
      onSubtopicSelect(primarySubtopic);
    }
  };

  const handleOpenCourses = () => {
    if (onOpenSidebar) {
      onOpenSidebar();
      return;
    }
    if (typeof onNavigateToFirstIncomplete === "function") {
      onNavigateToFirstIncomplete();
    }
  };

  const handleExploreTopics = () => {
    navigate("/explore");
  };

  const handleQuickAction = (actionType) => {
    let targetSubtopic = null;

    switch (actionType) {
      case "continue":
        targetSubtopic = learningInsights.firstIncompleteSubtopic;
        break;
      case "recent":
        targetSubtopic = suggestions.recentlyAccessed[0];
        break;
      case "priority":
        targetSubtopic = suggestions.highPrioritySubtopics[0];
        break;
    }

    if (targetSubtopic && onSubtopicSelect) {
      onSubtopicSelect(targetSubtopic);
    }
  };

  // Show loader first, then content
  if (isDataLoading) {
    return <LoadingState isDesktop={!isMobile} colorPalette={colorPalette} />;
  }

  if (!hasTopics) {
    if (isMobile) {
      return (
        <Fade in={true} timeout={400}>
          <Box
            sx={{
              minHeight: "100vh",
              bgcolor: "#F7F7FA",
              pb: "80px",
            }}
          >
            <Box
              sx={{
                minHeight: "128px",
                px: 2,
                pt: 2.5,
                pb: 2,
                background: "linear-gradient(135deg, #7B61FF 0%, #9C6BFF 100%)",
                color: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  mb: 1.5,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <School sx={{ fontSize: 20 }} />
                  <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
                    Learn
                  </Typography>
                </Stack>
              </Box>
              <Typography sx={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.2 }}>
                Continue Learning
              </Typography>
              <Typography sx={{ fontSize: "14px", opacity: 0.86, mt: 0.4 }}>
                Pick up where you left off
              </Typography>
            </Box>

            <Box sx={{ px: 2, pt: 2 }}>
              <Box
                sx={{
                  minHeight: "calc(100vh - 240px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <School sx={{ fontSize: 54, color: "#7B61FF", mb: 1.2 }} />
                <Typography sx={{ fontSize: "22px", fontWeight: 700, color: "#222", mb: 0.8 }}>
                  Start Learning
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#666", mb: 2.4, maxWidth: 280 }}>
                  Choose a course to begin your journey
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleExploreTopics}
                  sx={{
                    width: "70%",
                    height: 48,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #7B61FF 0%, #9C6BFF 100%)",
                  }}
                >
                  Browse Courses
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      );
    }

    return (
      <Fade in={true} timeout={400}>
        <Box
          sx={{
            minHeight: "100vh",
            background: isDark
              ? `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  0.85
                )} 0%, ${theme.palette.background.default} 100%)`
              : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header
            hasTopics={hasTopics}
            selectedTopic={selectedTopic}
            subtopicName={subtopicName}
            isReady={isReady}
            learningInsights={learningInsights}
            colorPalette={colorPalette}
            isMobile={isMobile}
            onOpenSidebar={onOpenSidebar}
            isRecalledTopic={isRecalledTopic}
          />
          <EmptyState colorPalette={colorPalette} />
        </Box>
      </Fade>
    );
  }

  if (isMobile) {
    return (
      <Fade in={true} timeout={400}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "#F7F7FA",
            pb: "80px",
          }}
        >
          <Box
            sx={{
              minHeight: "128px",
              px: 2,
              pt: 2.5,
              pb: 2,
              background: "linear-gradient(135deg, #7B61FF 0%, #9C6BFF 100%)",
              color: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                mb: 1.5,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <School sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
                  Learn
                </Typography>
              </Stack>
            </Box>
            <Typography sx={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.2 }}>
              Continue Learning
            </Typography>
            <Typography sx={{ fontSize: "14px", opacity: 0.86, mt: 0.4 }}>
              Pick up where you left off
            </Typography>
          </Box>

          <Box sx={{ px: 2, pt: 2 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 2,
                bgcolor: "#fff",
                border: "1px solid",
                borderColor: "divider",
                mb: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.4 }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#222" }}>
                  {normalizedSelectedTopic}
                </Typography>
                <Chip
                  label={`${completedCount} / ${totalCount}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(123,97,255,0.12)",
                    color: "#7B61FF",
                    fontWeight: 700,
                    borderRadius: "999px",
                  }}
                />
              </Stack>

              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 8,
                  borderRadius: 999,
                  bgcolor: "rgba(123,97,255,0.12)",
                  mb: 1,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #7B61FF 0%, #9C6BFF 100%)",
                  },
                }}
              />

              <Typography sx={{ color: "#666", fontSize: "0.88rem", mb: 1.6, fontWeight: 500 }}>
                {progressPercent}% completed
              </Typography>

              <Button
                fullWidth
                onClick={handleContinueLearning}
                disabled={!primarySubtopic}
                sx={{
                  height: 48,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "white",
                  background: "linear-gradient(135deg, #7B61FF 0%, #9C6BFF 100%)",
                  boxShadow: "0 6px 18px rgba(123,97,255,0.24)",
                }}
              >
                Continue
              </Button>
            </Card>

            <Stack direction="row" spacing={1.2} sx={{ mb: 1.5 }}>
              <Button
                variant="outlined"
                onClick={handleOpenCourses}
                sx={{
                  flex: 1,
                  height: 40,
                  borderRadius: 2,
                  textTransform: "none",
                  color: "#666",
                  borderColor: "rgba(123,97,255,0.25)",
                }}
              >
                View Courses
              </Button>
              <Button
                variant="outlined"
                onClick={handleExploreTopics}
                sx={{
                  flex: 1,
                  height: 40,
                  borderRadius: 2,
                  textTransform: "none",
                  color: "#666",
                  borderColor: "rgba(123,97,255,0.25)",
                }}
              >
                Explore Topics
              </Button>
            </Stack>

            <Typography sx={{ mt: 3, mb: 1, fontSize: "0.95rem", fontWeight: 700, color: "#222" }}>
              Your Courses
            </Typography>

            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                bgcolor: "#fff",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardActionArea onClick={handleContinueLearning} sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MenuBook sx={{ fontSize: 18, color: "#7B61FF" }} />
                      <Typography sx={{ fontSize: "0.98rem", fontWeight: 700, color: "#222" }}>
                        {normalizedSelectedTopic}
                      </Typography>
                    </Stack>
                    <IconButton size="small" sx={{ color: "#7B61FF" }}>
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      bgcolor: "rgba(123,97,255,0.12)",
                      mb: 0.9,
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background: "linear-gradient(90deg, #7B61FF 0%, #9C6BFF 100%)",
                      },
                    }}
                  />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.82rem", color: "#666" }}>
                      {completedCount} / {totalCount} Lessons
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: "#666", fontWeight: 600 }}>
                      {progressPercent}% Complete
                    </Typography>
                  </Stack>
                </Box>
              </CardActionArea>
            </Card>
          </Box>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={400}>
      <Box
        sx={{
          minHeight: "100vh",
          background: isDark
            ? `linear-gradient(135deg, ${alpha(
                theme.palette.background.paper,
                0.85
              )} 0%, ${theme.palette.background.default} 100%)`
            : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Full-screen content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "100%",
            margin: 0,
          }}
        >
          <Header
            hasTopics={hasTopics}
            selectedTopic={selectedTopic}
            subtopicName={subtopicName}
            isReady={isReady}
            learningInsights={learningInsights}
            colorPalette={colorPalette}
            isMobile={isMobile}
            onOpenSidebar={onOpenSidebar}
            isRecalledTopic={isRecalledTopic}
          />

          <Container
            maxWidth={false}
            sx={{
              flex: 1,
              py: { xs: 3, md: 4 },
              px: { xs: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                maxWidth: { md: "800px" },
                margin: "0 auto",
              }}
            >
              {/* Topic Selector at the top */}
              <TopicSelector
                topics={topics}
                selectedTopic={selectedTopic}
                onTopicSelect={onTopicSelect}
              />

              {/* Progress Card */}
              <ProgressCard
                selectedTopic={selectedTopic}
                learningInsights={learningInsights}
                colorPalette={colorPalette}
              />

              {/* Continue where you left off */}
              {selectedTopic && mostRecentIncompleteSubtopic && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    mb: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack
                    spacing={1.5}
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Continue where you left off
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        In progress: {inProgressTopicName || selectedTopic}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ fontWeight: 600, mt: 0.5 }}
                      >
                        Next up: {mostRecentIncompleteSubtopic.name}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onSubtopicSelect?.(mostRecentIncompleteSubtopic)
                      }
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 700,
                        px: 3,
                        background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
                      }}
                    >
                      Continue
                    </Button>
                  </Stack>
                </Paper>
              )}

              {/* Quick Actions */}
              <QuickActions
                selectedTopic={selectedTopic}
                learningInsights={learningInsights}
                suggestions={suggestions}
                activeSuggestion={activeSuggestion}
                onSetActiveSuggestion={setActiveSuggestion}
                onQuickAction={handleQuickAction}
                colorPalette={colorPalette}
              />

              {/* Main CTA Button */}
              {isReady && !learningInsights.isTopicCompleted && (
                <Box sx={{ mt: 3 }}>
                  <MainCTA
                    subtopicName={subtopicName}
                    onGenerateContent={onGenerateContent}
                    colorPalette={colorPalette}
                  />
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </Fade>
  );
};

// Main CTA Component
const MainCTA = ({ subtopicName, onGenerateContent, colorPalette }) => {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={onGenerateContent}
      startIcon={<AutoAwesome />}
      sx={{
        width: "100%",
        py: { xs: 1.5, md: 2 },
        borderRadius: 2,
        fontSize: { xs: "1rem", md: "1.1rem" },
        fontWeight: "700",
        background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
        boxShadow: `0 8px 24px ${colorPalette[300]}`,
        "&:hover": {
          transform: { md: "translateY(-2px)" },
          boxShadow: `0 12px 32px ${colorPalette[400]}`,
        },
        transition: "all 0.3s ease",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <SmartToy sx={{ fontSize: { xs: 20, md: 24 } }} />
        Start Learning {subtopicName}
      </Box>
    </Button>
  );
};

export default WelcomeState;
