

// import React from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Chip,
//   Card,
//   CardContent,
//   Fade,
//   useTheme,
//   useMediaQuery,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Paper,
//   Button,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Alert
// } from "@mui/material";
// import {
//   Description,
//   EmojiObjects,
//   FitnessCenter,
//   AccountTree,
//   Psychology,
//   ExpandMore,
//   Quiz,
//   CheckCircle,
//   PlayArrow,
//   Cancel
// } from "@mui/icons-material";
// import MermaidDiagram from "../components/MermaidDiagram";
// import WelcomeState from "./WelcomeState";
// import LoadingState from "./LoadingState";
// import { updateQuizMarks } from '../api/learning'; // Import the API function

// const LearningContent = ({ content, contentInfo, selectedTopic, selectedSubtopic, contentLoading, onGenerateContent }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
//   const [expandedQuiz, setExpandedQuiz] = React.useState(false);
//   const [quizAnswers, setQuizAnswers] = React.useState({});
//   const [quizSubmitted, setQuizSubmitted] = React.useState(false);
//   const [quizResults, setQuizResults] = React.useState({ correct: 0, wrong: 0 });
//   const [savingQuiz, setSavingQuiz] = React.useState(false);

//   // Show loading state when content is being generated
//   if (contentLoading) {
//     return <LoadingState isContentLoading={true} source={contentInfo?.source} />;
//   }

//   // Show welcome state when no content is available but subtopic is selected
//   if (!content && selectedSubtopic) {
//     return (
//       <WelcomeState 
//         subtopicName={selectedSubtopic.name}
//         isReady={true}
//         onGenerateContent={onGenerateContent}
//       />
//     );
//   }

//   // Show default welcome state when nothing is selected
//   if (!content) {
//     return <WelcomeState />;
//   }

//   const ContentSection = ({ 
//     title, 
//     content: sectionContent, 
//     icon: Icon, 
//     color = 'primary',
//     isList = false 
//   }) => {
//     if (!sectionContent || (Array.isArray(sectionContent) && sectionContent.length === 0)) {
//       return null;
//     }

//     return (
//       <Card elevation={2} sx={{ 
//         borderLeft: '4px solid', 
//         borderColor: `${color}.main`,
//         mb: 2
//       }}>
//         <CardContent sx={{ p: { xs: 2, md: 3 } }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <Icon color={color} sx={{ 
//               mr: 2, 
//               fontSize: { xs: 24, md: 32 } 
//             }} />
//             <Typography 
//               variant={isMobile ? "h6" : "h5"} 
//               color={`${color}.main`} 
//               fontWeight="600"
//               sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
//             >
//               {title}
//             </Typography>
//           </Box>
          
//           {isList && Array.isArray(sectionContent) ? (
//             <List sx={{ py: 0 }}>
//               {sectionContent.map((item, index) => (
//                 <ListItem key={index} sx={{ 
//                   alignItems: 'flex-start', 
//                   px: 0,
//                   py: 1
//                 }}>
//                   <ListItemIcon sx={{ 
//                     minWidth: { xs: 40, md: 48 }, 
//                     mt: 0.5 
//                   }}>
//                     <Chip 
//                       label={index + 1} 
//                       color={color}
//                       size={isMobile ? "small" : "medium"}
//                       sx={{ 
//                         fontWeight: 'bold', 
//                         fontSize: { xs: '0.8rem', md: '1rem' },
//                         width: { xs: 32, md: 36 },
//                         height: { xs: 32, md: 36 }
//                       }}
//                     />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary={
//                       <Typography 
//                         variant="body1" 
//                         sx={{ 
//                           lineHeight: 1.7, 
//                           fontSize: { xs: '0.9rem', md: '1.1rem' } 
//                         }}
//                       >
//                         {typeof item === 'string' ? item : JSON.stringify(item)}
//                       </Typography>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography 
//               variant="body1" 
//               sx={{ 
//                 lineHeight: 1.8, 
//                 fontSize: { xs: '0.9rem', md: '1.1rem' },
//                 whiteSpace: 'pre-line'
//               }}
//             >
//               {typeof sectionContent === 'string' ? sectionContent : JSON.stringify(sectionContent)}
//             </Typography>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   const LearningActionsSection = ({ actions }) => {
//     if (!actions || actions.length === 0) return null;

//     return (
//       <Card elevation={2} sx={{ 
//         borderLeft: '4px solid', 
//         borderColor: 'info.main',
//         mb: 2
//       }}>
//         <CardContent sx={{ p: { xs: 2, md: 3 } }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <PlayArrow color="info" sx={{ 
//               mr: 2, 
//               fontSize: { xs: 24, md: 32 } 
//             }} />
//             <Typography 
//               variant={isMobile ? "h6" : "h5"} 
//               color="info.main" 
//               fontWeight="600"
//               sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
//             >
//               Steps to understand {selectedSubtopic.name}
//             </Typography>
//           </Box>

//           <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
//             Follow these universal learning steps to master any topic
//           </Alert>

//           <List sx={{ py: 0 }}>
//             {actions.map((action, index) => (
//               <ListItem key={index} sx={{ 
//                 alignItems: 'flex-start', 
//                 px: 0,
//                 py: 1.5,
//                 borderBottom: index < actions.length - 1 ? '1px solid' : 'none',
//                 borderColor: 'divider'
//               }}>
//                 <ListItemIcon sx={{ 
//                   minWidth: { xs: 40, md: 48 }, 
//                   mt: 0.5 
//                 }}>
//                   <Chip 
//                     label={index + 1} 
//                     color="info"
//                     size={isMobile ? "small" : "medium"}
//                     sx={{ 
//                       fontWeight: 'bold', 
//                       fontSize: { xs: '0.8rem', md: '1rem' },
//                       width: { xs: 32, md: 36 },
//                       height: { xs: 32, md: 36 }
//                     }}
//                   />
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary={
//                     <Typography 
//                       variant="body1" 
//                       sx={{ 
//                         lineHeight: 1.7, 
//                         fontSize: { xs: '0.9rem', md: '1.1rem' },
//                         fontWeight: 500
//                       }}
//                     >
//                       {typeof action === 'string' ? action : JSON.stringify(action)}
//                     </Typography>
//                   }
//                 />
//               </ListItem>
//             ))}
//           </List>

//           <Box sx={{ 
//             mt: 2, 
//             p: 2, 
//             backgroundColor: 'info.light', 
//             borderRadius: 1,
//             border: '1px solid',
//             borderColor: 'info.main'
//           }}>
//             <Typography variant="body2" sx={{ color: 'info.contrastText', textAlign: 'center', fontStyle: 'italic' }}>
//               💡 Use these steps to understand the key ideas in {selectedSubtopic.name}.
//             </Typography>
//           </Box>
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

//     const isQuestionAnswered = (questionIndex) => {
//       return quizAnswers[questionIndex] !== undefined;
//     };

//     const handleSubmitQuiz = async () => {
//       // Calculate results
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
//         // Save quiz marks to backend
//         if (selectedTopic && selectedSubtopic) {
//           await updateQuizMarks({
//             topic: selectedTopic,
//             subtopic: selectedSubtopic.name,
//             correct,
//             wrong,
//             total
//           });
//           console.log('Quiz marks saved successfully!');
//         }
//       } catch (error) {
//         console.error('Failed to save quiz marks:', error);
//         // You might want to show an error message to the user here
//       } finally {
//         setSavingQuiz(false);
//       }
//     };

//     const answeredCount = Object.keys(quizAnswers).length;
//     const progressPercentage = (answeredCount / quizItems.length) * 100;
//     const allQuestionsAnswered = answeredCount === quizItems.length;

//     const getAnswerStatus = (questionIndex, option) => {
//       if (!quizSubmitted) return 'default';
      
//       const currentQuestion = typeof quizItems[questionIndex] === 'string' ? { choices: [] } : quizItems[questionIndex];
//       const correctAnswer = currentQuestion.choices?.[currentQuestion.correctIndex] || currentQuestion.answer;
//       const userAnswer = quizAnswers[questionIndex];
      
//       if (option === correctAnswer) {
//         return 'correct';
//       } else if (option === userAnswer && userAnswer !== correctAnswer) {
//         return 'wrong';
//       }
//       return 'default';
//     };

//     return (
//       <Card 
//         elevation={2}
//         sx={{ 
//           borderLeft: '4px solid',
//           borderColor: 'error.main',
//           mb: 2
//         }}
//       >
//         <CardContent sx={{ p: { xs: 2, md: 3 } }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <Quiz color="error" sx={{ 
//               mr: 2, 
//               fontSize: { xs: 24, md: 32 } 
//             }} />
//             <Typography 
//               variant={isMobile ? "h6" : "h5"} 
//               color="error.main" 
//               fontWeight="600"
//               sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
//             >
//               Check Your Understanding
//             </Typography>
//           </Box>

//           <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
//             Test your knowledge with these interactive questions
//           </Alert>

//           {/* Progress Bar */}
//           <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//               <Typography variant="body2" fontWeight="600">
//                 Progress
//               </Typography>
//               <Typography variant="body2" fontWeight="600" color="primary.main">
//                 {answeredCount} / {quizItems.length}
//               </Typography>
//             </Box>
//             <Box sx={{ width: '100%', height: 6, backgroundColor: 'grey.300', borderRadius: 3, overflow: 'hidden' }}>
//               <Box 
//                 sx={{ 
//                   width: `${progressPercentage}%`, 
//                   height: '100%', 
//                   backgroundColor: allQuestionsAnswered ? 'success.main' : 'primary.main',
//                   transition: 'width 0.5s ease',
//                   borderRadius: 3
//                 }} 
//               />
//             </Box>
//           </Box>

//           {quizItems.map((quizItem, index) => {
//             const question = typeof quizItem === 'string' ? { question: quizItem } : quizItem;
//             const userAnswer = quizAnswers[index];

//             return (
//               <Accordion 
//                 key={index}
//                 elevation={0}
//                 sx={{ 
//                   mb: 1,
//                   borderRadius: 1,
//                   border: '1px solid',
//                   borderColor: 'divider',
//                   '&:before': { display: 'none' }
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMore />}
//                   sx={{ 
//                     backgroundColor: 'background.paper',
//                     borderRadius: 1,
//                     minHeight: 60,
//                     '&.Mui-expanded': {
//                       minHeight: 60,
//                       borderBottomLeftRadius: 0,
//                       borderBottomRightRadius: 0
//                     }
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                     <Chip 
//                       label={`Q${index + 1}`}
//                       color="default"
//                       variant="filled"
//                       size={isMobile ? "small" : "medium"}
//                       sx={{ mr: 2, fontWeight: 'bold', minWidth: isMobile ? 40 : 50 }}
//                     />
//                     <Typography 
//                       variant={isMobile ? "body1" : "h6"} 
//                       fontWeight="600" 
//                       sx={{ flex: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}
//                     >
//                       {question.question || quizItem}
//                     </Typography>
//                   </Box>
//                 </AccordionSummary>
                
//                 <AccordionDetails sx={{ pt: 2, backgroundColor: 'background.default' }}>
//                   {question.options || question.choices ? (
//                     <RadioGroup
//                       value={userAnswer || ''}
//                       onChange={(e) => !quizSubmitted && handleQuizAnswer(index, e.target.value)}
//                       sx={{ mb: 2 }}
//                     >
//                       {(question.options || question.choices).map((option, optIndex) => {
//                         const answerStatus = getAnswerStatus(index, option);
                        
//                         return (
//                           <FormControlLabel
//                             key={optIndex}
//                             value={option}
//                             control={<Radio 
//                               size={isMobile ? "small" : "medium"}
//                               disabled={quizSubmitted}
//                             />}
//                             label={
//                               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
//                                   {option}
//                                 </Typography>
//                                 {quizSubmitted && answerStatus === 'correct' && (
//                                   <CheckCircle sx={{ color: 'success.main', ml: 1, fontSize: 20 }} />
//                                 )}
//                                 {quizSubmitted && answerStatus === 'wrong' && (
//                                   <Cancel sx={{ color: 'error.main', ml: 1, fontSize: 20 }} />
//                                 )}
//                               </Box>
//                             }
//                             sx={{ 
//                               mb: 1,
//                               p: 1,
//                               borderRadius: 1,
//                               backgroundColor: answerStatus === 'correct' ? 'success.light' : 
//                                             answerStatus === 'wrong' ? 'error.light' : 
//                                             userAnswer === option ? 'primary.light' : 'transparent',
//                               border: answerStatus === 'correct' ? '2px solid' : 
//                                      answerStatus === 'wrong' ? '2px solid' : 
//                                      userAnswer === option ? '2px solid' : '1px solid',
//                               borderColor: answerStatus === 'correct' ? 'success.main' : 
//                                          answerStatus === 'wrong' ? 'error.main' : 
//                                          userAnswer === option ? 'primary.main' : 'divider',
//                               '&:hover': {
//                                 backgroundColor: !quizSubmitted ? 'action.hover' : undefined
//                               }
//                             }}
//                           />
//                         );
//                       })}
//                     </RadioGroup>
//                   ) : (
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="body1" fontWeight="600" gutterBottom color="primary.main">
//                         🤔 Reflection Time
//                       </Typography>
//                       <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2 }}>
//                         Take a moment to think about this question. Consider what you've learned and form your answer.
//                       </Typography>
                      
//                       <Paper
//                         variant="outlined"
//                         sx={{ 
//                           p: 2, 
//                           minHeight: 100,
//                           backgroundColor: userAnswer ? 'success.light' : 'grey.50',
//                           border: '2px solid',
//                           borderColor: userAnswer ? 'success.main' : 'grey.300',
//                           borderRadius: 1,
//                           cursor: !quizSubmitted ? 'pointer' : 'default',
//                           transition: 'all 0.3s ease',
//                           '&:hover': {
//                             backgroundColor: !quizSubmitted && !userAnswer ? 'grey.100' : undefined
//                           }
//                         }}
//                         onClick={() => !quizSubmitted && !userAnswer && handleQuizAnswer(index, "Reflected")}
//                       >
//                         {userAnswer ? (
//                           <Box sx={{ textAlign: 'center' }}>
//                             <CheckCircle sx={{ fontSize: isMobile ? 32 : 40, color: 'success.main', mb: 1 }} />
//                             <Typography variant="h6" color="success.main" fontWeight="600" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
//                               Well done! You've reflected on this question.
//                             </Typography>
//                           </Box>
//                         ) : (
//                           <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
//                             <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
//                               Click to mark as reflected
//                             </Typography>
//                             <Typography variant="body2">
//                               Take your time to think, then click here when ready.
//                             </Typography>
//                           </Box>
//                         )}
//                       </Paper>
//                     </Box>
//                   )}

//                   {quizSubmitted && question.explanation && (
//                     <Alert severity="info" sx={{ borderRadius: 1, mt: 1 }}>
//                       <Typography variant="body2" fontWeight="600">
//                         {question.explanation}
//                       </Typography>
//                     </Alert>
//                   )}
//                 </AccordionDetails>
//               </Accordion>
//             );
//           })}

//           <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
//             <Button
//               variant="outlined"
//               color="primary"
//               onClick={() => setExpandedQuiz(!expandedQuiz)}
//               size={isMobile ? "small" : "medium"}
//               sx={{ borderRadius: 1 }}
//             >
//               {expandedQuiz ? 'Collapse All' : 'Expand All'}
//             </Button>
            
//             {!quizSubmitted ? (
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={handleSubmitQuiz}
//                 disabled={!allQuestionsAnswered || savingQuiz}
//                 size={isMobile ? "small" : "medium"}
//                 sx={{ borderRadius: 1 }}
//               >
//                 {savingQuiz ? 'Saving...' : 'Submit Answers'}
//               </Button>
//             ) : (
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={() => {
//                   setQuizSubmitted(false);
//                   setQuizAnswers({});
//                   setQuizResults({ correct: 0, wrong: 0 });
//                 }}
//                 size={isMobile ? "small" : "medium"}
//                 sx={{ borderRadius: 1 }}
//               >
//                 Retake Quiz
//               </Button>
//             )}
//           </Box>

//           {quizSubmitted && (
//             <Alert 
//               severity={savingQuiz ? "info" : "success"} 
//               sx={{ mt: 2, borderRadius: 1 }}
//             >
//               <Typography variant="body2" fontWeight="600">
//                 {savingQuiz 
//                   ? "Saving your quiz results..." 
//                   : `Quiz submitted! Results: ${quizResults.correct} correct, ${quizResults.wrong} wrong (${Math.round((quizResults.correct / (quizResults.correct + quizResults.wrong)) * 100)}%)`
//                 }
//               </Typography>
//             </Alert>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   // Safe content access with fallbacks
//   const safeContent = {
//     concept: content.concept || content.keyConcepts?.[0] || '',
//     explanation: content.explanation || '',
//     learningActions: Array.isArray(content.learningActions) ? content.learningActions : 
//                     Array.isArray(content.steps) ? content.steps :
//                     ["Identify the key pieces", "See how they work together", "Try it with the example", "Apply to something new"],
//     examples: Array.isArray(content.examples) ? content.examples : 
//               content.coreExample ? [content.coreExample] : [],
//     practice: content.practice || '',
//     mindmap: content.mindmap,
//     quiz: Array.isArray(content.quiz) ? content.quiz : []
//   };

//   return (
//     <Fade in={true} timeout={800}>
//       <Box sx={{ 
//         width: '100%',
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         overflow: 'hidden'
//       }}>
//         {/* Compact Header Card */}
//         <Box sx={{ 
//           flexShrink: 0,
//           p: { xs: 1.5, md: 2 },
//           pb: 0
//         }}>
//           <Card sx={{ 
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
//             color: 'white',
//             borderRadius: { xs: 2, md: 3 }
//           }}>
//             <CardContent sx={{ 
//               p: { xs: 2, md: 2.5 },
//               '&:last-child': { pb: { xs: 2, md: 2.5 } }
//             }}>
//               <Typography 
//                 variant="h3" 
//                 fontWeight="800" 
//                 gutterBottom 
//                 sx={{ 
//                   fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
//                   wordBreak: 'break-word',
//                   lineHeight: 1.2,
//                   mb: 1
//                 }}
//               >
//                 {content.title || `${selectedSubtopic?.name}`}
//               </Typography>
              
//               <Box sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: 1, 
//                 flexWrap: 'wrap',
//                 fontSize: { xs: '0.75rem', md: '0.9rem' }
//               }}>
//                 <Typography variant="h6" sx={{ opacity: 0.9, fontSize: 'inherit' }}>
//                   {selectedTopic}
//                 </Typography>
//                 <Typography sx={{ opacity: 0.7 }}>•</Typography>
//                 <Typography variant="h6" sx={{ opacity: 0.9, fontSize: 'inherit' }}>
//                   {selectedSubtopic?.name}
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Box>

//         {/* Scrollable Content Area */}
//         <Box sx={{ 
//           flex: 1,
//           width: '100%',
//           overflow: 'auto',
//           p: { xs: 1.5, md: 2 },
//           pt: 1.5,
//           '&::-webkit-scrollbar': {
//             width: '8px',
//           },
//           '&::-webkit-scrollbar-track': {
//             background: '#f1f1f1',
//             borderRadius: '4px',
//           },
//           '&::-webkit-scrollbar-thumb': {
//             background: '#c1c1c1',
//             borderRadius: '4px',
//             '&:hover': {
//               background: '#a8a8a8',
//             },
//           },
//         }}>
//           {/* Content Sections */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
//             {safeContent.concept && (
//               <ContentSection
//                 title="Core Concept"
//                 content={safeContent.concept}
//                 icon={Description}
//                 color="primary"
//               />
//             )}

//             {safeContent.explanation && (
//               <ContentSection
//                 title="Detailed Explanation"
//                 content={safeContent.explanation}
//                 icon={EmojiObjects}
//                 color="secondary"
//               />
//             )}

//             {/* LEARNING ACTIONS SECTION */}
//             {safeContent.learningActions.length > 0 && (
//               <LearningActionsSection actions={safeContent.learningActions} />
//             )}

//             {safeContent.examples.length > 0 && (
//               <ContentSection
//                 title="Practical Examples"
//                 content={safeContent.examples}
//                 icon={EmojiObjects}
//                 color="success"
//                 isList={true}
//               />
//             )}

//             {safeContent.practice && (
//               <ContentSection
//                 title="Practice Exercise"
//                 content={safeContent.practice}
//                 icon={FitnessCenter}
//                 color="warning"
//               />
//             )}

//             {safeContent.mindmap && (
//               <Card elevation={2} sx={{ 
//                 borderLeft: '4px solid', 
//                 borderColor: 'warning.main' 
//               }}>
//                 <CardContent sx={{ p: { xs: 2, md: 3 } }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                     <AccountTree color="warning" sx={{ 
//                       mr: 2, 
//                       fontSize: { xs: 24, md: 32 } 
//                     }} />
//                     <Typography 
//                       variant={isMobile ? "h6" : "h5"} 
//                       color="warning.main" 
//                       fontWeight="600"
//                       sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
//                     >
//                       Mind Map
//                     </Typography>
//                   </Box>
//                   <MermaidDiagram chart={safeContent.mindmap} />
//                 </CardContent>
//               </Card>
//             )}

//             {/* QUIZ SECTION */}
//             {safeContent.quiz.length > 0 && (
//               <QuizSection quizItems={safeContent.quiz} />
//             )}

//             {/* Fallback if no content sections are available */}
//             {!safeContent.concept && 
//              !safeContent.explanation && 
//              safeContent.learningActions.length === 0 && 
//              safeContent.examples.length === 0 && 
//              !safeContent.practice && 
//              !safeContent.mindmap && 
//              safeContent.quiz.length === 0 && (
//               <Card elevation={2} sx={{ textAlign: 'center', py: 4, width: '100%' }}>
//                 <CardContent>
//                   <Psychology sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                   <Typography variant="h6" color="text.secondary" gutterBottom>
//                     No content available
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     The content for this topic could not be generated. Please try regenerating the content.
//                   </Typography>
//                 </CardContent>
//               </Card>
//             )}
//           </Box>
//         </Box>
//       </Box>
//     </Fade>
//   );
// };

// export default LearningContent;

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Card,
  CardContent,
  Fade,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  LinearProgress
} from "@mui/material";
import {
  Description,
  EmojiObjects,
  FitnessCenter,
  AccountTree,
  Psychology,
  ExpandMore,
  Quiz,
  CheckCircle,
  PlayArrow,
  Cancel,
  AutoAwesome
} from "@mui/icons-material";
import MermaidDiagram from "../components/MermaidDiagram";
import WelcomeState from "./WelcomeState";
import LoadingState from "./LoadingState";
import { updateQuizMarks } from '../api/learning';

const LearningContent = ({ 
  content, 
  contentInfo, 
  selectedTopic, 
  selectedSubtopic, 
  contentLoading, 
  onGenerateContent,
  colorPalette 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [expandedQuiz, setExpandedQuiz] = React.useState(false);
  const [quizAnswers, setQuizAnswers] = React.useState({});
  const [quizSubmitted, setQuizSubmitted] = React.useState(false);
  const [quizResults, setQuizResults] = React.useState({ correct: 0, wrong: 0 });
  const [savingQuiz, setSavingQuiz] = React.useState(false);

  // Show loading state when content is being generated
  if (contentLoading) {
    return <LoadingState isContentLoading={true} source={contentInfo?.source} colorPalette={colorPalette} />;
  }

  // Show welcome state when no content is available but subtopic is selected
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

  // Show default welcome state when nothing is selected
  if (!content) {
    return <WelcomeState colorPalette={colorPalette} />;
  }

  const ContentSection = ({ 
    title, 
    content: sectionContent, 
    icon: Icon, 
    color = 'primary',
    isList = false 
  }) => {
    if (!sectionContent || (Array.isArray(sectionContent) && sectionContent.length === 0)) {
      return null;
    }

    const getColor = () => {
      const colors = {
        primary: colorPalette[600],
        secondary: colorPalette[500],
        success: '#10b981',
        warning: '#f59e0b',
        info: colorPalette[400]
      };
      return colors[color] || colorPalette[600];
    };

    return (
      <Card elevation={1} sx={{ 
        borderLeft: '4px solid', 
        borderColor: getColor(),
        mb: 2,
        background: 'white'
      }}>
        <CardContent sx={{ 
          p: { xs: 1.5, sm: 2, md: 2.5 },
          '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: { xs: 1.5, md: 2 } 
          }}>
            <Icon sx={{ 
              mr: { xs: 1.5, md: 2 }, 
              fontSize: { xs: 20, sm: 24, md: 28 },
              color: getColor()
            }} />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="700"
              sx={{ 
                fontSize: { 
                  xs: '1rem', 
                  sm: '1.2rem', 
                  md: '1.4rem' 
                },
                color: getColor()
              }}
            >
              {title}
            </Typography>
          </Box>
          
          {isList && Array.isArray(sectionContent) ? (
            <List sx={{ py: 0 }}>
              {sectionContent.map((item, index) => (
                <ListItem key={index} sx={{ 
                  alignItems: 'flex-start', 
                  px: 0,
                  py: { xs: 0.75, md: 1 }
                }}>
                  <ListItemIcon sx={{ 
                    minWidth: { xs: 32, md: 40 }, 
                    mt: 0.5 
                  }}>
                    <Chip 
                      label={index + 1} 
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        fontWeight: '700', 
                        fontSize: { xs: '0.75rem', md: '0.9rem' },
                        width: { xs: 28, md: 34 },
                        height: { xs: 28, md: 34 },
                        backgroundColor: getColor(),
                        color: 'white'
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          lineHeight: 1.6, 
                          fontSize: { 
                            xs: '0.875rem', 
                            sm: '0.9rem', 
                            md: '1rem' 
                          } 
                        }}
                      >
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.7, 
                fontSize: { 
                  xs: '0.875rem', 
                  sm: '0.9rem', 
                  md: '1rem' 
                },
                whiteSpace: 'pre-line'
              }}
            >
              {typeof sectionContent === 'string' ? sectionContent : JSON.stringify(sectionContent)}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  const LearningActionsSection = ({ actions }) => {
    if (!actions || actions.length === 0) return null;

    return (
      <Card elevation={1} sx={{ 
        borderLeft: '4px solid', 
        borderColor: colorPalette[400],
        mb: 2,
        background: 'white'
      }}>
        <CardContent sx={{ 
          p: { xs: 1.5, sm: 2, md: 2.5 },
          '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: { xs: 1.5, md: 2 } 
          }}>
            <PlayArrow sx={{ 
              mr: { xs: 1.5, md: 2 }, 
              fontSize: { xs: 20, sm: 24, md: 28 },
              color: colorPalette[400]
            }} />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="700"
              sx={{ 
                fontSize: { 
                  xs: '1rem', 
                  sm: '1.2rem', 
                  md: '1.4rem' 
                },
                color: colorPalette[400]
              }}
            >
              Steps to understand {selectedSubtopic.name}
            </Typography>
          </Box>

          <Alert 
            severity="info" 
            sx={{ 
              mb: 2, 
              borderRadius: 1,
              backgroundColor: colorPalette[50],
              color: colorPalette[700],
              border: `1px solid ${colorPalette[200]}`
            }}
            icon={<AutoAwesome sx={{ color: colorPalette[500] }} />}
          >
            Follow these universal learning steps to master any topic
          </Alert>

          <List sx={{ py: 0 }}>
            {actions.map((action, index) => (
              <ListItem key={index} sx={{ 
                alignItems: 'flex-start', 
                px: 0,
                py: { xs: 1, md: 1.25 },
                borderBottom: index < actions.length - 1 ? '1px solid' : 'none',
                borderColor: colorPalette[100]
              }}>
                <ListItemIcon sx={{ 
                  minWidth: { xs: 32, md: 40 }, 
                  mt: 0.5 
                }}>
                  <Chip 
                    label={index + 1} 
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                      fontWeight: '700', 
                      fontSize: { xs: '0.75rem', md: '0.9rem' },
                      width: { xs: 28, md: 34 },
                      height: { xs: 28, md: 34 },
                      backgroundColor: colorPalette[400],
                      color: 'white'
                    }}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.6, 
                        fontSize: { 
                          xs: '0.875rem', 
                          sm: '0.9rem', 
                          md: '1rem' 
                        },
                        fontWeight: 500
                      }}
                    >
                      {typeof action === 'string' ? action : JSON.stringify(action)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ 
            mt: 2, 
            p: { xs: 1.5, md: 2 }, 
            backgroundColor: colorPalette[50], 
            borderRadius: 1,
            border: '1px solid',
            borderColor: colorPalette[200]
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colorPalette[700], 
                textAlign: 'center', 
                fontStyle: 'italic',
                fontSize: { xs: '0.8rem', md: '0.9rem' }
              }}
            >
              💡 Use these steps to understand the key ideas in {selectedSubtopic.name}.
            </Typography>
          </Box>
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

    const isQuestionAnswered = (questionIndex) => {
      return quizAnswers[questionIndex] !== undefined;
    };

    const handleSubmitQuiz = async () => {
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
        if (selectedTopic && selectedSubtopic) {
          await updateQuizMarks({
            topic: selectedTopic,
            subtopic: selectedSubtopic.name,
            correct,
            wrong,
            total
          });
        }
      } catch (error) {
        console.error('Failed to save quiz marks:', error);
      } finally {
        setSavingQuiz(false);
      }
    };

    const answeredCount = Object.keys(quizAnswers).length;
    const progressPercentage = (answeredCount / quizItems.length) * 100;
    const allQuestionsAnswered = answeredCount === quizItems.length;

    const getAnswerStatus = (questionIndex, option) => {
      if (!quizSubmitted) return 'default';
      
      const currentQuestion = typeof quizItems[questionIndex] === 'string' ? { choices: [] } : quizItems[questionIndex];
      const correctAnswer = currentQuestion.choices?.[currentQuestion.correctIndex] || currentQuestion.answer;
      const userAnswer = quizAnswers[questionIndex];
      
      if (option === correctAnswer) {
        return 'correct';
      } else if (option === userAnswer && userAnswer !== correctAnswer) {
        return 'wrong';
      }
      return 'default';
    };

    return (
      <Card 
        elevation={1}
        sx={{ 
          borderLeft: '4px solid',
          borderColor: '#ef4444',
          mb: 2,
          background: 'white'
        }}
      >
        <CardContent sx={{ 
          p: { xs: 1.5, sm: 2, md: 2.5 },
          '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: { xs: 1.5, md: 2 } 
          }}>
            <Quiz sx={{ 
              mr: { xs: 1.5, md: 2 }, 
              fontSize: { xs: 20, sm: 24, md: 28 },
              color: '#ef4444'
            }} />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="700"
              sx={{ 
                fontSize: { 
                  xs: '1rem', 
                  sm: '1.2rem', 
                  md: '1.4rem' 
                },
                color: '#ef4444'
              }}
            >
              Check Your Understanding
            </Typography>
          </Box>

          <Alert 
            severity="info" 
            sx={{ 
              mb: 2, 
              borderRadius: 1,
              backgroundColor: colorPalette[50],
              color: colorPalette[700],
              border: `1px solid ${colorPalette[200]}`
            }}
          >
            Test your knowledge with these interactive questions
          </Alert>

          {/* Progress Bar */}
          <Box sx={{ 
            mb: 3, 
            p: { xs: 1.5, md: 2 }, 
            backgroundColor: colorPalette[50], 
            borderRadius: 1,
            border: `1px solid ${colorPalette[200]}`
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="600" color={colorPalette[600]} sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                {answeredCount} / {quizItems.length}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: colorPalette[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: allQuestionsAnswered ? '#10b981' : colorPalette[600],
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
                elevation={0}
                sx={{ 
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: colorPalette[200],
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: colorPalette[600] }} />}
                  sx={{ 
                    backgroundColor: colorPalette[50],
                    borderRadius: 1,
                    minHeight: { xs: 56, md: 64 },
                    '&.Mui-expanded': {
                      minHeight: { xs: 56, md: 64 },
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Chip 
                      label={`Q${index + 1}`}
                      variant="filled"
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        mr: 2, 
                        fontWeight: '700', 
                        minWidth: { xs: 36, md: 44 },
                        backgroundColor: colorPalette[500],
                        color: 'white',
                        fontSize: { xs: '0.75rem', md: '0.9rem' }
                      }}
                    />
                    <Typography 
                      variant={isMobile ? "body1" : "h6"} 
                      fontWeight="600" 
                      sx={{ 
                        flex: 1, 
                        fontSize: { xs: '0.875rem', md: '1rem' } 
                      }}
                    >
                      {question.question || quizItem}
                    </Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ 
                  pt: 2, 
                  backgroundColor: 'white',
                  px: { xs: 1.5, md: 2 }
                }}>
                  {question.options || question.choices ? (
                    <RadioGroup
                      value={userAnswer || ''}
                      onChange={(e) => !quizSubmitted && handleQuizAnswer(index, e.target.value)}
                      sx={{ mb: 2 }}
                    >
                      {(question.options || question.choices).map((option, optIndex) => {
                        const answerStatus = getAnswerStatus(index, option);
                        
                        return (
                          <FormControlLabel
                            key={optIndex}
                            value={option}
                            control={<Radio 
                              size={isMobile ? "small" : "medium"}
                              disabled={quizSubmitted}
                              sx={{ color: colorPalette[500] }}
                            />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontSize: { xs: '0.875rem', md: '1rem' } 
                                  }}
                                >
                                  {option}
                                </Typography>
                                {quizSubmitted && answerStatus === 'correct' && (
                                  <CheckCircle sx={{ color: '#10b981', ml: 1, fontSize: 20 }} />
                                )}
                                {quizSubmitted && answerStatus === 'wrong' && (
                                  <Cancel sx={{ color: '#ef4444', ml: 1, fontSize: 20 }} />
                                )}
                              </Box>
                            }
                            sx={{ 
                              mb: 1,
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: answerStatus === 'correct' ? '#dcfce7' : 
                                            answerStatus === 'wrong' ? '#fecaca' : 
                                            userAnswer === option ? colorPalette[50] : 'transparent',
                              border: answerStatus === 'correct' ? '2px solid #10b981' : 
                                     answerStatus === 'wrong' ? '2px solid #ef4444' : 
                                     userAnswer === option ? `2px solid ${colorPalette[300]}` : `1px solid ${colorPalette[200]}`,
                              '&:hover': {
                                backgroundColor: !quizSubmitted ? colorPalette[100] : undefined
                              }
                            }}
                          />
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" fontWeight="600" gutterBottom color={colorPalette[600]} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        🤔 Reflection Time
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                        Take a moment to think about this question. Consider what you've learned and form your answer.
                      </Typography>
                      
                      <Paper
                        variant="outlined"
                        sx={{ 
                          p: 2, 
                          minHeight: 100,
                          backgroundColor: userAnswer ? '#dcfce7' : colorPalette[50],
                          border: '2px solid',
                          borderColor: userAnswer ? '#10b981' : colorPalette[300],
                          borderRadius: 1,
                          cursor: !quizSubmitted ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: !quizSubmitted && !userAnswer ? colorPalette[100] : undefined
                          }
                        }}
                        onClick={() => !quizSubmitted && !userAnswer && handleQuizAnswer(index, "Reflected")}
                      >
                        {userAnswer ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <CheckCircle sx={{ fontSize: isMobile ? 28 : 36, color: '#10b981', mb: 1 }} />
                            <Typography variant="h6" color="#10b981" fontWeight="600" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              Well done! You've reflected on this question.
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', color: colorPalette[600] }}>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              Click to mark as reflected
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                              Take your time to think, then click here when ready.
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  )}

                  {quizSubmitted && question.explanation && (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        borderRadius: 1, 
                        mt: 1,
                        backgroundColor: colorPalette[50],
                        color: colorPalette[700],
                        border: `1px solid ${colorPalette[200]}`
                      }}
                    >
                      <Typography variant="body2" fontWeight="600" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                        {question.explanation}
                      </Typography>
                    </Alert>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}

          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mt: 2, 
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}>
            <Button
              variant="outlined"
              sx={{ 
                borderRadius: 1,
                borderColor: colorPalette[500],
                color: colorPalette[600],
                '&:hover': {
                  borderColor: colorPalette[600],
                  backgroundColor: colorPalette[50]
                }
              }}
              onClick={() => setExpandedQuiz(!expandedQuiz)}
              size={isMobile ? "small" : "medium"}
            >
              {expandedQuiz ? 'Collapse All' : 'Expand All'}
            </Button>
            
            {!quizSubmitted ? (
              <Button
                variant="contained"
                sx={{ 
                  borderRadius: 1,
                  backgroundColor: allQuestionsAnswered ? '#10b981' : colorPalette[500],
                  '&:hover': {
                    backgroundColor: allQuestionsAnswered ? '#059669' : colorPalette[600]
                  }
                }}
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered || savingQuiz}
                size={isMobile ? "small" : "medium"}
              >
                {savingQuiz ? 'Saving...' : 'Submit Answers'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  borderColor: colorPalette[500],
                  color: colorPalette[600],
                  '&:hover': {
                    borderColor: colorPalette[600],
                    backgroundColor: colorPalette[50]
                  }
                }}
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                  setQuizResults({ correct: 0, wrong: 0 });
                }}
                size={isMobile ? "small" : "medium"}
              >
                Retake Quiz
              </Button>
            )}
          </Box>

          {quizSubmitted && (
            <Alert 
              severity={savingQuiz ? "info" : "success"} 
              sx={{ 
                mt: 2, 
                borderRadius: 1,
                backgroundColor: savingQuiz ? colorPalette[50] : '#dcfce7',
                color: savingQuiz ? colorPalette[700] : '#065f46',
                border: `1px solid ${savingQuiz ? colorPalette[200] : '#10b981'}`
              }}
            >
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                {savingQuiz 
                  ? "Saving your quiz results..." 
                  : `Quiz submitted! Results: ${quizResults.correct} correct, ${quizResults.wrong} wrong (${Math.round((quizResults.correct / (quizResults.correct + quizResults.wrong)) * 100)}%)`
                }
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  // Safe content access with fallbacks
  const safeContent = {
    concept: content.concept || content.keyConcepts?.[0] || '',
    explanation: content.explanation || '',
    learningActions: Array.isArray(content.learningActions) ? content.learningActions : 
                    Array.isArray(content.steps) ? content.steps :
                    ["Identify the key pieces", "See how they work together", "Try it with the example", "Apply to something new"],
    examples: Array.isArray(content.examples) ? content.examples : 
              content.coreExample ? [content.coreExample] : [],
    practice: content.practice || '',
    mindmap: content.mindmap,
    quiz: Array.isArray(content.quiz) ? content.quiz : []
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'white'
      }}>
        {/* Compact Header Card */}
        <Box sx={{ 
          flexShrink: 0,
          p: { xs: 1, sm: 1.5, md: 2 },
          pb: 0
        }}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`, 
            color: 'white',
            borderRadius: { xs: 2, md: 3 },
            boxShadow: `0 4px 12px ${colorPalette[200]}`
          }}>
            <CardContent sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
            }}>
              <Typography 
                variant="h3" 
                fontWeight="800" 
                gutterBottom 
                sx={{ 
                  fontSize: { 
                    xs: '1.25rem', 
                    sm: '1.5rem', 
                    md: '1.75rem',
                    lg: '2rem'
                  },
                  wordBreak: 'break-word',
                  lineHeight: 1.2,
                  mb: 1
                }}
              >
                {content.title || `${selectedSubtopic?.name}`}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                flexWrap: 'wrap',
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
              }}>
                <Typography variant="h6" sx={{ opacity: 0.9, fontSize: 'inherit' }}>
                  {selectedTopic}
                </Typography>
                <Typography sx={{ opacity: 0.7 }}>•</Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontSize: 'inherit' }}>
                  {selectedSubtopic?.name}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Scrollable Content Area */}
        <Box sx={{ 
          flex: 1,
          width: '100%',
          overflow: 'auto',
          p: { xs: 1, sm: 1.5, md: 2 },
          pt: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: colorPalette[50],
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: colorPalette[300],
            borderRadius: '3px',
            '&:hover': {
              background: colorPalette[400],
            },
          },
        }}>
          {/* Content Sections */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 1.5, md: 2 }, 
            width: '100%',
            maxWidth: '100%'
          }}>
            {safeContent.concept && (
              <ContentSection
                title="Core Concept"
                content={safeContent.concept}
                icon={Description}
                color="primary"
              />
            )}

            {safeContent.explanation && (
              <ContentSection
                title="Detailed Explanation"
                content={safeContent.explanation}
                icon={EmojiObjects}
                color="secondary"
              />
            )}

            {/* LEARNING ACTIONS SECTION */}
            {safeContent.learningActions.length > 0 && (
              <LearningActionsSection actions={safeContent.learningActions} />
            )}

            {safeContent.examples.length > 0 && (
              <ContentSection
                title="Practical Examples"
                content={safeContent.examples}
                icon={EmojiObjects}
                color="success"
                isList={true}
              />
            )}

            {safeContent.practice && (
              <ContentSection
                title="Practice Exercise"
                content={safeContent.practice}
                icon={FitnessCenter}
                color="warning"
              />
            )}

            {safeContent.mindmap && (
              <Card elevation={1} sx={{ 
                borderLeft: '4px solid', 
                borderColor: '#f59e0b',
                background: 'white'
              }}>
                <CardContent sx={{ 
                  p: { xs: 1.5, sm: 2, md: 2.5 },
                  '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: { xs: 1.5, md: 2 } 
                  }}>
                    <AccountTree sx={{ 
                      mr: { xs: 1.5, md: 2 }, 
                      fontSize: { xs: 20, sm: 24, md: 28 },
                      color: '#f59e0b'
                    }} />
                    <Typography 
                      variant={isMobile ? "h6" : "h5"} 
                      fontWeight="700"
                      sx={{ 
                        fontSize: { 
                          xs: '1rem', 
                          sm: '1.2rem', 
                          md: '1.4rem' 
                        },
                        color: '#f59e0b'
                      }}
                    >
                      Mind Map
                    </Typography>
                  </Box>
                  <MermaidDiagram chart={safeContent.mindmap} />
                </CardContent>
              </Card>
            )}

            {/* QUIZ SECTION */}
            {safeContent.quiz.length > 0 && (
              <QuizSection quizItems={safeContent.quiz} />
            )}

            {/* Fallback if no content sections are available */}
            {!safeContent.concept && 
             !safeContent.explanation && 
             safeContent.learningActions.length === 0 && 
             safeContent.examples.length === 0 && 
             !safeContent.practice && 
             !safeContent.mindmap && 
             safeContent.quiz.length === 0 && (
              <Card elevation={1} sx={{ 
                textAlign: 'center', 
                py: { xs: 3, md: 4 }, 
                width: '100%',
                background: 'white'
              }}>
                <CardContent>
                  <Psychology sx={{ 
                    fontSize: { xs: 40, md: 48 }, 
                    color: colorPalette[400], 
                    mb: 2 
                  }} />
                  <Typography variant="h6" color={colorPalette[600]} gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    No content available
                  </Typography>
                  <Typography variant="body2" color={colorPalette[500]} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    The content for this topic could not be generated. Please try regenerating the content.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default LearningContent;