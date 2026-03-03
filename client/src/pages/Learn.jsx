import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Menu, Refresh } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  getSubtopics,
  teachSubtopic,
  regenerateContent,
  updateSubtopicProgress,
  incrementGenerationCount,
  getGenerationCounts,
  getCachedSubtopics,
  getFullContentByVersion,
} from "../api/learning";
import LearningSidebar from "../components/learn/LearningSidebar/index";
import LearningHeader from "../components/learn/LearningHeader/index";
import LearningContent from "../components/learn/LearningContent/index";
import QuizSection from "../components/learn/LearningContent/QuizSection";
import WelcomeState from "../components/learn/WelcomeState/index";
import LoadingState from "../components/learn/LoadingState/index";
import TeachingStyleSelector from "../components/learn/TeachingStyleSelector";
import { useDailyRegen } from "../contexts/DailyRegenContext";

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
  const [cachedSubtopics, setCachedSubtopics] = useState([]);
  
  // Use shared user context
  const { user } = useUser();
  
  // Use daily regen context
  const { dailyRegenRemaining, dailyRegenResetAt, updateDailyRegen } = useDailyRegen();
  
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [pendingCompleteSubtopic, setPendingCompleteSubtopic] = useState(null);
  const [teachingStyleSelectorOpen, setTeachingStyleSelectorOpen] = useState(false);
  const [selectedTeachingStyle, setSelectedTeachingStyle] = useState("default");
  const [pendingAutoOpen, setPendingAutoOpen] = useState(null);
  
  // Ref to store the version dialog opener from LearningContent
  const versionDialogOpenerRef = useRef(null);
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const MAX_GENERATIONS = 3;

  // Register the version dialog opener from LearningContent
  const handleRegisterVersionDialogOpener = useCallback((openerFn) => {
    versionDialogOpenerRef.current = openerFn;
  }, []);

  // Create a stable function that uses the ref to call the dialog opener
  const handleOpenVersionDialog = useCallback(() => {
    if (versionDialogOpenerRef.current) {
      versionDialogOpenerRef.current(true);
    }
  }, []);

  // Function to filter and reorder topics - incomplete only
  const getOrderedTopics = useCallback((topicsArray) => {
    if (!Array.isArray(topicsArray)) return [];

    const incompleteTopics = [];

    topicsArray.forEach((topic) => {
      const subtopicList = topic?.subTopics || topic?.subtopics || [];
      if (subtopicList.length > 0) {
        const hasIncomplete = subtopicList.some(
          (sub) => sub && !sub.completed
        );
        if (hasIncomplete) {
          incompleteTopics.push(topic);
        }
      } else if (topic?.completed === false) {
        // Use explicit topic-level completion only when subtopics are unavailable
        incompleteTopics.push(topic);
      }
    });

    return incompleteTopics;
  }, []);

  const getCompletedTopics = useCallback((topicsArray) => {
    if (!Array.isArray(topicsArray)) return [];

    return topicsArray.filter((topic) => {
      const subtopicList = topic?.subTopics || topic?.subtopics || [];
      if (subtopicList.length === 0) return topic?.completed === true;
      return subtopicList.every((sub) => sub && sub.completed);
    });
  }, []);

  const getVisibleTopics = useCallback(
    (topicsArray, recallTopicName) => {
      const incompleteTopics = getOrderedTopics(topicsArray);

      if (!recallTopicName) {
        return incompleteTopics;
      }

      const completedTopics = getCompletedTopics(topicsArray);
      if (completedTopics.length === 0) {
        return incompleteTopics;
      }

      const recalledTopic = completedTopics.find(
        (topic) => (topic?.topic || topic?.name) === recallTopicName
      );

      if (!recalledTopic) {
        return completedTopics;
      }

      return [
        recalledTopic,
        ...completedTopics.filter(
          (topic) => (topic?.topic || topic?.name) !== recallTopicName
        ),
      ];
    },
    [getOrderedTopics, getCompletedTopics]
  );

  const preferredTopic = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("topic");
  }, [location.search]);

  const generatedTopicState = useMemo(() => {
    if (!location?.state) return null;

    const topicFromState =
      location.state.customTopic || location.state.topic || preferredTopic;
    const subtopicsFromState = Array.isArray(location.state.subtopics)
      ? location.state.subtopics
      : [];

    if (!topicFromState || subtopicsFromState.length === 0) {
      return null;
    }

    return {
      topic: topicFromState,
      subtopics: subtopicsFromState,
    };
  }, [location.state, preferredTopic]);

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

        return orderedSubtopics;
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to load subtopics";
        setError(errorMsg);
        setShowError(true);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isMobile]
  );

  const getStartingSubtopic = useCallback((subtopicsArray, options = {}) => {
    const { startFromBeginning = false } = options;

    if (!Array.isArray(subtopicsArray) || subtopicsArray.length === 0) {
      return null;
    }

    if (startFromBeginning) {
      return subtopicsArray[0];
    }

    return subtopicsArray.find((sub) => sub && !sub.completed) || subtopicsArray[0];
  }, []);

  // Memoized fetch functions
  const fetchUserTopics = useCallback(
    async (preferredTopicName) => {
    try {
      setLoading(true);
      setError("");
      
      // Use user data from shared context instead of fetching
      if (!user) {
        throw new Error("User data not available");
      }
      
      const progressTopics = user.progress || [];
      const dailyUsed = Number(user.regenDailyCount || 0);
      updateDailyRegen(Math.max(0, 6 - dailyUsed), user.regenDailyResetAt || null);
      const orderedTopics = getOrderedTopics(progressTopics);
      const visibleTopics = getVisibleTopics(progressTopics, preferredTopicName);

      if (preferredTopicName) {
        const recalledTopic = progressTopics.find(
          (topic) =>
            (topic?.topic || topic?.name) === preferredTopicName
        );

        if (recalledTopic) {
          setTopics(visibleTopics);
        } else {
          setTopics(visibleTopics);
        }
      } else {
        setTopics(visibleTopics);
      }

      if (preferredTopicName) {
        setSelectedTopic(preferredTopicName);
        const orderedSubtopics = await fetchSubtopics(preferredTopicName);
        const startingSubtopic = getStartingSubtopic(orderedSubtopics, {
          startFromBeginning: true,
        });
        if (startingSubtopic) {
          setPendingAutoOpen({
            topic: preferredTopicName,
            subtopic: startingSubtopic,
          });
        }
        return;
      }

      if (orderedTopics.length > 0) {
        // Auto-select first incomplete topic
        const firstIncompleteTopic = orderedTopics[0];

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
  }, [
    user,
    getOrderedTopics,
    getVisibleTopics,
    fetchSubtopics,
    updateDailyRegen,
    getStartingSubtopic,
  ]);

  const handleTopicSelect = useCallback(
    async (topicName) => {
      const orderedSubtopics = await fetchSubtopics(topicName);

      const startingSubtopic = getStartingSubtopic(orderedSubtopics, {
        startFromBeginning: true,
      });
      if (startingSubtopic) {
        setPendingAutoOpen({
          topic: topicName,
          subtopic: startingSubtopic,
        });
      }
    },
    [fetchSubtopics, getStartingSubtopic]
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
      const { data } = await getGenerationCounts(topic);
      const apiCounts = data?.data?.counts || {};
      const mergedCounts = (subtopics || []).reduce((acc, subtopic) => {
        if (subtopic?.name) {
          acc[subtopic.name] = apiCounts[subtopic.name] || 0;
        }
        return acc;
      }, {});

      setGenerationCounts(mergedCounts);
    } catch (err) {
      console.error("Error fetching generation counts:", err);
    }
  }, []);

  const handleIncrementGenerationCount = useCallback(
    async (subtopicName, topicOverride) => {
      const effectiveTopic = topicOverride || selectedTopic;
      try {
        await incrementGenerationCount({
          topic: effectiveTopic,
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
    async (subtopic = selectedSubtopic, topicOverride) => {
      const effectiveTopic = topicOverride || selectedTopic;
      if (!subtopic || !effectiveTopic) return;

      try {
        setContentLoading(true);
        setContentError("");
        const cacheKey = `${effectiveTopic}-${subtopic.name}`;
        if (contentCache[cacheKey]) {
          setContent(contentCache[cacheKey].content);
          setContentInfo(contentCache[cacheKey].info);
          setContentLoading(false);
          return;
        }

        const { data } = await teachSubtopic({
          topic: effectiveTopic,
          subtopic: subtopic.name,
        });

        if (!data.cached) {
          await handleIncrementGenerationCount(subtopic.name, effectiveTopic);
          // Update daily regen count for initial generation
          if (typeof data.dailyRemaining === "number") {
            updateDailyRegen(data.dailyRemaining, data.dailyResetAt);
          } else {
            updateDailyRegen();
          }
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
        // Update daily regen count if returned in error response (e.g., when limit reached)
        if (typeof err.response?.data?.dailyRemaining === "number") {
          updateDailyRegen(
            err.response.data.dailyRemaining,
            err.response.data.dailyResetAt || null
          );
        }
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
      updateDailyRegen,
    ]
  );

  const handleSelectSubtopic = useCallback(
    async (subtopic, topicOverride) => {
      const effectiveTopic = topicOverride || selectedTopic;
      const cacheKey = `${effectiveTopic}-${subtopic.name}`;
      const cachedSet = new Set(
        cachedSubtopics.map((name) => String(name).toLowerCase())
      );
      const normalizedName = String(subtopic?.name || "").toLowerCase();

      if (
        dailyRegenRemaining <= 0 &&
        !contentCache[cacheKey] &&
        !cachedSet.has(normalizedName)
      ) {
        setContentError(
          "Daily regeneration limit reached. Cached subtopics only."
        );
        setShowError(true);
        return;
      }

      if (topicOverride) {
        setSelectedTopic(topicOverride);
      }
      setSelectedSubtopic(subtopic);
      setContentError("");

      if (contentCache[cacheKey]) {
        setContent(contentCache[cacheKey].content);
        setContentInfo(contentCache[cacheKey].info);
      } else {
        await handleGenerateContent(subtopic, effectiveTopic);
      }
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    },
    [
      selectedTopic,
      contentCache,
      handleGenerateContent,
      isMobile,
      dailyRegenRemaining,
      cachedSubtopics,
    ]
  );

  const getRemainingGenerations = useCallback(
    (subtopicName) => {
      const used = generationCounts[subtopicName] || 0;
      return Math.max(0, Math.min(MAX_GENERATIONS - used, dailyRegenRemaining));
    },
    [generationCounts, MAX_GENERATIONS, dailyRegenRemaining]
  );

  const canGenerate = useCallback(
    (subtopicName) => {
      return getRemainingGenerations(subtopicName) > 0;
    },
    [getRemainingGenerations]
  );

  const cachedSubtopicSet = useMemo(() => {
    return new Set(cachedSubtopics.map((name) => name.toLowerCase()));
  }, [cachedSubtopics]);

  const displayedSubtopics = useMemo(() => {
    if (dailyRegenRemaining > 0) {
      return subtopics;
    }

    return subtopics.filter((sub) =>
      cachedSubtopicSet.has(sub?.name?.toLowerCase())
    );
  }, [dailyRegenRemaining, subtopics, cachedSubtopicSet]);

  const visibleTopics = useMemo(() => {
    return getVisibleTopics(topics, preferredTopic);
  }, [topics, preferredTopic, getVisibleTopics]);

  useEffect(() => {
    let isActive = true;

    const fetchCached = async () => {
      if (!selectedTopic || dailyRegenRemaining > 0) {
        setCachedSubtopics([]);
        return;
      }

      try {
        const { data } = await getCachedSubtopics(selectedTopic);
        const serverSubtopics = data?.subtopics || data?.data?.subtopics || [];
        if (isActive) {
          setCachedSubtopics(serverSubtopics);
        }
      } catch (err) {
        console.error("Failed to fetch cached subtopics:", err);
        if (isActive) {
          setCachedSubtopics([]);
        }
      }
    };

    fetchCached();

    return () => {
      isActive = false;
    };
  }, [selectedTopic, dailyRegenRemaining]);

  const handleSelectFullVersion = useCallback(
    async (versionNumber) => {
      if (!selectedSubtopic || !selectedTopic) return;

      try {
        setContentLoading(true);
        setContentError("");
        const { data } = await getFullContentByVersion({
          topic: selectedTopic,
          subtopic: selectedSubtopic.name,
          versionNumber: versionNumber,
        });

        setContent(data.data);
        setContentInfo({
          cached: true,
          version: data.version,
          source: "cache",
          isFullVersion: true,
        });
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to load content version";
        setContentError(errorMessage);
        setShowError(true);
      } finally {
        setContentLoading(false);
      }
    },
    [selectedTopic, selectedSubtopic]
  );

  const handleRegenerateContent = useCallback(async () => {
    if (!selectedSubtopic || !selectedTopic) return;

    const subtopicName = selectedSubtopic.name;

    if (!canGenerate(subtopicName)) {
      setContentError(`Generation limit reached (${MAX_GENERATIONS} times)`);
      setShowError(true);
      return;
    }

    if (dailyRegenRemaining <= 0) {
      setContentError("Daily regeneration limit reached (max 6 per day)");
      setShowError(true);
      return;
    }

    // Open teaching style selector
    setTeachingStyleSelectorOpen(true);
  }, [selectedSubtopic, selectedTopic, canGenerate, dailyRegenRemaining]);

  const handleTeachingStyleSelect = useCallback(async (teachingStyle) => {
    if (!selectedSubtopic || !selectedTopic) return;

    const subtopicName = selectedSubtopic.name;

    try {
      setContentLoading(true);
      setContentError("");
      const { data } = await regenerateContent({
        topic: selectedTopic,
        subtopic: subtopicName,
        teachingStyle: teachingStyle,
      });

      await handleIncrementGenerationCount(subtopicName, selectedTopic);

      setContent(data.data);
      setSelectedTeachingStyle(teachingStyle);
      setContentInfo({
        cached: false,
        version: data.version || 1,
        source: "ai",
      });

      if (typeof data.dailyRemaining === "number") {
        updateDailyRegen(data.dailyRemaining, data.dailyResetAt);
      } else {
        updateDailyRegen();
      }

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
      if (typeof err.response?.data?.dailyRemaining === "number") {
        updateDailyRegen(
          err.response.data.dailyRemaining,
          err.response.data.dailyResetAt || null
        );
      }
      setContentError(errorMessage);
      setShowError(true);
    } finally {
      setContentLoading(false);
    }
  }, [selectedTopic, selectedSubtopic, canGenerate, handleIncrementGenerationCount, updateDailyRegen]);

  const handleDailyRegenUpdate = useCallback((nextRemaining, nextResetAt) => {
    updateDailyRegen(nextRemaining, nextResetAt);
  }, [updateDailyRegen]);

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

  const performCompleteSubtopic = useCallback(
    async (subtopic) => {
      try {
        setUpdatingSubtopic(subtopic.name);
        setError("");

        await updateSubtopicProgress({
          topic: selectedTopic,
          subtopicName: subtopic.name,
          completed: true,
          understandingLevel: subtopic.understandingLevel,
        });

        const updatedSubtopic = { ...subtopic, completed: true };

        setOriginalSubtopics((prev) =>
          prev.map((sub) =>
            sub.name === subtopic.name ? updatedSubtopic : sub
          )
        );

        setSubtopics((prev) => {
          const updatedArray = prev.map((sub) =>
            sub.name === subtopic.name ? updatedSubtopic : sub
          );
          return getOrderedSubtopics(updatedArray);
        });

        if (selectedSubtopic?.name === subtopic.name) {
          setSelectedSubtopic(updatedSubtopic);
        }

        return true;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to complete subtopic";
        setError(errorMessage);
        setShowError(true);
        return false;
      } finally {
        setUpdatingSubtopic(null);
      }
    },
    [selectedTopic, selectedSubtopic, getOrderedSubtopics]
  );

  const handleCompleteSubtopic = useCallback(
    async (subtopic) => {
      if (!subtopic.understandingLevel || subtopic.understandingLevel < 1) {
        setContentError("Please rate your understanding first");
        setShowError(true);
        return;
      }

      const quizMark = subtopic.quizMark || {};
      const answeredCount = (quizMark.correct || 0) + (quizMark.wrong || 0);
      const hasQuizAttempt = (quizMark.total || 0) > 0 && answeredCount > 0;

      if (!hasQuizAttempt) {
        if (!Array.isArray(content?.quiz) || content.quiz.length === 0) {
          setContentError("Quiz is not available for this subtopic yet");
          setShowError(true);
          return;
        }

        setPendingCompleteSubtopic(subtopic);
        setQuizModalOpen(true);
        return;
      }

      await performCompleteSubtopic(subtopic);
    },
    [content, performCompleteSubtopic]
  );

  const handleQuizSubmitted = useCallback(async () => {
    // Refresh the subtopic data to get the updated quiz marks
    if (selectedSubtopic && selectedTopic) {
      try {
        const { data } = await getSubtopics(selectedTopic);
        const updatedSubtopics = data.subTopics || [];
        
        // Find the updated version of the current subtopic
        const updatedSubtopic = updatedSubtopics.find(
          (sub) => sub.name === selectedSubtopic.name
        );
        
        if (updatedSubtopic) {
          setSelectedSubtopic(updatedSubtopic);
          
          // Update the subtopics list with the refreshed data
          setOriginalSubtopics(updatedSubtopics);
          setSubtopics(getOrderedSubtopics(updatedSubtopics));

          if (
            pendingCompleteSubtopic &&
            pendingCompleteSubtopic.name === updatedSubtopic.name
          ) {
            const completed = await performCompleteSubtopic(updatedSubtopic);
            if (completed) {
              setQuizModalOpen(false);
              setPendingCompleteSubtopic(null);
            }
          }
        }
      } catch (error) {
        console.error("Failed to refresh subtopic data after quiz submission:", error);
      }
    }
  }, [
    selectedSubtopic,
    selectedTopic,
    getOrderedSubtopics,
    pendingCompleteSubtopic,
    performCompleteSubtopic,
  ]);

  const calculateProgress = useCallback(() => {
    if (!originalSubtopics.length) return 0;
    const completed = originalSubtopics.filter((sub) => sub.completed).length;
    return (completed / originalSubtopics.length) * 100;
  }, [originalSubtopics]);

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
    if (user) {
      fetchUserTopics(preferredTopic);
    }
  }, [fetchUserTopics, preferredTopic, user]);

  useEffect(() => {
    if (!generatedTopicState) return;

    const normalizedSubtopics = generatedTopicState.subtopics.map((subtopic) => ({
      ...subtopic,
      completed: !!subtopic.completed,
      understandingLevel: subtopic.understandingLevel || 1,
    }));

    setSelectedTopic(generatedTopicState.topic);
    setOriginalSubtopics(normalizedSubtopics);
    setSubtopics(getOrderedSubtopics(normalizedSubtopics));
    fetchGenerationCounts(normalizedSubtopics, generatedTopicState.topic);

    setTopics((prev) => {
      const exists = prev.some(
        (topic) => (topic?.topic || topic?.name) === generatedTopicState.topic
      );

      if (exists) {
        return prev.map((topic) =>
          (topic?.topic || topic?.name) === generatedTopicState.topic
            ? {
                ...topic,
                topic: generatedTopicState.topic,
                subTopics: normalizedSubtopics,
              }
            : topic
        );
      }

      return [
        {
          topic: generatedTopicState.topic,
          subTopics: normalizedSubtopics,
          overallUnderstanding: 1,
          lastAccessed: new Date(),
        },
        ...prev,
      ];
    });
  }, [generatedTopicState, getOrderedSubtopics, fetchGenerationCounts]);

  useEffect(() => {
    if (selectedSubtopic) {
      setContentError("");
      setShowError(false);
    }
  }, [selectedSubtopic]);

  useEffect(() => {
    if (!pendingAutoOpen?.topic || !pendingAutoOpen?.subtopic) {
      return;
    }

    handleSelectSubtopic(pendingAutoOpen.subtopic, pendingAutoOpen.topic);
    setPendingAutoOpen(null);
  }, [pendingAutoOpen, handleSelectSubtopic]);

  const currentError = contentError || error;
  const handleNavigateSubtopic = useCallback(
    (subtopic) => {
      handleSelectSubtopic(subtopic);
    },
    [handleSelectSubtopic]
  );

  const handleNavigateToFirstIncomplete = useCallback(() => {
    const firstIncomplete = displayedSubtopics.find(
      (sub) => sub && !sub.completed
    );
    if (firstIncomplete) {
      handleSelectSubtopic(firstIncomplete);
    }
  }, [displayedSubtopics, handleSelectSubtopic]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "background.default",
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
              height: "100dvh",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              bgcolor: "background.paper",
            },
          }}
        >
          <LearningSidebar
            topics={visibleTopics}
            subtopics={displayedSubtopics}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
            updatingSubtopic={updatingSubtopic}
            contentCache={contentCache}
            generationCounts={generationCounts}
            onTopicSelect={handleTopicSelect}
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
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <LearningSidebar
            topics={visibleTopics}
            subtopics={displayedSubtopics}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
            updatingSubtopic={updatingSubtopic}
            contentCache={contentCache}
            generationCounts={generationCounts}
            onTopicSelect={handleTopicSelect}
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
          displaySubtopics={displayedSubtopics}
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
          onOpenVersions={handleOpenVersionDialog}
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

        <Dialog
          open={quizModalOpen}
          onClose={() => {
            setQuizModalOpen(false);
            setPendingCompleteSubtopic(null);
          }}
          aria-labelledby="quiz-complete-title"
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2.5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 18px 50px rgba(0, 0, 0, 0.45)"
                  : "0 18px 50px rgba(15, 23, 42, 0.12)",
            },
          }}
        >
          <DialogTitle
            id="quiz-complete-title"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Complete Subtopic Quiz
          </DialogTitle>
          <DialogContent sx={{ px: 2, pb: 1 }}>
            {Array.isArray(content?.quiz) && content.quiz.length > 0 ? (
              <QuizSection
                quizItems={content.quiz}
                selectedTopic={selectedTopic}
                selectedSubtopic={pendingCompleteSubtopic || selectedSubtopic}
                isMobile={isMobile}
                colorPalette={purplePalette}
                onQuizSubmitted={handleQuizSubmitted}
              />
            ) : (
              <Typography color="text.secondary" variant="body2">
                No quiz available for this subtopic.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setQuizModalOpen(false);
                setPendingCompleteSubtopic(null);
              }}
              sx={{ textTransform: "none", fontWeight: 600, color: "text.primary" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Teaching Style Selector */}
        <TeachingStyleSelector
          open={teachingStyleSelectorOpen}
          onClose={() => setTeachingStyleSelectorOpen(false)}
          onSelect={handleTeachingStyleSelect}
          isLoading={contentLoading}
        />

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
              currentSubtopicIndex={originalSubtopics.findIndex(
                (sub) => sub.name === selectedSubtopic?.name
              )}
              contentLoading={contentLoading}
              contentError={contentError}
              onRetry={handleRetryContent}
              colorPalette={purplePalette}
              onVersionDialogOpen={handleRegisterVersionDialogOpener}
              onSelectFullVersion={handleSelectFullVersion}
              dailyRemaining={dailyRegenRemaining}
              onDailyRegenUpdate={handleDailyRegenUpdate}
            />
          ) : (
            <WelcomeState
              subtopicName={selectedSubtopic?.name}
              isReady={!!selectedSubtopic}
              onGenerateContent={() => handleGenerateContent(selectedSubtopic)}
              subtopics={displayedSubtopics}
              topics={visibleTopics}
              selectedTopic={selectedTopic}
              isDataLoading={loading}
              onNavigateToFirstIncomplete={handleNavigateToFirstIncomplete}
              onTopicSelect={handleTopicSelect}
              onSubtopicSelect={handleSelectSubtopic}
              onOpenSidebar={() => setMobileDrawerOpen(true)}
              progress={calculateProgress()}
              generationCounts={generationCounts}
              contentCache={contentCache}
              colorPalette={purplePalette}
              isRecalledTopic={!!preferredTopic}
              isMobile={isMobile}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
