import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const QuizProgress = ({
  answeredCount,
  totalQuestions,
  allQuestionsAnswered,
}) => {
  const progressPercentage =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "text.secondary",
            fontSize: "0.72rem",
          }}
        >
          Quiz Progress
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: allQuestionsAnswered ? "success.main" : "text.secondary",
            fontSize: "0.75rem",
          }}
        >
          {`${answeredCount} of ${totalQuestions} answered`}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
          "& .MuiLinearProgress-bar": {
            bgcolor: allQuestionsAnswered ? "success.main" : "primary.main",
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
};

export default QuizProgress;