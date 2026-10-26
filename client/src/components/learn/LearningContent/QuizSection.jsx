import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Alert,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Quiz, Refresh, Lock, CheckCircle } from "@mui/icons-material";
import QuizQuestion from "./QuizQuestion";
import QuizProgress from "./QuizProgress";
import { updateQuizMarks, analyzeQuizAnswers } from "../../../api";

const QuizSection = ({
  quizItems,
  selectedTopic,
  selectedSubtopic,
  isMobile,
  onRegenerate,
  isRegenerating = false,
  isRegenerateDisabled = false,
  onQuizSubmitted,
}) => {
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
      await updateQuizMarks({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name,
        correct,
        wrong,
        total,
      });

      analyzeQuizAnswers({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name,
        quizAnswers: analysisData,
      }).catch((error) => {
        console.error("Quiz analysis failed (non-critical):", error);
      });

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
    <Paper
      elevation={0}
      id="knowledge-check-section"
      sx={{
        mt: 4,
        mb: 3,
        p: { xs: 2.25, md: 3 },
        borderRadius: "8px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "6px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.05)",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Quiz sx={{ fontSize: 16 }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, fontSize: "1.025rem", color: "text.primary", letterSpacing: "-0.01em" }}
            >
              Knowledge Check
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>
              Verify your understanding before completing this lesson
            </Typography>
          </Box>
        </Box>

        {onRegenerate && (
          <Tooltip
            title={
              isRegenerateDisabled
                ? "Generation limit reached (max 3)"
                : "Regenerate quiz questions"
            }
          >
            <span>
              <IconButton
                size="small"
                onClick={onRegenerate}
                disabled={isRegenerating || isRegenerateDisabled}
                sx={{
                  color: isRegenerateDisabled ? "text.secondary" : "text.secondary",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "6px",
                  p: 0.6,
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: "action.hover",
                  },
                }}
              >
                {isRegenerateDisabled ? (
                  <Lock sx={{ fontSize: 15 }} />
                ) : (
                  <Refresh
                    sx={{
                      fontSize: 15,
                      animation: isRegenerating ? "spin 1s linear infinite" : "none",
                    }}
                  />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>

      {/* Progress */}
      <QuizProgress
        answeredCount={answeredCount}
        totalQuestions={quizItems.length}
        allQuestionsAnswered={allQuestionsAnswered}
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
        />
      ))}

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 2.5, alignItems: "center" }}>
        {!quizSubmitted ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmitQuiz}
            disabled={!allQuestionsAnswered || savingQuiz}
            startIcon={savingQuiz ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              py: 0.9,
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.88rem",
            }}
          >
            {savingQuiz ? "Saving..." : "Submit Answers"}
          </Button>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            onClick={handleResetQuiz}
            sx={{
              py: 0.9,
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.88rem",
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "divider", bgcolor: "action.hover" },
            }}
          >
            Retake Quiz
          </Button>
        )}
      </Box>

      {/* Results */}
      {quizSubmitted && (
        <Alert
          severity={scorePercentage >= 70 ? "success" : "info"}
          icon={scorePercentage >= 70 ? <CheckCircle fontSize="inherit" /> : undefined}
          sx={{ mt: 2, borderRadius: "6px", fontWeight: 500 }}
        >
          {scorePercentage >= 70
            ? `Great job! You scored ${quizResults.correct}/${quizResults.correct + quizResults.wrong} (${scorePercentage}%). You're ready to complete this subtopic!`
            : `You scored ${quizResults.correct}/${quizResults.correct + quizResults.wrong} (${scorePercentage}%). Review the explanations above and retake when ready.`}
        </Alert>
      )}
    </Paper>
  );
};

export default QuizSection;