import React from "react";
import { Box, Typography, useMediaQuery, IconButton, Chip } from "@mui/material";
import { Menu } from "@mui/icons-material";

const Header = ({
  hasTopics,
  selectedTopic,
  subtopicName,
  isReady,
  learningInsights,
  colorPalette,
  isMobile: isMobileProp,
  onOpenSidebar,
  isRecalledTopic = false,
}) => {
  const isMobileMedia = useMediaQuery("(max-width: 600px)");
  const isMobile = isMobileProp !== undefined ? isMobileProp : isMobileMedia;
  const isDesktop = useMediaQuery("(min-width: 1200px)");

  const getHeaderText = () => {
    if (!hasTopics) return "Welcome to Guidra!";
    if (isRecalledTopic) return "Recalling Completed Topic";
    if (learningInsights.isTopicCompleted) return "Course Completed! 🎉";
    if (isReady) return "Ready to Learn";
    return "Continue Learning";
  };

  const getSubtitleText = () => {
    if (!hasTopics)
      return "Start your learning journey with personalized AI-powered courses";
    if (isRecalledTopic)
      return `Review ${selectedTopic} - select a subtopic to refresh your knowledge`;
    if (learningInsights.isTopicCompleted)
      return `You've mastered ${selectedTopic}`;
    if (isReady) return `Start learning "${subtopicName}"`;
    if (selectedTopic) return `Continue your progress in ${selectedTopic}`;
    return "Select a topic to begin";
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
        color: "white",
        p: isMobile ? 3 : isDesktop ? 4 : 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && onOpenSidebar && (
        <IconButton
          onClick={onOpenSidebar}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 44,
            height: 44,
            background: "rgba(255, 255, 255, 0.15)",
            color: "white",
            zIndex: 2,
            backdropFilter: "blur(10px)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.25)",
            },
          }}
        >
          <Menu sx={{ fontSize: 20 }} />
        </IconButton>
      )}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background:
            "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        {isRecalledTopic && (
          <Chip
            label="Recall Mode"
            size="small"
            sx={{
              mb: 1.5,
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              backdropFilter: "blur(10px)",
            }}
          />
        )}
        <Typography
          variant={isMobile ? "h5" : isDesktop ? "h4" : "h5"}
          fontWeight="800"
          sx={{ mb: 1 }}
        >
          {getHeaderText()}
        </Typography>

        <Typography
          variant={isMobile ? "body2" : "body1"}
          sx={{
            opacity: 0.9,
            lineHeight: 1.5,
          }}
        >
          {getSubtitleText()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
