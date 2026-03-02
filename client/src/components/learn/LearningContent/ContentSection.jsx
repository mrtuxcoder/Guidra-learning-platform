import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Button,
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
  const isDark = theme.palette.mode === "dark";
  const surfaceBg = isDark ? "#1A1D24" : "#FFFFFF";
  const surfaceBorder = isDark ? "#2A2F3A" : alpha(theme.palette.divider, 0.7);
  const sectionTitleColor = isDark ? "#FFFFFF" : "text.primary";
  const bodyColor = isDark ? "#B8C0CC" : "text.secondary";

  const paragraphize = (value, maxParagraphs = 3) => {
    if (!value || typeof value !== "string") return [];
    const sentences = value
      .split(/(?<=[.!?])\s+/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (sentences.length === 0) return [value.trim()];

    const chunks = [];
    for (let index = 0; index < sentences.length; index += 2) {
      chunks.push(sentences.slice(index, index + 2).join(" "));
    }
    return chunks.slice(0, maxParagraphs);
  };

  const extractExampleParts = (value) => {
    if (typeof value !== "string") {
      return {
        code: 'print("Hello World")',
        explanation: "This prints a message to the console.",
      };
    }

    const fencedMatch = value.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const code = (fencedMatch?.[1] || "").trim();
    const cleanText = value.replace(/```(?:\w+)?\n[\s\S]*?```/g, "").trim();

    return {
      code: code || 'print("Hello World")',
      explanation:
        cleanText ||
        "This simple statement demonstrates how Python outputs text.",
    };
  };

  if (!content || (Array.isArray(content) && content.length === 0)) {
    return null;
  }

  const isExampleSection = title === "Example";
  const paragraphs = paragraphize(
    typeof content === "string" ? content : JSON.stringify(content),
    title === "Core Concept" ? 3 : 6
  );
  const exampleParts = isExampleSection
    ? extractExampleParts(typeof content === "string" ? content : "")
    : null;

  return (
    <Card
      sx={{
        mb: { xs: 2, md: 2.5 },
        bgcolor: surfaceBg,
        border: "1px solid",
        borderColor: surfaceBorder,
        borderRadius: "14px",
        boxShadow: isDark ? "none" : "0 2px 10px rgba(15, 23, 42, 0.05)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: isExpanded ? { xs: 1.6, md: 1.8 } : 0,
            cursor: "pointer",
          }}
          onClick={onToggle}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="600"
              sx={{
                color: sectionTitleColor,
                textAlign: "left",
                fontSize: isMobile ? "1rem" : "1.1rem",
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
                        ? "error.main"
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
            bgcolor: surfaceBorder,
            mb: isExpanded ? { xs: 1.6, md: 1.8 } : 0,
          }}
        />

        <Collapse in={isExpanded} timeout={320} unmountOnExit>
          <Box>
            {isList && Array.isArray(content) ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {content.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: { xs: 1.5, md: 1.6 },
                      borderRadius: "12px",
                      background: isDark
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.primary.main, 0.08),
                      border: "1px solid",
                      borderColor: isDark
                        ? alpha(theme.palette.primary.main, 0.32)
                        : alpha(theme.palette.primary.main, 0.2),
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.74rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontWeight: 700,
                        color: "primary.main",
                        mb: 0.5,
                      }}
                    >
                      Step {index + 1}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.75,
                        color: bodyColor,
                        fontSize: "1rem",
                      }}
                    >
                      {typeof item === "string" ? item : JSON.stringify(item)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : isExampleSection ? (
              <Box>
                <Box
                  sx={{
                    borderRadius: "12px",
                    p: 1.75,
                    bgcolor: isDark ? "#0D0F14" : alpha(theme.palette.common.black, 0.03),
                    border: "1px solid",
                    borderColor: isDark ? "#2A2F3A" : alpha(theme.palette.common.black, 0.08),
                    mb: 1.6,
                    overflowX: "auto",
                  }}
                >
                  <Typography
                    component="pre"
                    sx={{
                      m: 0,
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      color: isDark ? "#FFFFFF" : "text.primary",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {exampleParts.code}
                  </Typography>
                </Box>

                {paragraphize(exampleParts.explanation, 3).map((paragraph, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{
                      lineHeight: 1.75,
                      color: bodyColor,
                      fontSize: "1rem",
                      mb: index < paragraphize(exampleParts.explanation, 3).length - 1 ? 1.5 : 0,
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Box>
                {paragraphs.map((paragraph, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: bodyColor,
                      fontSize: "1rem",
                      mb: index < paragraphs.length - 1 ? 1.5 : 0,
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
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
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const cardBg = isDark ? "#1A1D24" : "#FFFFFF";
  const borderColor = isDark ? "#2A2F3A" : alpha(theme.palette.divider, 0.7);

  return (
  <Card
    sx={{
      mb: { xs: 2, md: 2.5 },
      borderRadius: "14px",
      background: cardBg,
      border: "1px solid",
      borderColor,
      boxShadow: isDark ? "none" : "0 2px 10px rgba(15, 23, 42, 0.05)",
    }}
  >
    <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          fontWeight="600"
          sx={{
            color: isDark ? "#FFFFFF" : "text.primary",
            textAlign: "left",
            fontSize: isMobile ? "1rem" : "1.1rem",
          }}
        >
          Mind Map
        </Typography>
      </Box>
      <Box sx={{ height: 1, bgcolor: borderColor, mb: 2 }} />
      <MermaidDiagram
        chart={safeContent.mindmap}
        topic={selectedTopic}
        subtopic={selectedSubtopic?.name}
        onManualRegenerate={handleManualMindmapRegenerate}
        isRegenerating={regeneratingMindmap}
        remainingGenerations={userRemainingGenerations}
        initialError={mindmapData?.hasError}
        colorPalette={colorPalette}
        showViewButton
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
        <Button
          variant="contained"
          onClick={() => {
            const event = new CustomEvent("guidra-open-mindmap-zoom");
            window.dispatchEvent(event);
          }}
          sx={{
            textTransform: "none",
            borderRadius: 999,
            px: 2.4,
            py: 0.9,
            fontWeight: 600,
            fontSize: "0.88rem",
            background: isDark
              ? alpha(theme.palette.primary.light, 0.26)
              : alpha(theme.palette.primary.main, 0.12),
            color: isDark ? theme.palette.primary.light : theme.palette.primary.main,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              background: isDark
                ? alpha(theme.palette.primary.light, 0.34)
                : alpha(theme.palette.primary.main, 0.18),
            },
          }}
        >
          View Full Mind Map
        </Button>
      </Box>
    </CardContent>
  </Card>
  );
};

export default ContentSection;
