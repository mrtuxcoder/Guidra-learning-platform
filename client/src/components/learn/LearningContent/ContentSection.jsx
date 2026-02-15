import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Fade,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ExpandMore, Refresh } from "@mui/icons-material";
import MermaidDiagram from "../MermardDiagram/index";

const ContentSection = ({
  title,
  content,
  emoji = "💡",
  isList = false,
  isExpanded = true,
  onToggle,
  onRegenerate,
  isRegenerating = false,
  isRegenerateDisabled = false,
  isMobile,
  colorPalette,
}) => {
  if (!content || (Array.isArray(content) && content.length === 0)) {
    return null;
  }

  return (
    <Card
      sx={{
        mb: 3,
        background: "white",
        border: "1px solid",
        borderColor: colorPalette[200],
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: isExpanded ? 2 : 0,
            cursor: "pointer",
          }}
          onClick={onToggle}
        >
          <Box
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${colorPalette[400]} 0%, ${colorPalette[600]} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: isMobile ? "1rem" : "1.2rem" }}>
              {emoji}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="600"
              sx={{ color: colorPalette[700] }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
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
                    sx={{ color: colorPalette[500] }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegenerate();
                    }}
                    disabled={isRegenerating || isRegenerateDisabled}
                  >
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

        {isExpanded && (
          <Fade in={isExpanded} timeout={300}>
            <Box>
              {isList && Array.isArray(content) ? (
                <Box sx={{ pl: 1 }}>
                  {content.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 2,
                        p: isMobile ? 1.5 : 2,
                        borderRadius: 1,
                        background:
                          index % 2 === 0 ? colorPalette[50] : "transparent",
                        border: `1px solid ${colorPalette[100]}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: isMobile ? 20 : 24,
                          height: isMobile ? 20 : 24,
                          borderRadius: "6px",
                          background: colorPalette[500],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "white",
                            fontWeight: "700",
                            fontSize: isMobile ? "0.6rem" : "0.75rem",
                          }}
                        >
                          {index + 1}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.6,
                          color: "text.primary",
                          flex: 1,
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
                    p: isMobile ? 1.5 : 2,
                    borderRadius: 1,
                    background: colorPalette[50],
                    border: `1px solid ${colorPalette[100]}`,
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
  <Card sx={{ mb: 3, borderRadius: 2 }}>
    <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          fontWeight="600"
          sx={{ color: colorPalette[700] }}
        >
          Mind Map
        </Typography>
      </Box>
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
