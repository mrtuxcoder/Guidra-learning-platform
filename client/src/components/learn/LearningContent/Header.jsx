import React from "react";
import { Box, Typography } from "@mui/material";

const Header = ({ title, topic, isMobile, currentSubtopicIndex = -1 }) => {
  const displayTitle = React.useMemo(() => {
    if (!title) return "";
    if (!topic) return title;

    const escapedTopic = topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const leadingTopicPattern = new RegExp(
      `^\\s*${escapedTopic}\\s*[:\\-–—|]+\\s*`,
      "i"
    );
    const trailingTopicPattern = new RegExp(
      `\\s*[:\\-–—|]+\\s*${escapedTopic}\\s*$`,
      "i"
    );
    return (
      title
        .replace(leadingTopicPattern, "")
        .replace(trailingTopicPattern, "")
        .trim() || title
    );
  }, [title, topic]);

  // On desktop, the breadcrumb in DesktopHeader already shows the subtopic name.
  // We keep a lightweight reading title on mobile where the top bar is compact.
  if (!isMobile) {
    return null;
  }

  return (
    <Box sx={{ px: 2, pt: 1, pb: 2 }}>
      <Typography
        variant="caption"
        sx={{
          color: "primary.main",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: "0.72rem",
          display: "block",
          mb: 0.5,
        }}
      >
        {topic}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          fontSize: "1.25rem",
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        {currentSubtopicIndex >= 0 ? `${currentSubtopicIndex + 1}. ${displayTitle}` : displayTitle}
      </Typography>
    </Box>
  );
};

export default Header;