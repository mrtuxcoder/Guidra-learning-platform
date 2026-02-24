import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Alert,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { Quiz, Refresh, Lock } from "@mui/icons-material";
import QuizQuestion from "./QuizQuestion";
import QuizProgress from "./QuizProgress";
import { updateQuizMarks, analyzeQuizAnswers } from "../../../api";

const QuizSection = ({
  quizItems,
  selectedTopic,
  selectedSubtopic,
  isMobile,
  colorPalette,
  onRegenerate,
  isRegenerating = false,
  isRegenerateDisabled = false,
  onQuizSubmitted,
}) => {
  const theme = useTheme();
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState({ correct: 0, wrong: 0 });
  const [savingQuiz, setSavingQuiz] = useState(false);

  if (!quizItems || quizItems.length === 0) return null;

  const handleQuizAnswer = (questionIndex, answer) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedTopic || !selectedSubtopic) {
      console.error("Missing topic or subtopic for quiz submission");
      return;
    }

    let correct = 0;
    let wrong = 0;
    const analysisData = [];

    quizItems.forEach((question, index) => {
      if (quizAnswers[index] !== undefined) {
        const currentQuestion =
          typeof question === "string" ? { choices: [] } : question;
        const correctAnswer =
          currentQuestion.choices?.[currentQuestion.correctIndex] ||
          currentQuestion.answer;

        const isCorrect = quizAnswers[index] === correctAnswer;
        
        if (isCorrect) {
          correct++;
        } else {
          wrong++;
        }

        // Prepare data for AI analysis
        analysisData.push({
          question: currentQuestion.question || question,
          userAnswer: quizAnswers[index],
          correctAnswer: correctAnswer,
          isCorrect: isCorrect,
          explanation: currentQuestion.explanation || "",
        });
      }
    });

    const total = correct + wrong;
    setQuizResults({ correct, wrong });
    setQuizSubmitted(true);
    setSavingQuiz(true);

    try {
      // Update quiz marks
      await updateQuizMarks({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name,
        correct,
        wrong,
        total,
      });

      // Analyze quiz answers with AI (don't wait for it to complete)
      analyzeQuizAnswers({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name,
        quizAnswers: analysisData,
      }).catch((error) => {
        console.error("Quiz analysis failed (non-critical):", error);
      });

      // Notify parent component that quiz was submitted successfully
      if (onQuizSubmitted) {
        onQuizSubmitted();
      }
    } catch (error) {
      console.error("Failed to save quiz marks:", error);
    } finally {
      setSavingQuiz(false);
    }
  };

  const answeredCount = Object.keys(quizAnswers).length;
  const allQuestionsAnswered = answeredCount === quizItems.length;
  const scorePercentage =
    quizResults.correct + quizResults.wrong > 0
      ? Math.round(
          (quizResults.correct / (quizResults.correct + quizResults.wrong)) *
            100
        )
      : 0;

  const handleResetQuiz = () => {
    setQuizSubmitted(false);
    setQuizAnswers({});
    setQuizResults({ correct: 0, wrong: 0 });
  };

  return (
    <Card
      sx={{
        mb: 3,
        bgcolor: "transparent",
        border: "none",
        borderRadius: 0,
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${colorPalette[400]} 0%, ${colorPalette[600]} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              boxShadow: `0 6px 16px ${alpha(colorPalette[500], 0.28)}`,
            }}
          >
            <Quiz sx={{ fontSize: isMobile ? 18 : 20, color: "white" }} />
          </Box>
          <Box>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="600"
              sx={{ color: "text.primary" }}
            >
              Knowledge Check
            </Typography>
          </Box>
          {onRegenerate && (
            <Tooltip
              title={
                isRegenerateDisabled
                  ? "Generation limit reached (max 3)"
                  : "Regenerate quiz"
              }
            >
              <span style={{ marginLeft: "auto" }}>
                <IconButton
                  size="small"
                  sx={{
                    color: isRegenerateDisabled
                      ? "#ef4444"
                      : colorPalette[500],
                  }}
                  onClick={onRegenerate}
                  disabled={isRegenerating || isRegenerateDisabled}
                >
                  {isRegenerateDisabled ? (
                    <Lock sx={{ fontSize: 18 }} />
                  ) : (
                    <Refresh
                      sx={{
                        animation: isRegenerating
                          ? "spin 1s linear infinite"
                          : "none",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ height: 1, bgcolor: alpha(theme.palette.divider, 0.5), mb: 2 }} />

        {/* Progress */}
        <QuizProgress
          answeredCount={answeredCount}
          totalQuestions={quizItems.length}
          allQuestionsAnswered={allQuestionsAnswered}
          colorPalette={colorPalette}
          isMobile={isMobile}
        />

        {/* Questions */}
        {quizItems.map((quizItem, index) => (
          <QuizQuestion
            key={index}
            quizItem={quizItem}
            index={index}
            userAnswer={quizAnswers[index]}
            quizSubmitted={quizSubmitted}
            onAnswer={handleQuizAnswer}
            isMobile={isMobile}
            colorPalette={colorPalette}
          />
        ))}

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1, mt: 2, alignItems: "center" }}>
          {!quizSubmitted ? (
            <Button
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{
                background: colorPalette[600],
                flex: 1,
              }}
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered || savingQuiz}
            >
              {savingQuiz ? "Submitting..." : "Submit Answers"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                borderColor: colorPalette[600],
                color: colorPalette[600],
                flex: 1,
              }}
              onClick={handleResetQuiz}
            >
              Try Again
            </Button>
          )}
        </Box>

        {/* Results */}
        {quizSubmitted && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
            >
              Results: {quizResults.correct} correct, {quizResults.wrong} wrong
              ({scorePercentage}%)
            </Typography>
          </Alert>
        )}

      </CardContent>
    </Card>
  );
};

export default QuizSection;
