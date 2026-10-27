import React, { useState } from "react";
import {
  Container,
  Box,
  useMediaQuery,
  Paper,
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
    return <Navigate to="/explore?tab=custom" replace />;
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        display: "flex",
        alignItems: "flex-start",
        pt: { xs: 2, md: 2.5 },
        pb: { xs: 10, md: 3 },
      }}
    >
      <Container maxWidth="md" sx={{ maxWidth: { xs: "100%", sm: 760, md: 840 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Header />

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
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
          </Paper>

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
