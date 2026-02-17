import React from "react";
import { Stack, Card, CardContent, Box, Typography } from "@mui/material";

const MobileQuickActions = ({
  quickActions,
  learningInsights,
  suggestions,
  onQuickAction,
}) => {
  return (
    <Stack spacing={1}>
      {quickActions.map((action) => {
        const getSubtopic = () => {
          switch (action.type) {
            case "continue":
              return learningInsights.firstIncompleteSubtopic;
            case "recent":
              return suggestions.recentlyAccessed[0];
            case "priority":
              return suggestions.highPrioritySubtopics[0];
            default:
              return null;
          }
        };

        const subtopic = getSubtopic();
        if (!subtopic) return null;

        return (
          <Card
            key={action.type}
            sx={{
              cursor: "pointer",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              transition: "all 0.2s ease",
              bgcolor: "background.paper",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                borderColor: action.color,
              },
            }}
            onClick={() => {
              onQuickAction(action.type);
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: action.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    flexShrink: 0,
                  }}
                >
                  {React.cloneElement(action.icon, {
                    sx: { color: "white" },
                  })}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color="text.primary"
                      noWrap
                    >
                      {action.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1.2 }}
                  >
                    {action.subtitle}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.primary"
                    sx={{
                      fontWeight: "500",
                      mt: 0.5,
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {subtopic.name}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default MobileQuickActions;
