// import React, { useState, useMemo } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Fade,
//   useTheme,
//   useMediaQuery,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Button,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Alert,
//   LinearProgress,
//   IconButton,
//   Tooltip
// } from "@mui/material";
// import {
//   ExpandMore,
//   Quiz,
//   CheckCircle,
//   Cancel,
//   AutoAwesome,
//   Psychology,
//   VolumeUp
// } from "@mui/icons-material";
// import MermaidDiagram from "../components/MermaidDiagram";
// import WelcomeState from "./WelcomeState";
// import LoadingState from "./LoadingState";
// import { updateQuizMarks, generateMermaidMindmap } from '../api/learning';

// const LearningContent = ({ 
//   content, 
//   contentInfo, 
//   selectedTopic, 
//   selectedSubtopic, 
//   contentLoading, 
//   onGenerateContent,
//   colorPalette,
//   userRemainingGenerations = 5
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
//   // State declarations
//   const [mindmapData, setMindmapData] = useState(null);
//   const [regeneratingMindmap, setRegeneratingMindmap] = useState(false);
//   const [quizAnswers, setQuizAnswers] = useState({});
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [quizResults, setQuizResults] = useState({ correct: 0, wrong: 0 });
//   const [savingQuiz, setSavingQuiz] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     concept: true,
//     explanation: true,
//     learningActions: true,
//     examples: true,
//     practice: true
//   });

//   // Handle mindmap regeneration
//   const handleManualMindmapRegenerate = async () => {
//     if (!selectedTopic || !selectedSubtopic?.name) {
//       console.error('Missing topic or subtopic for mindmap regeneration');
//       return;
//     }

//     try {
//       setRegeneratingMindmap(true);
//       const response = await generateMermaidMindmap({
//         topic: selectedTopic,
//         subtopic: selectedSubtopic.name
//       });
      
//       if (response?.data?.mindmap) {
//         setMindmapData(prev => ({
//           ...prev,
//           mindmap: response.data.mindmap,
//           hasError: false
//         }));
//       }
//     } catch (error) {
//       console.error('Failed to regenerate mindmap:', error);
//       setMindmapData(prev => ({
//         ...prev,
//         hasError: true
//       }));
//     } finally {
//       setRegeneratingMindmap(false);
//     }
//   };

//   // Safe content access with fallbacks
//   const safeContent = useMemo(() => {
//     // Use the regenerated mindmap if available, otherwise use the original content
//     const currentMindmap = mindmapData?.mindmap || content?.mindmap;
    
//     return {
//       concept: content?.concept || content?.keyConcepts?.[0] || '',
//       explanation: content?.explanation || '',
//       learningActions: Array.isArray(content?.learningActions) ? content.learningActions : [],
//       examples: Array.isArray(content?.examples) ? content.examples : [],
//       practice: content?.practice || '',
//       mindmap: currentMindmap,
//       quiz: Array.isArray(content?.quiz) ? content.quiz : [],
//       title: content?.title || selectedSubtopic?.name || ''
//     };
//   }, [content, selectedSubtopic, mindmapData]);

//   // Initialize mindmap data when content changes
//   React.useEffect(() => {
//     if (content?.mindmap && !mindmapData) {
//       setMindmapData({
//         mindmap: content.mindmap,
//         hasError: false
//       });
//     }
//   }, [content?.mindmap, mindmapData]);

//   // Reset quiz when content changes
//   React.useEffect(() => {
//     setQuizAnswers({});
//     setQuizSubmitted(false);
//     setQuizResults({ correct: 0, wrong: 0 });
//   }, [content]);

//   if (contentLoading) {
//     return <LoadingState isContentLoading={true} source={contentInfo?.source} colorPalette={colorPalette} />;
//   }

//   if (!content && selectedSubtopic) {
//     return (
//       <WelcomeState 
//         subtopicName={selectedSubtopic.name}
//         isReady={true}
//         onGenerateContent={onGenerateContent}
//         colorPalette={colorPalette}
//       />
//     );
//   }

//   if (!content || !selectedSubtopic) {
//     return <WelcomeState colorPalette={colorPalette} />;
//   }

//   const toggleSection = (sectionKey) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sectionKey]: !prev[sectionKey]
//     }));
//   };

//   const ContentSection = ({ 
//     title, 
//     content: sectionContent, 
//     emoji = "💡",
//     isList = false,
//     sectionKey
//   }) => {
//     if (!sectionContent || (Array.isArray(sectionContent) && sectionContent.length === 0)) {
//       return null;
//     }

//     const isExpanded = expandedSections[sectionKey] !== false;

//     return (
//       <Card sx={{ 
//         mb: 3,
//         background: 'white',
//         border: '1px solid',
//         borderColor: colorPalette[200],
//         borderRadius: 2,
//         boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
//         overflow: 'visible',
//       }}>
//         <CardContent sx={{ p: 2 }}>
//           <Box 
//             sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               mb: isExpanded ? 2 : 0,
//               cursor: 'pointer',
//             }}
//             onClick={() => toggleSection(sectionKey)}
//           >
//             <Box sx={{
//               width: isMobile ? 32 : 40,
//               height: isMobile ? 32 : 40,
//               borderRadius: '10px',
//               background: `linear-gradient(135deg, ${colorPalette[400]} 0%, ${colorPalette[600]} 100%)`,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               mr: 2,
//               flexShrink: 0
//             }}>
//               <Typography sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>
//                 {emoji}
//               </Typography>
//             </Box>
//             <Box sx={{ flex: 1 }}>
//               <Typography 
//                 variant={isMobile ? "subtitle1" : "h6"}
//                 fontWeight="600"
//                 sx={{ color: colorPalette[700] }}
//               >
//                 {title}
//               </Typography>
//             </Box>
//             <IconButton 
//               size="small" 
//               sx={{ color: colorPalette[500] }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleSection(sectionKey);
//               }}
//             >
//               <ExpandMore sx={{ 
//                 transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
//                 transition: 'transform 0.3s ease'
//               }} />
//             </IconButton>
//           </Box>

//           {isExpanded && (
//             <Fade in={isExpanded} timeout={300}>
//               <Box>
//                 {isList && Array.isArray(sectionContent) ? (
//                   <Box sx={{ pl: 1 }}>
//                     {sectionContent.map((item, index) => (
//                       <Box
//                         key={index}
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'flex-start',
//                           mb: 2,
//                           p: isMobile ? 1.5 : 2,
//                           borderRadius: 1,
//                           background: index % 2 === 0 ? colorPalette[50] : 'transparent',
//                           border: `1px solid ${colorPalette[100]}`,
//                         }}
//                       >
//                         <Box sx={{
//                           width: isMobile ? 20 : 24,
//                           height: isMobile ? 20 : 24,
//                           borderRadius: '6px',
//                           background: colorPalette[500],
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           mr: 2,
//                           flexShrink: 0,
//                           mt: 0.25
//                         }}>
//                           <Typography variant="caption" sx={{ color: 'white', fontWeight: '700', fontSize: isMobile ? '0.6rem' : '0.75rem' }}>
//                             {index + 1}
//                           </Typography>
//                         </Box>
//                         <Typography 
//                           variant="body1" 
//                           sx={{ 
//                             lineHeight: 1.6,
//                             color: 'text.primary',
//                             flex: 1,
//                             fontSize: isMobile ? '0.9rem' : '1rem'
//                           }}
//                         >
//                           {typeof item === 'string' ? item : JSON.stringify(item)}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 ) : (
//                   <Box sx={{
//                     p: isMobile ? 1.5 : 2,
//                     borderRadius: 1,
//                     background: colorPalette[50],
//                     border: `1px solid ${colorPalette[100]}`
//                   }}>
//                     <Typography 
//                       variant="body1" 
//                       sx={{ 
//                         lineHeight: 1.7,
//                         color: 'text.primary',
//                         fontSize: isMobile ? '0.9rem' : '1rem'
//                       }}
//                     >
//                       {typeof sectionContent === 'string' ? sectionContent : JSON.stringify(sectionContent)}
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>
//             </Fade>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   const QuizSection = ({ quizItems }) => {
//     if (!quizItems || quizItems.length === 0) return null;

//     const handleQuizAnswer = (questionIndex, answer) => {
//       setQuizAnswers(prev => ({
//         ...prev,
//         [questionIndex]: answer
//       }));
//     };

//     const handleSubmitQuiz = async () => {
//       if (!selectedTopic || !selectedSubtopic) {
//         console.error('Missing topic or subtopic for quiz submission');
//         return;
//       }

//       let correct = 0;
//       let wrong = 0;

//       quizItems.forEach((question, index) => {
//         if (quizAnswers[index] !== undefined) {
//           const currentQuestion = typeof question === 'string' ? { choices: [] } : question;
//           const correctAnswer = currentQuestion.choices?.[currentQuestion.correctIndex] || currentQuestion.answer;
          
//           if (quizAnswers[index] === correctAnswer) {
//             correct++;
//           } else {
//             wrong++;
//           }
//         }
//       });

//       const total = correct + wrong;
//       setQuizResults({ correct, wrong });
//       setQuizSubmitted(true);
//       setSavingQuiz(true);

//       try {
//         await updateQuizMarks({
//           topic: selectedTopic,
//           subtopic: selectedSubtopic.name,
//           correct,
//           wrong,
//           total
//         });
//       } catch (error) {
//         console.error('Failed to save quiz marks:', error);
//       } finally {
//         setSavingQuiz(false);
//       }
//     };

//     const answeredCount = Object.keys(quizAnswers).length;
//     const progressPercentage = quizItems.length > 0 ? (answeredCount / quizItems.length) * 100 : 0;
//     const allQuestionsAnswered = answeredCount === quizItems.length;
//     const scorePercentage = quizResults.correct + quizResults.wrong > 0 
//       ? Math.round((quizResults.correct / (quizResults.correct + quizResults.wrong)) * 100)
//       : 0;

//     const getAnswerStatus = (question, userAnswer, option) => {
//       if (!quizSubmitted) return 'default';
      
//       const correctAnswer = question.choices?.[question.correctIndex] || question.answer;
//       if (option === correctAnswer) return 'correct';
//       if (option === userAnswer && userAnswer !== correctAnswer) return 'wrong';
//       return 'default';
//     };

//     return (
//       <Card sx={{ 
//         mb: 3,
//         background: 'white',
//         border: `2px solid ${colorPalette[200]}`,
//         borderRadius: 2,
//       }}>
//         <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <Box sx={{
//               width: isMobile ? 32 : 40,
//               height: isMobile ? 32 : 40,
//               borderRadius: '10px',
//               background: colorPalette[500],
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               mr: 2
//             }}>
//               <Quiz sx={{ fontSize: isMobile ? 18 : 20, color: 'white' }} />
//             </Box>
//             <Box>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="600" sx={{ color: colorPalette[700] }}>
//                 Knowledge Check
//               </Typography>
//             </Box>
//           </Box>

//           {/* Progress */}
//           <Box sx={{ mb: 2 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//               <Typography variant="body2" fontWeight="600" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
//                 Progress
//               </Typography>
//               <Typography variant="body2" fontWeight="600" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
//                 {answeredCount} / {quizItems.length}
//               </Typography>
//             </Box>
//             <LinearProgress 
//               variant="determinate" 
//               value={progressPercentage} 
//               sx={{ 
//                 height: 6, 
//                 borderRadius: 3,
//                 backgroundColor: colorPalette[100],
//                 '& .MuiLinearProgress-bar': {
//                   backgroundColor: allQuestionsAnswered ? '#10b981' : colorPalette[500],
//                   borderRadius: 3
//                 }
//               }}
//             />
//           </Box>

//           {quizItems.map((quizItem, index) => {
//             const question = typeof quizItem === 'string' ? { question: quizItem } : quizItem;
//             const userAnswer = quizAnswers[index];

//             return (
//               <Accordion 
//                 key={index}
//                 sx={{ 
//                   mb: 1,
//                   borderRadius: 1,
//                   border: `1px solid ${colorPalette[100]}`,
//                   background: 'white',
//                   '&:before': { display: 'none' },
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMore sx={{ color: colorPalette[500] }} />}
//                   sx={{ borderRadius: 1 }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                     <Typography 
//                       variant="body2" 
//                       fontWeight="600" 
//                       sx={{ 
//                         flex: 1,
//                         color: colorPalette[700],
//                         fontSize: isMobile ? '0.8rem' : '0.875rem'
//                       }}
//                     >
//                       {question.question || quizItem}
//                     </Typography>
//                   </Box>
//                 </AccordionSummary>
                
//                 <AccordionDetails>
//                   {question.options || question.choices ? (
//                     <RadioGroup
//                       value={userAnswer || ''}
//                       onChange={(e) => !quizSubmitted && handleQuizAnswer(index, e.target.value)}
//                     >
//                       {(question.options || question.choices).map((option, optIndex) => {
//                         const answerStatus = getAnswerStatus(question, userAnswer, option);
                        
//                         return (
//                           <FormControlLabel
//                             key={optIndex}
//                             value={option}
//                             control={<Radio 
//                               disabled={quizSubmitted}
//                               sx={{ color: colorPalette[500] }}
//                               size={isMobile ? "small" : "medium"}
//                             />}
//                             label={
//                               <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
//                                 <Typography variant="body2" sx={{ flex: 1, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
//                                   {option}
//                                 </Typography>
//                                 {answerStatus === 'correct' && (
//                                   <CheckCircle sx={{ color: '#10b981', ml: 1, fontSize: isMobile ? 14 : 16 }} />
//                                 )}
//                                 {answerStatus === 'wrong' && (
//                                   <Cancel sx={{ color: '#ef4444', ml: 1, fontSize: isMobile ? 14 : 16 }} />
//                                 )}
//                               </Box>
//                             }
//                             sx={{ 
//                               mb: 1,
//                               p: isMobile ? 0.75 : 1,
//                               borderRadius: 1,
//                               border: `1px solid ${
//                                 answerStatus === 'correct' ? '#10b981' : 
//                                 answerStatus === 'wrong' ? '#ef4444' : 
//                                 colorPalette[200]
//                               }`,
//                               background: answerStatus === 'correct' ? '#f0fdf4' : 
//                                        answerStatus === 'wrong' ? '#fef2f2' : 'transparent',
//                             }}
//                           />
//                         );
//                       })}
//                     </RadioGroup>
//                   ) : (
//                     <Box sx={{ textAlign: 'center', p: 2 }}>
//                       <Button
//                         variant="outlined"
//                         onClick={() => !quizSubmitted && !userAnswer && handleQuizAnswer(index, "Reflected")}
//                         disabled={quizSubmitted || userAnswer}
//                         size={isMobile ? "small" : "medium"}
//                         sx={{
//                           borderColor: colorPalette[500],
//                           color: colorPalette[500],
//                         }}
//                       >
//                         {userAnswer ? '✓ Reflected' : 'Mark as Reflected'}
//                       </Button>
//                     </Box>
//                   )}
//                 </AccordionDetails>
//               </Accordion>
//             );
//           })}

//           <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
//             {!quizSubmitted ? (
//               <Button
//                 variant="contained"
//                 size={isMobile ? "small" : "medium"}
//                 sx={{ 
//                   background: colorPalette[600],
//                   flex: 1
//                 }}
//                 onClick={handleSubmitQuiz}
//                 disabled={!allQuestionsAnswered || savingQuiz}
//               >
//                 {savingQuiz ? 'Submitting...' : 'Submit Answers'}
//               </Button>
//             ) : (
//               <Button
//                 variant="outlined"
//                 size={isMobile ? "small" : "medium"}
//                 sx={{ 
//                   borderColor: colorPalette[600],
//                   color: colorPalette[600],
//                   flex: 1
//                 }}
//                 onClick={() => {
//                   setQuizSubmitted(false);
//                   setQuizAnswers({});
//                   setQuizResults({ correct: 0, wrong: 0 });
//                 }}
//               >
//                 Try Again
//               </Button>
//             )}
//           </Box>

//           {quizSubmitted && (
//             <Alert 
//               severity="info"
//               sx={{ mt: 2 }}
//             >
//               <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
//                 Results: {quizResults.correct} correct, {quizResults.wrong} wrong ({scorePercentage}%)
//               </Typography>
//             </Alert>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <Box sx={{ 
//       height: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       overflow: 'hidden',
//       background: 'white',
//       '& ::-webkit-scrollbar': {
//         width: '6px',
//       },
//       '& ::-webkit-scrollbar-track': {
//         background: colorPalette[50],
//         borderRadius: '3px',
//       },
//       '& ::-webkit-scrollbar-thumb': {
//         background: colorPalette[200],
//         borderRadius: '3px',
//         transition: 'background 0.2s ease',
//       },
//       '& ::-webkit-scrollbar-thumb:hover': {
//         background: colorPalette[300],
//       },
//       '& *': {
//         scrollbarWidth: 'thin',
//         scrollbarColor: `${colorPalette[200]} ${colorPalette[50]}`,
//       }
//     }}>
//       {/* Header */}
//       <Box sx={{ 
//         p: isMobile ? 1.5 : 2,
//         borderBottom: `1px solid ${colorPalette[100]}`,
//         background: 'white'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
//           <Box sx={{ flex: 1 }}>
//             <Typography 
//               variant={isMobile ? "h6" : "h5"}
//               fontWeight="600"
//               sx={{ color: colorPalette[700] }}
//             >
//               {safeContent.title}
//             </Typography>
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 color: colorPalette[500],
//                 fontSize: isMobile ? '0.8rem' : '0.875rem'
//               }}
//             >
//               {selectedTopic}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Content */}
//       <Box sx={{ 
//         flex: 1,
//         overflow: 'auto',
//         p: isMobile ? 1.5 : 2
//       }}>
//         {safeContent.concept && (
//           <ContentSection
//             title="Core Concept"
//             content={safeContent.concept}
//             emoji="💡"
//             sectionKey="concept"
//           />
//         )}

//         {safeContent.explanation && (
//           <ContentSection
//             title="Detailed Explanation"
//             content={safeContent.explanation}
//             emoji="📚"
//             sectionKey="explanation"
//           />
//         )}

//         {safeContent.learningActions.length > 0 && (
//           <ContentSection
//             title="Learning Steps"
//             content={safeContent.learningActions}
//             emoji="🛣️"
//             isList={true}
//             sectionKey="learningActions"
//           />
//         )}

//         {safeContent.examples.length > 0 && (
//           <ContentSection
//             title="Examples"
//             content={safeContent.examples}
//             emoji="💼"
//             isList={true}
//             sectionKey="examples"
//           />
//         )}

//         {safeContent.practice && (
//           <ContentSection
//             title="Practice"
//             content={safeContent.practice}
//             emoji="💪"
//             sectionKey="practice"
//           />
//         )}

//         {safeContent.mindmap && (
//           <Card sx={{ mb: 3, borderRadius: 2 }}>
//             <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
//               <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="600" sx={{ mb: 2, color: colorPalette[700] }}>
//                 Mind Map
//               </Typography>
//               <MermaidDiagram
//                 chart={safeContent.mindmap}
//                 topic={selectedTopic}
//                 subtopic={selectedSubtopic?.name}
//                 onManualRegenerate={handleManualMindmapRegenerate}
//                 isRegenerating={regeneratingMindmap}
//                 remainingGenerations={userRemainingGenerations}
//                 initialError={mindmapData?.hasError}
//                 colorPalette={colorPalette}
//               />
//             </CardContent>
//           </Card>
//         )}

//         {safeContent.quiz.length > 0 && (
//           <QuizSection quizItems={safeContent.quiz} />
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default LearningContent;

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Fade,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  ExpandMore,
  Quiz,
  CheckCircle,
  Cancel,
  AutoAwesome,
  Psychology,
  VolumeUp
} from "@mui/icons-material";
import MermaidDiagram from "../components/MermaidDiagram";
import WelcomeState from "./WelcomeState";
import LoadingState from "./LoadingState";
import { updateQuizMarks, generateMermaidMindmap } from '../api/learning';

const LearningContent = ({ 
  content, 
  contentInfo, 
  selectedTopic, 
  selectedSubtopic, 
  contentLoading, 
  onGenerateContent,
  colorPalette,
  userRemainingGenerations = 5
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State declarations
  const [mindmapData, setMindmapData] = useState(null);
  const [regeneratingMindmap, setRegeneratingMindmap] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState({ correct: 0, wrong: 0 });
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    concept: true,
    explanation: true,
    learningActions: true,
    examples: true,
    practice: true
  });

  // Handle mindmap regeneration
  const handleManualMindmapRegenerate = async () => {
    if (!selectedTopic || !selectedSubtopic?.name) {
      console.error('Missing topic or subtopic for mindmap regeneration');
      return;
    }

    try {
      setRegeneratingMindmap(true);
      const response = await generateMermaidMindmap({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name
      });
      
      if (response?.data?.mindmap) {
        setMindmapData(prev => ({
          ...prev,
          mindmap: response.data.mindmap,
          hasError: false
        }));
      }
    } catch (error) {
      console.error('Failed to regenerate mindmap:', error);
      setMindmapData(prev => ({
        ...prev,
        hasError: true
      }));
    } finally {
      setRegeneratingMindmap(false);
    }
  };

  // Safe content access with fallbacks
  const safeContent = useMemo(() => {
    // Use the regenerated mindmap if available, otherwise use the original content
    const currentMindmap = mindmapData?.mindmap || content?.mindmap;
    
    return {
      concept: content?.concept || content?.keyConcepts?.[0] || '',
      explanation: content?.explanation || '',
      learningActions: Array.isArray(content?.learningActions) ? content.learningActions : [],
      examples: Array.isArray(content?.examples) ? content.examples : [],
      practice: content?.practice || '',
      mindmap: currentMindmap,
      quiz: Array.isArray(content?.quiz) ? content.quiz : [],
      title: content?.title || selectedSubtopic?.name || ''
    };
  }, [content, selectedSubtopic, mindmapData]);

  // Initialize mindmap data when content changes
  React.useEffect(() => {
    if (content?.mindmap && !mindmapData) {
      setMindmapData({
        mindmap: content.mindmap,
        hasError: false
      });
    }
  }, [content?.mindmap, mindmapData]);

  // Reset quiz when content changes
  React.useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults({ correct: 0, wrong: 0 });
  }, [content]);

  if (contentLoading) {
    return <LoadingState isContentLoading={true} source={contentInfo?.source} colorPalette={colorPalette} />;
  }

  if (!content && selectedSubtopic) {
    return (
      <WelcomeState 
        subtopicName={selectedSubtopic.name}
        isReady={true}
        onGenerateContent={onGenerateContent}
        colorPalette={colorPalette}
      />
    );
  }

  if (!content || !selectedSubtopic) {
    return <WelcomeState colorPalette={colorPalette} />;
  }

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const ContentSection = ({ 
    title, 
    content: sectionContent, 
    emoji = "💡",
    isList = false,
    sectionKey
  }) => {
    if (!sectionContent || (Array.isArray(sectionContent) && sectionContent.length === 0)) {
      return null;
    }

    const isExpanded = expandedSections[sectionKey] !== false;

    return (
      <Card sx={{ 
        mb: 3,
        background: 'white',
        border: '1px solid',
        borderColor: colorPalette[200],
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'visible',
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: isExpanded ? 2 : 0,
              cursor: 'pointer',
            }}
            onClick={() => toggleSection(sectionKey)}
          >
            <Box sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${colorPalette[400]} 0%, ${colorPalette[600]} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              flexShrink: 0
            }}>
              <Typography sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>
                {emoji}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"}
                fontWeight="600"
                sx={{ color: colorPalette[700] }}
              >
                {title}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              sx={{ color: colorPalette[500] }}
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(sectionKey);
              }}
            >
              <ExpandMore sx={{ 
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} />
            </IconButton>
          </Box>

          {isExpanded && (
            <Fade in={isExpanded} timeout={300}>
              <Box>
                {isList && Array.isArray(sectionContent) ? (
                  <Box sx={{ pl: 1 }}>
                    {sectionContent.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          mb: 2,
                          p: isMobile ? 1.5 : 2,
                          borderRadius: 1,
                          background: index % 2 === 0 ? colorPalette[50] : 'transparent',
                          border: `1px solid ${colorPalette[100]}`,
                        }}
                      >
                        <Box sx={{
                          width: isMobile ? 20 : 24,
                          height: isMobile ? 20 : 24,
                          borderRadius: '6px',
                          background: colorPalette[500],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          flexShrink: 0,
                          mt: 0.25
                        }}>
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: '700', fontSize: isMobile ? '0.6rem' : '0.75rem' }}>
                            {index + 1}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.6,
                            color: 'text.primary',
                            flex: 1,
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}
                        >
                          {typeof item === 'string' ? item : JSON.stringify(item)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{
                    p: isMobile ? 1.5 : 2,
                    borderRadius: 1,
                    background: colorPalette[50],
                    border: `1px solid ${colorPalette[100]}`
                  }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7,
                        color: 'text.primary',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}
                    >
                      {typeof sectionContent === 'string' ? sectionContent : JSON.stringify(sectionContent)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    );
  };

  const QuizSection = ({ quizItems }) => {
    if (!quizItems || quizItems.length === 0) return null;

    const handleQuizAnswer = (questionIndex, answer) => {
      setQuizAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    };

    const handleSubmitQuiz = async () => {
      if (!selectedTopic || !selectedSubtopic) {
        console.error('Missing topic or subtopic for quiz submission');
        return;
      }

      let correct = 0;
      let wrong = 0;

      quizItems.forEach((question, index) => {
        if (quizAnswers[index] !== undefined) {
          const currentQuestion = typeof question === 'string' ? { choices: [] } : question;
          const correctAnswer = currentQuestion.choices?.[currentQuestion.correctIndex] || currentQuestion.answer;
          
          if (quizAnswers[index] === correctAnswer) {
            correct++;
          } else {
            wrong++;
          }
        }
      });

      const total = correct + wrong;
      setQuizResults({ correct, wrong });
      setQuizSubmitted(true);
      setSavingQuiz(true);

      try {
        await updateQuizMarks({
          topic: selectedTopic,
          subtopic: selectedSubtopic.name,
          correct,
          wrong,
          total
        });
      } catch (error) {
        console.error('Failed to save quiz marks:', error);
      } finally {
        setSavingQuiz(false);
      }
    };

    const answeredCount = Object.keys(quizAnswers).length;
    const progressPercentage = quizItems.length > 0 ? (answeredCount / quizItems.length) * 100 : 0;
    const allQuestionsAnswered = answeredCount === quizItems.length;
    const scorePercentage = quizResults.correct + quizResults.wrong > 0 
      ? Math.round((quizResults.correct / (quizResults.correct + quizResults.wrong)) * 100)
      : 0;

    const getAnswerStatus = (question, userAnswer, option) => {
      if (!quizSubmitted) return 'default';
      
      const correctAnswer = question.choices?.[question.correctIndex] || question.answer;
      if (option === correctAnswer) return 'correct';
      if (option === userAnswer && userAnswer !== correctAnswer) return 'wrong';
      return 'default';
    };

    return (
      <Card sx={{ 
        mb: 3,
        background: 'white',
        border: `2px solid ${colorPalette[200]}`,
        borderRadius: 2,
      }}>
        <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              borderRadius: '10px',
              background: colorPalette[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <Quiz sx={{ fontSize: isMobile ? 18 : 20, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="600" sx={{ color: colorPalette[700] }}>
                Knowledge Check
              </Typography>
            </Box>
          </Box>

          {/* Progress */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                {answeredCount} / {quizItems.length}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: colorPalette[100],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: allQuestionsAnswered ? '#10b981' : colorPalette[500],
                  borderRadius: 3
                }
              }}
            />
          </Box>

          {quizItems.map((quizItem, index) => {
            const question = typeof quizItem === 'string' ? { question: quizItem } : quizItem;
            const userAnswer = quizAnswers[index];

            return (
              <Accordion 
                key={index}
                sx={{ 
                  mb: 1,
                  borderRadius: 1,
                  border: `1px solid ${colorPalette[100]}`,
                  background: 'white',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: colorPalette[500] }} />}
                  sx={{ borderRadius: 1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography 
                      variant="body2" 
                      fontWeight="600" 
                      sx={{ 
                        flex: 1,
                        color: colorPalette[700],
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}
                    >
                      {question.question || quizItem}
                    </Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  {question.options || question.choices ? (
                    <RadioGroup
                      value={userAnswer || ''}
                      onChange={(e) => !quizSubmitted && handleQuizAnswer(index, e.target.value)}
                    >
                      {(question.options || question.choices).map((option, optIndex) => {
                        const answerStatus = getAnswerStatus(question, userAnswer, option);
                        
                        return (
                          <FormControlLabel
                            key={optIndex}
                            value={option}
                            control={<Radio 
                              disabled={quizSubmitted}
                              sx={{ color: colorPalette[500] }}
                              size={isMobile ? "small" : "medium"}
                            />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <Typography variant="body2" sx={{ flex: 1, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                                  {option}
                                </Typography>
                                {answerStatus === 'correct' && (
                                  <CheckCircle sx={{ color: '#10b981', ml: 1, fontSize: isMobile ? 14 : 16 }} />
                                )}
                                {answerStatus === 'wrong' && (
                                  <Cancel sx={{ color: '#ef4444', ml: 1, fontSize: isMobile ? 14 : 16 }} />
                                )}
                              </Box>
                            }
                            sx={{ 
                              mb: 1,
                              p: isMobile ? 0.75 : 1,
                              borderRadius: 1,
                              border: `1px solid ${
                                answerStatus === 'correct' ? '#10b981' : 
                                answerStatus === 'wrong' ? '#ef4444' : 
                                colorPalette[200]
                              }`,
                              background: answerStatus === 'correct' ? '#f0fdf4' : 
                                       answerStatus === 'wrong' ? '#fef2f2' : 'transparent',
                            }}
                          />
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => !quizSubmitted && !userAnswer && handleQuizAnswer(index, "Reflected")}
                        disabled={quizSubmitted || userAnswer}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          borderColor: colorPalette[500],
                          color: colorPalette[500],
                        }}
                      >
                        {userAnswer ? '✓ Reflected' : 'Mark as Reflected'}
                      </Button>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}

          <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
            {!quizSubmitted ? (
              <Button
                variant="contained"
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  background: colorPalette[600],
                  flex: 1
                }}
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered || savingQuiz}
              >
                {savingQuiz ? 'Submitting...' : 'Submit Answers'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  borderColor: colorPalette[600],
                  color: colorPalette[600],
                  flex: 1
                }}
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                  setQuizResults({ correct: 0, wrong: 0 });
                }}
              >
                Try Again
              </Button>
            )}
          </Box>

          {quizSubmitted && (
            <Alert 
              severity="info"
              sx={{ mt: 2 }}
            >
              <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                Results: {quizResults.correct} correct, {quizResults.wrong} wrong ({scorePercentage}%)
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'white',
      '& ::-webkit-scrollbar': {
        width: '6px',
      },
      '& ::-webkit-scrollbar-track': {
        background: colorPalette[50],
        borderRadius: '3px',
      },
      '& ::-webkit-scrollbar-thumb': {
        background: colorPalette[200],
        borderRadius: '3px',
        transition: 'background 0.2s ease',
      },
      '& ::-webkit-scrollbar-thumb:hover': {
        background: colorPalette[300],
      },
      '& *': {
        scrollbarWidth: 'thin',
        scrollbarColor: `${colorPalette[200]} ${colorPalette[50]}`,
      }
    }}>
      {/* Minimal Header - Not Sticky */}
      <Box sx={{ 
        p: isMobile ? 1 : 1.5,
        borderBottom: `1px solid ${colorPalette[100]}`,
        background: 'white'
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant={isMobile ? "subtitle2" : "h6"}
            fontWeight="600"
            sx={{ 
              color: colorPalette[700],
              fontSize: isMobile ? '0.9rem' : '1.25rem',
              lineHeight: 1.2,
              mb: 0.25
            }}
          >
            {safeContent.title}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: colorPalette[500],
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              fontWeight: 500
            }}
          >
            {selectedTopic}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: isMobile ? 1.5 : 2
      }}>
        {safeContent.concept && (
          <ContentSection
            title="Core Concept"
            content={safeContent.concept}
            emoji="💡"
            sectionKey="concept"
          />
        )}

        {safeContent.explanation && (
          <ContentSection
            title="Detailed Explanation"
            content={safeContent.explanation}
            emoji="📚"
            sectionKey="explanation"
          />
        )}

        {safeContent.learningActions.length > 0 && (
          <ContentSection
            title="Learning Steps"
            content={safeContent.learningActions}
            emoji="🛣️"
            isList={true}
            sectionKey="learningActions"
          />
        )}

        {safeContent.examples.length > 0 && (
          <ContentSection
            title="Examples"
            content={safeContent.examples}
            emoji="💼"
            isList={true}
            sectionKey="examples"
          />
        )}

        {safeContent.practice && (
          <ContentSection
            title="Practice"
            content={safeContent.practice}
            emoji="💪"
            sectionKey="practice"
          />
        )}

        {safeContent.mindmap && (
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="600" sx={{ mb: 2, color: colorPalette[700] }}>
                Mind Map
              </Typography>
              <MermaidDiagram
                chart={safeContent.mindmap}
                topic={selectedTopic}
                subtopic={selectedSubtopic?.name}
                onManualRegenerate={handleManualMindmapRegenerate}
                isRegenerating={regeneratingMindmap}
                remainingGenerations={userRemainingGenerations}
                initialError={mindmapData?.hasError}
                colorPalette={colorPalette}
              />
            </CardContent>
          </Card>
        )}

        {safeContent.quiz.length > 0 && (
          <QuizSection quizItems={safeContent.quiz} />
        )}
      </Box>
    </Box>
  );
};

export default LearningContent;