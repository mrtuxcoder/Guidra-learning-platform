import { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import DOMPurify from "dompurify";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Fullscreen } from "@mui/icons-material";
import ZoomModal from "./ZoomModal";
import LoadingView from "./LoadingView";
import ErrorView from "./ErrorView";
import DiagramView from "./DiagramView";

const MermaidDiagram = ({
  chart,
  colorPalette = {},
  onManualRegenerate,
  remainingGenerations = 5,
  isRegenerating = false,
  initialError = false,
  showViewButton = false,
}) => {
  const ref = useRef(null);
  const [error, setError] = useState(initialError || null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [renderedSvg, setRenderedSvg] = useState(null);
  const [autoRegenerated, setAutoRegenerated] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Default color palette if not provided
  const colors = {
    50: "#FAF7FE",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7",
    600: "#9333EA",
    700: "#7C3AED",
    800: "#6B21A8",
    900: "#581C87",
    ...colorPalette,
  };

  // Initialize mermaid
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme.palette.mode === "dark" ? "dark" : "default",
        securityLevel: "strict",
        fontFamily: "Arial, sans-serif",
        flowchart: {
          useMaxWidth: false,
          htmlLabels: false,
          curve: "basis",
        },
        themeCSS: `
          .mermaid {
            font-size: ${isMobile ? "18px" : "16px"} !important;
            background: transparent;
          }
          .node rect, .node circle, .node ellipse, .node polygon {
            stroke-width: 2px !important;
            stroke: ${colors[600]} !important;
          }
          .edgePath .path {
            stroke: ${colors[500]} !important;
            stroke-width: 2px !important;
          }
          .label {
            font-size: ${isMobile ? "16px" : "14px"} !important;
            font-family: Arial, sans-serif !important;
          }
        `,
      });
    } catch (error) {
      console.warn("Mermaid initialization warning:", error);
    }
  }, [isMobile, colors]);

  // Handle manual regeneration
  const handleManualRegenerate = useCallback(async () => {
    if (remainingGenerations <= 0) {
      setError("No regenerations available");
      return;
    }

    if (!onManualRegenerate) {
      setError("Mindmap regeneration not available");
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await onManualRegenerate();
    } catch (err) {
      console.error("Manual mindmap regeneration error:", err);
      setError(err.response?.data?.message || "Failed to regenerate mindmap");
      setIsLoading(false);
    }
  }, [onManualRegenerate, remainingGenerations]);

  const cleanMermaidSyntax = useCallback((inputChart) => {
    if (!inputChart) return "";

    let cleaned = inputChart.trim();
    cleaned = cleaned.replace(/```mermaid\s*/gi, "").replace(/```\s*/gi, "");
    cleaned = cleaned.replace(/(graph [A-Z]+)\s*(graph [A-Z]+)/g, "$1");
    cleaned = cleaned
      .replace(/[–—‑−]/g, "-")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[`$®©™]/g, "")
      .replace(/[{}]/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/;/g, "");

    if (
      !cleaned.trim().startsWith("graph") &&
      !cleaned.trim().startsWith("mindmap")
    ) {
      cleaned = `graph TD\n${cleaned}`;
    }

    return cleaned;
  }, []);

  const buildFallbackMindmap = useCallback(() => {
    return [
      "graph TD",
      "A[Main Idea] --> B[Key Point 1]",
      "A --> C[Key Point 2]",
      "A --> D[Key Point 3]",
    ].join("\n");
  }, []);

  const isMermaidSyntaxValid = useCallback(async (input) => {
    if (!input || !input.trim()) return false;

    try {
      await mermaid.parse(input);
      return true;
    } catch {
      return false;
    }
  }, []);

  const sanitizeMermaidSvg = useCallback((svg) => {
    if (!svg || typeof svg !== "string") return svg;

    const cleanedSvg = svg
      .replace(
        /<text[^>]*>[^]*?(Syntax error in text|mermaid version)[^]*?<\/text>/gi,
        ""
      )
      .replace(/Syntax error in text/gi, "")
      .replace(/mermaid version\s*\d+\.\d+\.\d+/gi, "");

    return DOMPurify.sanitize(cleanedSvg, {
      USE_PROFILES: { svg: true },
      FORBID_TAGS: ["foreignObject", "script"],
    });
  }, []);

  // Render diagram effect
  useEffect(() => {
    let isMounted = true;
    let consoleErrorOriginal = null;
    let consoleWarnOriginal = null;

    const renderDiagram = async () => {
      if (!isMounted || !ref.current || !chart) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        ref.current.innerHTML = "";

        const cleanedChart = cleanMermaidSyntax(chart);

        if (!cleanedChart.trim()) {
          throw new Error("Empty diagram content");
        }

        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        let finalSvg;

        try {
          const shouldSuppress = (message) =>
            typeof message === "string" &&
            (message.includes("mermaid") ||
              message.includes("Syntax error in text"));

          consoleErrorOriginal = console.error;
          consoleWarnOriginal = console.warn;

          console.error = (...args) => {
            const firstArg = args[0];
            if (shouldSuppress(firstArg) || shouldSuppress(firstArg?.message)) {
              return;
            }
            consoleErrorOriginal.apply(console, args);
          };

          console.warn = (...args) => {
            const firstArg = args[0];
            if (shouldSuppress(firstArg) || shouldSuppress(firstArg?.message)) {
              return;
            }
            consoleWarnOriginal.apply(console, args);
          };

          const isValid = await isMermaidSyntaxValid(cleanedChart);
          if (!isValid) {
            throw new Error("Invalid mermaid syntax");
          }

          const result = await mermaid.render(id, cleanedChart);
          finalSvg = sanitizeMermaidSvg(result.svg);
        } catch {
          try {
            const fallbackChart = buildFallbackMindmap();
            const fallbackValid = await isMermaidSyntaxValid(fallbackChart);
            if (!fallbackValid) {
              throw new Error("Fallback mermaid syntax invalid");
            }
            const fallbackId = `mermaid-${Math.random()
              .toString(36)
              .slice(2, 11)}`;
            const fallbackResult = await mermaid.render(
              fallbackId,
              fallbackChart
            );
            finalSvg = sanitizeMermaidSvg(fallbackResult.svg);
          } catch {
            if (
              !autoRegenerated &&
              onManualRegenerate &&
              remainingGenerations > 0 &&
              isMounted
            ) {
              setAutoRegenerated(true);
              await handleManualRegenerate();
              return;
            }

            throw new Error("Mindmap unavailable");
          }
        } finally {
          if (consoleErrorOriginal) {
            console.error = consoleErrorOriginal;
          }
          if (consoleWarnOriginal) {
            console.warn = consoleWarnOriginal;
          }
        }

        if (finalSvg && isMounted) {
          const svgContainer = document.createElement("div");
          svgContainer.innerHTML = finalSvg;
          svgContainer.style.width = "100%";
          svgContainer.style.textAlign = "center";
          svgContainer.style.cursor = "pointer";

          const shouldStripNode = (node) => {
            if (!node || !node.textContent) return false;
            const text = node.textContent.toLowerCase();
            return (
              text.includes("syntax error in text") ||
              text.includes("mermaid version") ||
              text.includes("💣")
            );
          };

          svgContainer
            .querySelectorAll("text, tspan, foreignObject, div, span")
            .forEach((node) => {
              if (shouldStripNode(node)) {
                node.remove();
              }
            });

          const svgElement = svgContainer.querySelector("svg");
          if (svgElement) {
            svgElement.style.maxWidth = "100%";
            svgElement.style.width = "100%";
            svgElement.style.height = "auto";
            svgElement.style.minHeight = isMobile ? "400px" : "300px";
            svgElement.style.fontSize = isMobile ? "18px" : "16px";

            if (isMobile) {
              svgElement.style.overflow = "visible";
              const labels = svgElement.querySelectorAll(".label");
              labels.forEach((label) => {
                label.style.fontSize = "16px";
                label.style.fontWeight = "500";
              });
            }

            svgElement.onclick = () => setZoomOpen(true);

            if (
              !svgElement.getAttribute("viewBox") &&
              svgElement.getAttribute("width") &&
              svgElement.getAttribute("height")
            ) {
              const width = svgElement.getAttribute("width");
              const height = svgElement.getAttribute("height");
              svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
              svgElement.removeAttribute("width");
              svgElement.removeAttribute("height");
            }
          }

          ref.current.appendChild(svgContainer);
          setRenderedSvg(finalSvg);
        }

        if (isMounted) {
          setError(null);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Mindmap unavailable");
          setIsLoading(false);

          if (ref.current) {
            ref.current.innerHTML = "";
            DiagramView.renderErrorState(ref.current, {
              isMobile,
              onManualRegenerate,
              remainingGenerations,
              handleManualRegenerate,
              setZoomOpen,
            });
          }
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
      if (consoleErrorOriginal) {
        console.error = consoleErrorOriginal;
      }
      if (consoleWarnOriginal) {
        console.warn = consoleWarnOriginal;
      }
    };
  }, [
    chart,
    isMobile,
    autoRegenerated,
    onManualRegenerate,
    remainingGenerations,
    handleManualRegenerate,
    cleanMermaidSyntax,
  ]);

  // Reset autoRegenerated when chart changes
  useEffect(() => {
    const handleOpenZoom = () => {
      setZoomOpen(true);
    };

    window.addEventListener("guidra-open-mindmap-zoom", handleOpenZoom);

    return () => {
      window.removeEventListener("guidra-open-mindmap-zoom", handleOpenZoom);
    };
  }, []);

  useEffect(() => {
    setAutoRegenerated(false);
  }, [chart]);

  if (!chart) return null;

  return (
    <Box
      className="mermaid-container"
      sx={{
        my: isMobile ? 2 : 3,
        position: "relative",
        width: "100%",
      }}
    >
      <Box
        sx={{
          border: "2px solid",
          borderColor: error ? colors[300] : colors[100],
          borderRadius: 3,
          padding: isMobile ? 2 : 3,
          bgcolor: "background.paper",
          transition: "all 0.3s ease",
          cursor: "pointer",
          minHeight: isMobile ? "480px" : "380px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          "&:hover": {
            borderColor: error ? colors[400] : colors[300],
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            transform: "translateY(-2px)",
          },
        }}
        onClick={() => setZoomOpen(true)}
      >
        {isLoading ? (
          <LoadingView
            isMobile={isMobile}
            colors={colors}
            isRegenerating={isRegenerating}
          />
        ) : error ? (
          <ErrorView
            error={error}
            isMobile={isMobile}
            onManualRegenerate={onManualRegenerate}
            remainingGenerations={remainingGenerations}
            isRegenerating={isRegenerating}
            handleManualRegenerate={handleManualRegenerate}
            setZoomOpen={setZoomOpen}
            colors={colors}
          />
        ) : null}

        <Box
          ref={ref}
          sx={{
            minHeight: isMobile ? "420px" : "320px",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            "& > div": {
              width: "100%",
              textAlign: "center",
            },
            "& svg": {
              maxWidth: "100% !important",
              width: "100% !important",
              height: "auto !important",
              minHeight: isMobile ? "400px" : "300px",
              fontSize: isMobile ? "18px !important" : "16px !important",
            },
          }}
        />

        {!isLoading && !showViewButton && (
          <Box
            sx={{
              textAlign: "center",
              mt: 2,
              color: error ? colors[400] : colors[500],
              fontSize: isMobile ? "15px" : "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              fontWeight: "600",
            }}
          >
            <Fullscreen fontSize={isMobile ? "medium" : "small"} />
            {error ? "View details" : "Click to enlarge"}
          </Box>
        )}
      </Box>

      <ZoomModal
        open={zoomOpen}
        onClose={() => {
          setZoomOpen(false);
        }}
        renderedSvg={renderedSvg}
        chart={chart}
        error={error}
        isMobile={isMobile}
        colors={colors}
        onManualRegenerate={handleManualRegenerate}
        isRegenerating={isRegenerating}
        remainingGenerations={remainingGenerations}
      />
    </Box>
  );
};

export default MermaidDiagram;
