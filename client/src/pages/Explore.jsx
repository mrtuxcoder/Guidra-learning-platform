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
} from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
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

// Import constants
import {
  PREDEFINED_TOPICS,
  CATEGORIES,
} from "../components/Explore/constants.jsx";

export default function Explore() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const suggestedTopics = [
    "Prompt Engineering",
    "Python Basics",
    "Data Analysis",
    "Public Speaking",
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [customGenerating, setCustomGenerating] = useState(false);
  const [customError, setCustomError] = useState("");
  const [isCustomTopicValid, setIsCustomTopicValid] = useState(false);
  const [lastValidatedQuery, setLastValidatedQuery] = useState("");

  // Memoized filtered topics
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
    setSelectedTopic(topicId);
    setError("");
  };

  const handleCustomSearch = async (overrideQuery) => {
    const query =
      typeof overrideQuery === "string" ? overrideQuery.trim() : searchQuery.trim();

    if (!query) {
      setCustomError("Please enter a topic to search");
      return;
    }

    try {
      setCustomLoading(true);
      setCustomError("");
      setIsCustomTopicValid(false);
      setLastValidatedQuery(query);

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

  const handleGenerateCustomSubtopics = async () => {
    const query = searchQuery.trim();
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
          subtopics: response.data.data.subTopics,
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

  const handleStartCustomLearning = () => {
    const query = searchQuery.trim();
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
    setSearchQuery("");
    setCustomError("");
    setIsCustomTopicValid(false);
    setCustomLoading(false);
    setCustomGenerating(false);
    setLastValidatedQuery("");
  };

  const handleUnifiedSearchChange = (value) => {
    setSearchQuery(value);
    setSelectedTopic("");
    setError("");
    setCustomError("");
    setIsCustomTopicValid(false);
    setCustomLoading(false);
    setLastValidatedQuery("");
  };

  const hasSearchQuery = searchQuery.trim().length > 0;
  const shouldShowCustomFallback = hasSearchQuery && filteredTopics.length === 0;
  const showCourseCollectionsUi = !shouldShowCustomFallback;

  const handleStartLearning = async () => {
    if (!selectedTopic) {
      setError("Please select a topic to continue");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const topic = PREDEFINED_TOPICS.find((t) => t.id === selectedTopic);
      if (!topic?.name) {
        setError("Selected topic is invalid. Please choose another one.");
        return;
      }

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
      console.error("API Error:", err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTopicName = () => {
    return PREDEFINED_TOPICS.find((t) => t.id === selectedTopic)?.name || "";
  };

  if (isMobile) {
    const topicLabel = searchQuery.trim();
    const discoverTopics = filteredTopics;

    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#F8F9FC", pb: "88px" }}>
        <Container maxWidth="sm" sx={{ px: 2, pt: 1.6 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.8 }}
          >
            <Typography sx={{ fontSize: "1.45rem", fontWeight: 700, color: "#111827" }}>
              Explore
            </Typography>
          </Stack>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleUnifiedSearchChange}
            placeholder="Search courses or create a learning topic"
            helperText="Search existing courses or create a custom AI path"
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 2.3,
              overflowX: "auto",
              pb: 0.2,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {suggestedTopics.map((item) => (
              <Chip
                key={item}
                label={item}
                onClick={() => handleUnifiedSearchChange(item)}
                size="small"
                sx={{
                  borderRadius: "999px",
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "#6B7280",
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>

          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#111827", mb: 1 }}>
            Categories
          </Typography>
          <CategorySidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isMobile={true}
          />

          {!hasSearchQuery && (
            <Paper
              elevation={0}
              sx={{
                mt: 2.3,
                p: 2,
                borderRadius: 2.5,
                border: "1px solid #E5E7EB",
                bgcolor: "#FFFFFF",
              }}
            >
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", mb: 0.6 }}>
                Start learning something new
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "#6B7280", mb: 1.6 }}>
                Discover curated courses or build a custom AI learning path.
              </Typography>
              <Stack direction="row" spacing={1.2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setSelectedCategory("all")}
                  sx={{
                    height: 44,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "#D6DAE6",
                    color: "#4B5563",
                  }}
                >
                  Browse Courses
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleUnifiedSearchChange("AI Fundamentals")}
                  sx={{
                    height: 44,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                  }}
                >
                  Custom Path
                </Button>
              </Stack>
            </Paper>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#111827", mb: 1 }}>
              Courses
            </Typography>
            <Stack spacing={1.5}>
              {discoverTopics.map((topic, index) => (
                <CourseCard
                  key={topic.id}
                  topic={topic}
                  isSelected={selectedTopic === topic.id}
                  onSelect={handleTopicSelect}
                  index={index}
                />
              ))}
              {discoverTopics.length === 0 && (
                <Typography sx={{ py: 1, fontSize: "0.86rem", color: "#6B7280" }}>
                  No matching courses found for “{searchQuery.trim()}”.
                </Typography>
              )}
            </Stack>
          </Box>

          {hasSearchQuery && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: "0.74rem", color: "#6B7280" }}>
                  CREATE LEARNING PATH
                </Typography>
              </Divider>

              <Card
                sx={{
                  borderRadius: 2.5,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: "0.94rem", color: "#111827", fontWeight: 600, mb: 0.5 }}>
                    Create learning path for:
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", color: "#4F46E5", fontWeight: 700, mb: 1.4 }}>
                    {topicLabel}
                  </Typography>

                  {!isCustomTopicValid && (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleCustomSearch(topicLabel)}
                      disabled={customLoading || !topicLabel}
                      sx={{
                        height: 44,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        mb: 1.2,
                        borderColor: "rgba(79, 70, 229, 0.35)",
                        color: "#4F46E5",
                      }}
                    >
                      {customLoading ? "Validating..." : "Validate Topic"}
                    </Button>
                  )}

                  {isCustomTopicValid ? (
                    <>
                      <Box
                        sx={{
                          p: 1.2,
                          borderRadius: 1.6,
                          bgcolor: "rgba(22, 163, 74, 0.09)",
                          border: "1px solid rgba(22, 163, 74, 0.25)",
                          mb: customError ? 0.9 : 1.4,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.82rem", color: "#166534", fontWeight: 600 }}>
                          Ready to build your learning path
                        </Typography>
                      </Box>
                      <ErrorDisplay error={customError} />
                    </>
                  ) : (
                    <ErrorDisplay error={customError} />
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!isCustomTopicValid || customGenerating}
                    onClick={handleGenerateCustomSubtopics}
                    startIcon={<AutoAwesome sx={{ fontSize: 18 }} />}
                    sx={{
                      height: 48,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                    }}
                  >
                    {customGenerating ? "Generating..." : "Generate Path"}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}

          {selectedTopic && (
            <Box
              sx={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 64,
                px: 2,
                py: 1.2,
                background: "linear-gradient(transparent, rgba(248,249,252,0.96) 40%)",
                zIndex: 1200,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
                }}
              >
                <Typography sx={{ fontSize: "0.78rem", color: "#6B7280", mb: 0.7, px: 0.4 }}>
                  Selected course: {getSelectedTopicName()}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleStartLearning}
                  disabled={loading}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                  }}
                >
                  {loading ? "Generating..." : "Generate Subtopics & Learn Now"}
                </Button>
                {error && (
                  <Typography
                    sx={{
                      mt: 0.8,
                      px: 0.4,
                      fontSize: "0.76rem",
                      color: "error.main",
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </Typography>
                )}
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pb: { xs: 10, md: 11 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 1.25, md: 2.25 },
          px: { xs: 1.25, sm: 2, md: 3 },
        }}
      >
        {/* Header Section */}
        {!isMobile && <Header />}

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleUnifiedSearchChange}
        />

        {shouldShowCustomFallback && (
          <Stack spacing={1.2} sx={{ mb: 1.5 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: { xs: 1.7, sm: 2 } }}>
                {!isCustomTopicValid ? (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.8 }}>
                      No matching course found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.6 }}>
                      No existing course matched. Validate this topic to create a custom path.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleCustomSearch(searchQuery.trim())}
                      disabled={customLoading || !searchQuery.trim()}
                      sx={{ textTransform: "none", fontWeight: 700, mb: 1 }}
                    >
                      {customLoading ? "Validating..." : "Validate Topic"}
                    </Button>
                    <ErrorDisplay error={customError} />
                  </Box>
                ) : (
                  <ValidatedTopic
                    searchQuery={searchQuery.trim()}
                    error={customError}
                    generating={customGenerating}
                    onResetSearch={resetCustomSearch}
                    onGenerateSubtopics={handleGenerateCustomSubtopics}
                  />
                )}
              </CardContent>
            </Card>

            <Guidelines show={!isCustomTopicValid} />

            <BasicLearningOption
              isValidTopic={isCustomTopicValid}
              generating={customGenerating}
              onClick={handleStartCustomLearning}
            />
          </Stack>
        )}

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "stretch", lg: "flex-start" },
            gap: { xs: 1.5, md: 2.5 },
          }}
        >
          {/* Category Sidebar */}
          {showCourseCollectionsUi && (
            <CategorySidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isMobile={isMobile}
            />
          )}

          {/* Courses Grid */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Selected Category Info */}
            {showCourseCollectionsUi && (
              <Box
                sx={{
                  mb: { xs: 1.25, md: 2 },
                  textAlign: "left",
                  px: { xs: 0.5, sm: 0 },
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="primary"
                  sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                >
                  {CATEGORIES.find((cat) => cat.id === selectedCategory)?.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.82rem", md: "0.92rem" } }}
                >
                  {filteredTopics.length} courses available
                </Typography>
              </Box>
            )}

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(211, 47, 47, 0.2)",
                  mx: { xs: 0.5, sm: 0 },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Courses Grid - Responsive */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: { xs: 1.5, sm: 2 },
                alignContent: "start",
                px: { xs: 0.25, sm: 0 },
              }}
            >
              {filteredTopics.map((topic, index) => (
                <CourseCard
                  key={topic.id}
                  topic={topic}
                  isSelected={selectedTopic === topic.id}
                  onSelect={handleTopicSelect}
                  index={index}
                />
              ))}
            </Box>

            {/* No Results */}
            {filteredTopics.length === 0 && !shouldShowCustomFallback && (
              <Box sx={{ textAlign: "center", py: 6, px: { xs: 1.5, sm: 0 } }}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  No courses found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                >
                  Try a different search or category
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Action Button */}
        {!shouldShowCustomFallback && (
          <ActionButton
            selectedTopic={selectedTopic}
            loading={loading}
            handleStartLearning={handleStartLearning}
            getSelectedTopicName={getSelectedTopicName}
          />
        )}
      </Container>
    </Box>
  );
}
