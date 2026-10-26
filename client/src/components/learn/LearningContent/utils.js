// Utility functions for LearningContent
import React from 'react';
import { Box } from '@mui/material';

export const renderFormattedText = (text) => {
  if (typeof text !== "string") return text;
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      const code = part.slice(1, -1);
      return React.createElement(
        Box,
        {
          key: i,
          component: "code",
          sx: {
            px: 0.65,
            py: 0.15,
            mx: 0.25,
            borderRadius: "4px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
            color: "text.primary",
            fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
            fontSize: "0.86em",
            fontWeight: 500,
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.08)",
            verticalAlign: "baseline",
          },
        },
        code
      );
    }
    return part;
  });
};

export const processQuizResults = (quizItems, quizAnswers) => {
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
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, wrong, total, percentage };
};

export const validateQuizSubmission = (quizAnswers, totalQuestions) => {
  return Object.keys(quizAnswers).length === totalQuestions;
};

export const getAnswerStatus = (question, userAnswer, option) => {
  const correctAnswer =
    question.choices?.[question.correctIndex] || question.answer;

  if (option === correctAnswer) return "correct";
  if (option === userAnswer && userAnswer !== correctAnswer) return "wrong";
  return "default";
};
