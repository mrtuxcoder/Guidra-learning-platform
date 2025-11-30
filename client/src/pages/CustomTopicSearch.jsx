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
  Collapse,
  IconButton
} from "@mui/material";
import {
  Search,
  AutoAwesome,
  ArrowForward,
  TrendingUp,
  Psychology,
  CheckCircle,
  Info,
  Close,
  Warning
} from "@mui/icons-material";
import { validateTopic } from "../api/learning";
import { personalizeAndGenerate } from "../api/learning";
import { useNavigate } from "react-router-dom";

const POPULAR_TOPICS = [
  "AI & Machine Learning",
  "Web Development", 
  "Digital Marketing",
  "Data Science",
  "Blockchain",
  "Psychology",
  "Finance",
  "Creative Writing"
];

export default function CustomTopicSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isValidTopic, setIsValidTopic] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a topic to search");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setIsValidTopic(false);
      setShowGenerateButton(false);

      const response = await validateTopic(searchQuery);
      
      if (response.data.valid) {
        setIsValidTopic(true);
        setShowGenerateButton(true);
      } else {
        setError(response.data.message || "This topic might not be suitable for learning. Try using different words or a more specific topic.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to validate topic. Please try again with different words.");
      setIsValidTopic(false);
      setShowGenerateButton(false);
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
      
      // Navigate to learning page with generated subtopics
      navigate('/learn', { 
        state: { 
          customTopic: searchQuery,
          validated: true,
          subtopics: response.data.data.subTopics,
          generatedContent: response.data
        } 
      });
    } catch (err) {
      // Handle the specific error about incomplete topics
      const errorMessage = err.response?.data?.message || "Failed to generate subtopics. Please try again.";
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const handleStartLearning = () => {
    if (isValidTopic && searchQuery) {
      navigate('/learn', { 
        state: { 
          customTopic: searchQuery,
          validated: true 
        } 
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setError("");
    setIsValidTopic(false);
    setShowGenerateButton(false);
  };

  const getRetrySuggestion = () => {
    if (!error) return null;
    
    if (error.includes("not suitable") || error.includes("try")) {
      return "Try using more specific terms or different wording";
    }
    
    return "Try rephrasing your topic or using more specific keywords";
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header with Beta Tag */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              position: 'relative'
            }}>
              <AutoAwesome sx={{ fontSize: 40, color: 'white' }} />
              
              {/* Beta Badge */}
              <Chip
                label="BETA"
                size="small"
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            </Box>
          </Box>
          
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Learn Anything
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.5,
              mb: 2
            }}
          >
            Enter any topic and our AI will create your personalized learning path
          </Typography>

          {/* Rules Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => setShowRules(!showRules)}
              sx={{ 
                color: '#7C3AED',
                '&:hover': { background: 'rgba(124, 58, 237, 0.1)' }
              }}
            >
              <Info />
            </IconButton>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#7C3AED',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={() => setShowRules(!showRules)}
            >
              {showRules ? 'Hide Guidelines' : 'Show Guidelines'}
            </Typography>
          </Box>
        </Box>

        {/* Rules Section */}
        <Collapse in={showRules}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(94, 53, 177, 0.05) 100%)',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              position: 'relative'
            }}
          >
            <IconButton
              size="small"
              onClick={() => setShowRules(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#7C3AED'
              }}
            >
              <Close />
            </IconButton>

            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#7C3AED',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Warning sx={{ fontSize: 20 }} />
              Important Guidelines
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: '#7C3AED', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.25
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    1
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Complete Your Current Topics First
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Finish your existing learning paths before starting new ones for better progress tracking
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: '#7C3AED', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.25
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    2
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Use Specific & Appropriate Topics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose educational, professional, or skill-based topics. Avoid inappropriate content
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: '#7C3AED', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.25
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    3
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Try Different Words If Rejected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    If a topic isn't accepted, rephrase it or use more specific terminology ex: fundamental, basics
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: '#7C3AED', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.25
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    4
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Focus on Learning Content
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This tool is designed for educational purposes and structured learning
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Collapse>

        {/* Search Section - Show input only if not validated */}
        {!isValidTopic ? (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              mb: 2
            }}>
              <InputBase
                placeholder="What do you want to learn? (e.g., Machine Learning Basics)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError("");
                  setIsValidTopic(false);
                }}
                onKeyPress={handleKeyPress}
                sx={{ 
                  flex: 1,
                  p: 2,
                  borderRadius: '16px',
                  border: `2px solid ${
                    error ? '#f44336' : 
                    isValidTopic ? '#4CAF50' : 
                    'rgba(126, 87, 194, 0.2)'
                  }`,
                  fontSize: '1rem',
                  fontWeight: 500,
                  background: 'white',
                  '&:focus': {
                    borderColor: '#7C3AED',
                    outline: 'none'
                  }
                }}
              />
              
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                sx={{
                  minWidth: { xs: '100%', sm: '120px' },
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                  fontWeight: 600,
                  py: 2,
                  fontSize: '1rem',
                  '&:disabled': {
                    background: 'grey.300'
                  },
                  '&:hover:not(:disabled)': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Validate"}
              </Button>
            </Box>

            {/* Status Messages */}
            {error && (
              <Box>
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: '12px', 
                    mb: 1,
                    background: 'rgba(244, 67, 54, 0.05)',
                    border: '1px solid rgba(244, 67, 54, 0.2)'
                  }}
                >
                  {error}
                </Alert>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#7C3AED',
                    fontWeight: 500,
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}
                >
                  💡 {getRetrySuggestion()}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          /* Show selected topic and actions after validation */
          <Box sx={{ mb: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(94, 53, 177, 0.05) 100%)',
                border: '1px solid rgba(124, 58, 237, 0.1)',
                textAlign: 'center'
              }}
            >
              <CheckCircle sx={{ fontSize: 40, color: '#10b981', mb: 2 }} />
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 1
                }}
              >
                Topic Validated!
              </Typography>
              
              <Chip
                label={searchQuery}
                color="primary"
                sx={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 2,
                  mb: 2
                }}
              />
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 3
                }}
              >
                This topic is suitable for structured learning with 10-15 subtopics.
              </Typography>

              {/* Error Alert for Generation */}
              {error && (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    borderRadius: '12px', 
                    mb: 3,
                    background: 'rgba(255, 152, 0, 0.05)',
                    border: '1px solid rgba(255, 152, 0, 0.2)'
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center'
              }}>
                <Button
                  variant="outlined"
                  onClick={resetSearch}
                  sx={{
                    borderRadius: '12px',
                    borderColor: '#7C3AED',
                    color: '#7C3AED',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.04)',
                      borderColor: '#7C3AED'
                    }
                  }}
                >
                  Change Topic
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleGenerateSubtopics}
                  disabled={generating}
                  startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <Psychology />}
                  sx={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    '&:hover:not(:disabled)': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {generating ? 'Generating...' : 'Generate Learning Path'}
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Popular Topics - Only show when not validated */}
        {!isValidTopic && (
          <Fade in={!isValidTopic}>
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: '16px',
              background: 'rgba(126, 87, 194, 0.03)',
              border: '1px solid rgba(126, 87, 194, 0.1)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 2,
                justifyContent: 'center'
              }}>
                <TrendingUp sx={{ fontSize: 20, color: '#7C3AED' }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#7C3AED',
                    textAlign: 'center'
                  }}
                >
                  Popular Learning Topics
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
                gap: 1.5
              }}>
                {POPULAR_TOPICS.map((topic) => (
                  <Button
                    key={topic}
                    variant="outlined"
                    onClick={() => setSearchQuery(topic)}
                    sx={{
                      borderRadius: '12px',
                      borderColor: 'rgba(126, 87, 194, 0.3)',
                      color: '#7C3AED',
                      fontWeight: 500,
                      py: 1.5,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'rgba(126, 87, 194, 0.08)',
                        borderColor: '#7C3AED',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {topic}
                  </Button>
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {/* Alternative Start Learning Button */}
        {isValidTopic && !generating && (
          <Fade in={isValidTopic && !generating}>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 1
                }}
              >
                Or continue with basic learning
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={handleStartLearning}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: '#7C3AED',
                  color: '#7C3AED',
                  borderRadius: '16px',
                  minWidth: '200px',
                  '&:hover': {
                    background: 'rgba(124, 58, 237, 0.04)',
                    borderColor: '#7C3AED',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
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