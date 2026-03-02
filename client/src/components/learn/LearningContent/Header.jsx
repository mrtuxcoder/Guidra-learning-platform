import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const Header = ({ title, topic, isMobile, currentSubtopicIndex = -1, colorPalette }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentMain = colorPalette?.[600] || "#6d48b5";
  const accentSoft = colorPalette?.[300] || "#b39ddb";
  const titleGradient = `linear-gradient(135deg, ${accentMain} 0%, ${accentSoft} 100%)`;

  const displayTitle = React.useMemo(() => {
    if (!isMobile || !title || !topic) {
      return title;
    }

    const escapedTopic = topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const leadingTopicPattern = new RegExp(
      `^\\s*${escapedTopic}\\s*[:\\-–—|]+\\s*`,
      "i"
    );

    const cleanedTitle = title.replace(leadingTopicPattern, "").trim();
    return cleanedTitle || title;
  }, [isMobile, title, topic]);

  const titleWithCount = React.useMemo(() => {
    if (currentSubtopicIndex < 0) {
      return displayTitle;
    }

    return `${currentSubtopicIndex + 1}. ${displayTitle}`;
  }, [currentSubtopicIndex, displayTitle]);

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: (theme) =>
          isMobile
            ? (theme.palette.mode === "dark" ? "#0F1115" : theme.palette.background.default)
            : "background.paper",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "2px",
          background: titleGradient,
          opacity: 0.6,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
          <Typography
            variant={isMobile ? "subtitle1" : "h5"}
            fontWeight={700}
            sx={{
              background: titleGradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: isMobile ? "1.2rem" : "1.6rem",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              mb: isMobile ? 0 : 0.4,
              display: "-webkit-box",
              WebkitLineClamp: isMobile ? 2 : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {titleWithCount}
          </Typography>
          {!isMobile && (
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? alpha(theme.palette.common.white, 0.7)
                  : alpha(theme.palette.text.primary, 0.65),
                fontSize: "0.9rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {topic}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
