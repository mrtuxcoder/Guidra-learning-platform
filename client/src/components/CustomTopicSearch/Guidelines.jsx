import React from "react";
import { Paper, Box, Typography, Fade } from "@mui/material";
import { Warning } from "@mui/icons-material";

const guidelines = [
  {
    title: "Finish Current Topics First",
    desc: "Stay on one learning path at a time. It keeps your progress accurate and avoids confusion.",
  },
  {
    title: "Use Clear, Beginner-Friendly Topics",
    desc: "Enter simple topics like 'Basics of Git' or 'Intro to Psychology' for the best results.",
  },
  {
    title: "Rephrase If Validation Fails",
    desc: "Try clearer wording or add terms like 'fundamentals', 'introduction', or 'basics'.",
  },
  {
    title: "Guided Lessons Only",
    desc: "This tool creates structured lessons and learning paths, not general chat-style answers.",
  },
];

const Guidelines = ({ show }) => {
  if (!show) return null;

  return (
    <Fade in={show}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: "16px",
          background: "rgba(124, 58, 237, 0.05)",
          border: "1px solid rgba(124, 58, 237, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#7C3AED",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Warning sx={{ fontSize: 20 }} />
          Important Guidelines
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {guidelines.map((guideline, index) => (
            <GuidelineItem key={index} index={index} guideline={guideline} />
          ))}
        </Box>
      </Paper>
    </Fade>
  );
};

const GuidelineItem = ({ index, guideline }) => (
  <Box sx={{ display: "flex", gap: 2 }}>
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "#7C3AED",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 0.5,
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" sx={{ color: "white", fontWeight: 700 }}>
        {index + 1}
      </Typography>
    </Box>

    <Box>
      <Typography variant="body2" fontWeight={600}>
        {guideline.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {guideline.desc}
      </Typography>
    </Box>
  </Box>
);

export default Guidelines;
