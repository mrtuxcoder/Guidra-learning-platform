import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Paper,
  Divider,
  alpha,
  CircularProgress,
} from "@mui/material";
import { AutoAwesome, School, Search, ArrowForward } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { personalizeAndGenerate, validateTopic } from "../api";

// Import components
import Header from "../components/Explore/Header";
import SearchBar from "../components/Explore/SearchBar";
import CategorySidebar from "../components/Explore/CategorySidebar";
import CourseCard from "../components/Explore/CourseCard";
import ActionButton from "../components/Explore/ActionButton";
import Guidelines from "../components/CustomTopicSearch/Guidelines";
import ValidatedTopic from "../components/CustomTopicSearch/ValidatedTopic";
import ErrorDisplay from "../components/CustomTopicSearch/ErrorDisplay";
import BasicLearningOption from "../components/CustomTopicSearch/BasicLearningOption";
import SearchBox from "../components/CustomTopicSearch/SearchBox";

// Import constants and tokens
import {
  PREDEFINED_TOPICS,
  CATEGORIES,
} from "../components/Explore/constants.jsx";

export default function Explore() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state synced with URL ?tab=curated | ?tab=custom
  const currentTabParam = searchParams.get("tab");
  const activeTab = currentTabParam === "custom" ? "custom" : "curated";

  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab });
    setError("");
    setCustomError("");
  };

  const suggestedTopics = [
    "Prompt Engineering",
    "Python Basics",
    "Data Analysis",
    "Public Speaking",
    "Machine Learning",
  ];

  // Curated Catalog State
  const [loadingTopicId, setLoadingTopicId] = useState(null);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Custom AI Topic Generator State
  const [customSearchQuery, setCustomSearchQuery] = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [customGenerating, setCustomGenerating] = useState(false);
  const [customError, setCustomError] = useState("");
  const [isCustomTopicValid, setIsCustomTopicValid] = useState(false);

  // Filtered topics for curated catalog
  const filteredTopics = useMemo(() => {
    return PREDEFINED_TOPICS.filter((topic) => {
      const matchesCategory =
        selectedCategory === "all" || topic.category === selectedCategory;
      const matchesSearch =
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!searchQuery.trim()) return matchesCategory;
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleTopicSelect = (topicId) => {
    setSelectedTopic((prev) => (prev === topicId ? "" : topicId));
    setError("");
  };

  // Launch a curated course path
  const handleStartCourse = async (topicObj) => {
    const topic =
      topicObj || PREDEFINED_TOPICS.find((t) => t.id === selectedTopic);
    if (!topic?.name) {
      setError("Please select a topic to continue");
      return;
    }

    try {
      setLoadingTopicId(topic.id);
      setError("");

      const response = await personalizeAndGenerate({ topic: topic.name });
      navigate(`/learn?topic=${encodeURIComponent(topic.name)}`, {
        state: {
          customTopic: topic.name,
          validated: true,
          subtopics: response?.data?.data?.subTopics || [],
          generatedContent: response?.data,
        },
      });
    } catch (err) {
      console.error("Course start error:", err);
      setError(
        err.response?.data?.message || "Failed to start course. Please try again."
      );
    } finally {
      setLoadingTopicId(null);
    }
  };

  // Custom topic search & validation
  const handleCustomValidate = async (overrideQuery) => {
    const query = (
      typeof overrideQuery === "string" ? overrideQuery : customSearchQuery
    ).trim();

    if (!query) {
      setCustomError("Please enter a topic to search");
      return;
    }

    try {
      setCustomLoading(true);
      setCustomError("");
      setIsCustomTopicValid(false);

      if (query !== customSearchQuery) {
        setCustomSearchQuery(query);
      }

      const response = await validateTopic(query);

      if (response.data.valid) {
        setIsCustomTopicValid(true);
      } else {
        setCustomError(
          response.data.message ||
            "This topic might not be suitable for learning. Try using different words or a more specific topic."
        );
      }
    } catch (err) {
      setCustomError(
        err.response?.data?.message ||
          "Failed to validate topic. Please try again with different words."
      );
      setIsCustomTopicValid(false);
    } finally {
      setCustomLoading(false);
    }
  };

  // Generate subtopics from custom topic
  const handleGenerateCustomSubtopics = async () => {
    const query = customSearchQuery.trim();
    if (!query) return;

    try {
      setCustomGenerating(true);
      setCustomError("");

      const personalizationData = {
        topic: query,
        learningStyle: "comprehensive",
        depth: "intermediate",
      };

      const response = await personalizeAndGenerate(personalizationData);

      navigate("/learn", {
        state: {
          customTopic: query,
          validated: true,
          subtopics: response.data?.data?.subTopics || [],
          generatedContent: response.data,
        },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to generate subtopics. Please try again.";
      setCustomError(errorMessage);
    } finally {
      setCustomGenerating(false);
    }
  };

  // Basic learning option fallback
  const handleStartBasicCustomLearning = () => {
    const query = customSearchQuery.trim();
    if (isCustomTopicValid && query) {
      navigate("/learn", {
        state: {
          customTopic: query,
          validated: true,
        },
      });
    }
  };

  const resetCustomSearch = () => {
    setCustomSearchQuery("");
    setCustomError("");
    setIsCustomTopicValid(false);
    setCustomLoading(false);
    setCustomGenerating(false);
  };

  const getSelectedTopicName = () => {
    return PREDEFINED_TOPICS.find((t) => t.id === selectedTopic)?.name || "";
  };

  return (
    <Box
      id="explore-scroll-container"
      sx={{
        height: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: "background.default",
        scrollbarWidth: "thin",
        scrollbarColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.2) transparent"
            : "rgba(0, 0, 0, 0.2) transparent",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          "&:hover": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.35)"
                : "rgba(0, 0, 0, 0.35)",
          },
        },
        pt: { xs: 2, md: 2.5 },
        pb: { xs: 10, md: 4 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: { xs: "100%", md: 1440, xl: 1600 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Unified Explore Header with Segmented Switcher */}
        <Header
          activeTab={activeTab}
          onTabChange={handleTabChange}
          totalCourses={PREDEFINED_TOPICS.length}
        />

        {/* Global Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2.5, borderRadius: "6px" }}
          >
            {error}
          </Alert>
        )}

        {/* TAB 1: CURATED CATALOG */}
        {activeTab === "curated" && (
          <Box>
            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search catalog or discover topics..."
            />

            {/* Quick Filter Chips */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                flexWrap: "wrap",
                mb: { xs: 2, md: 2.5 },
              }}
            >
              {suggestedTopics.map((topic) => {
                const isSelected = searchQuery.toLowerCase() === topic.toLowerCase();
                return (
                  <Chip
                    key={topic}
                    label={topic}
                    size="small"
                    clickable
                    onClick={() => setSearchQuery(isSelected ? "" : topic)}
                    sx={{
                      borderRadius: "6px",
                      height: 28,
                      bgcolor: isSelected
                        ? (theme) =>
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.primary.main, 0.16)
                              : alpha(theme.palette.primary.main, 0.08)
                        : "background.paper",
                      color: isSelected ? "primary.main" : "text.secondary",
                      border: "1px solid",
                      borderColor: isSelected ? "primary.main" : "divider",
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: "0.78rem",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        borderColor: isSelected ? "primary.main" : "text.secondary",
                        color: "text.primary",
                      },
                    }}
                  />
                );
              })}
            </Box>

            {/* Main Content Layout */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 3 },
                alignItems: "flex-start",
              }}
            >
              {/* Category Sidebar / Mobile Chip Bar */}
              <CategorySidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                isMobile={isMobile}
              />

              {/* Course Grid */}
              <Box sx={{ flex: 1, width: "100%" }}>
                {filteredTopics.length > 0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                        xl: "repeat(4, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    {filteredTopics.map((topic, index) => (
                      <CourseCard
                        key={topic.id}
                        topic={topic}
                        isSelected={selectedTopic === topic.id}
                        onSelect={handleTopicSelect}
                        onStart={handleStartCourse}
                        isLoading={loadingTopicId === topic.id}
                        index={index}
                      />
                    ))}
                  </Box>
                ) : (
                  /* Zero Match Fallback with AI Prompt CTA */
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: "8px",
                      border: "1px dashed",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        bgcolor: (theme) =>
                          alpha(
                            theme.palette.primary.main,
                            theme.palette.mode === "dark" ? 0.15 : 0.08
                          ),
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <AutoAwesome sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 0.75, color: "text.primary", fontSize: "1.05rem" }}
                    >
                      No pre-made courses for "{searchQuery}"
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 460, mx: "auto", mb: 2.5, fontSize: "0.88rem" }}
                    >
                      Guidra's AI can generate a custom, step-by-step curriculum
                      with interactive quizzes on this exact topic.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setCustomSearchQuery(searchQuery);
                        handleTabChange("custom");
                        handleCustomValidate(searchQuery);
                      }}
                      startIcon={<AutoAwesome sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: "6px",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        px: 2.5,
                        height: 36,
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                      }}
                    >
                      Create "{searchQuery}" with AI
                    </Button>
                  </Paper>
                )}
              </Box>
            </Box>

            {/* Elevated Action Bar (Floats safely above mobile bottom nav) */}
            <ActionButton
              selectedTopic={selectedTopic}
              loading={Boolean(loadingTopicId)}
              handleStartLearning={() => handleStartCourse()}
              getSelectedTopicName={getSelectedTopicName}
            />
          </Box>
        )}

        {/* TAB 2: CREATE WITH AI */}
        {activeTab === "custom" && (
          <Box sx={{ maxWidth: { xs: "100%", sm: 760, md: 840 }, mx: "auto" }}>
            {/* Topic Input Box */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 0.5, color: "text.primary", fontSize: "1.05rem" }}
              >
                What do you want to learn?
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, fontSize: "0.86rem" }}
              >
                Enter any subject, technology, or domain (e.g. "Prompt Engineering", "PostgreSQL Indexing", "Rust Concurrency").
              </Typography>

              <SearchBox
                searchQuery={customSearchQuery}
                onQueryChange={(val) => {
                  setCustomSearchQuery(val);
                  setIsCustomTopicValid(false);
                  setCustomError("");
                }}
                onSearch={() => handleCustomValidate()}
                loading={customLoading}
                error={customError}
                isValidTopic={isCustomTopicValid}
              />

              {/* Quick Prompt Ideas */}
              <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.74rem" }}>
                  Try:
                </Typography>
                {suggestedTopics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    size="small"
                    clickable
                    onClick={() => {
                      setCustomSearchQuery(topic);
                      handleCustomValidate(topic);
                    }}
                    sx={{
                      borderRadius: "6px",
                      height: 24,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.03)",
                      border: "1px solid",
                      borderColor: "divider",
                      fontSize: "0.74rem",
                      fontWeight: 500,
                      "&:hover": { borderColor: "primary.main", color: "text.primary" },
                    }}
                  />
                ))}
              </Box>

              {/* Validation Status & Error Alert */}
              <ErrorDisplay error={customError} />
            </Paper>

            {/* Validated Topic Card */}
            {isCustomTopicValid && (
              <Box sx={{ mb: 3 }}>
                <ValidatedTopic
                  searchQuery={customSearchQuery}
                  error={customError}
                  generating={customGenerating}
                  onResetSearch={resetCustomSearch}
                  onGenerateSubtopics={handleGenerateCustomSubtopics}
                />

                <BasicLearningOption
                  isValidTopic={isCustomTopicValid}
                  generating={customGenerating}
                  onClick={handleStartBasicCustomLearning}
                />
              </Box>
            )}

            {/* Helpful Guidelines */}
            <Guidelines show={!isCustomTopicValid} />
          </Box>
        )}
      </Container>
    </Box>
  );
}
