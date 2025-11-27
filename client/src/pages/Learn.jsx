
// import { useState, useEffect, useCallback } from "react";
// import {
//   Box,
//   Typography,
//   Alert,
//   useTheme,
//   useMediaQuery,
//   Drawer,
//   IconButton,
//   Button,
// } from "@mui/material";
// import { Menu, Refresh } from "@mui/icons-material";
// import { getProfile } from "../api/auth";
// import { 
//   getSubtopics, 
//   teachSubtopic, 
//   regenerateContent, 
//   updateSubtopicProgress,
//   incrementGenerationCount, 
//   getGenerationCount 
// } from "../api/learning";
// import LearningSidebar from "../components/LearningSidebar";
// import LearningHeader from "../components/LearningHeader";
// import LearningContent from "../components/LearningContent";
// import WelcomeState from "../components/WelcomeState";
// import LoadingState from "../components/LoadingState";

// // Consistent color palette
// const purplePalette = {
//   50: '#FAF7FE',
//   100: '#F3E8FF',
//   200: '#E9D5FF',
//   300: '#D8B4FE',
//   400: '#C084FC',
//   500: '#A855F7',
//   600: '#9333EA',
//   700: '#7C3AED',
//   800: '#6B21A8',
//   900: '#581C87'
// };

// export default function Learning() {
//   const [topics, setTopics] = useState([]);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [subtopics, setSubtopics] = useState([]);
//   const [selectedSubtopic, setSelectedSubtopic] = useState(null);
//   const [content, setContent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [contentLoading, setContentLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [contentError, setContentError] = useState("");
//   const [updatingSubtopic, setUpdatingSubtopic] = useState(null);
//   const [contentInfo, setContentInfo] = useState({ cached: false, version: 1 });
//   const [generationCounts, setGenerationCounts] = useState({});
//   const [contentCache, setContentCache] = useState({});
//   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
//   const [showError, setShowError] = useState(false);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const MAX_GENERATIONS = 3;

//   // Memoized fetch functions
//   const fetchUserTopics = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const { data } = await getProfile();
//       setTopics(data.user.progress || []);
      
//       if (data.user.progress?.length > 0) {
//         const firstTopic = data.user.progress[0];
//         setSelectedTopic(firstTopic.topic);
//         await fetchSubtopics(firstTopic.topic);
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to load topics";
//       setError(errorMsg);
//       setShowError(true);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchSubtopics = useCallback(async (topic) => {
//     try {
//       setLoading(true);
//       setError("");
//       setSelectedTopic(topic);
//       const { data } = await getSubtopics(topic);
//       setSubtopics(data.subTopics || []);
      
//       fetchGenerationCounts(data.subTopics || [], topic);
      
//       if (isMobile) {
//         setMobileDrawerOpen(false);
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to load subtopics";
//       setError(errorMsg);
//       setShowError(true);
//     } finally {
//       setLoading(false);
//     }
//   }, [isMobile]);

//   const fetchGenerationCounts = useCallback(async (subtopics, topic) => {
//     try {
//       const counts = {};
//       for (const subtopic of subtopics) {
//         try {
//           const { data } = await getGenerationCount(topic, subtopic.name);
//           counts[subtopic.name] = data.data.generationCount;
//         } catch (err) {
//           counts[subtopic.name] = 0;
//         }
//       }
//       setGenerationCounts(counts);
//     } catch (err) {
//       console.error("Error fetching generation counts:", err);
//     }
//   }, []);

//   const handleIncrementGenerationCount = useCallback(async (subtopicName) => {
//     try {
//       await incrementGenerationCount({
//         topic: selectedTopic,
//         subtopic: subtopicName
//       });
      
//       setGenerationCounts(prev => ({
//         ...prev,
//         [subtopicName]: Math.min((prev[subtopicName] || 0) + 1, MAX_GENERATIONS)
//       }));
//     } catch (err) {
//       console.error("Error incrementing generation count:", err);
//     }
//   }, [selectedTopic, MAX_GENERATIONS]);

//   const handleGenerateContent = useCallback(async (subtopic = selectedSubtopic) => {
//     if (!subtopic || !selectedTopic) return;
    
//     try {
//       setContentLoading(true);
//       setContentError("");
      
//       const cacheKey = `${selectedTopic}-${subtopic.name}`;
//       if (contentCache[cacheKey]) {
//         setContent(contentCache[cacheKey].content);
//         setContentInfo(contentCache[cacheKey].info);
//         setContentLoading(false);
//         return;
//       }

//       const { data } = await teachSubtopic({
//         topic: selectedTopic,
//         subtopic: subtopic.name
//       });

//       if (!data.cached) {
//         await handleIncrementGenerationCount(subtopic.name);
//       }
      
//       setContent(data.data);
//       setContentInfo({
//         cached: data.cached || false,
//         version: data.version || 1,
//         source: data.cached ? "cache" : "ai"
//       });
      
//       setContentCache(prev => ({
//         ...prev,
//         [cacheKey]: {
//           content: data.data,
//           info: {
//             cached: data.cached || false,
//             version: data.version || 1,
//             source: data.cached ? "cache" : "ai"
//           }
//         }
//       }));
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Failed to generate content";
//       setContentError(errorMessage);
//       setShowError(true);
//     } finally {
//       setContentLoading(false);
//     }
//   }, [selectedTopic, selectedSubtopic, contentCache, handleIncrementGenerationCount]);

//   const handleSelectSubtopic = useCallback(async (subtopic) => {
//     setSelectedSubtopic(subtopic);
//     setContentError("");
    
//     const cacheKey = `${selectedTopic}-${subtopic.name}`;
//     if (contentCache[cacheKey]) {
//       setContent(contentCache[cacheKey].content);
//       setContentInfo(contentCache[cacheKey].info);
//     } else {
//       await handleGenerateContent(subtopic);
//     }
//     if (isMobile) {
//       setMobileDrawerOpen(false);
//     }
//   }, [selectedTopic, contentCache, handleGenerateContent, isMobile]);

//   const getRemainingGenerations = useCallback((subtopicName) => {
//     const used = generationCounts[subtopicName] || 0;
//     return Math.max(0, MAX_GENERATIONS - used);
//   }, [generationCounts, MAX_GENERATIONS]);

//   const canGenerate = useCallback((subtopicName) => {
//     return getRemainingGenerations(subtopicName) > 0;
//   }, [getRemainingGenerations]);

//   const handleRegenerateContent = useCallback(async () => {
//     if (!selectedSubtopic || !selectedTopic) return;
    
//     const subtopicName = selectedSubtopic.name;
    
//     if (!canGenerate(subtopicName)) {
//       setContentError(`Generation limit reached (${MAX_GENERATIONS} times)`);
//       setShowError(true);
//       return;
//     }

//     try {
//       setContentLoading(true);
//       setContentError("");
//       const { data } = await regenerateContent({
//         topic: selectedTopic,
//         subtopic: subtopicName
//       });
      
//       await handleIncrementGenerationCount(subtopicName);

//       setContent(data.data);
//       setContentInfo({
//         cached: false,
//         version: data.version || 1,
//         source: "ai"
//       });
      
//       const cacheKey = `${selectedTopic}-${subtopicName}`;
//       setContentCache(prev => ({
//         ...prev,
//         [cacheKey]: {
//           content: data.data,
//           info: {
//             cached: false,
//             version: data.version || 1,
//             source: "ai"
//           }
//         }
//       }));
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Failed to regenerate content";
//       setContentError(errorMessage);
//       setShowError(true);
//     } finally {
//       setContentLoading(false);
//     }
//   }, [selectedTopic, selectedSubtopic, canGenerate, handleIncrementGenerationCount]);

//   const handleUpdateUnderstanding = useCallback(async (subtopic, newUnderstanding) => {
//     const previousUnderstanding = subtopic.understandingLevel;
    
//     try {
//       setUpdatingSubtopic(subtopic.name);
//       setError("");
      
//       setSubtopics(prev => prev.map(sub => 
//         sub.name === subtopic.name 
//           ? { ...sub, understandingLevel: newUnderstanding }
//           : sub
//       ));

//       if (selectedSubtopic?.name === subtopic.name) {
//         setSelectedSubtopic(prev => ({ ...prev, understandingLevel: newUnderstanding }));
//       }

//       await updateSubtopicProgress({
//         topic: selectedTopic,
//         subtopicName: subtopic.name,
//         completed: subtopic.completed,
//         understandingLevel: newUnderstanding
//       });

//     } catch (err) {
//       setSubtopics(prev => prev.map(sub => 
//         sub.name === subtopic.name 
//           ? { ...sub, understandingLevel: previousUnderstanding }
//           : sub
//       ));

//       if (selectedSubtopic?.name === subtopic.name) {
//         setSelectedSubtopic(prev => ({ ...prev, understandingLevel: previousUnderstanding }));
//       }

//       setError("Failed to update understanding");
//       setShowError(true);
//     } finally {
//       setUpdatingSubtopic(null);
//     }
//   }, [selectedTopic, selectedSubtopic]);

//   const handleCompleteSubtopic = useCallback(async (subtopic) => {
//     if (!subtopic.understandingLevel || subtopic.understandingLevel < 1) {
//       setContentError("Please rate your understanding first");
//       setShowError(true);
//       return;
//     }

//     try {
//       setUpdatingSubtopic(subtopic.name);
//       setError("");
      
//       await updateSubtopicProgress({
//         topic: selectedTopic,
//         subtopicName: subtopic.name,
//         completed: true,
//         understandingLevel: subtopic.understandingLevel
//       });

//       setSubtopics(prev => prev.map(sub => 
//         sub.name === subtopic.name 
//           ? { ...sub, completed: true }
//           : sub
//       ));

//       if (selectedSubtopic?.name === subtopic.name) {
//         setSelectedSubtopic(prev => ({ ...prev, completed: true }));
//       }

//     } catch (err) {
//       setError("Failed to complete subtopic");
//       setShowError(true);
//     } finally {
//       setUpdatingSubtopic(null);
//     }
//   }, [selectedTopic, selectedSubtopic]);

//   const calculateProgress = useCallback(() => {
//     if (!subtopics.length) return 0;
//     const completed = subtopics.filter(sub => sub.completed).length;
//     return (completed / subtopics.length) * 100;
//   }, [subtopics]);

//   const handleCloseError = useCallback(() => {
//     setShowError(false);
//     setError("");
//     setContentError("");
//   }, []);

//   const handleRetryContent = useCallback(() => {
//     if (selectedSubtopic) {
//       handleGenerateContent(selectedSubtopic);
//     }
//   }, [selectedSubtopic, handleGenerateContent]);

//   // Effects
//   useEffect(() => {
//     fetchUserTopics();
//   }, [fetchUserTopics]);

//   useEffect(() => {
//     if (selectedSubtopic) {
//       setContentError("");
//       setShowError(false);
//     }
//   }, [selectedSubtopic]);

//   const currentError = contentError || error;

//   return (
//     <Box sx={{ 
//       display: 'flex', 
//       height: '100vh', 
//       background: 'white',
//       flexDirection: { xs: 'column', md: 'row' },
//       overflow: 'hidden'
//     }}>
//       {/* Mobile Header */}
//       {isMobile && (
//         <Box sx={{ 
//           p: 1.5, 
//           background: 'white',
//           borderBottom: '1px solid rgba(126, 87, 194, 0.1)',
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1.5,
//           flexShrink: 0
//         }}>
//           <IconButton
//             onClick={() => setMobileDrawerOpen(true)}
//             sx={{ color: purplePalette[600] }}
//           >
//             <Menu />
//           </IconButton>
//           <Typography variant="h6" fontWeight="600" sx={{
//             color: purplePalette[600]
//           }}>
//             Learning
//           </Typography>
//         </Box>
//       )}

//       {/* Sidebar */}
//       {isMobile ? (
//         <Drawer
//           anchor="left"
//           open={mobileDrawerOpen}
//           onClose={() => setMobileDrawerOpen(false)}
//           sx={{
//             '& .MuiDrawer-paper': {
//               width: '100%',
//               maxWidth: 320,
//               height: '100vh',
//               overflow: 'hidden',
//               background: 'white'
//             }
//           }}
//         >
//           <LearningSidebar
//             topics={topics}
//             subtopics={subtopics}
//             selectedTopic={selectedTopic}
//             selectedSubtopic={selectedSubtopic}
//             updatingSubtopic={updatingSubtopic}
//             contentCache={contentCache}
//             generationCounts={generationCounts}
//             onTopicSelect={fetchSubtopics}
//             onSubtopicSelect={handleSelectSubtopic}
//             onUpdateUnderstanding={handleUpdateUnderstanding}
//             progress={calculateProgress()}
//             colorPalette={purplePalette}
//           />
//         </Drawer>
//       ) : (
//         <Box sx={{ 
//           width: 320,
//           flexShrink: 0,
//           borderRight: '1px solid rgba(126, 87, 194, 0.1)'
//         }}>
//           <LearningSidebar
//             topics={topics}
//             subtopics={subtopics}
//             selectedTopic={selectedTopic}
//             selectedSubtopic={selectedSubtopic}
//             updatingSubtopic={updatingSubtopic}
//             contentCache={contentCache}
//             generationCounts={generationCounts}
//             onTopicSelect={fetchSubtopics}
//             onSubtopicSelect={handleSelectSubtopic}
//             onUpdateUnderstanding={handleUpdateUnderstanding}
//             progress={calculateProgress()}
//             colorPalette={purplePalette}
//           />
//         </Box>
//       )}

//       {/* Main Content Area */}
//       <Box sx={{ 
//         flex: 1, 
//         display: 'flex', 
//         flexDirection: 'column',
//         minHeight: 0,
//         overflow: 'hidden'
//       }}>
//         {/* Header */}
//         <Box sx={{ 
//           flexShrink: 0,
//           p: { xs: 1.5, md: 2 },
//           borderBottom: '1px solid rgba(126, 87, 194, 0.1)'
//         }}>
//           <LearningHeader
//             selectedTopic={selectedTopic}
//             selectedSubtopic={selectedSubtopic}
//             updatingSubtopic={updatingSubtopic}
//             contentInfo={contentInfo}
//             remainingGenerations={selectedSubtopic ? getRemainingGenerations(selectedSubtopic.name) : 0}
//             maxGenerations={MAX_GENERATIONS}
//             contentLoading={contentLoading}
//             onRegenerateContent={handleRegenerateContent}
//             onCompleteSubtopic={handleCompleteSubtopic}
//             onUpdateUnderstanding={handleUpdateUnderstanding}
//             colorPalette={purplePalette}
//           />
//         </Box>

//         {/* Error Alert */}
//         {showError && currentError && (
//           <Box sx={{ 
//             flexShrink: 0,
//             p: { xs: 1.5, md: 2 },
//             pb: 0
//           }}>
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 borderRadius: 1,
//                 fontSize: '0.875rem'
//               }} 
//               onClose={handleCloseError}
//               action={
//                 contentError && selectedSubtopic && (
//                   <Button 
//                     color="inherit" 
//                     size="small" 
//                     startIcon={<Refresh />}
//                     onClick={handleRetryContent}
//                     sx={{ fontWeight: 600, fontSize: '0.75rem' }}
//                   >
//                     Retry
//                   </Button>
//                 )
//               }
//             >
//               {currentError}
//             </Alert>
//           </Box>
//         )}

//         {/* Content Area */}
//         <Box sx={{ 
//           flex: 1,
//           minHeight: 0,
//           overflow: 'hidden'
//         }}>
//           {contentLoading ? (
//             <LoadingState 
//               isContentLoading={true} 
//               source={contentInfo?.source} 
//               colorPalette={purplePalette}
//             />
//           ) : content && selectedSubtopic && !contentError ? (
//             <LearningContent
//               content={content}
//               contentInfo={contentInfo}
//               selectedTopic={selectedTopic}
//               selectedSubtopic={selectedSubtopic}
//               contentLoading={contentLoading}
//               contentError={contentError}
//               onRetry={handleRetryContent}
//               colorPalette={purplePalette}
//             />
//           ) : (
//             <WelcomeState 
//               subtopicName={selectedSubtopic?.name}
//               isReady={!!selectedSubtopic}
//               onGenerateContent={() => handleGenerateContent(selectedSubtopic)}
//               error={contentError}
//               onRetry={handleRetryContent}
//               colorPalette={purplePalette}
//             />
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// }



import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Button,
} from "@mui/material";
import { Menu, Refresh } from "@mui/icons-material";
import { getProfile } from "../api/auth";
import { 
  getSubtopics, 
  teachSubtopic, 
  regenerateContent, 
  updateSubtopicProgress,
  incrementGenerationCount, 
  getGenerationCount 
} from "../api/learning";
import LearningSidebar from "../components/LearningSidebar";
import LearningHeader from "../components/LearningHeader";
import LearningContent from "../components/LearningContent";
import WelcomeState from "../components/WelcomeState";
import LoadingState from "../components/LoadingState";

// Consistent color palette
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

export default function Learning() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState("");
  const [contentError, setContentError] = useState("");
  const [updatingSubtopic, setUpdatingSubtopic] = useState(null);
  const [contentInfo, setContentInfo] = useState({ cached: false, version: 1 });
  const [generationCounts, setGenerationCounts] = useState({});
  const [contentCache, setContentCache] = useState({});
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const MAX_GENERATIONS = 3;

  // Memoized fetch functions
  const fetchUserTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getProfile();
      setTopics(data.user.progress || []);
      
      if (data.user.progress?.length > 0) {
        const firstTopic = data.user.progress[0];
        setSelectedTopic(firstTopic.topic);
        await fetchSubtopics(firstTopic.topic);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load topics";
      setError(errorMsg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubtopics = useCallback(async (topic) => {
    try {
      setLoading(true);
      setError("");
      setSelectedTopic(topic);
      const { data } = await getSubtopics(topic);
      setSubtopics(data.subTopics || []);
      
      fetchGenerationCounts(data.subTopics || [], topic);
      
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load subtopics";
      setError(errorMsg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }, [isMobile]);

  const fetchGenerationCounts = useCallback(async (subtopics, topic) => {
    try {
      const counts = {};
      for (const subtopic of subtopics) {
        try {
          const { data } = await getGenerationCount(topic, subtopic.name);
          counts[subtopic.name] = data.data.generationCount;
        } catch (err) {
          counts[subtopic.name] = 0;
        }
      }
      setGenerationCounts(counts);
    } catch (err) {
      console.error("Error fetching generation counts:", err);
    }
  }, []);

  const handleIncrementGenerationCount = useCallback(async (subtopicName) => {
    try {
      await incrementGenerationCount({
        topic: selectedTopic,
        subtopic: subtopicName
      });
      
      setGenerationCounts(prev => ({
        ...prev,
        [subtopicName]: Math.min((prev[subtopicName] || 0) + 1, MAX_GENERATIONS)
      }));
    } catch (err) {
      console.error("Error incrementing generation count:", err);
    }
  }, [selectedTopic, MAX_GENERATIONS]);

  const handleGenerateContent = useCallback(async (subtopic = selectedSubtopic) => {
    if (!subtopic || !selectedTopic) return;
    
    try {
      setContentLoading(true);
      setContentError("");
      
      const cacheKey = `${selectedTopic}-${subtopic.name}`;
      if (contentCache[cacheKey]) {
        setContent(contentCache[cacheKey].content);
        setContentInfo(contentCache[cacheKey].info);
        setContentLoading(false);
        return;
      }

      const { data } = await teachSubtopic({
        topic: selectedTopic,
        subtopic: subtopic.name
      });

      if (!data.cached) {
        await handleIncrementGenerationCount(subtopic.name);
      }
      
      setContent(data.data);
      setContentInfo({
        cached: data.cached || false,
        version: data.version || 1,
        source: data.cached ? "cache" : "ai"
      });
      
      setContentCache(prev => ({
        ...prev,
        [cacheKey]: {
          content: data.data,
          info: {
            cached: data.cached || false,
            version: data.version || 1,
            source: data.cached ? "cache" : "ai"
          }
        }
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to generate content";
      setContentError(errorMessage);
      setShowError(true);
    } finally {
      setContentLoading(false);
    }
  }, [selectedTopic, selectedSubtopic, contentCache, handleIncrementGenerationCount]);

  const handleSelectSubtopic = useCallback(async (subtopic) => {
    setSelectedSubtopic(subtopic);
    setContentError("");
    
    const cacheKey = `${selectedTopic}-${subtopic.name}`;
    if (contentCache[cacheKey]) {
      setContent(contentCache[cacheKey].content);
      setContentInfo(contentCache[cacheKey].info);
    } else {
      await handleGenerateContent(subtopic);
    }
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [selectedTopic, contentCache, handleGenerateContent, isMobile]);

  const getRemainingGenerations = useCallback((subtopicName) => {
    const used = generationCounts[subtopicName] || 0;
    return Math.max(0, MAX_GENERATIONS - used);
  }, [generationCounts, MAX_GENERATIONS]);

  const canGenerate = useCallback((subtopicName) => {
    return getRemainingGenerations(subtopicName) > 0;
  }, [getRemainingGenerations]);

  const handleRegenerateContent = useCallback(async () => {
    if (!selectedSubtopic || !selectedTopic) return;
    
    const subtopicName = selectedSubtopic.name;
    
    if (!canGenerate(subtopicName)) {
      setContentError(`Generation limit reached (${MAX_GENERATIONS} times)`);
      setShowError(true);
      return;
    }

    try {
      setContentLoading(true);
      setContentError("");
      const { data } = await regenerateContent({
        topic: selectedTopic,
        subtopic: subtopicName
      });
      
      await handleIncrementGenerationCount(subtopicName);

      setContent(data.data);
      setContentInfo({
        cached: false,
        version: data.version || 1,
        source: "ai"
      });
      
      const cacheKey = `${selectedTopic}-${subtopicName}`;
      setContentCache(prev => ({
        ...prev,
        [cacheKey]: {
          content: data.data,
          info: {
            cached: false,
            version: data.version || 1,
            source: "ai"
          }
        }
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to regenerate content";
      setContentError(errorMessage);
      setShowError(true);
    } finally {
      setContentLoading(false);
    }
  }, [selectedTopic, selectedSubtopic, canGenerate, handleIncrementGenerationCount]);

  const handleUpdateUnderstanding = useCallback(async (subtopic, newUnderstanding) => {
    const previousUnderstanding = subtopic.understandingLevel;
    
    try {
      setUpdatingSubtopic(subtopic.name);
      setError("");
      
      setSubtopics(prev => prev.map(sub => 
        sub.name === subtopic.name 
          ? { ...sub, understandingLevel: newUnderstanding }
          : sub
      ));

      if (selectedSubtopic?.name === subtopic.name) {
        setSelectedSubtopic(prev => ({ ...prev, understandingLevel: newUnderstanding }));
      }

      await updateSubtopicProgress({
        topic: selectedTopic,
        subtopicName: subtopic.name,
        completed: subtopic.completed,
        understandingLevel: newUnderstanding
      });

    } catch (err) {
      setSubtopics(prev => prev.map(sub => 
        sub.name === subtopic.name 
          ? { ...sub, understandingLevel: previousUnderstanding }
          : sub
      ));

      if (selectedSubtopic?.name === subtopic.name) {
        setSelectedSubtopic(prev => ({ ...prev, understandingLevel: previousUnderstanding }));
      }

      setError("Failed to update understanding");
      setShowError(true);
    } finally {
      setUpdatingSubtopic(null);
    }
  }, [selectedTopic, selectedSubtopic]);

  const handleCompleteSubtopic = useCallback(async (subtopic) => {
    if (!subtopic.understandingLevel || subtopic.understandingLevel < 1) {
      setContentError("Please rate your understanding first");
      setShowError(true);
      return;
    }

    try {
      setUpdatingSubtopic(subtopic.name);
      setError("");
      
      await updateSubtopicProgress({
        topic: selectedTopic,
        subtopicName: subtopic.name,
        completed: true,
        understandingLevel: subtopic.understandingLevel
      });

      setSubtopics(prev => prev.map(sub => 
        sub.name === subtopic.name 
          ? { ...sub, completed: true }
          : sub
      ));

      if (selectedSubtopic?.name === subtopic.name) {
        setSelectedSubtopic(prev => ({ ...prev, completed: true }));
      }

    } catch (err) {
      setError("Failed to complete subtopic");
      setShowError(true);
    } finally {
      setUpdatingSubtopic(null);
    }
  }, [selectedTopic, selectedSubtopic]);

  const calculateProgress = useCallback(() => {
    if (!subtopics.length) return 0;
    const completed = subtopics.filter(sub => sub.completed).length;
    return (completed / subtopics.length) * 100;
  }, [subtopics]);

  const handleCloseError = useCallback(() => {
    setShowError(false);
    setError("");
    setContentError("");
  }, []);

  const handleRetryContent = useCallback(() => {
    if (selectedSubtopic) {
      handleGenerateContent(selectedSubtopic);
    }
  }, [selectedSubtopic, handleGenerateContent]);

  // Effects
  useEffect(() => {
    fetchUserTopics();
  }, [fetchUserTopics]);

  useEffect(() => {
    if (selectedSubtopic) {
      setContentError("");
      setShowError(false);
    }
  }, [selectedSubtopic]);

  const currentError = contentError || error;
  const handleNavigateSubtopic = useCallback((subtopic) => {
  handleSelectSubtopic(subtopic);
}, [handleSelectSubtopic]);
const handleNavigateToFirstIncomplete = useCallback((subtopic) => {
  handleSelectSubtopic(subtopic);
}, [handleSelectSubtopic]);

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      background: 'white',
      flexDirection: { xs: 'column', md: 'row' },
      overflow: 'hidden'
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <Box sx={{ 
          p: 1.5, 
          background: 'white',
          borderBottom: '1px solid rgba(126, 87, 194, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexShrink: 0
        }}>
          <IconButton
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ color: purplePalette[600] }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" fontWeight="600" sx={{
            color: purplePalette[600]
          }}>
            Learning
          </Typography>
        </Box>
      )}

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              maxWidth: 320,
              height: '100vh',
              overflow: 'hidden',
              background: 'white'
            }
          }}
        >
          <LearningSidebar
            topics={topics}
            subtopics={subtopics}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
            updatingSubtopic={updatingSubtopic}
            contentCache={contentCache}
            generationCounts={generationCounts}
            onTopicSelect={fetchSubtopics}
            onSubtopicSelect={handleSelectSubtopic}
            onUpdateUnderstanding={handleUpdateUnderstanding}
            progress={calculateProgress()}
            colorPalette={purplePalette}
          />
        </Drawer>
      ) : (
        <Box sx={{ 
          width: 320,
          flexShrink: 0,
          borderRight: '1px solid rgba(126, 87, 194, 0.1)'
        }}>
          <LearningSidebar
            topics={topics}
            subtopics={subtopics}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
            updatingSubtopic={updatingSubtopic}
            contentCache={contentCache}
            generationCounts={generationCounts}
            onTopicSelect={fetchSubtopics}
            onSubtopicSelect={handleSelectSubtopic}
            onUpdateUnderstanding={handleUpdateUnderstanding}
            progress={calculateProgress()}
            colorPalette={purplePalette}
          />
        </Box>
      )}

      {/* Main Content Area */}
    <Box sx={{ 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
    pb: isMobile ? '120px' : 0 // Add padding for mobile footer
  }}>
        {/* Header */}
        <Box sx={{ 
          flexShrink: 0,
          p: { xs: 1.5, md: 2 },
          borderBottom: '1px solid rgba(126, 87, 194, 0.1)'
        }}>
<LearningHeader
  selectedTopic={selectedTopic}
  selectedSubtopic={selectedSubtopic}
  subtopics={subtopics}
  updatingSubtopic={updatingSubtopic}
  contentInfo={contentInfo}
  remainingGenerations={selectedSubtopic ? getRemainingGenerations(selectedSubtopic.name) : 0}
  maxGenerations={MAX_GENERATIONS}
  contentLoading={contentLoading}
  onRegenerateContent={handleRegenerateContent}
  onCompleteSubtopic={handleCompleteSubtopic}
  onUpdateUnderstanding={handleUpdateUnderstanding}
  onNavigateSubtopic={handleNavigateSubtopic}
  onOpenSidebar={() => setMobileDrawerOpen(true)} // Add this
  colorPalette={purplePalette}
/>
        </Box>

        {/* Error Alert */}
        {showError && currentError && (
          <Box sx={{ 
            flexShrink: 0,
            p: { xs: 1.5, md: 2 },
            pb: 0
          }}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1,
                fontSize: '0.875rem'
              }} 
              onClose={handleCloseError}
              action={
                contentError && selectedSubtopic && (
                  <Button 
                    color="inherit" 
                    size="small" 
                    startIcon={<Refresh />}
                    onClick={handleRetryContent}
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    Retry
                  </Button>
                )
              }
            >
              {currentError}
            </Alert>
          </Box>
        )}

        {/* Content Area */}
        <Box sx={{ 
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {contentLoading ? (
            <LoadingState 
              isContentLoading={true} 
              source={contentInfo?.source} 
              colorPalette={purplePalette}
            />
          ) : content && selectedSubtopic && !contentError ? (
            <LearningContent
              content={content}
              contentInfo={contentInfo}
              selectedTopic={selectedTopic}
              selectedSubtopic={selectedSubtopic}
              contentLoading={contentLoading}
              contentError={contentError}
              onRetry={handleRetryContent}
              colorPalette={purplePalette}
            />
          ) : (
         <WelcomeState 
  subtopicName={selectedSubtopic?.name}
  isReady={!!selectedSubtopic}
  onGenerateContent={() => handleGenerateContent(selectedSubtopic)}
  error={contentError}
  onRetry={handleRetryContent}
  subtopics={subtopics} // Add this
  onNavigateToFirstIncomplete={handleNavigateToFirstIncomplete} // Add this
  colorPalette={purplePalette}
/>
          )}
        </Box>
      </Box>
    </Box>
  );
}