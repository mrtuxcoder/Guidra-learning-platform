import React from "react";
import { Paper, Box, Typography, Fade } from "@mui/material";
import { TipsAndUpdates } from "@mui/icons-material";

const guidelines = [
  {
    title: "Finish Current Topics First",
    desc: "Stay focused on one learning path at a time to keep your progress and retention optimal.",
  },
  {
    title: "Use Clear, Specific Titles",
    desc: "Enter targeted topics like 'Python Control Flow' or 'PostgreSQL Indexing' for the best results.",
  },
  {
    title: "Rephrase If Validation Fails",
    desc: "Try clearer wording or add terms like 'fundamentals', 'introduction', or 'basics'.",
  },
  {
    title: "Structured Lessons Only",
    desc: "Guidra creates structured curriculum lessons and quizzes, not general chat answers.",
  },
];

const Guidelines = ({ show }) => {
  if (!show) return null;

  return (
    <Fade in={show} timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, sm: 2.75 },
          mt: 3,
          borderRadius: "8px",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.92rem",
            color: "text.primary",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TipsAndUpdates sx={{ fontSize: 18, color: "text.secondary" }} />
          Guidelines for Custom Topics
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          {guidelines.map((guideline, index) => (
            <GuidelineItem key={index} index={index} guideline={guideline} />
          ))}
        </Box>
      </Paper>
    </Fade>
  );
};

const GuidelineItem = ({ index, guideline }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 0.2,
          flexShrink: 0,
          color: "text.primary",
          fontWeight: 700,
          fontSize: "0.72rem",
        }}
      >
        {index + 1}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "text.primary",
            lineHeight: 1.3,
            mb: 0.35,
          }}
        >
          {guideline.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.8rem",
            color: "text.secondary",
            lineHeight: 1.45,
          }}
        >
          {guideline.desc}
        </Typography>
      </Box>
    </Box>
  );
};

export default Guidelines;
