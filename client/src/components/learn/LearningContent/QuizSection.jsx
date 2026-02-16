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
} from "@mui/material";
import { Quiz, Refresh, Lock } from "@mui/icons-material";
import QuizQuestion from "./QuizQuestion";
import QuizProgress from "./QuizProgress";
import { updateQuizMarks } from "../../../api";

const QuizSection = ({
  quizItems,
  selectedTopic,
  selectedSubtopic,
  isMobile,
  colorPalette,
  onRegenerate,
  isRegenerating = false,
  isRegenerateDisabled = false,
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

    quizItems.forEach((question, index) => {
      if (quizAnswers[index] !== undefined) {
        const currentQuestion =
          typeof question === "string" ? { choices: [] } : question;
        const correctAnswer =
          currentQuestion.choices?.[currentQuestion.correctIndex] ||
          currentQuestion.answer;

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
        total,
      });
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
        background: "white",
        border: `2px solid ${colorPalette[200]}`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              borderRadius: "10px",
              background: colorPalette[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <Quiz sx={{ fontSize: isMobile ? 18 : 20, color: "white" }} />
          </Box>
          <Box>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="600"
              sx={{ color: colorPalette[700] }}
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
