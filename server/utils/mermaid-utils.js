/**
 * Check if mindmap is actually AI-generated or just fallback placeholder
 */
function isFallbackMindmap(mindmap) {
  if (!mindmap) return true;

  const fallbackIndicators = [
    "Fundamental Idea",
    "Basic Components",
    "Main Rule 1",
    "Main Rule 2",
    "Real-world Example",
    "Practice Exercise",
  ];

  return fallbackIndicators.some((indicator) => mindmap.includes(indicator));
}

/**
 * Validate and fix Mermaid.js syntax - FIXED FOR FRONTEND
 */
function validateAndFixMermaidSyntax(mindmap) {
  if (!mindmap) return generateFallbackMindmap("Unknown Topic");

  let fixedMindmap = mindmap;

  // Remove markdown code blocks
  fixedMindmap = fixedMindmap
    .replace(/```mermaid\s*/gi, "")
    .replace(/```\s*/gi, "");

  // Fix common character issues
  fixedMindmap = fixedMindmap
    .replace(/[–—‑−]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[`$®©™]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // Fix parentheses in node labels
  fixedMindmap = fixedMindmap.replace(
    /\[([^\]]*)\(([^)]*)\)([^\]]*)\]/g,
    (match, before, content, after) => {
      return `[${before}${content}${after}]`;
    }
  );

  // Ensure proper graph declaration
  if (
    !fixedMindmap.trim().startsWith("graph") &&
    !fixedMindmap.trim().startsWith("mindmap")
  ) {
    fixedMindmap = `graph TD\n${fixedMindmap}`;
  }

  // Fix arrow spacing
  fixedMindmap = fixedMindmap.replace(
    /([A-Za-z0-9])\s*-->\s*([A-Za-z0-9])/g,
    "$1 --> $2"
  );

  // Fix line breaks and indentation
  const lines = fixedMindmap.split("\n");
  const cleanedLines = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Add proper indentation for nodes
    if (line.match(/^[A-Z]\d?\[/) || line.match(/^[A-Z]\d? -->/)) {
      line = "    " + line;
    }

    // Add proper indentation for sub-nodes
    if (line.match(/^[A-Z]\d+\[/) || line.match(/^[A-Z]\d+ -->/)) {
      line = "        " + line;
    }

    cleanedLines.push(line);
  }

  fixedMindmap = cleanedLines.join("\n");

  return fixedMindmap;
}

/**
 * Validate Mermaid syntax and return validation result - FIXED FOR FRONTEND
 */
function validateMermaidSyntax(mindmap) {
  if (!mindmap) {
    return { isValid: false, error: "Mindmap is empty" };
  }

  // Basic syntax checks that work with frontend Mermaid
  const checks = {
    hasValidDeclaration: /^(graph|mindmap|flowchart)/i.test(mindmap.trim()),
    hasNodes: /\[.*\]/.test(mindmap),
    hasProperStructure: mindmap.includes("\n") || mindmap.includes(";"),
    hasReasonableLength: mindmap.length > 50,
  };

  const isValid = Object.values(checks).every((check) => check);

  return {
    isValid,
    errors: isValid
      ? []
      : Object.entries(checks)
          .filter(([_, check]) => !check)
          .map(([key]) => key),
    details: checks,
  };
}

// Import from content-utils for fallback
const { generateFallbackMindmap } = require("./content-utils");

module.exports = {
  isFallbackMindmap,
  validateAndFixMermaidSyntax,
  validateMermaidSyntax,
};
