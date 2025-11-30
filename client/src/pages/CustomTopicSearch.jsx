import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  InputBase,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Fade,
  Paper,
  IconButton
} from "@mui/material";
import {
  AutoAwesome,
  ArrowForward,
  Psychology,
  CheckCircle,
  Warning
} from "@mui/icons-material";
import { validateTopic, personalizeAndGenerate } from "../api/learning";
import { useNavigate } from "react-router-dom";

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
        depth: "intermediate"
      };

      const response = await personalizeAndGenerate(personalizationData);

      navigate("/learn", {
        state: {
          customTopic: searchQuery,
          validated: true,
          subtopics: response.data.data.subTopics,
          generatedContent: response.data
        }
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to generate subtopics. Please try again.";
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
          validated: true
        }
      });
    }
  };

  const getRetrySuggestion = () => {
    if (!error) return null;

    if (error.includes("not suitable") || error.includes("try")) {
      return "Try using more specific terms or different wording";
    }

    return "Try rephrasing your topic or using more specific keywords";
  };

  const resetSearch = () => {
    setSearchQuery("");
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
        py: 4
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* HEADER */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "20px",
                background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AutoAwesome sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            Learn Anything
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 2 }}>
          Type a topic and get a clear, step-by-step learning path instantly.
          </Typography>
        </Box>

        {/* SEARCH BOX */}
        {!isValidTopic ? (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                mb: 2
              }}
            >
              <InputBase
                placeholder="What do you want to learn? (e.g., Machine Learning Basics)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError("");
                  setIsValidTopic(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: "16px",
                  border: `2px solid ${
                    error
                      ? "#f44336"
                      : isValidTopic
                      ? "#4CAF50"
                      : "rgba(126, 87, 194, 0.2)"
                  }`,
                  background: "white",
                  fontSize: "1rem"
                }}
              />

              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                sx={{
                  minWidth: { xs: "100%", sm: "120px" },
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
                  fontWeight: 600
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Validate"}
              </Button>
            </Box>

            {error && (
              <Box>
                <Alert severity="error" sx={{ borderRadius: "12px", mb: 1 }}>
                  {error}
                </Alert>

                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    color: "#7C3AED",
                    fontStyle: "italic",
                    fontWeight: 500
                  }}
                >
                  💡 {getRetrySuggestion()}
                </Typography>
              </Box>
            )}

            {/* SINGLE GUIDELINES BLOCK */}
            <Fade in={!isValidTopic}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: "16px",
                  background: "rgba(124, 58, 237, 0.05)",
                  border: "1px solid rgba(124, 58, 237, 0.1)"
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#7C3AED",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Warning sx={{ fontSize: 20 }} />
                  Important Guidelines
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    {
  title: "Finish Current Topics First",
  desc:
    "Stay on one learning path at a time. It keeps your progress accurate and avoids confusion."
},
{
  title: "Use Clear, Beginner-Friendly Topics",
  desc:
    "Enter simple topics like “Basics of Git” or “Intro to Psychology” for the best results."
},
{
  title: "Rephrase If Validation Fails",
  desc:
    "Try clearer wording or add terms like “fundamentals”, “introduction”, or “basics”."
},
{
  title: "Guided Lessons Only",
  desc:
    "This tool creates structured lessons and learning paths, not general chat-style answers."
}

                  ].map((g, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "#7C3AED",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mt: 0.5,
                          flexShrink: 0
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "white", fontWeight: 700 }}>
                          {i + 1}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {g.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {g.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Fade>
          </Box>
        ) : (
          /* TOPIC VALIDATED BOX */
          <Box sx={{ mb: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "rgba(124, 58, 237, 0.05)",
                border: "1px solid rgba(124, 58, 237, 0.1)",
                textAlign: "center"
              }}
            >
              <CheckCircle sx={{ fontSize: 40, color: "#10b981", mb: 2 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Topic Validated!
              </Typography>

              <Chip
                label={searchQuery}
                sx={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
                  color: "white",
                  fontWeight: 600,
                  py: 1.5,
                  mb: 2
                }}
              />

              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                This topic is suitable for structured learning with 10-15 subtopics.
              </Typography>

              {error && (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: "12px" }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={resetSearch}
                  sx={{
                    borderRadius: "12px",
                    borderColor: "#7C3AED",
                    color: "#7C3AED",
                    fontWeight: 600
                  }}
                >
                  Change Topic
                </Button>

                <Button
                  variant="contained"
                  onClick={handleGenerateSubtopics}
                  disabled={generating}
                  startIcon={
                    generating ? <CircularProgress size={20} color="inherit" /> : <Psychology />
                  }
                  sx={{
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    fontWeight: 600
                  }}
                >
                  {generating ? "Generating..." : "Generate Learning Path"}
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {isValidTopic && !generating && (
          <Fade in={isValidTopic}>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                Or continue with basic learning
              </Typography>

              <Button
                variant="outlined"
                size="large"
                onClick={handleStartLearning}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: "#7C3AED",
                  color: "#7C3AED",
                  borderRadius: "16px"
                }}
                endIcon={<ArrowForward />}
              >
                Start Basic Learning
              </Button>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
