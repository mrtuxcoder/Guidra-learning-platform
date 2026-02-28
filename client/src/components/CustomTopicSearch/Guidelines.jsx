import React from "react";
import { Paper, Box, Typography, Fade } from "@mui/material";
import { TipsAndUpdates } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";

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

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Fade in={show}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          mt: { xs: 0, md: 3 },
          borderRadius: "16px",
          background: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TipsAndUpdates sx={{ fontSize: 20 }} />
          Helpful Guidelines
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

const GuidelineItem = ({ index, guideline }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 1.4,
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        background: "background.paper",
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "10px",
          background: alpha(theme.palette.primary.main, isDark ? 0.3 : 0.12),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 0.25,
          flexShrink: 0,
          color: theme.palette.primary.main,
          fontWeight: 700,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {index + 1}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={700}>
          {guideline.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {guideline.desc}
        </Typography>
      </Box>
    </Box>
  );
};

export default Guidelines;
