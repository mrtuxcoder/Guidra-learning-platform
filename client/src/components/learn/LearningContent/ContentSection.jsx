import React, { useState } from "react";
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Tooltip,
  useTheme,
  Button,
  Chip,
} from "@mui/material";
import { ExpandMore, Refresh, Lock, ContentCopy, Check } from "@mui/icons-material";
import MermaidDiagram from "../MermardDiagram/index";
import { renderFormattedText } from "./utils";

const ContentSection = ({
  title,
  content,
  isList = false,
  isExpanded = true,
  onToggle,
  onRegenerate,
  isRegenerating = false,
  isRegenerateDisabled = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [copied, setCopied] = useState(false);

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
        code: "",
        explanation: "Practical application demonstrating this topic.",
      };
    }

    const fencedMatch = value.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const code = (fencedMatch?.[1] || "").trim();
    const cleanText = value.replace(/```(?:\w+)?\n[\s\S]*?```/g, "").trim();

    return {
      code: code || value.trim(),
      explanation: cleanText || "This example illustrates how this concept operates in real-world scenarios.",
    };
  };

  if (!content || (Array.isArray(content) && content.length === 0)) {
    return null;
  }

  const isExampleSection = title === "Example";
  const isConceptSection = title === "Core Concept";
  const isPracticeSection = title === "Practice";
  const isDetailedExplanation = title === "Detailed Explanation";

  const paragraphs = paragraphize(
    typeof content === "string" ? content : JSON.stringify(content),
    isConceptSection ? 3 : 6
  );
  const exampleParts = isExampleSection
    ? extractExampleParts(typeof content === "string" ? content : "")
    : null;

  const handleCopyCode = (text) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reusable section header action controls
  const renderActions = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
                color: isRegenerateDisabled ? "text.secondary" : "text.secondary",
                p: 0.5,
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "action.hover",
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                onRegenerate();
              }}
              disabled={isRegenerating || isRegenerateDisabled}
            >
              {isRegenerateDisabled ? (
                <Lock sx={{ fontSize: 15 }} />
              ) : (
                <Refresh
                  sx={{
                    fontSize: 16,
                    animation: isRegenerating ? "spin 1s linear infinite" : "none",
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
        sx={{
          p: 0.5,
          color: "text.secondary",
          transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
          transition: "transform 0.2s ease",
          "&:hover": {
            color: "text.primary",
            bgcolor: "action.hover",
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <ExpandMore sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );

  // 1. Core Concept — Editorial Callout / Lead Box
  if (isConceptSection) {
    return (
      <Box
        sx={{
          mb: 3.5,
          p: { xs: 2.25, md: 2.75 },
          borderRadius: "8px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(101, 88, 217, 0.06)"
              : "rgba(101, 88, 217, 0.03)",
          borderLeft: (theme) => `3px solid ${theme.palette.primary.main}`,
          borderTop: "1px solid",
          borderRight: "1px solid",
          borderBottom: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(101, 88, 217, 0.2)"
              : "rgba(101, 88, 217, 0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            mb: isExpanded ? 1.5 : 0,
          }}
          onClick={onToggle}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "primary.main",
            }}
          >
            Core Concept
          </Typography>
          {renderActions()}
        </Box>

        <Collapse in={isExpanded} timeout={250} unmountOnExit>
          <Box>
            {paragraphs.map((paragraph, index) => (
              <Typography
                key={index}
                sx={{
                  lineHeight: 1.75,
                  color: "text.primary",
                  fontSize: "0.98rem",
                  mb: index < paragraphs.length - 1 ? 1.5 : 0,
                }}
              >
                {renderFormattedText(paragraph)}
              </Typography>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  }

  // 2. Learning Steps — Numbered Clean Ordered Flow
  if (isList && Array.isArray(content)) {
    return (
      <Box sx={{ mb: 3.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            pb: 1,
            mb: isExpanded ? 2 : 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
          onClick={onToggle}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: "1.025rem",
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
          {renderActions()}
        </Box>

        <Collapse in={isExpanded} timeout={250} unmountOnExit>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {content.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.75,
                  py: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)",
                    color: "text.primary",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    mt: 0.35,
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      lineHeight: 1.65,
                      color: "text.primary",
                      fontSize: "0.95rem",
                    }}
                  >
                    {renderFormattedText(typeof item === "string" ? item : JSON.stringify(item))}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  }

  // 3. Example — Dedicated Code Container + Flowing Text
  if (isExampleSection && exampleParts) {
    return (
      <Box sx={{ mb: 3.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            pb: 1,
            mb: isExpanded ? 2 : 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
          onClick={onToggle}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: "1.025rem",
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            Example
          </Typography>
          {renderActions()}
        </Box>

        <Collapse in={isExpanded} timeout={250} unmountOnExit>
          <Box>
            {/* Code Snippet Box with high contrast */}
            <Box
              sx={{
                borderRadius: "8px",
                bgcolor: isDark ? "#090D16" : "#0F172A",
                color: "#F8FAFC",
                border: "1px solid",
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.9)",
                mb: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 0.85,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  Code Example
                </Typography>
                <Button
                  size="small"
                  startIcon={copied ? <Check sx={{ fontSize: 13 }} /> : <ContentCopy sx={{ fontSize: 13 }} />}
                  onClick={() => handleCopyCode(exampleParts.code)}
                  sx={{
                    color: copied ? "success.light" : "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.72rem",
                    p: "2px 8px",
                    minWidth: "auto",
                    textTransform: "none",
                    "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.08)" },
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              </Box>
              <Box sx={{ p: 2, overflowX: "auto" }}>
                <Typography
                  component="pre"
                  sx={{
                    m: 0,
                    fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    color: "#E2E8F0",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {exampleParts.code}
                </Typography>
              </Box>
            </Box>

            {/* Example Explanations */}
            {paragraphize(exampleParts.explanation, 3).map((paragraph, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  lineHeight: 1.7,
                  color: "text.secondary",
                  fontSize: "0.93rem",
                  mb: index < paragraphize(exampleParts.explanation, 3).length - 1 ? 1.5 : 0,
                }}
              >
                {renderFormattedText(paragraph)}
              </Typography>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  }

  // 4. Practice — Distinct Exercise Callout
  if (isPracticeSection) {
    return (
      <Box sx={{ mb: 3.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            pb: 1,
            mb: isExpanded ? 2 : 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
          onClick={onToggle}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: "1.025rem",
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            Practice
          </Typography>
          {renderActions()}
        </Box>

        <Collapse in={isExpanded} timeout={250} unmountOnExit>
          <Box
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: "8px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.02)"
                  : "rgba(0, 0, 0, 0.015)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
              <Chip
                label="EXERCISE"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  borderRadius: "4px",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(0, 0, 0, 0.05)",
                  color: "text.secondary",
                }}
              />
            </Box>
            {paragraphs.map((paragraph, index) => (
              <Typography
                key={index}
                sx={{
                  lineHeight: 1.7,
                  color: "text.primary",
                  fontSize: "0.95rem",
                  mb: index < paragraphs.length - 1 ? 1.5 : 0,
                }}
              >
                {renderFormattedText(paragraph)}
              </Typography>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  }

  // 5. Detailed Explanation & General Prose Sections — Pure flowing text
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          pb: 1,
          mb: isExpanded ? 2 : 0,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
        onClick={onToggle}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: "1.025rem",
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </Typography>
        {renderActions()}
      </Box>

      <Collapse in={isExpanded} timeout={250} unmountOnExit>
        <Box>
          {paragraphs.map((paragraph, index) => (
            <Typography
              key={index}
              sx={{
                lineHeight: 1.75,
                color: isDetailedExplanation ? "text.primary" : "text.secondary",
                fontSize: "0.95rem",
                mb: index < paragraphs.length - 1 ? 2 : 0,
              }}
            >
              {renderFormattedText(paragraph)}
            </Typography>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

// Specialized Mindmap Section
const MindmapSection = ({
  safeContent,
  selectedTopic,
  selectedSubtopic,
  handleManualMindmapRegenerate,
  regeneratingMindmap,
  userRemainingGenerations,
  mindmapData,
}) => {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          mb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: "1.025rem",
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          Mind Map
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const event = new CustomEvent("guidra-open-mindmap-zoom");
            window.dispatchEvent(event);
          }}
          sx={{
            textTransform: "none",
            borderRadius: "6px",
            fontSize: "0.78rem",
            height: 28,
            px: 1.25,
            borderColor: "divider",
            color: "text.secondary",
            "&:hover": { borderColor: "divider", color: "text.primary", bgcolor: "action.hover" },
          }}
        >
          Zoom Diagram
        </Button>
      </Box>

      <Box
        sx={{
          borderRadius: "8px",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 2, md: 2.5 },
        }}
      >
        <MermaidDiagram
          chart={safeContent.mindmap}
          topic={selectedTopic}
          subtopic={selectedSubtopic?.name}
          onManualRegenerate={handleManualMindmapRegenerate}
          isRegenerating={regeneratingMindmap}
          remainingGenerations={userRemainingGenerations}
          initialError={mindmapData?.hasError}
          showViewButton={false}
        />
      </Box>
    </Box>
  );
};

ContentSection.MindmapSection = MindmapSection;

export default ContentSection;
