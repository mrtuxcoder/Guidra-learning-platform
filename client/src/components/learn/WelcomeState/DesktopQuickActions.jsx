import React from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const DesktopQuickActions = ({
  quickActions,
  learningInsights,
  suggestions,
  activeSuggestion,
  onSetActiveSuggestion,
  onQuickAction,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 3,
        alignItems: "stretch",
      }}
    >
      {quickActions.map((action, index) => {
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
              border: `2px solid #f1f5f9`,
              borderRadius: 3,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background: "white",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 280,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: action.gradient,
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.4s ease",
              },
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 24px 48px rgba(126, 87, 194, 0.15)",
                borderColor: action.color,
                "&::before": {
                  transform: "scaleX(1)",
                },
                "& .action-icon": {
                  transform: "scale(1.1) rotate(5deg)",
                },
                "& .subtopic-box": {
                  background: action.gradient,
                  color: "white",
                  transform: "translateY(-2px)",
                },
              },
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              "@keyframes fadeInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(30px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
            onClick={() => {
              onSetActiveSuggestion(action.type);
              onQuickAction(action.type);
            }}
          >
            <CardContent
              sx={{
                p: 3,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                "&:last-child": { pb: 3 },
              }}
            >
              {/* Header - Fixed height */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 2.5,
                  flexShrink: 0,
                }}
              >
                <Box
                  className="action-icon"
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    background: action.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 24px ${action.color}40`,
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  {React.cloneElement(action.icon, {
                    sx: {
                      fontSize: 24,
                      color: "white",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    },
                  })}
                </Box>

                <Chip
                  label={action.type.toUpperCase()}
                  size="small"
                  sx={{
                    background: "rgba(126, 87, 194, 0.08)",
                    color: "#7e57c2",
                    fontWeight: "800",
                    fontSize: "0.65rem",
                    height: 22,
                    border: "1px solid rgba(126, 87, 194, 0.2)",
                  }}
                />
              </Box>

              {/* Content - Flexible but controlled */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Title Section */}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="800"
                    sx={{
                      color: "#1e293b",
                      lineHeight: 1.3,
                      mb: 1,
                      fontSize: "1.1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.6em",
                    }}
                  >
                    {action.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      lineHeight: 1.4,
                      fontSize: "0.85rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.8em",
                    }}
                  >
                    {action.subtitle}
                  </Typography>
                </Box>

                {/* Spacer - Pushes subtopic to bottom */}
                <Box sx={{ flex: 1 }} />

                {/* Subtopic Section - Fixed at bottom */}
                <Box
                  sx={{
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      fontWeight: "600",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                      mb: 1,
                    }}
                  >
                    Suggested Topic
                  </Typography>

                  <Box
                    className="subtopic-box"
                    sx={{
                      p: 2,
                      background: "#f8fafc",
                      borderRadius: 2,
                      border: "2px solid #f1f5f9",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      minHeight: 68,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "3px",
                        height: "100%",
                        background: action.gradient,
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "700",
                        color: "#1e293b",
                        lineHeight: 1.3,
                        fontSize: "0.9rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {subtopic.name}
                    </Typography>

                    {/* Progress indicator */}
                    {action.type === "continue" && subtopic.progress && (
                      <Box sx={{ mt: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "600",
                              color: "inherit",
                              opacity: 0.9,
                              fontSize: "0.65rem",
                            }}
                          >
                            Progress
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "800",
                              color: "inherit",
                              fontSize: "0.65rem",
                            }}
                          >
                            {Math.round(subtopic.progress * 100)}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 3,
                            background: "rgba(255,255,255,0.3)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              background: "white",
                              borderRadius: 2,
                              width: `${subtopic.progress * 100}%`,
                              transition: "width 0.5s ease",
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default DesktopQuickActions;
