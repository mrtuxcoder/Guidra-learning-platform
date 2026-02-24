import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ExpandMore,
  Psychology,
  EmojiEvents,
  ErrorOutline,
  Refresh,
} from "@mui/icons-material";
import { profileTheme, cardSx, smallCardSx } from "./constants";
import { getAllAnalysis } from "../../api";

const AnalysisCard = () => {
  const theme = useTheme();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [location.pathname]); // Refetch when navigating to profile

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllAnalysis();
      
      if (response?.data?.success) {
        setAnalysisData(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch analysis:", err);
      setError("Failed to load analysis data");
    } finally {
      setLoading(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Calculate total strengths and weaknesses
  const totalStrengths = analysisData.reduce(
    (sum, topic) => sum + (topic.strengths?.length || 0),
    0
  );
  const totalWeaknesses = analysisData.reduce(
    (sum, topic) => sum + (topic.weaknesses?.length || 0),
    0
  );

  if (loading) {
    return (
      <Card sx={cardSx}>
        <CardContent sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
          <CircularProgress size={40} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={cardSx}>
        <CardContent sx={{ p: 3 }}>
          <Alert severity="error" icon={<ErrorOutline />}>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (analysisData.length === 0) {
    return (
      <Card sx={cardSx}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Psychology sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.125rem" },
              }}
            >
              Learning Analysis
            </Typography>
          </Box>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Complete some quizzes to see your strengths and areas for improvement!
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Psychology sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              flex: 1,
            }}
          >
            Learning Analysis
          </Typography>
          <Tooltip title="Refresh analysis">
            <IconButton
              size="small"
              onClick={fetchAnalysis}
              disabled={loading}
              sx={{ color: "primary.main" }}
            >
              <Refresh
                sx={{
                  fontSize: 20,
                  animation: loading ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Summary Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              ...smallCardSx,
              background: alpha(theme.palette.success.main, 0.08),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <EmojiEvents sx={{ color: theme.palette.success.main, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Strengths
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {totalStrengths}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              concepts mastered
            </Typography>
          </Box>

          <Box
            sx={{
              ...smallCardSx,
              background: alpha(theme.palette.warning.main, 0.08),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <TrendingDown sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Focus Areas
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700} color="warning.main">
              {totalWeaknesses}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              needs improvement
            </Typography>
          </Box>
        </Box>

        {/* Topic-by-Topic Analysis */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {analysisData.map((topicData) => (
            <Accordion
              key={topicData.topic}
              expanded={expanded === topicData.topic}
              onChange={handleAccordionChange(topicData.topic)}
              sx={{
                boxShadow: "none",
                "&:before": { display: "none" },
                border: `1px solid ${profileTheme.border}`,
                bgcolor: "background.default",
                borderRadius: "12px !important",
                overflow: "hidden",
                "&.Mui-expanded": {
                  margin: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  minHeight: 56,
                  "&.Mui-expanded": { minHeight: 56 },
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                    "&.Mui-expanded": { margin: "12px 0" },
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <Typography variant="body1" fontWeight={600}>
                    {topicData.topic}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, ml: "auto", mr: 1 }}>
                    {topicData.strengths?.length > 0 && (
                      <Chip
                        size="small"
                        label={topicData.strengths.length}
                        icon={<TrendingUp sx={{ fontSize: 16 }} />}
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          color: theme.palette.success.main,
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    )}
                    {topicData.weaknesses?.length > 0 && (
                      <Chip
                        size="small"
                        label={topicData.weaknesses.length}
                        icon={<TrendingDown sx={{ fontSize: 16 }} />}
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.12),
                          color: theme.palette.warning.main,
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                <Stack spacing={2}>
                  {/* Strengths */}
                  {topicData.strengths?.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="success.main"
                        sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <EmojiEvents sx={{ fontSize: 18 }} />
                        Strengths
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {topicData.strengths.map((strength, idx) => (
                          <Chip
                            key={idx}
                            label={strength}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.success.main, 0.08),
                              color: theme.palette.success.dark,
                              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Weaknesses */}
                  {topicData.weaknesses?.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="warning.main"
                        sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <TrendingDown sx={{ fontSize: 18 }} />
                        Focus Areas
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {topicData.weaknesses.map((weakness, idx) => (
                          <Chip
                            key={idx}
                            label={weakness}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.warning.main, 0.08),
                              color: theme.palette.warning.dark,
                              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
