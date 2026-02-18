import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
  const isDark = theme.palette.mode === "dark";
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        py: { xs: 4, md: 7 },
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: isDark
            ? `radial-gradient(circle at 15% 20%, ${alpha(
                theme.palette.primary.main,
                0.18
              )} 0%, transparent 45%),
               radial-gradient(circle at 85% 10%, ${alpha(
                 theme.palette.primary.main,
                 0.12
               )} 0%, transparent 40%)`
            : "radial-gradient(circle at 15% 20%, rgba(124, 58, 237, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 10%, rgba(94, 53, 177, 0.12) 0%, transparent 40%)",
          pointerEvents: "none",
        },
        "&:after": {
          content: '""',
          position: "absolute",
          width: 420,
          height: 420,
          right: { xs: -280, md: -180 },
          bottom: { xs: -300, md: -220 },
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, zIndex: 1 }}>
        <Header />

        {!isValidTopic ? (
          <Box sx={{ mb: 3 }}>
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
          <Box sx={{ mb: 3 }}>
            <ValidatedTopic
              searchQuery={searchQuery}
              error={error}
              generating={generating}
              onResetSearch={resetSearch}
              onGenerateSubtopics={handleGenerateSubtopics}
            />
          </Box>
        )}

        <Guidelines show={!isValidTopic} />
        <BasicLearningOption
          isValidTopic={isValidTopic}
          generating={generating}
          onClick={handleStartLearning}
        />
      </Container>
    </Box>
  );
}
