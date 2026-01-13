import React, { useState } from "react";
import { Container, Box, Fade, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isValidTopic, setIsValidTopic] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a topic to search");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setIsValidTopic(false);

      const response = await validateTopic(searchQuery);

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
    if (!searchQuery.trim()) return;

    try {
      setGenerating(true);
      setError("");

      const personalizationData = {
        topic: searchQuery,
        learningStyle: "comprehensive",
        depth: "intermediate",
      };

      const response = await personalizeAndGenerate(personalizationData);

      navigate("/learn", {
        state: {
          customTopic: searchQuery,
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
    if (isValidTopic && searchQuery) {
      navigate("/learn", {
        state: {
          customTopic: searchQuery,
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
        background: "linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
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

            <Guidelines show={!isValidTopic} />
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

        <BasicLearningOption
          isValidTopic={isValidTopic}
          generating={generating}
          onClick={handleStartLearning}
        />
      </Container>
    </Box>
  );
}
