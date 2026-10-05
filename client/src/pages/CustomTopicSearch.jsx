import React, { useState } from "react";
import {
  Container,
  Box,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AutoAwesome } from "@mui/icons-material";
import { useNavigate, Navigate } from "react-router-dom";

// Import components from the components folder
import Header from "../components/CustomTopicSearch/Header";
import SearchBox from "../components/CustomTopicSearch/SearchBox";
import Guidelines from "../components/CustomTopicSearch/Guidelines";
import ValidatedTopic from "../components/CustomTopicSearch/ValidatedTopic";
import ErrorDisplay from "../components/CustomTopicSearch/ErrorDisplay";
import BasicLearningOption from "../components/CustomTopicSearch/BasicLearningOption";
import { validateTopic, personalizeAndGenerate } from "../api";

export default function CustomTopicSearch() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isValidTopic, setIsValidTopic] = useState(false);

  const handleSearch = async (overrideQuery) => {
    const rawQuery =
      typeof overrideQuery === "string" ? overrideQuery : searchQuery;
    const query = rawQuery.trim();

    if (!query) {
      setError("Please enter a topic to search");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setIsValidTopic(false);

      if (query !== searchQuery) {
        setSearchQuery(query);
      }

      const response = await validateTopic(query);

      if (response.data.valid) {
        setIsValidTopic(true);
      } else {
        setError(
          response.data.message ||
            "This topic might not be suitable for learning. Try using different words or a more specific topic."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to validate topic. Please try again with different words."
      );
      setIsValidTopic(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSubtopics = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    try {
      setGenerating(true);
      setError("");

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
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const handleStartLearning = () => {
    const query = searchQuery.trim();
    if (isValidTopic && query) {
      navigate("/learn", {
        state: {
          customTopic: query,
          validated: true,
        },
      });
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setError("");
    setIsValidTopic(false);
  };

  const handleQueryChange = (value) => {
    setSearchQuery(value);
    setError("");
    setIsValidTopic(false);
  };

  if (isMobile) {
    return <Navigate to="/explore" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        py: { xs: 1.5, md: 5 },
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2.5 } }}>
        <Stack spacing={1.5}>
          {!isMobile && <Header />}

          {isMobile && (
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AutoAwesome sx={{ color: "primary.main", fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Build your custom learning path
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>
                    Enter any topic, validate it, then generate a structured path in one tap.
                  </Typography>
                  <Box>
                    <Chip
                      label="10–15 structured lessons"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          <Card
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 1.8, sm: 2.4 } }}>
              {!isValidTopic ? (
                <Box>
                  <SearchBox
                    searchQuery={searchQuery}
                    onQueryChange={handleQueryChange}
                    onSearch={handleSearch}
                    loading={loading}
                    error={error}
                    isValidTopic={isValidTopic}
                  />
                  <ErrorDisplay error={error} />
                </Box>
              ) : (
                <ValidatedTopic
                  searchQuery={searchQuery}
                  error={error}
                  generating={generating}
                  onResetSearch={resetSearch}
                  onGenerateSubtopics={handleGenerateSubtopics}
                />
              )}
            </CardContent>
          </Card>

          <Guidelines show={!isValidTopic} />

          <BasicLearningOption
            isValidTopic={isValidTopic}
            generating={generating}
            onClick={handleStartLearning}
          />
        </Stack>
      </Container>
    </Box>
  );
}
