import React from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import { Menu, School } from "@mui/icons-material";

const Header = ({
  hasTopics,
  selectedTopic,
  subtopicName,
  isReady,
  learningInsights,
  isMobile = false,
  onOpenSidebar,
  isRecalledTopic = false,
}) => {
  const getHeaderText = () => {
    if (!hasTopics) return "Welcome to Guidra";
    if (isRecalledTopic) return "Topic Review";
    if (learningInsights?.isTopicCompleted) return "Course Completed";
    if (isReady) return "Ready to Learn";
    return "Continue Learning";
  };

  const getSubtitleText = () => {
    if (!hasTopics)
      return "Start your learning journey with structured, AI-powered courses.";
    if (isRecalledTopic)
      return `Reviewing ${selectedTopic} — select a subtopic to refresh your understanding.`;
    if (learningInsights?.isTopicCompleted)
      return `You have mastered all lessons in ${selectedTopic}.`;
    if (isReady) return `Start learning "${subtopicName}".`;
    if (selectedTopic) return `Continue your progress in ${selectedTopic}.`;
    return "Select a topic or lesson to begin studying.";
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: { xs: 3, md: 3.5 },
        px: { xs: 2.5, md: 4 },
        position: "relative",
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && onOpenSidebar && (
        <IconButton
          onClick={onOpenSidebar}
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "action.hover",
            color: "text.primary",
            zIndex: 2,
          }}
        >
          <Menu fontSize="small" />
        </IconButton>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 640,
          mx: "auto",
        }}
      >
        {/* Subtle Icon Badge */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "10px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(101, 88, 217, 0.15)"
                : "rgba(101, 88, 217, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1.5,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <School sx={{ fontSize: 24, color: "primary.main" }} />
        </Box>

        {isRecalledTopic && (
          <Chip
            label="Recall Mode"
            size="small"
            sx={{
              mb: 1.25,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(101, 88, 217, 0.15)"
                  : "rgba(101, 88, 217, 0.08)",
              color: "primary.main",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        )}

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.02em",
            fontSize: { xs: "1.35rem", md: "1.6rem" },
            mb: 0.75,
          }}
        >
          {getHeaderText()}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.6,
            fontSize: "0.92rem",
            maxWidth: 520,
          }}
        >
          {getSubtitleText()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
