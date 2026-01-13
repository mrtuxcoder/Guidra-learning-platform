import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Button,
} from "@mui/material";
import { Menu, Refresh } from "@mui/icons-material";
import { getProfile } from "../api";
import {
  getSubtopics,
  teachSubtopic,
  regenerateContent,
  updateSubtopicProgress,
  incrementGenerationCount,
  getGenerationCount,
} from "../api/learning";
import LearningSidebar from "../components/learn/LearningSidebar/index";
import LearningHeader from "../components/learn/LearningHeader/index";
import LearningContent from "../components/learn/LearningContent/index";
import WelcomeState from "../components/learn/WelcomeState/index";
import LoadingState from "../components/learn/LoadingState/index";

// Consistent color palette
const purplePalette = {
  50: "#FAF7FE",
  100: "#F3E8FF",
  200: "#E9D5FF",
  300: "#D8B4FE",
  400: "#C084FC",
  500: "#A855F7",
  600: "#9333EA",
  700: "#7C3AED",
  800: "#6B21A8",
  900: "#581C87",
};

export default function Learning() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [originalSubtopics, setOriginalSubtopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState("");
  const [contentError, setContentError] = useState("");
  const [updatingSubtopic, setUpdatingSubtopic] = useState(null);
  const [contentInfo, setContentInfo] = useState({ cached: false, version: 1 });
  const [generationCounts, setGenerationCounts] = useState({});
  const [contentCache, setContentCache] = useState({});
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const MAX_GENERATIONS = 3;

  // Function to reorder topics - incomplete first
  const getOrderedTopics = useCallback((topicsArray) => {
    if (!Array.isArray(topicsArray)) return [];

    const incompleteTopics = [];
    const completedTopics = [];

    topicsArray.forEach((topic) => {
      if (topic && topic.subtopics) {
        const hasIncomplete = topic.subtopics.some(
          (sub) => sub && !sub.completed
        );
        if (hasIncomplete) {
          incompleteTopics.push(topic);
        } else {
          completedTopics.push(topic);
        }
      } else {
        // If no subtopics info, treat as incomplete
        incompleteTopics.push(topic);
      }
    });

    return [...incompleteTopics, ...completedTopics];
  }, []);

  // Memoized fetch functions
  const fetchUserTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getProfile();
      const orderedTopics = getOrderedTopics(data.user.progress || []);
      setTopics(orderedTopics);

      if (orderedTopics.length > 0) {
        // Auto-select first incomplete topic
        const firstIncompleteTopic =
          orderedTopics.find((topic) =>
            topic.subtopics?.some((sub) => !sub.completed)
          ) || orderedTopics[0];

        if (firstIncompleteTopic) {
          setSelectedTopic(
            firstIncompleteTopic.topic || firstIncompleteTopic.name
          );
          await fetchSubtopics(
            firstIncompleteTopic.topic || firstIncompleteTopic.name
          );
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load topics";
      setError(errorMsg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }, [getOrderedTopics]);

  const fetchSubtopics = useCallback(
    async (topic) => {
      try {
        setLoading(true);
        setError("");
        setSelectedTopic(topic);
        const { data } = await getSubtopics(topic);

        // Keep original order for navigation
        const originalSubs = data.subTopics || [];
        setOriginalSubtopics(originalSubs);

        // Create ordered version for display only
        const orderedSubtopics = getOrderedSubtopics(originalSubs);
        setSubtopics(orderedSubtopics);

        fetchGenerationCounts(originalSubs, topic);

        if (isMobile) {
          setMobileDrawerOpen(false);
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to load subtopics";
        setError(errorMsg);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    },
    [isMobile]
  );

  // Function to reorder subtopics - incomplete first
  const getOrderedSubtopics = useCallback((subtopicsArray) => {
    if (!Array.isArray(subtopicsArray)) return [];

    const incompleteSubtopics = subtopicsArray.filter(
      (sub) => sub && !sub.completed
    );
    const completedSubtopics = subtopicsArray.filter(
      (sub) => sub && sub.completed
    );

    return [...incompleteSubtopics, ...completedSubtopics];
  }, []);

  const fetchGenerationCounts = useCallback(async (subtopics, topic) => {
    try {
      const counts = {};
      for (const subtopic of subtopics) {
        try {
          const { data } = await getGenerationCount(topic, subtopic.name);
          counts[subtopic.name] = data.data.generationCount;
        } catch (err) {
          counts[subtopic.name] = 0;
        }
      }
      setGenerationCounts(counts);
    } catch (err) {
      console.error("Error fetching generation counts:", err);
    }
  }, []);

  const handleIncrementGenerationCount = useCallback(
    async (subtopicName) => {
      try {
        await incrementGenerationCount({
          topic: selectedTopic,
          subtopic: subtopicName,
        });

        setGenerationCounts((prev) => ({
          ...prev,
          [subtopicName]: Math.min(
            (prev[subtopicName] || 0) + 1,
            MAX_GENERATIONS
          ),
        }));
      } catch (err) {
        console.error("Error incrementing generation count:", err);
      }
    },
    [selectedTopic, MAX_GENERATIONS]
  );

  const handleGenerateContent = useCallback(
    async (subtopic = selectedSubtopic) => {
      if (!subtopic || !selectedTopic) return;

      try {
        setContentLoading(true);
        setContentError("");

        const cacheKey = `${selectedTopic}-${subtopic.name}`;
        if (contentCache[cacheKey]) {
          setContent(contentCache[cacheKey].content);
          setContentInfo(contentCache[cacheKey].info);
          setContentLoading(false);
          return;
        }

        const { data } = await teachSubtopic({
          topic: selectedTopic,
          subtopic: subtopic.name,
        });

        if (!data.cached) {
          await handleIncrementGenerationCount(subtopic.name);
        }

        setContent(data.data);
        setContentInfo({
          cached: data.cached || false,
          version: data.version || 1,
          source: data.cached ? "cache" : "ai",
        });

        setContentCache((prev) => ({
          ...prev,
          [cacheKey]: {
            content: data.data,
            info: {
              cached: data.cached || false,
              version: data.version || 1,
              source: data.cached ? "cache" : "ai",
            },
          },
        }));
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to generate content";
        setContentError(errorMessage);
        setShowError(true);
      } finally {
        setContentLoading(false);
      }
    },
    [
      selectedTopic,
      selectedSubtopic,
      contentCache,
      handleIncrementGenerationCount,
    ]
  );

  const handleSelectSubtopic = useCallback(
    async (subtopic) => {
      setSelectedSubtopic(subtopic);
      setContentError("");

      const cacheKey = `${selectedTopic}-${subtopic.name}`;
      if (contentCache[cacheKey]) {
        setContent(contentCache[cacheKey].content);
        setContentInfo(contentCache[cacheKey].info);
      } else {
        await handleGenerateContent(subtopic);
      }
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    },
    [selectedTopic, contentCache, handleGenerateContent, isMobile]
  );

  const getRemainingGenerations = useCallback(
    (subtopicName) => {
      const used = generationCounts[subtopicName] || 0;
      return Math.max(0, MAX_GENERATIONS - used);
    },
    [generationCounts, MAX_GENERATIONS]
  );

  const canGenerate = useCallback(
    (subtopicName) => {
      return getRemainingGenerations(subtopicName) > 0;
    },
    [getRemainingGenerations]
  );

  const handleRegenerateContent = useCallback(async () => {
    if (!selectedSubtopic || !selectedTopic) return;

    const subtopicName = selectedSubtopic.name;

    if (!canGenerate(subtopicName)) {
      setContentError(`Generation limit reached (${MAX_GENERATIONS} times)`);
      setShowError(true);
      return;
    }

    try {
      setContentLoading(true);
      setContentError("");
      const { data } = await regenerateContent({
        topic: selectedTopic,
        subtopic: subtopicName,
      });

      await handleIncrementGenerationCount(subtopicName);

      setContent(data.data);
      setContentInfo({
        cached: false,
        version: data.version || 1,
        source: "ai",
      });

      const cacheKey = `${selectedTopic}-${subtopicName}`;
      setContentCache((prev) => ({
        ...prev,
        [cacheKey]: {
          content: data.data,
          info: {
            cached: false,
            version: data.version || 1,
            source: "ai",
          },
        },
      }));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to regenerate content";
      setContentError(errorMessage);
      setShowError(true);
    } finally {
      setContentLoading(false);
    }
  }, [
    selectedTopic,
    selectedSubtopic,
    canGenerate,
    handleIncrementGenerationCount,
  ]);

  const handleUpdateUnderstanding = useCallback(
    async (subtopic, newUnderstanding) => {
      const previousUnderstanding = subtopic.understandingLevel;

      try {
        setUpdatingSubtopic(subtopic.name);
        setError("");

        const updatedSubtopic = {
          ...subtopic,
          understandingLevel: newUnderstanding,
        };

        // Update both arrays
        setSubtopics((prev) =>
          prev.map((sub) =>
            sub.name === subtopic.name ? updatedSubtopic : sub
          )
        );
        setOriginalSubtopics((prev) =>
          prev.map((sub) =>
            sub.name === subtopic.name ? updatedSubtopic : sub
          )
        );

        if (selectedSubtopic?.name === subtopic.name) {
          setSelectedSubtopic(updatedSubtopic);
        }

        await updateSubtopicProgress({
          topic: selectedTopic,
          subtopicName: subtopic.name,
          completed: subtopic.completed,
          understandingLevel: newUnderstanding,
        });
      } catch (err) {
        // Revert both arrays on error
        setSubtopics((prev) =>
          prev.map((sub) =>
            sub.name === subtopic.name
              ? { ...sub, understandingLevel: previousUnderstanding }
              : sub
          )
        );
        setOriginalSubtopics((prev) =>
          prev.map((sub) =>
            sub.name === subtopic.name
              ? { ...sub, understandingLevel: previousUnderstanding }
              : sub
          )
        );

        if (selectedSubtopic?.name === subtopic.name) {
          setSelectedSubtopic((prev) => ({
            ...prev,
            understandingLevel: previousUnderstanding,
          }));
        }

        setError("Failed to update understanding");
        setShowError(true);
      } finally {
        setUpdatingSubtopic(null);
      }
    },
    [selectedTopic, selectedSubtopic]
  );

  const handleCompleteSubtopic = useCallback(
    async (subtopic) => {
      if (!subtopic.understandingLevel || subtopic.understandingLevel < 1) {
        setContentError("Please rate your understanding first");
        setShowError(true);
        return;
      }

      try {
        setUpdatingSubtopic(subtopic.name);
        setError("");

        await updateSubtopicProgress({
          topic: selectedTopic,
          subtopicName: subtopic.name,
          completed: true,
          understandingLevel: subtopic.understandingLevel,
        });

        // Create the updated subtopic object
        const updatedSubtopic = { ...subtopic, completed: true };

        // Update ORIGINAL subtopics array
        setOriginalSubtopics((prev) =>
          prev.map((sub) =>
            sub.name === subtopic.name ? updatedSubtopic : sub
          )
        );

        // Update SORTED subtopics array and re-sort it
        setSubtopics((prev) => {
          const updatedArray = prev.map((sub) =>
            sub.name === subtopic.name ? updatedSubtopic : sub
          );
          return getOrderedSubtopics(updatedArray);
        });

        // Update selected subtopic if it's the current one
        if (selectedSubtopic?.name === subtopic.name) {
          setSelectedSubtopic(updatedSubtopic);
        }
      } catch (err) {
        setError("Failed to complete subtopic");
        setShowError(true);
      } finally {
        setUpdatingSubtopic(null);
      }
    },
    [selectedTopic, selectedSubtopic, getOrderedSubtopics]
  );

  const calculateProgress = useCallback(() => {
    if (!subtopics.length) return 0;
    const completed = subtopics.filter((sub) => sub.completed).length;
    return (completed / subtopics.length) * 100;
  }, [subtopics]);

  const handleCloseError = useCallback(() => {
    setShowError(false);
    setError("");
    setContentError("");
  }, []);

  const handleRetryContent = useCallback(() => {
    if (selectedSubtopic) {
      handleGenerateContent(selectedSubtopic);
    }
  }, [selectedSubtopic, handleGenerateContent]);

  // Effects
  useEffect(() => {
    fetchUserTopics();
  }, [fetchUserTopics]);

  useEffect(() => {
    if (selectedSubtopic) {
      setContentError("");
      setShowError(false);
    }
  }, [selectedSubtopic]);

  const currentError = contentError || error;
  const handleNavigateSubtopic = useCallback(
    (subtopic) => {
      handleSelectSubtopic(subtopic);
    },
    [handleSelectSubtopic]
  );

  const handleNavigateToFirstIncomplete = useCallback(() => {
    const firstIncomplete = subtopics.find((sub) => sub && !sub.completed);
    if (firstIncomplete) {
      handleSelectSubtopic(firstIncomplete);
    }
  }, [subtopics, handleSelectSubtopic]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "white",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "100%",
              maxWidth: 300,
              height: "100vh",
              overflow: "hidden",
              background: "white",
            },
          }}
        >
          <LearningSidebar
            topics={topics}
            subtopics={subtopics}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
            updatingSubtopic={updatingSubtopic}
            contentCache={contentCache}
            generationCounts={generationCounts}
            onTopicSelect={fetchSubtopics}
            onSubtopicSelect={handleSelectSubtopic}
            onUpdateUnderstanding={handleUpdateUnderstanding}
            progress={calculateProgress()}
            colorPalette={purplePalette}
          />
        </Drawer>
      ) : (
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            borderRight: "1px solid rgba(126, 87, 194, 0.1)",
          }}
        >
          <LearningSidebar
            topics={topics}
            subtopics={subtopics}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
            updatingSubtopic={updatingSubtopic}
            contentCache={contentCache}
            generationCounts={generationCounts}
            onTopicSelect={fetchSubtopics}
            onSubtopicSelect={handleSelectSubtopic}
            onUpdateUnderstanding={handleUpdateUnderstanding}
            progress={calculateProgress()}
            colorPalette={purplePalette}
          />
        </Box>
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
          pb: isMobile ? "0px" : 0,
        }}
      >
        {/* Header */}
        <LearningHeader
          selectedTopic={selectedTopic}
          selectedSubtopic={selectedSubtopic}
          subtopics={originalSubtopics}
          displaySubtopics={subtopics}
          updatingSubtopic={updatingSubtopic}
          contentInfo={contentInfo}
          remainingGenerations={
            selectedSubtopic
              ? getRemainingGenerations(selectedSubtopic.name)
              : 0
          }
          maxGenerations={MAX_GENERATIONS}
          contentLoading={contentLoading}
          onRegenerateContent={handleRegenerateContent}
          onCompleteSubtopic={handleCompleteSubtopic}
          onUpdateUnderstanding={handleUpdateUnderstanding}
          onNavigateSubtopic={handleNavigateSubtopic}
          onOpenSidebar={() => setMobileDrawerOpen(true)}
          colorPalette={purplePalette}
        />

        {/* Error Alert */}
        {showError && currentError && (
          <Box
            sx={{
              flexShrink: 0,
              px: { xs: 1, md: 1.5 },
              pt: 0.5,
            }}
          >
            <Alert
              severity="error"
              sx={{
                borderRadius: 1,
                fontSize: "0.875rem",
                py: 0.5,
              }}
              onClose={handleCloseError}
              action={
                contentError &&
                selectedSubtopic && (
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={handleRetryContent}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      minWidth: "auto",
                      px: 1,
                    }}
                  >
                    Retry
                  </Button>
                )
              }
            >
              {currentError}
            </Alert>
          </Box>
        )}

        {/* Content Area - NO PADDING */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
          }}
        >
          {contentLoading ? (
            <LoadingState
              isContentLoading={true}
              source={contentInfo?.source}
              colorPalette={purplePalette}
            />
          ) : content && selectedSubtopic && !contentError ? (
            <LearningContent
              content={content}
              contentInfo={contentInfo}
              selectedTopic={selectedTopic}
              selectedSubtopic={selectedSubtopic}
              contentLoading={contentLoading}
              contentError={contentError}
              onRetry={handleRetryContent}
              colorPalette={purplePalette}
            />
          ) : (
            <WelcomeState
              subtopicName={selectedSubtopic?.name}
              isReady={!!selectedSubtopic}
              onGenerateContent={() => handleGenerateContent(selectedSubtopic)}
              subtopics={subtopics}
              topics={topics}
              selectedTopic={selectedTopic}
              onNavigateToFirstIncomplete={handleNavigateToFirstIncomplete}
              onTopicSelect={fetchSubtopics}
              onSubtopicSelect={handleSelectSubtopic}
              onOpenSidebar={() => setMobileDrawerOpen(true)}
              progress={calculateProgress()}
              generationCounts={generationCounts}
              contentCache={contentCache}
              colorPalette={purplePalette}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
