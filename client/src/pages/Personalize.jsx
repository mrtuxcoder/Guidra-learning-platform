
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




import React, { useState } from "react";
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
  Chip,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Tabs,
  Tab
} from "@mui/material";
import {
  Code,
  Palette,
  Javascript,
  Build,
  DataObject,
  Terminal,
  Web,
  Science,
  Calculate,
  Biotech,
  Psychology,
  Business,
  School,
  HealthAndSafety,
  Public,
  Analytics,
  Security as SecurityIcon,
  TrendingUp,
  Psychology as PsychologyIcon,
  Computer,
  DesignServices,
  Storage,
  Cloud,
  Language,
  Group,
  EmojiObjects,
  SelfImprovement,
  AccountBalance,
  ShowChart,
  Rocket,
  PsychologyAlt,
  VolunteerActivism,
  SmartToy,
  DataThresholding,
  Architecture,
  Psychology as MindIcon
} from "@mui/icons-material";
import { personalizeAndGenerate } from "../api/learning";

// Topic icons mapping
const topicIcons = {
  // 💻 Programming & CS
  "python-basics": <Code sx={{ fontSize: 40 }} />,
  "javascript-fundamentals": <Javascript sx={{ fontSize: 40 }} />,
  "data-structures-algorithms": <Storage sx={{ fontSize: 40 }} />,
  "web-development": <Web sx={{ fontSize: 40 }} />,
  "mobile-app-dev": <Web sx={{ fontSize: 40 }} />,
  "ai-ml-basics": <SmartToy sx={{ fontSize: 40 }} />,
  "cloud-computing": <Cloud sx={{ fontSize: 40 }} />,
  "cybersecurity-essentials": <SecurityIcon sx={{ fontSize: 40 }} />,
  "blockchain-web3": <AccountBalance sx={{ fontSize: 40 }} />,
  "api-design": <DataObject sx={{ fontSize: 40 }} />,

  // 🔬 Science & Tech
  "quantum-computing": <Calculate sx={{ fontSize: 40 }} />,
  "biotechnology": <Biotech sx={{ fontSize: 40 }} />,
  "neuroscience-basics": <Psychology sx={{ fontSize: 40 }} />,
  "space-technology": <Public sx={{ fontSize: 40 }} />,
  "climate-science": <Public sx={{ fontSize: 40 }} />,
  "scientific-method": <Science sx={{ fontSize: 40 }} />,
  "physics-concepts": <Science sx={{ fontSize: 40 }} />,
  "chemistry-foundations": <Biotech sx={{ fontSize: 40 }} />,

  // 💼 Finance & Business
  "personal-finance": <ShowChart sx={{ fontSize: 40 }} />,
  "investing-basics": <TrendingUp sx={{ fontSize: 40 }} />,
  "entrepreneurship": <Business sx={{ fontSize: 40 }} />,
  "digital-marketing": <Analytics sx={{ fontSize: 40 }} />,
  "economics-principles": <AccountBalance sx={{ fontSize: 40 }} />,
  "cryptocurrency": <AccountBalance sx={{ fontSize: 40 }} />,
  "financial-literacy": <ShowChart sx={{ fontSize: 40 }} />,

  // 🧠 Self Development
  "critical-thinking": <EmojiObjects sx={{ fontSize: 40 }} />,
  "emotional-intelligence": <PsychologyIcon sx={{ fontSize: 40 }} />,
  "productivity-systems": <SelfImprovement sx={{ fontSize: 40 }} />,
  "decision-making": <PsychologyAlt sx={{ fontSize: 40 }} />,
  "mindfulness-meditation": <HealthAndSafety sx={{ fontSize: 40 }} />,
  "learning-how-to-learn": <School sx={{ fontSize: 40 }} />,
  "growth-mindset": <MindIcon sx={{ fontSize: 40 }} />,
  "communication-skills": <Language sx={{ fontSize: 40 }} />,
  "leadership-basics": <Group sx={{ fontSize: 40 }} />,
  "future-careers": <Rocket sx={{ fontSize: 40 }} />,

  // 🌐 Future Skills
  "data-literacy": <DataThresholding sx={{ fontSize: 40 }} />,
  "ux-design-principles": <DesignServices sx={{ fontSize: 40 }} />,
  "project-management": <Analytics sx={{ fontSize: 40 }} />,
  "ethical-technology": <VolunteerActivism sx={{ fontSize: 40 }} />,
  "systems-thinking": <Architecture sx={{ fontSize: 40 }} />
};

// All predefined topics organized by field
const PREDEFINED_TOPICS = [
  // 💻 Programming & Computer Science (10 topics)
  { 
    id: "python-basics", 
    name: "Python Programming", 
    description: "Fundamental programming concepts and syntax", 
    level: "Beginner", 
    duration: "4-5 weeks", 
    color: "#3776AB", 
    category: "programming" 
  },
  { 
    id: "javascript-fundamentals", 
    name: "JavaScript Fundamentals", 
    description: "Core concepts of web programming language", 
    level: "Beginner", 
    duration: "4-5 weeks", 
    color: "#F7DF1E", 
    category: "programming" 
  },
  { 
    id: "data-structures-algorithms", 
    name: "Data Structures & Algorithms", 
    description: "Essential computer science foundations", 
    level: "Intermediate", 
    duration: "6-8 weeks", 
    color: "#00BCD4", 
    category: "programming" 
  },
  { 
    id: "web-development", 
    name: "Modern Web Development", 
    description: "Full-stack development principles", 
    level: "Beginner", 
    duration: "5-6 weeks", 
    color: "#E44D26", 
    category: "programming" 
  },
  { 
    id: "ai-ml-basics", 
    name: "AI & Machine Learning", 
    description: "Introduction to artificial intelligence", 
    level: "Intermediate", 
    duration: "4-5 weeks", 
    color: "#FF6B6B", 
    category: "programming" 
  },
  { 
    id: "cloud-computing", 
    name: "Cloud Computing", 
    description: "Understanding cloud services and architecture", 
    level: "Intermediate", 
    duration: "3-4 weeks", 
    color: "#4285F4", 
    category: "programming" 
  },
  { 
    id: "cybersecurity-essentials", 
    name: "Cybersecurity", 
    description: "Digital security principles and practices", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#228B22", 
    category: "programming" 
  },
  { 
    id: "blockchain-web3", 
    name: "Blockchain & Web3", 
    description: "Decentralized technology fundamentals", 
    level: "Intermediate", 
    duration: "4-5 weeks", 
    color: "#3D3D3D", 
    category: "programming" 
  },
  { 
    id: "api-design", 
    name: "API Design", 
    description: "Building and consuming web APIs", 
    level: "Intermediate", 
    duration: "3-4 weeks", 
    color: "#FF5722", 
    category: "programming" 
  },

  // 🔬 Science & Technology (8 topics)
  { 
    id: "quantum-computing", 
    name: "Quantum Computing", 
    description: "Principles of quantum information science", 
    level: "Advanced", 
    duration: "4-5 weeks", 
    color: "#9C27B0", 
    category: "science" 
  },
  { 
    id: "biotechnology", 
    name: "Biotechnology", 
    description: "Biological technology applications", 
    level: "Intermediate", 
    duration: "4-5 weeks", 
    color: "#4CAF50", 
    category: "science" 
  },
  { 
    id: "neuroscience-basics", 
    name: "Neuroscience", 
    description: "Understanding brain and cognition", 
    level: "Intermediate", 
    duration: "4-5 weeks", 
    color: "#2196F3", 
    category: "science" 
  },
  { 
    id: "space-technology", 
    name: "Space Technology", 
    description: "Space exploration and satellite systems", 
    level: "Intermediate", 
    duration: "3-4 weeks", 
    color: "#3F51B5", 
    category: "science" 
  },
  { 
    id: "climate-science", 
    name: "Climate Science", 
    description: "Climate systems and sustainability", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#009688", 
    category: "science" 
  },
  { 
    id: "scientific-method", 
    name: "Scientific Thinking", 
    description: "Critical analysis and research methods", 
    level: "Beginner", 
    duration: "2-3 weeks", 
    color: "#FF9800", 
    category: "science" 
  },
  { 
    id: "physics-concepts", 
    name: "Modern Physics", 
    description: "Key concepts in contemporary physics", 
    level: "Intermediate", 
    duration: "4-5 weeks", 
    color: "#795548", 
    category: "science" 
  },

  // 💼 Finance & Business (7 topics)
  { 
    id: "personal-finance", 
    name: "Personal Finance", 
    description: "Budgeting, saving, and financial planning", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#2196F3", 
    category: "finance" 
  },
  { 
    id: "investing-basics", 
    name: "Investment Principles", 
    description: "Stock market and investment strategies", 
    level: "Beginner", 
    duration: "4-5 weeks", 
    color: "#4CAF50", 
    category: "finance" 
  },
  { 
    id: "entrepreneurship", 
    name: "Entrepreneurship", 
    description: "Starting and scaling businesses", 
    level: "Beginner", 
    duration: "4-5 weeks", 
    color: "#FF9800", 
    category: "finance" 
  },
  { 
    id: "digital-marketing", 
    name: "Digital Marketing", 
    description: "Online marketing strategies and analytics", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#E91E63", 
    category: "finance" 
  },
  { 
    id: "economics-principles", 
    name: "Economics", 
    description: "Market systems and economic theory", 
    level: "Beginner", 
    duration: "4-5 weeks", 
    color: "#607D8B", 
    category: "finance" 
  },
  { 
    id: "cryptocurrency", 
    name: "Cryptocurrency", 
    description: "Digital currencies and blockchain economics", 
    level: "Intermediate", 
    duration: "3-4 weeks", 
    color: "#FF5722", 
    category: "finance" 
  },
  { 
    id: "financial-literacy", 
    name: "Financial Literacy", 
    description: "Essential money management skills", 
    level: "Beginner", 
    duration: "2-3 weeks", 
    color: "#009688", 
    category: "finance" 
  },

  // 🧠 Self Development (10 topics)
  { 
    id: "critical-thinking", 
    name: "Critical Thinking", 
    description: "Analytical reasoning and problem solving", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#9C27B0", 
    category: "self-dev" 
  },
  { 
    id: "emotional-intelligence", 
    name: "Emotional Intelligence", 
    description: "Self-awareness and relationship management", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#FF5722", 
    category: "self-dev" 
  },
  { 
    id: "productivity-systems", 
    name: "Productivity Systems", 
    description: "Time management and workflow optimization", 
    level: "Beginner", 
    duration: "2-3 weeks", 
    color: "#4CAF50", 
    category: "self-dev" 
  },
  { 
    id: "decision-making", 
    name: "Decision Making", 
    description: "Strategic thinking and choice architecture", 
    level: "Beginner", 
    duration: "2-3 weeks", 
    color: "#2196F3", 
    category: "self-dev" 
  },
  { 
    id: "mindfulness-meditation", 
    name: "Mindfulness", 
    description: "Mental focus and stress management", 
    level: "Beginner", 
    duration: "2-3 weeks", 
    color: "#795548", 
    category: "self-dev" 
  },
  { 
    id: "learning-how-to-learn", 
    name: "Learning How to Learn", 
    description: "Meta-learning and skill acquisition", 
    level: "Beginner", 
    duration: "2-3 weeks", 
    color: "#FF9800", 
    category: "self-dev" 
  },
  { 
    id: "growth-mindset", 
    name: "Growth Mindset", 
    description: "Developing resilience and adaptability", 
    level: "Beginner", 
    duration: "2-3 weeks", 
    color: "#E91E63", 
    category: "self-dev" 
  },
  { 
    id: "communication-skills", 
    name: "Communication Skills", 
    description: "Effective speaking and listening techniques", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#00BCD4", 
    category: "self-dev" 
  },
  { 
    id: "leadership-basics", 
    name: "Leadership Fundamentals", 
    description: "Team management and influence skills", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#3F51B5", 
    category: "self-dev" 
  },
  { 
    id: "future-careers", 
    name: "Future Careers", 
    description: "Emerging job markets and skills", 
    level: "Beginner", 
    duration: "2-3 weeks", 
    color: "#FF6B6B", 
    category: "self-dev" 
  },

  // 🌐 Future Skills (5 topics)
  { 
    id: "data-literacy", 
    name: "Data Literacy", 
    description: "Understanding and interpreting data", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#4285F4", 
    category: "future-skills" 
  },
  { 
    id: "ux-design-principles", 
    name: "UX Design", 
    description: "User experience design fundamentals", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#E91E63", 
    category: "future-skills" 
  },
  { 
    id: "project-management", 
    name: "Project Management", 
    description: "Agile and traditional project methodologies", 
    level: "Beginner", 
    duration: "3-4 weeks", 
    color: "#4CAF50", 
    category: "future-skills" 
  },
  { 
    id: "ethical-technology", 
    name: "Ethical Technology", 
    description: "AI ethics and responsible innovation", 
    level: "Intermediate", 
    duration: "2-3 weeks", 
    color: "#607D8B", 
    category: "future-skills" 
  },
  { 
    id: "systems-thinking", 
    name: "Systems Thinking", 
    description: "Understanding complex interconnected systems", 
    level: "Intermediate", 
    duration: "3-4 weeks", 
    color: "#9C27B0", 
    category: "future-skills" 
  }
];

// Categories for tabs
const CATEGORIES = [
  { id: "all", name: "All Courses", icon: <School />, count: PREDEFINED_TOPICS.length },
  { id: "programming", name: "💻 Programming", icon: <Code />, count: PREDEFINED_TOPICS.filter(t => t.category === "programming").length },
  { id: "science", name: "🔬 Science", icon: <Science />, count: PREDEFINED_TOPICS.filter(t => t.category === "science").length },
  { id: "finance", name: "💼 Finance", icon: <TrendingUp />, count: PREDEFINED_TOPICS.filter(t => t.category === "finance").length },
  { id: "self-dev", name: "🧠 Self Dev", icon: <PsychologyIcon />, count: PREDEFINED_TOPICS.filter(t => t.category === "self-dev").length },
  { id: "future-skills", name: "🌐 Future Skills", icon: <Rocket />, count: PREDEFINED_TOPICS.filter(t => t.category === "future-skills").length }
];

export default function TopicSelection() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [hoveredTopic, setHoveredTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    setError("");
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setSelectedTopic(""); // Reset selection when changing category
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
      const response = await personalizeAndGenerate({
        topic: topic.name
      });
      
      window.location.href = `/profile`;
      
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || "Oops! Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter topics based on selected category
  const filteredTopics = selectedCategory === "all" 
    ? PREDEFINED_TOPICS 
    : PREDEFINED_TOPICS.filter(topic => topic.category === selectedCategory);

  return (
    <Container maxWidth="xl" sx={{ 
      py: { xs: 2, md: 4 },
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
    }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
        <Fade in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              mx: 'auto',
              maxWidth: '900px',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              }
            }}
          >
            <Typography 
              variant="h1" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                fontWeight: 800,
                background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2
              }}
            >
              🚀 Future-Proof Your Skills
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9, 
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                fontWeight: 300,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Master {PREDEFINED_TOPICS.length}+ essential skills for the next decade. 
              Theoretical foundations, practical insights, and future-focused learning.
            </Typography>
          </Paper>
        </Fade>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ px: { xs: 1, sm: 2 }, mb: 4 }}>
        <Fade in timeout={1000}>
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 3, 
              p: 2,
              mb: 3,
              background: 'white'
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                textAlign: 'center',
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 3
              }}
            >
              Explore Learning Paths
            </Typography>
            
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              overflowX: 'auto',
              '& .MuiTabs-scroller': {
                overflowX: 'auto !important'
              }
            }}>
              <Tabs
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  minHeight: '60px',
                  '& .MuiTab-root': {
                    minHeight: '50px',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    mx: 0.5,
                    minWidth: 'auto',
                    px: { xs: 1.5, sm: 2 }
                  }
                }}
              >
                {CATEGORIES.map((category) => (
                  <Tab
                    key={category.id}
                    value={category.id}
                    icon={category.icon}
                    iconPosition="start"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{category.name.split(' ')[0]}</span>
                        <Chip 
                          label={category.count} 
                          size="small" 
                          sx={{ 
                            height: '20px', 
                            fontSize: '0.7rem',
                            backgroundColor: selectedCategory === category.id ? 'white' : 'grey.200',
                            color: selectedCategory === category.id ? 'primary.main' : 'grey.700'
                          }} 
                        />
                      </Box>
                    }
                    sx={{
                      backgroundColor: selectedCategory === category.id ? 'primary.main' : 'transparent',
                      color: selectedCategory === category.id ? 'white' : 'text.primary',
                      '&:hover': {
                        backgroundColor: selectedCategory === category.id ? 'primary.dark' : 'grey.100',
                      }
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </Paper>
        </Fade>
      </Box>

      {/* Error Alert */}
      {error && (
        <Zoom in>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              boxShadow: 2,
              mx: { xs: 1, sm: 2 }
            }}
          >
            {error}
          </Alert>
        </Zoom>
      )}

      {/* Topics Grid */}
      <Box sx={{ px: { xs: 1, sm: 2 } }}>
        <Grid container spacing={2} justifyContent="center">
          {filteredTopics.map((topic, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={topic.id}>
              <Zoom in timeout={800 + index * 100}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: selectedTopic === topic.id 
                      ? `3px solid ${topic.color}`
                      : '2px solid transparent',
                    background: selectedTopic === topic.id
                      ? `linear-gradient(135deg, ${alpha(topic.color, 0.08)} 0%, ${alpha(topic.color, 0.03)} 100%)`
                      : 'white',
                    transform: selectedTopic === topic.id 
                      ? 'translateY(-8px) scale(1.02)'
                      : hoveredTopic === topic.id
                      ? 'translateY(-4px) scale(1.01)'
                      : 'translateY(0) scale(1)',
                    boxShadow: selectedTopic === topic.id 
                      ? `0 16px 32px ${alpha(topic.color, 0.15)}`
                      : hoveredTopic === topic.id
                      ? '0 8px 24px rgba(0,0,0,0.12)'
                      : '0 2px 12px rgba(0,0,0,0.06)',
                    borderRadius: 3,
                    overflow: 'visible',
                    position: 'relative',
                    height: '100%',
                    '&::before': selectedTopic === topic.id ? {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background: `linear-gradient(135deg, ${topic.color} 0%, ${alpha(topic.color, 0.5)} 100%)`,
                      borderRadius: 3,
                      zIndex: -1,
                    } : {},
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.01)',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => handleTopicSelect(topic.id)}
                  onMouseEnter={() => setHoveredTopic(topic.id)}
                  onMouseLeave={() => setHoveredTopic("")}
                >
                  <CardContent sx={{ p: 2.5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Topic Icon */}
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${topic.color} 0%, ${alpha(topic.color, 0.7)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        color: 'white',
                        boxShadow: `0 6px 16px ${alpha(topic.color, 0.3)}`
                      }}
                    >
                      {topicIcons[topic.id]}
                    </Box>

                    {/* Topic Name */}
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1,
                        fontSize: '1rem',
                        lineHeight: 1.3
                      }}
                    >
                      {topic.name}
                    </Typography>

                    {/* Topic Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        lineHeight: 1.4,
                        flexGrow: 1,
                        fontSize: '0.8rem'
                      }}
                    >
                      {topic.description}
                    </Typography>

                    {/* Chips for Level and Duration */}
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mb: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={topic.level}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: topic.color,
                          color: topic.color,
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          height: '20px'
                        }}
                      />
                      <Chip 
                        label={topic.duration}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: theme.palette.grey[400],
                          color: theme.palette.grey[700],
                          fontWeight: 500,
                          fontSize: '0.65rem',
                          height: '20px'
                        }}
                      />
                    </Box>

                    {/* Selection Indicator */}
                    {selectedTopic === topic.id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: topic.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          boxShadow: `0 2px 8px ${alpha(topic.color, 0.5)}`
                        }}
                      >
                        ✓
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* No topics found message */}
        {filteredTopics.length === 0 && (
          <Fade in timeout={800}>
            <Paper 
              sx={{ 
                p: 6, 
                textAlign: 'center', 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No courses found in this category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try selecting a different category or check back later for new courses.
              </Typography>
            </Paper>
          </Fade>
        )}
      </Box>

      {/* Start Button */}
      <Fade in timeout={2000}>
        <Box sx={{ textAlign: 'center', mt: 6, mb: 4, px: { xs: 2, sm: 0 } }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartLearning}
            disabled={!selectedTopic || loading}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 3,
              boxShadow: selectedTopic 
                ? '0 12px 30px rgba(102, 126, 234, 0.4)'
                : '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 16px 40px rgba(102, 126, 234, 0.5)',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              },
              '&:disabled': {
                background: theme.palette.grey[300],
                color: theme.palette.grey[500],
                transform: 'none',
                boxShadow: 'none'
              },
              minWidth: { xs: '180px', sm: '200px' }
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 16, 
                    height: 16, 
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} 
                />
                Starting...
              </Box>
            ) : (
              "Start Learning Journey 🚀"
            )}
          </Button>
          
          {!selectedTopic && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 2, fontStyle: 'italic' }}
            >
              Select a topic above to begin your learning adventure
            </Typography>
          )}
          
          {selectedTopic && (
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ mt: 2, fontWeight: 600 }}
            >
              Ready to start learning: {PREDEFINED_TOPICS.find(t => t.id === selectedTopic)?.name}
            </Typography>
          )}
        </Box>
      </Fade>

      {/* Add CSS animation for spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
}