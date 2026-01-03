import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { personalizeAndGenerate } from "../api/learning";

// Import components
import Header from "../components/personalize/Header";
import SearchBar from "../components/personalize/SearchBar";
import CategorySidebar from "../components/personalize/CategorySidebar";
import CourseCard from "../components/personalize/CourseCard";
import ActionButton from "../components/personalize/ActionButton";

// Import constants
import { PREDEFINED_TOPICS, CATEGORIES } from "../components/personalize/constants.jsx";

export default function Personalize() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized filtered topics
  const filteredTopics = useMemo(() => {
    return PREDEFINED_TOPICS.filter(topic => {
      const matchesCategory = selectedCategory === "all" || topic.category === selectedCategory;
      const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           topic.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    setError("");
  };

  const handleStartLearning = async () => {
    if (!selectedTopic) {
      setError("Please select a topic to continue");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const topic = PREDEFINED_TOPICS.find(t => t.id === selectedTopic);
      await personalizeAndGenerate({ topic: topic.name });
      navigate('/profile');
      
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTopicName = () => {
    return PREDEFINED_TOPICS.find(t => t.id === selectedTopic)?.name || '';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
      pb: 8 // Space for bottom button
    }}>
      <Container maxWidth="xl" sx={{ 
        py: { xs: 2, md: 3 }, 
        px: { xs: 1.5, sm: 2, md: 3 } 
      }}>
        
        {/* Header Section */}
        <Header />

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          
          {/* Category Sidebar */}
          <CategorySidebar 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isMobile={isMobile}
          />

          {/* Courses Grid */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Selected Category Info */}
            <Box sx={{ 
              mb: 3, 
              textAlign: { xs: 'center', lg: 'left' },
              px: { xs: 1, sm: 0 }
            }}>
              <Typography variant="h5" fontWeight={700} color="#7C3AED" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                {CATEGORIES.find(cat => cat.id === selectedCategory)?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                {filteredTopics.length} courses available
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ 
                mb: 3, 
                borderRadius: 2,
                border: '1px solid rgba(211, 47, 47, 0.2)',
                mx: { xs: 1, sm: 0 }
              }}>
                {error}
              </Alert>
            )}

            {/* Courses Grid - Responsive */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: { xs: 1.5, sm: 2 },
              alignContent: 'start',
              px: { xs: 0.5, sm: 0 }
            }}>
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
            {filteredTopics.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8, px: { xs: 2, sm: 0 } }}>
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  No courses found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  Try a different search or category
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Action Button */}
        <ActionButton
          selectedTopic={selectedTopic}
          loading={loading}
          handleStartLearning={handleStartLearning}
          getSelectedTopicName={getSelectedTopicName}
        />
      </Container>
    </Box>
  );
}