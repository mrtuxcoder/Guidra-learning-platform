import React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { profileTheme } from "../profile/constants";

const solutionSteps = [
  {
    title: "Start from curated or custom topics",
    detail: "Use Explore for ready-to-learn topics or validate your own topic and generate a custom path.",
  },
  {
    title: "Learn subtopic by subtopic",
    detail: "Each topic is split into structured subtopics with explanation, examples, mindmap, practice, and quiz.",
  },
  {
    title: "Generate and regenerate with control",
    detail: "Use teaching styles, version history, and cached content to keep output consistent and useful.",
  },
  {
    title: "Track mastery, not just completion",
    detail: "Update understanding level, submit quizzes, and monitor performance from Learn and Profile insights.",
  },
  {
    title: "Recall completed topics anytime",
    detail: "Finished topics can be reopened in recall mode for quick revision from the first subtopic.",
  },
  {
    title: "Keep a daily learning rhythm",
    detail: "Use daily regeneration limits and the focus timer to keep study sessions sustainable.",
  },
];

const LandingSolution = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(
                theme.palette.primary.main,
                0.16
              )} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
            : "linear-gradient(180deg, rgba(126,87,194,0.05) 0%, rgba(126,87,194,0.1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
          }}
        >
          How Guidra Works
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          {solutionSteps.map((step, index) => (
            <Box
              key={step.title}
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: "background.paper",
                border: `1px solid ${profileTheme.border}`,
                height: "100%",
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: isDark
                    ? profileTheme.primaryLight
                    : profileTheme.primaryDark,
                  fontWeight: 600,
                }}
              >
                Step {index + 1}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1, mt: 0.5 }}
              >
                {step.title}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {step.detail}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LandingSolution;
