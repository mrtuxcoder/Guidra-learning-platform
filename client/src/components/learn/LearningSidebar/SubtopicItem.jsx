import React from "react";
import { Box, ListItem, Typography, Tooltip, CircularProgress, Chip, useTheme, alpha } from "@mui/material";
import CompletionIndicator from "./CompletionIndicator";

const SubtopicItem = ({
  subtopic,
  isSelected,
  isUpdating,
  hasContent,
  onSubtopicClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const quizAccuracy = subtopic.quizMark?.percentage;

  return (
    <ListItem
      onClick={onSubtopicClick}
      disabled={isUpdating}
      sx={{
        borderRadius: "8px",
        py: 1,
        px: 1.5,
        my: 0.5,
        bgcolor: isSelected
          ? isDark
            ? alpha(theme.palette.primary.main, 0.15)
            : alpha(theme.palette.primary.main, 0.08)
          : "transparent",
        border: "1px solid",
        borderColor: isSelected
          ? isDark
            ? alpha(theme.palette.primary.main, 0.3)
            : alpha(theme.palette.primary.main, 0.2)
          : "transparent",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
          bgcolor: isSelected
            ? isDark
              ? alpha(theme.palette.primary.main, 0.2)
              : alpha(theme.palette.primary.main, 0.12)
            : "action.hover",
        },
        "&.Mui-disabled": {
          opacity: 0.6,
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5 }}>
        {/* Completion Indicator */}
        <CompletionIndicator completed={subtopic.completed} isSelected={isSelected} />

        {/* Index & Name */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            title={subtopic.name}
            sx={{
              fontWeight: isSelected ? 600 : 500,
              fontSize: "0.85rem",
              color: isSelected ? "primary.main" : "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.35,
            }}
          >
            {subtopic.name}
          </Typography>
        </Box>

        {/* Quiz score chip if completed */}
        {subtopic.completed && typeof quizAccuracy === "number" && (
          <Chip
            label={`${quizAccuracy}%`}
            size="small"
            sx={{
              height: 18,
              fontSize: "0.65rem",
              fontWeight: 700,
              bgcolor: isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)",
              color: "success.main",
              borderRadius: "4px",
              px: 0.25,
            }}
          />
        )}

        {/* Updating spinner or content ready dot */}
        {isUpdating ? (
          <CircularProgress size={14} color="inherit" />
        ) : hasContent && !subtopic.completed ? (
          <Tooltip title="Saved offline">
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "primary.main",
                opacity: 0.8,
              }}
            />
          </Tooltip>
        ) : null}
      </Box>
    </ListItem>
  );
};

export default SubtopicItem;