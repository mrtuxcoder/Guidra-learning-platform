import React, { useMemo } from "react";
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
import { ArrowForward, MenuBook, School, AutoAwesome, CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import TopicSelector from "./TopicSelector";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import {
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

  // Memoized calculations
  const learningInsights = useMemo(() => {
    return calculateLearningInsights(subtopics);
  }, [subtopics]);

  const mostRecentIncompleteSubtopic = useMemo(() => {
    return (
      getMostRecentIncompleteSubtopic(subtopics) ||
      learningInsights.firstIncompleteSubtopic
    );
  }, [subtopics, learningInsights.firstIncompleteSubtopic]);

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
              bgcolor: "background.default",
              pb: "80px",
            }}
          >
            <Box
              sx={{
                minHeight: "128px",
                px: 2,
                pt: 2.5,
                pb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
                <School sx={{ fontSize: 54, color: "primary.main", mb: 1.2 }} />
                <Typography sx={{ fontSize: "22px", fontWeight: 700, color: "text.primary", mb: 0.8 }}>
                  Start Learning
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "text.secondary", mb: 2.4, maxWidth: 280 }}>
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
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
            minHeight: "100%",
            bgcolor: "background.default",
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
          <EmptyState />
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
            bgcolor: "background.default",
            pb: "80px",
          }}
        >
          <Box
            sx={{
              minHeight: "128px",
              px: 2,
              pt: 2.5,
              pb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                mb: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.4 }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "text.primary" }}>
                  {normalizedSelectedTopic}
                </Typography>
                <Chip
                  label={`${completedCount} / ${totalCount}`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: "primary.main",
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
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  mb: 1,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  },
                }}
              />

              <Typography sx={{ color: "text.secondary", fontSize: "0.88rem", mb: 1.6, fontWeight: 500 }}>
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: "none",
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
                  color: "text.secondary",
                  borderColor: alpha(theme.palette.primary.main, 0.25),
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
                  color: "text.secondary",
                  borderColor: alpha(theme.palette.primary.main, 0.25),
                }}
              >
                Explore Topics
              </Button>
            </Stack>

            <Typography sx={{ mt: 3, mb: 1, fontSize: "0.95rem", fontWeight: 700, color: "text.primary" }}>
              Your Courses
            </Typography>

            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardActionArea onClick={handleContinueLearning} sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MenuBook sx={{ fontSize: 18, color: "primary.main" }} />
                      <Typography sx={{ fontSize: "0.98rem", fontWeight: 700, color: "text.primary" }}>
                        {normalizedSelectedTopic}
                      </Typography>
                    </Stack>
                    <IconButton size="small" sx={{ color: "primary.main" }}>
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      mb: 0.9,
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      },
                    }}
                  />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                      {completedCount} / {totalCount} Lessons
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: "text.secondary", fontWeight: 600 }}>
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
          minHeight: "100%",
          bgcolor: "background.default",
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

              {/* Course Completed State */}
              {selectedTopic && learningInsights.isTopicCompleted && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: "10px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textAlign: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "rgba(16, 185, 129, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <CheckCircleOutline sx={{ fontSize: 32, color: "success.main" }} />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", mb: 0.75 }}>
                    All Lessons Completed!
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 440, mx: "auto", mb: 3 }}>
                    You have mastered all {learningInsights.totalSubtopics} lessons in {selectedTopic}. Select another course from the sidebar or review past lessons.
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => onNavigateToFirstIncomplete ? onNavigateToFirstIncomplete() : onTopicSelect(selectedTopic)}
                    sx={{
                      borderRadius: "6px",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                    }}
                  >
                    Review Course Lessons
                  </Button>
                </Paper>
              )}

              {/* Active Topic - Consolidated Focused Next Lesson Card */}
              {selectedTopic && !learningInsights.isTopicCompleted && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>
                        Current Course
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.15rem", color: "text.primary", mt: 0.25 }}>
                        {selectedTopic}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${learningInsights.completedSubtopics} of ${learningInsights.totalSubtopics} completed (${Math.round(learningInsights.progressPercentage)}%)`}
                      size="small"
                      sx={{
                        borderRadius: "4px",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                        color: "text.secondary",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={learningInsights.progressPercentage}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                      mb: 2.5,
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        bgcolor: "primary.main",
                      },
                    }}
                  />

                  {mostRecentIncompleteSubtopic && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        pt: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.25 }}>
                          Next Lesson Up
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", fontSize: "1rem" }}>
                          {mostRecentIncompleteSubtopic.name}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onSubtopicSelect?.(mostRecentIncompleteSubtopic)}
                        endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "6px",
                          px: 2.5,
                          height: 38,
                          fontSize: "0.88rem",
                        }}
                      >
                        Continue Lesson
                      </Button>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Main CTA Button when a subtopic is explicitly selected but content is ungenerated */}
              {isReady && !learningInsights.isTopicCompleted && (
                <Box sx={{ mt: 2.5 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onGenerateContent}
                    startIcon={<AutoAwesome />}
                    sx={{
                      width: "100%",
                      py: 1.5,
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      textTransform: "none",
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    Start Learning: {subtopicName}
                  </Button>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </Fade>
  );
};

export default WelcomeState;
