const { createStructuredContentFromText, generateFallbackMindmap } = require('./content-utils');
const { isFallbackMindmap, validateMermaidSyntax, validateAndFixMermaidSyntax } = require('./mermaid-utils');

/**
 * Validate and ensure complete content structure - PRESERVES AI CONTENT
 */
function validateContentStructure(content, topic, subtopic) {
  // Ensure content is an object
  if (typeof content !== 'object' || content === null) {
    return createStructuredContentFromText("", topic, subtopic);
  }

  // Create safe defaults that only fill in missing fields
  const safeDefaults = {
    title: `${subtopic} - ${topic}`,
    explanation: `Comprehensive explanation of ${subtopic}`,
    keyConcepts: [`Essential concepts of ${subtopic}`],
    coreExample: `Practical application of ${subtopic}`,
    practice: `Hands-on practice for ${subtopic}`,
  };

  // Merge preserving AI content - AI content takes priority
  const validatedContent = {
  ...content  ,      // Then overlay with AI content (preserves real data)
    ...safeDefaults  // Fill missing fields first
    
  };

  // Debug: Check content preservation
  console.log("🔍 Content Validation Debug:");
  console.log("- Original explanation exists:", !!content.explanation);
  console.log("- Final explanation exists:", !!validatedContent.explanation);
  console.log("- Was explanation preserved?", content.explanation === validatedContent.explanation);
  
  if (content.explanation && content.explanation !== validatedContent.explanation) {
    console.log("⚠️  WARNING: Explanation was overwritten!");
    // Restore the original AI content
    validatedContent.explanation = content.explanation;
  }

  // Handle mindmap separately with better validation
  if (!validatedContent.mindmap || validatedContent.mindmap.trim() === '' || isFallbackMindmap(validatedContent.mindmap)) {
    console.log("🔄 Generating new mindmap for:", subtopic);
    validatedContent.mindmap = generateFallbackMindmap(subtopic);
  } else {
    const validation = validateMermaidSyntax(validatedContent.mindmap);
    
    if (!validation.isValid) {
      console.log("🔄 Fixing mindmap syntax for:", subtopic);
      validatedContent.mindmap = validateAndFixMermaidSyntax(validatedContent.mindmap);
    }
  }

  // Ensure arrays are properly formatted without overwriting real data
  if (!Array.isArray(validatedContent.keyConcepts) || validatedContent.keyConcepts.length === 0) {
    validatedContent.keyConcepts = [`Key principles of ${subtopic}`];
  }

  return validatedContent;
}

module.exports = {
  validateContentStructure
};