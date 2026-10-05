import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import DesktopQuickActions from "./DesktopQuickActions";
import MobileQuickActions from "./MobileQuickActions";
import { Restore, Bolt, TrendingUp } from "@mui/icons-material";

const quickActionsData = [
  {
    icon: <Bolt sx={{ fontSize: 24 }} />,
    name: "Continue Learning",
    type: "continue",
    subtitle: "Pick up where you left",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  {
    icon: <Restore sx={{ fontSize: 24 }} />,
    name: "Recent Topic",
    type: "recent",
    subtitle: "Jump back in",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  },
  {
    icon: <TrendingUp sx={{ fontSize: 24 }} />,
    name: "Priority Topic",
    type: "priority",
    subtitle: "Needs attention",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  },
];

const QuickActions = ({
  selectedTopic,
  learningInsights,
  suggestions,
  activeSuggestion,
  onSetActiveSuggestion,
  onQuickAction,
}) => {
  const isDesktop = useMediaQuery("(min-width: 900px)");

  if (!selectedTopic || learningInsights.isTopicCompleted) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        fontWeight="700"
        sx={{ mb: 3, color: "text.primary" }}
      >
        Learning Suggestions
      </Typography>

      {isDesktop ? (
        <DesktopQuickActions
          quickActions={quickActionsData}
          learningInsights={learningInsights}
          suggestions={suggestions}
          activeSuggestion={activeSuggestion}
          onSetActiveSuggestion={onSetActiveSuggestion}
          onQuickAction={onQuickAction}
        />
      ) : (
        <MobileQuickActions
          quickActions={quickActionsData}
          learningInsights={learningInsights}
          suggestions={suggestions}
          activeSuggestion={activeSuggestion}
          onSetActiveSuggestion={onSetActiveSuggestion}
          onQuickAction={onQuickAction}
        />
      )}
    </Box>
  );
};

export default QuickActions;
