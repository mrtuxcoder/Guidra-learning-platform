import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const QuizProgress = ({
  answeredCount,
  totalQuestions,
  allQuestionsAnswered,
  colorPalette,
  isMobile,
}) => {
  const progressPercentage =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="body2"
          fontWeight="600"
          sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
        >
          Progress
        </Typography>
        <Typography
          variant="body2"
          fontWeight="600"
          sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
        >
          {answeredCount} / {totalQuestions}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: colorPalette[100],
          "& .MuiLinearProgress-bar": {
            backgroundColor: allQuestionsAnswered
              ? "#10b981"
              : colorPalette[500],
            borderRadius: 3,
          },
        }}
      />
    </Box>
  );
};

export default QuizProgress;
