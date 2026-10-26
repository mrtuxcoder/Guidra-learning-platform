import React from "react";
import { Typography, Box, Button, useTheme } from "@mui/material";
import AnswerOption from "./AnswerOption";
import { renderFormattedText } from "./utils";

const QuizQuestion = ({
  quizItem,
  index,
  userAnswer,
  quizSubmitted,
  onAnswer,
  isMobile,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const question =
    typeof quizItem === "string" ? { question: quizItem } : quizItem;

  const correctAnswer =
    question.choices?.[question.correctIndex] || question.answer;
  const isCorrect = userAnswer === correctAnswer;

  const getAnswerStatus = (option) => {
    if (!quizSubmitted) return "default";
    if (option === correctAnswer) return "correct";
    if (option === userAnswer && userAnswer !== correctAnswer) return "wrong";
    return "default";
  };

  return (
    <Box
      sx={{
        mb: 2.5,
        p: { xs: 1.75, md: 2.25 },
        borderRadius: "8px",
        bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.015)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Question Title */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          fontSize: isMobile ? "0.88rem" : "0.93rem",
          lineHeight: 1.45,
          mb: 1.5,
        }}
      >
        {renderFormattedText(`${index + 1}. ${question.question || quizItem}`)}
      </Typography>

      {/* Options */}
      {question.options || question.choices ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {(question.options || question.choices).map((option, optIndex) => {
            const answerStatus = getAnswerStatus(option);

            return (
              <AnswerOption
                key={optIndex}
                option={option}
                value={option}
                disabled={quizSubmitted}
                answerStatus={answerStatus}
                isSelected={userAnswer === option}
                onSelect={() => !quizSubmitted && onAnswer(index, option)}
                isMobile={isMobile}
              />
            );
          })}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", p: 1 }}>
          <Button
            variant="outlined"
            onClick={() =>
              !quizSubmitted && !userAnswer && onAnswer(index, "Reflected")
            }
            disabled={quizSubmitted || !!userAnswer}
            size="small"
            sx={{
              borderRadius: "6px",
              fontWeight: 600,
            }}
          >
            {userAnswer ? "✓ Understood" : "Mark as Understood"}
          </Button>
        </Box>
      )}

      {/* Explanation Banner when Quiz Submitted */}
      {quizSubmitted && question.explanation && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: "6px",
            bgcolor: isCorrect
              ? isDark
                ? "rgba(16, 185, 129, 0.08)"
                : "rgba(16, 185, 129, 0.04)"
              : isDark
              ? "rgba(239, 68, 68, 0.08)"
              : "rgba(239, 68, 68, 0.04)",
            borderLeft: `3px solid ${isCorrect ? theme.palette.success.main : theme.palette.error.main}`,
            borderTop: "1px solid",
            borderRight: "1px solid",
            borderBottom: "1px solid",
            borderColor: isCorrect
              ? isDark
                ? "rgba(16, 185, 129, 0.2)"
                : "rgba(16, 185, 129, 0.15)"
              : isDark
              ? "rgba(239, 68, 68, 0.2)"
              : "rgba(239, 68, 68, 0.15)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontWeight: 700,
              color: isCorrect ? "success.main" : "error.main",
              mb: 0.25,
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {isCorrect ? "Correct" : "Explanation"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.84rem",
              color: "text.primary",
              lineHeight: 1.5,
            }}
          >
            {renderFormattedText(question.explanation)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default QuizQuestion;