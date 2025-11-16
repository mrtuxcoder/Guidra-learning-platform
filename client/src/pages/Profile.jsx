import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Alert,
  Button,
  Box,
  CircularProgress,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getProfile, logoutUser } from "../api/auth";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProgressStats from "../components/profile/ProgressStats";
import PersonalInfo from "../components/profile/PersonalInfo";
import TopicsProgress from "../components/profile/TopicsProgress";
import { clearAllTokens, debugAuth } from "../utils/auth";
import { learningStyles, understandingLevels } from "../components/profile/constants";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTopics, setExpandedTopics] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Debug auth status first
    const debugAuthStatus = async () => {
      console.log("🔐 [PROFILE] Debugging auth status...");
      const authStatus = await debugAuth();
      console.log("🔐 [PROFILE] Auth debug result:", authStatus);
    };
    
    debugAuthStatus();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log("🔐 [PROFILE] Starting profile fetch...");
      
      const response = await getProfile();
      console.log("✅ [PROFILE] API Response:", response);
      
      const userData = response.data?.user || response.data || response;
      
      // Use only the API data
      const enhancedUserData = {
        ...userData,
        learningStyle: userData.learningStyle || "visual",
        progress: userData.progress || [] // Use empty array if no progress data
      };
      
      console.log("🎯 Final User Data from API:", enhancedUserData);
      setUser(enhancedUserData);
      setError("");
    } catch (err) {
      console.error("❌ [PROFILE] Fetch error:", err);
      console.error("❌ [PROFILE] Error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        code: err.code
      });
      
      if (err.response?.status === 401) {
        clearAllTokens();
        setError("Session expired. Please login again.");
        // Auto-redirect after showing message
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(err.response?.data?.error || err.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component remains the same
  const handleLogout = async () => {
    await logoutUser()
    window.location.href = "/login";
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const toggleTopicExpansion = (topicIndex) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicIndex]: !prev[topicIndex]
    }));
  };

  // Use the imported learningStyles from constants
  const getLearningStyleInfo = (learningStyle) => {
    return learningStyles.find(style => style.value === learningStyle) || learningStyles[0];
  };

  // FIXED: Progress stats calculation using topic.completed field
  const getProgressStats = (user) => {
    if (!user || !user.progress) {
      console.log("❌ getProgressStats: No user or progress data");
      return {
        progressPercentage: 0,
        totalTopics: 0,
        completed: 0,
        inProgress: 0,
        completedSubtopics: 0,
        totalSubtopics: 0
      };
    }

    const progress = user.progress || [];
    
    console.log("📊 Raw progress data from API:", progress);
    
    // FIXED: Use topic.completed field instead of overallUnderstanding
    const completed = progress.filter(p => p.completed === true).length;
    const total = progress.length;
    
    const inProgress = progress.filter(p => {
      // Topics that have some progress but aren't completed
      const hasCompletedSubtopics = p.subTopics && p.subTopics.some(sub => sub.completed);
      return !p.completed && hasCompletedSubtopics;
    }).length;
    
    // Calculate subtopics
    let totalSubtopics = 0;
    let completedSubtopics = 0;
    
    progress.forEach(topic => {
      const subtopics = topic.subTopics || [];
      totalSubtopics += subtopics.length;
      completedSubtopics += subtopics.filter(sub => sub.completed === true).length;
    });

    // Calculate progress percentage based on COMPLETED SUBTOPICS
    const progressPercentage = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

    const calculatedStats = {
      progressPercentage: progressPercentage,
      totalTopics: total,
      completed: completed,
      inProgress: inProgress,
      completedSubtopics: completedSubtopics,
      totalSubtopics: totalSubtopics
    };

    console.log("🎯 FINAL Calculated stats (using topic.completed):", {
      progressPercentage,
      totalTopics: total,
      completed,
      inProgress,
      completedSubtopics,
      totalSubtopics,
      topicsCompletion: progress.map(p => ({ 
        topic: p.topic, 
        completed: p.completed,
        subtopicsCompleted: p.subTopics?.filter(s => s.completed).length,
        totalSubtopics: p.subTopics?.length 
      }))
    });
    
    return calculatedStats;
  };

  // FIXED: Transform your MongoDB data for TopicsProgress component
  const transformProgressData = (progress) => {
    if (!progress || !Array.isArray(progress)) return [];

    console.log("🔍 [transformProgressData] Raw progress:", progress);

    return progress.map((topic, index) => {
      const subtopics = topic.subTopics || [];
      
      console.log(`📚 Topic "${topic.topic}" - completed: ${topic.completed}, subtopics:`, subtopics);
      
      return {
        id: topic._id || index,
        topicName: topic.topic || `Topic ${index + 1}`,
        understandingLevel: topic.overallUnderstanding || 1,
        completionPercentage: calculateTopicCompletion(topic),
        score: Math.round((topic.overallUnderstanding || 1) * 20),
        completed: topic.completed || false, // FIXED: Use topic.completed field
        lastUpdated: topic.lastAccessed || new Date().toISOString().split('T')[0],
        subtopics: subtopics.map((subtopic, subIndex) => {
          console.log(`   📝 Subtopic "${subtopic.name}" completed: ${subtopic.completed}`);
          
          return {
            id: subtopic._id || subIndex,
            name: subtopic.name || `Subtopic ${subIndex + 1}`,
            completed: subtopic.completed || false,
            completionPercentage: subtopic.completed ? 100 : 0,
            difficulty: getDifficultyFromUnderstanding(subtopic.understandingLevel),
            score: Math.round((subtopic.understandingLevel || 1) * 20),
            quizMark: subtopic.quizMark || null,
            understandingLevel: subtopic.understandingLevel || 1,
            lastReviewed: subtopic.lastReviewed || topic.lastAccessed
          };
        })
      };
    });
  };

  // Helper function to calculate topic completion percentage
  const calculateTopicCompletion = (topic) => {
    const subtopics = topic.subTopics || [];
    if (subtopics.length === 0) return 0;
    
    const completed = subtopics.filter(sub => sub.completed).length;
    return Math.round((completed / subtopics.length) * 100);
  };

  // Helper function to convert understanding level to difficulty
  const getDifficultyFromUnderstanding = (level) => {
    if (level >= 4) return "Easy";
    if (level >= 2) return "Medium";
    return "Hard";
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading your profile...</Typography>
        </Box>
      </Container>
    );
  }

  if (error && error.includes("Session expired") && !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoginRedirect}
          sx={{ borderRadius: 2, maxWidth: 200, mx: 'auto' }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  if (!user && error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={fetchProfile}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const styleInfo = getLearningStyleInfo(user.learningStyle);
  const stats = getProgressStats(user);
  const userProgress = transformProgressData(user.progress);

  console.log("🔍 FINAL - Stats being sent to ProgressStats:", stats);
  console.log("🔍 FINAL - Transformed progress for TopicsProgress:", userProgress);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Header - Compact */}
      <Box sx={{ 
        width: '100%',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}>
        <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
          <ProfileHeader user={user} styleInfo={styleInfo} />
        </Container>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Left Sidebar - 40% width, no scrollbar */}
        <Box sx={{ 
          width: { xs: '100%', md: '40%' },
          maxWidth: { md: 450 },
          flexShrink: 0,
          borderRight: { md: '1px solid' },
          borderColor: { md: 'divider' },
          bgcolor: 'background.paper',
          overflowY: 'auto',
          height: 'calc(100vh - 80px)',
          position: { xs: 'static', md: 'sticky' },
          top: { md: 80 },
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <PersonalInfo user={user} />
              <ProgressStats stats={stats} />
            </Box>
          </Box>
        </Box>

        {/* Main Content Area - 60% width */}
        <Box sx={{ 
          flex: 1,
          width: { md: '60%' },
          overflowY: 'auto',
          height: 'calc(100vh - 80px)',
          bgcolor: 'background.default'
        }}>
          <Container maxWidth={false} sx={{ 
            py: 3, 
            px: { xs: 2, sm: 3, md: 4 },
            maxWidth: '100% !important'
          }}>
            {error && !error.includes("Session expired") && (
              <Alert severity="error" sx={{ 
                mb: 3, 
                borderRadius: 2,
                mx: 'auto',
                maxWidth: 1200
              }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
              <TopicsProgress
                userProgress={userProgress}
                expandedTopics={expandedTopics}
                onToggleTopic={toggleTopicExpansion}
                onLogout={handleLogout}
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}