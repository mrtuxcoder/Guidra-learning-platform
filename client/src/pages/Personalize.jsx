
// import React, { useState } from "react";
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Stepper,
//   Step,
//   StepLabel,
//   Alert,
//   Fade,
//   useTheme
// } from "@mui/material";
// import { personalizeAndGenerate } from "../api/learning";
// import LearningStyleStep from "../components/personalize/LearningStyleStep";
// import MissionStep from "../components/personalize/MissionStep";
// import LaunchStep from "../components/personalize/LaunchStep";
// import SuccessStep from "../components/personalize/SuccessStep";
// import StepperNavigation from "../components/personalize/StepperNavigation";
// import { steps, customPalette } from "../components/personalize/constants";

// export default function PersonalizedLearningSetup() {
//   const theme = useTheme();
//   theme.palette.primary.main = customPalette.primary.main;
//   theme.palette.primary.light = customPalette.primary.light;
//   theme.palette.secondary.main = customPalette.secondary.main;
//   theme.palette.success.main = customPalette.success.main;
//   theme.palette.background.default = customPalette.background.default;

//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [formData, setFormData] = useState({
//     topic: "",
//     learningStyle: "",
//     reasonForLearning: "",
//     tonePreference: "friendly",
//     difficultyPreference: "intermediate"
//   });

//   const [apiResponse, setApiResponse] = useState(null);

//   const handleInputChange = (field) => (event) => {
//     setFormData({
//       ...formData,
//       [field]: event.target.value
//     });
//   };

//   const handleStyleSelect = (styleValue) => {
//     setFormData({
//       ...formData,
//       learningStyle: styleValue
//     });
//   };

//   const handleNext = () => {
//     setActiveStep((prevStep) => prevStep + 1);
//     setError("");
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//     setError("");
//   };

//   const isStepValid = () => {
//     switch (activeStep) {
//       case 0:
//         return formData.learningStyle && formData.tonePreference && formData.difficultyPreference;
//       case 1:
//         return formData.topic.trim() && formData.reasonForLearning.trim();
//       case 2:
//         return true;
//       default:
//         return false;
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setError("");
      
//       const response = await personalizeAndGenerate({
//         topic: formData.topic,
//         learningStyle: formData.learningStyle,
//         reasonForLearning: formData.reasonForLearning,
//         tonePreference: formData.tonePreference,
//         difficultyPreference: formData.difficultyPreference
//       });
      
//       setApiResponse(response.data);
//       setSuccess(response.data.message || "🎉 Amazing! Your personalized learning universe is ready!");
      
//       setActiveStep(3);
      
//     } catch (err) {
//       console.error("API Error:", err);
//       const errorMessage = err.response?.data?.message || "Oops! Something went wrong. Let's try that again! 🤔";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStartLearning = () => {
//     window.location.href = `/profile`;
//   };

//   const handleCreateAnother = () => {
//     setFormData({
//       topic: "",
//       learningStyle: "",
//       reasonForLearning: "",
//       tonePreference: "friendly",
//       difficultyPreference: "intermediate"
//     });
//     setApiResponse(null);
//     setSuccess("");
//     setError("");
//     setActiveStep(0);
//   };

//   // In your personalize.js file, find the renderStepContent function
// const renderStepContent = (step) => {
//   switch (step) {
//     case 0:
//       return (
//         <LearningStyleStep
//           formData={formData}
//           handleStyleSelect={handleStyleSelect}
//           handleInputChange={handleInputChange}
//           theme={theme}
//         />
//       );
//     case 1:
//       return (
//         <MissionStep
//           formData={formData}
//           handleInputChange={handleInputChange}
//           theme={theme}
//         />
//       );
//     case 2:
//       return (
//         <LaunchStep
//           formData={formData}
//           theme={theme}
//         />
//       );
//     case 3:
//       // REMOVE THE FADE WRAPPER - just return SuccessStep directly
//       return (
//         <SuccessStep
//           formData={formData}
//           apiResponse={apiResponse}
//           handleStartLearning={handleStartLearning}
//           handleCreateAnother={handleCreateAnother}
//           theme={theme}
//         />
//       );
//     default:
//       return null;
//   }
// };
//   const StepperStyle = {
//     "& .MuiStepLabel-root .Mui-completed": {
//       color: customPalette.success.main,
//     },
//     "& .MuiStepLabel-root .Mui-active": {
//       color: customPalette.primary.main,
//     },
//     "& .MuiStepLabel-label": {
//       fontWeight: 'bold',
//       fontSize: { xs: '0.75rem', md: '1rem' }
//     },
//     "& .MuiStepLabel-root .Mui-disabled": {
//       color: 'rgba(0, 0, 0, 0.4)',
//     },
//     "& .MuiStepIcon-root": {
//       fontSize: { xs: '1.5rem', md: '2rem' },
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ 
//       py: { xs: 3, md: 6 },
//       minHeight: '100vh',
//       backgroundColor: theme.palette.background.default,
//     }}>
//       <Paper 
//         elevation={10} 
//         sx={{ 
//           p: { xs: 3, md: 6 },
//           borderRadius: 4,
//           background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, #764ba2 100%)`,
//           color: 'white',
//           mb: 6,
//           textAlign: 'center',
//         }}
//       >
//         <Typography variant="h2" gutterBottom fontWeight="900" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
//           🎓 The Learning Architect
//         </Typography>
//         <Typography variant="h5" sx={{ opacity: 0.9, fontSize: { xs: '1rem', md: '1.5rem' } }}>
//           Design Your Perfect AI-Powered Learning Adventure!
//         </Typography>
//       </Paper>

//       <Stepper activeStep={activeStep} sx={{ mb: 6, ...StepperStyle }}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       <Box sx={{ px: { xs: 0, sm: 2 } }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {success && activeStep !== 3 && (
//           <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
//             {success}
//           </Alert>
//         )}

//         {renderStepContent(activeStep)}
//       </Box>

//       {activeStep < 3 && (
//         <StepperNavigation
//           activeStep={activeStep}
//           loading={loading}
//           isStepValid={isStepValid}
//           handleBack={handleBack}
//           handleNext={handleNext}
//           handleSubmit={handleSubmit}
//           theme={theme}
//         />
//       )}
//     </Container>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Fade,
  CircularProgress,
  InputBase,
  Chip,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
  Tooltip
} from "@mui/material";
import {
  Search,
  FilterList,
  Star,
  School,
  Code,
  Science,
  TrendingUp,
  Psychology,
  Rocket
} from "@mui/icons-material";
import { personalizeAndGenerate } from "../api/learning";
import { useNavigate } from "react-router-dom";

// Consistent purple color palette with profile page
const purplePalette = {
  50: '#FAF7FE',
  100: '#F3E8FF',
  200: '#E9D5FF',
  300: '#D8B4FE',
  400: '#C084FC',
  500: '#A855F7',
  600: '#9333EA',
  700: '#7C3AED',
  800: '#6B21A8',
  900: '#581C87'
};

// Category icons and colors - consistent with profile theme
const CATEGORY_DATA = {
  programming: { icon: <Code />, color: '#7C3AED', name: "Programming" },
  science: { icon: <Science />, color: '#9333EA', name: "Science" },
  finance: { icon: <TrendingUp />, color: '#A855F7', name: "Finance" },
  'self-dev': { icon: <Psychology />, color: '#6B21A8', name: "Self Development" },
  'future-skills': { icon: <Rocket />, color: '#581C87', name: "Future Skills" }
};

// Optimized topics data
const PREDEFINED_TOPICS = [
  // Programming
  { id: "python-basics", name: "Python Programming", description: "Fundamental programming concepts and syntax", category: "programming", popularity: 95 },
  { id: "javascript-fundamentals", name: "JavaScript Fundamentals", description: "Core concepts of web programming language", category: "programming", popularity: 88 },
  { id: "data-structures-algorithms", name: "Data Structures & Algorithms", description: "Essential computer science foundations", category: "programming", popularity: 92 },
  { id: "web-development", name: "Modern Web Development", description: "Full-stack development principles", category: "programming", popularity: 85 },
  { id: "mobile-app-dev", name: "Mobile App Development", description: "iOS and Android app development", category: "programming", popularity: 79 },
  { id: "ai-ml-basics", name: "AI & Machine Learning", description: "Introduction to artificial intelligence", category: "programming", popularity: 96 },
  { id: "cloud-computing", name: "Cloud Computing", description: "Understanding cloud services and architecture", category: "programming", popularity: 78 },
  { id: "cybersecurity-essentials", name: "Cybersecurity", description: "Digital security principles and practices", category: "programming", popularity: 82 },
  { id: "blockchain-web3", name: "Blockchain & Web3", description: "Decentralized technology fundamentals", category: "programming", popularity: 75 },
  { id: "api-design", name: "API Design", description: "Building and consuming web APIs", category: "programming", popularity: 80 },

  // Science
  { id: "quantum-computing", name: "Quantum Computing", description: "Principles of quantum information science", category: "science", popularity: 65 },
  { id: "biotechnology", name: "Biotechnology", description: "Biological technology applications", category: "science", popularity: 70 },
  { id: "neuroscience-basics", name: "Neuroscience", description: "Understanding brain and cognition", category: "science", popularity: 72 },
  { id: "space-technology", name: "Space Technology", description: "Space exploration and satellite systems", category: "science", popularity: 68 },
  { id: "climate-science", name: "Climate Science", description: "Climate systems and sustainability", category: "science", popularity: 85 },
  { id: "scientific-method", name: "Scientific Thinking", description: "Critical analysis and research methods", category: "science", popularity: 78 },
  { id: "physics-concepts", name: "Modern Physics", description: "Key concepts in contemporary physics", category: "science", popularity: 71 },
  { id: "chemistry-foundations", name: "Chemistry Foundations", description: "Fundamental chemical principles", category: "science", popularity: 69 },

  // Finance
  { id: "personal-finance", name: "Personal Finance", description: "Budgeting, saving, and financial planning", category: "finance", popularity: 90 },
  { id: "investing-basics", name: "Investment Principles", description: "Stock market and investment strategies", category: "finance", popularity: 82 },
  { id: "entrepreneurship", name: "Entrepreneurship", description: "Starting and scaling businesses", category: "finance", popularity: 88 },
  { id: "digital-marketing", name: "Digital Marketing", description: "Online marketing strategies and analytics", category: "finance", popularity: 79 },
  { id: "economics-principles", name: "Economics", description: "Market systems and economic theory", category: "finance", popularity: 75 },
  { id: "cryptocurrency", name: "Cryptocurrency", description: "Digital currencies and blockchain economics", category: "finance", popularity: 81 },
  { id: "financial-literacy", name: "Financial Literacy", description: "Essential money management skills", category: "finance", popularity: 92 },

  // Self Development
  { id: "critical-thinking", name: "Critical Thinking", description: "Analytical reasoning and problem solving", category: "self-dev", popularity: 87 },
  { id: "emotional-intelligence", name: "Emotional Intelligence", description: "Self-awareness and relationship management", category: "self-dev", popularity: 89 },
  { id: "productivity-systems", name: "Productivity Systems", description: "Time management and workflow optimization", category: "self-dev", popularity: 84 },
  { id: "decision-making", name: "Decision Making", description: "Strategic thinking and choice architecture", category: "self-dev", popularity: 80 },
  { id: "mindfulness-meditation", name: "Mindfulness", description: "Mental focus and stress management", category: "self-dev", popularity: 86 },
  { id: "learning-how-to-learn", name: "Learning How to Learn", description: "Meta-learning and skill acquisition", category: "self-dev", popularity: 91 },
  { id: "growth-mindset", name: "Growth Mindset", description: "Developing resilience and adaptability", category: "self-dev", popularity: 88 },
  { id: "communication-skills", name: "Communication Skills", description: "Effective speaking and listening techniques", category: "self-dev", popularity: 85 },
  { id: "leadership-basics", name: "Leadership Fundamentals", description: "Team management and influence skills", category: "self-dev", popularity: 83 },
  { id: "future-careers", name: "Future Careers", description: "Emerging job markets and skills", category: "self-dev", popularity: 79 },

  // Future Skills
  { id: "data-literacy", name: "Data Literacy", description: "Understanding and interpreting data", category: "future-skills", popularity: 86 },
  { id: "ux-design-principles", name: "UX Design", description: "User experience design fundamentals", category: "future-skills", popularity: 82 },
  { id: "project-management", name: "Project Management", description: "Agile and traditional project methodologies", category: "future-skills", popularity: 84 },
  { id: "ethical-technology", name: "Ethical Technology", description: "AI ethics and responsible innovation", category: "future-skills", popularity: 77 },
  { id: "systems-thinking", name: "Systems Thinking", description: "Understanding complex interconnected systems", category: "future-skills", popularity: 80 }
];

const CATEGORIES = [
  { id: "all", name: "All Courses", icon: <School />, count: PREDEFINED_TOPICS.length },
  { id: "programming", name: "Programming", icon: <Code />, count: PREDEFINED_TOPICS.filter(t => t.category === "programming").length },
  { id: "science", name: "Science", icon: <Science />, count: PREDEFINED_TOPICS.filter(t => t.category === "science").length },
  { id: "finance", name: "Finance", icon: <TrendingUp />, count: PREDEFINED_TOPICS.filter(t => t.category === "finance").length },
  { id: "self-dev", name: "Self Development", icon: <Psychology />, count: PREDEFINED_TOPICS.filter(t => t.category === "self-dev").length },
  { id: "future-skills", name: "Future Skills", icon: <Rocket />, count: PREDEFINED_TOPICS.filter(t => t.category === "future-skills").length }
];

export default function TopicSelection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
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

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)',
    }}>
      <Container maxWidth="xl" sx={{ 
        py: { xs: 2, md: 3 }, 
        px: { xs: 2, sm: 3 } 
      }}>
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <Fade in timeout={600}>
            <Box>
              <Box sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2,
                boxShadow: '0 8px 32px rgba(126, 87, 194, 0.2)'
              }}>
                <School sx={{ 
                  fontSize: { xs: '2rem', md: '2.5rem' }, 
                  color: 'white' 
                }} />
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1,
                  fontSize: { xs: '1.75rem', md: '2.5rem', lg: '3rem' }
                }}
              >
                Explore Learning Paths
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 400,
                  fontSize: { xs: '0.9rem', md: '1.1rem' }
                }}
              >
                {PREDEFINED_TOPICS.length} curated courses • Start your journey
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
          <Fade in timeout={800}>
            <Paper
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                background: 'white',
                boxShadow: '0 4px 20px rgba(126, 87, 194, 0.08)',
                border: '1px solid rgba(126, 87, 194, 0.1)'
              }}
            >
              <Search sx={{ color: '#7C3AED', mx: 1 }} />
              <InputBase
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1 }}
              />
            </Paper>
          </Fade>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          
          {/* Category Sidebar */}
          <Box sx={{ 
            width: { xs: '100%', lg: '80px' },
            display: 'flex', 
            flexDirection: { xs: 'row', lg: 'column' },
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0
          }}>
            {CATEGORIES.map((category) => (
              <Tooltip key={category.id} title={category.name} placement="right" arrow>
                <Box
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    width: { xs: '50px', lg: '60px' },
                    height: { xs: '50px', lg: '60px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    backgroundColor: selectedCategory === category.id ? '#7C3AED' : 'transparent',
                    color: selectedCategory === category.id ? 'white' : '#7C3AED',
                    border: `2px solid ${selectedCategory === category.id ? '#7C3AED' : 'rgba(126, 87, 194, 0.2)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: selectedCategory === category.id ? '#6B21A8' : 'rgba(126, 87, 194, 0.05)',
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  {category.icon}
                  
                  {/* Badge for course count */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: '#7C3AED',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {category.count}
                  </Box>
                </Box>
              </Tooltip>
            ))}
          </Box>

          {/* Courses Grid */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Selected Category Info */}
            <Box sx={{ mb: 3, textAlign: { xs: 'center', lg: 'left' } }}>
              <Typography variant="h5" fontWeight={700} color="#7C3AED">
                {CATEGORIES.find(cat => cat.id === selectedCategory)?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {filteredTopics.length} courses available
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ 
                mb: 3, 
                borderRadius: 2,
                border: '1px solid rgba(211, 47, 47, 0.2)'
              }}>
                {error}
              </Alert>
            )}

           {/* Courses Grid - Masonry Style for Natural Flow */}
<Box sx={{
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)'
  },
  gap: 2,
  alignContent: 'start'
}}>
  {filteredTopics.map((topic, index) => {
    const categoryData = CATEGORY_DATA[topic.category];
    const isSelected = selectedTopic === topic.id;
    
    // Calculate content height based on text length
    const titleLines = Math.ceil(topic.name.length / 25); // ~25 chars per line
    const descLines = Math.ceil(topic.description.length / 40); // ~40 chars per line
    const totalLines = titleLines + descLines;
    const cardHeight = Math.max(180, 140 + (totalLines * 8)); // Dynamic height
    
    return (
      <Fade in timeout={400 + index * 50} key={topic.id}>
        <Card 
          sx={{ 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: isSelected ? `2px solid ${categoryData.color}` : '1px solid rgba(126, 87, 194, 0.1)',
            background: isSelected ? `linear-gradient(135deg, ${alpha(categoryData.color, 0.08)} 0%, ${alpha(categoryData.color, 0.02)} 100%)` : 'white',
            transform: isSelected ? 'translateY(-2px)' : 'none',
            boxShadow: isSelected ? '0 8px 25px rgba(126, 87, 194, 0.15)' : '0 2px 8px rgba(126, 87, 194, 0.06)',
            borderRadius: 3,
            height: `${cardHeight}px`,
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(126, 87, 194, 0.1)',
            }
          }}
          onClick={() => handleTopicSelect(topic.id)}
        >
          <CardContent sx={{ 
            p: 2.5, 
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header - Fixed */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              mb: 2,
              flexShrink: 0
            }}>
              <Chip
                label={categoryData.name}
                size="small"
                sx={{
                  backgroundColor: alpha(categoryData.color, 0.1),
                  color: categoryData.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: '24px'
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                <Star sx={{ fontSize: 16, color: '#fbbf24' }} />
                <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
                  {topic.popularity}%
                </Typography>
              </Box>
            </Box>

            {/* Content - Flexible */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                sx={{ 
                  mb: 1, 
                  lineHeight: 1.3,
                  fontSize: '1rem'
                }}
              >
                {topic.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.4,
                  fontSize: '0.8rem',
                  flex: 1
                }}
              >
                {topic.description}
              </Typography>
            </Box>

            {/* Selection Indicator */}
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: categoryData.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(126, 87, 194, 0.3)'
                }}
              >
                ✓
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>
    );
  })}
</Box>

          
            {/* No Results */}
            {filteredTopics.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No courses found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different search or category
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Action Button */}
        <Box sx={{ 
          position: 'sticky', 
          bottom: 0, 
          background: 'linear-gradient(transparent, #FAF7FE)',
          py: 3, 
          mt: 4,
          textAlign: 'center'
        }}>
          <Fade in timeout={1200}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartLearning}
              disabled={!selectedTopic || loading}
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.25, md: 1.5 },
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 700,
                background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
                borderRadius: 3,
                minWidth: { xs: '180px', md: '200px' },
                boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 12px 35px rgba(126, 87, 194, 0.4)',
                },
                '&:disabled': {
                  background: 'grey.300',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Start Learning"}
            </Button>
          </Fade>
          
          {selectedTopic && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1, 
                fontWeight: 600, 
                color: '#7C3AED',
                fontSize: { xs: '0.8rem', md: '0.9rem' }
              }}
            >
              Selected: {PREDEFINED_TOPICS.find(t => t.id === selectedTopic)?.name}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}