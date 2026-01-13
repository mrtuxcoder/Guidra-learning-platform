import React, { useState, useMemo, useEffect } from "react";
import { Box, Container, Fade } from "@mui/material";
import Header from "./Header";
import TopicSelector from "./TopicSelector";
import ProgressCard from "./ProgressCard";
import QuickActions from "./QuickActions";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import MobileMenuButton from "./MobileMenuButton";
import {
  getRecentlyAccessedSubtopics,
  getHighPrioritySubtopics,
  getRecommendedTopics,
  calculateLearningInsights,
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
  const [activeSuggestion, setActiveSuggestion] = useState("continue");
  const [isLoading, setIsLoading] = useState(true);

  // Add loading delay to prevent flash of wrong content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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

  // Check if we have any topics at all
  const hasTopics = Array.isArray(topics) && topics.length > 0;
  const hasSelectedTopic = !!selectedTopic;

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
  if (isLoading) {
    return <LoadingState isDesktop={false} colorPalette={colorPalette} />;
  }

  if (!hasTopics) {
    return (
      <Fade in={true} timeout={400}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MobileMenuButton
            onOpenSidebar={onOpenSidebar}
            colorPalette={colorPalette}
          />
          <Header
            hasTopics={hasTopics}
            selectedTopic={selectedTopic}
            subtopicName={subtopicName}
            isReady={isReady}
            learningInsights={learningInsights}
            colorPalette={colorPalette}
          />
          <EmptyState colorPalette={colorPalette} />
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={400}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MobileMenuButton
          onOpenSidebar={onOpenSidebar}
          colorPalette={colorPalette}
        />

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
