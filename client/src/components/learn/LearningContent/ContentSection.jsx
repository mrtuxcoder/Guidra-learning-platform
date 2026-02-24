import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Fade,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { ExpandMore, Refresh, Lock } from "@mui/icons-material";
import MermaidDiagram from "../MermardDiagram/index";

const ContentSection = ({
  title,
  content,
  isList = false,
  isExpanded = true,
  onToggle,
  onRegenerate,
  isRegenerating = false,
  isRegenerateDisabled = false,
  isMobile,
  colorPalette,
}) => {
  const theme = useTheme();
  if (!content || (Array.isArray(content) && content.length === 0)) {
    return null;
  }

  return (
    <Card
      sx={{
        mb: 3,
        bgcolor: "transparent",
        border: "none",
        borderRadius: 0,
        boxShadow: "none",
        overflow: "visible",
        position: "relative",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: isExpanded ? 2 : 0,
            cursor: "pointer",
          }}
          onClick={onToggle}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="700"
              sx={{
                color: "text.primary",
                textAlign: "left",
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
            }}
          >
            {onRegenerate && (
              <Tooltip
                title={
                  isRegenerateDisabled
                    ? "Generation limit reached (max 3)"
                    : "Regenerate section"
                }
              >
                <span>
                  <IconButton
                    size="small"
                    sx={{
                      color: isRegenerateDisabled
                        ? "#ef4444"
                        : colorPalette[500],
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegenerate();
                    }}
                    disabled={isRegenerating || isRegenerateDisabled}
                  >
                    {isRegenerateDisabled ? (
                      <Lock sx={{ fontSize: 18 }} />
                    ) : (
                      <Refresh
                        sx={{
                          animation: isRegenerating
                            ? "spin 1s linear infinite"
                            : "none",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <IconButton
              size="small"
              sx={{ color: colorPalette[500] }}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              <ExpandMore
                sx={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            height: 1,
            bgcolor: alpha(theme.palette.divider, 0.5),
            mb: isExpanded ? 2 : 0,
          }}
        />

        {isExpanded && (
          <Fade in={isExpanded} timeout={300}>
            <Box>
              {isList && Array.isArray(content) ? (
                <Box sx={{ pl: 1 }}>
                  {content.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "block",
                        mb: 2,
                        p: isMobile ? 1.25 : 1.5,
                        borderRadius: 0,
                        background: "transparent",
                        border: "none",
                        borderBottom:
                          index < content.length - 1
                            ? `1px solid ${alpha(theme.palette.divider, 0.45)}`
                            : "none",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.6,
                          color: "text.primary",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                        }}
                      >
                        {typeof item === "string" ? item : JSON.stringify(item)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    p: isMobile ? 1.25 : 1.5,
                    borderRadius: 0,
                    background: "transparent",
                    border: "none",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.7,
                      color: "text.primary",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    {typeof content === "string"
                      ? content
                      : JSON.stringify(content)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
};

// Specialized Mindmap Section
ContentSection.MindmapSection = ({
  isMobile,
  colorPalette,
  safeContent,
  selectedTopic,
  selectedSubtopic,
  handleManualMindmapRegenerate,
  regeneratingMindmap,
  userRemainingGenerations,
  mindmapData,
}) => (
  <Card
    sx={{
      mb: 3,
      borderRadius: 0,
      background: "transparent",
      border: "none",
      boxShadow: "none",
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          fontWeight="600"
          sx={{
            color: "text.primary",
            textAlign: "left",
          }}
        >
          Mind Map
        </Typography>
      </Box>
      <Box sx={{ height: 1, bgcolor: (theme) => alpha(theme.palette.divider, 0.5), mb: 2 }} />
      <MermaidDiagram
        chart={safeContent.mindmap}
        topic={selectedTopic}
        subtopic={selectedSubtopic?.name}
        onManualRegenerate={handleManualMindmapRegenerate}
        isRegenerating={regeneratingMindmap}
        remainingGenerations={userRemainingGenerations}
        initialError={mindmapData?.hasError}
        colorPalette={colorPalette}
      />
    </CardContent>
  </Card>
);

export default ContentSection;
