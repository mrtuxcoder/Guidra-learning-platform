const createStructuredContentFromText = require('../create-structure')
const generateFallbackMindmap = require('../fallback/mindmap-fallback');
const { isFallbackMindmap, validateMermaidSyntax, validateAndFixMermaidSyntax } = require('../mermaid-utils');

/**
 * Validate and ensure complete content structure - PRESERVES AI CONTENT
 */
function validateContentStructure(content, topic, subtopic) {
  // Ensure content is an object
  if (typeof content !== 'object' || content === null) {
    return createStructuredContentFromText("", topic, subtopic);
  }

  console.log("=== DEBUG: validateContentStructure ===");
  console.log("Topic:", topic, "Subtopic:", subtopic);
  console.log("Content received - coreExample:", content.coreExample ? "EXISTS" : "MISSING");
  if (content.coreExample) {
    console.log("coreExample first 50 chars:", content.coreExample.substring(0, 50));
  }
  console.log("Content received - mindmap:", content.mindmap ? "EXISTS" : "MISSING");

  // Create safe defaults that only fill in TRULY missing fields
  const safeDefaults = {
    title: `${subtopic} - ${topic}`,
    explanation: `Comprehensive explanation of ${subtopic}`,
    coreExample: `Practical application of ${subtopic}`,
    practice: `Hands-on practice for ${subtopic}`,
  };

  // Start with the AI content
  const validatedContent = { ...content };
  
  // Only fill in fields that are TRULY missing (undefined, null, or empty string)
  const importantFields = ['title', 'explanation', 'coreExample', 'practice', 'concept'];
  
  importantFields.forEach(field => {
    if (!validatedContent[field] || validatedContent[field].trim() === '') {
      console.log(`🔄 Field "${field}" is missing, applying default`);
      validatedContent[field] = safeDefaults[field];
    }
  });

  // Handle mindmap separately with better validation
  if (!validatedContent.mindmap || 
      validatedContent.mindmap.trim() === '' || 
      isFallbackMindmap(validatedContent.mindmap)) {
    
    console.log("🔄 Generating fallback mindmap for:", subtopic);
    validatedContent.mindmap = generateFallbackMindmap(subtopic);
  } else {
    // Clean and validate the AI-generated mindmap
    const validation = validateMermaidSyntax(validatedContent.mindmap);
    
    if (!validation.isValid) {
      console.log("🔄 Fixing mindmap syntax for:", subtopic);
      validatedContent.mindmap = validateAndFixMermaidSyntax(validatedContent.mindmap);
    }
  }

  // Ensure arrays exist (but don't add empty arrays if not needed)
  if (!validatedContent.learningActions && Array.isArray(content.learningActions)) {
    validatedContent.learningActions = content.learningActions;
  } else if (!validatedContent.learningActions) {
    validatedContent.learningActions = [];
  }
  
  if (!validatedContent.quiz && Array.isArray(content.quiz)) {
    validatedContent.quiz = content.quiz;
  } else if (!validatedContent.quiz) {
    validatedContent.quiz = [];
  }
  
  // Only add examples array if it was provided by AI
  if (!validatedContent.examples && Array.isArray(content.examples)) {
    validatedContent.examples = content.examples;
  }
  // Don't add examples array if not provided - keep undefined

  console.log("🔍 After validation:");
  console.log("- coreExample:", validatedContent.coreExample?.substring(0, 50) + "...");
  console.log("- mindmap exists:", !!validatedContent.mindmap);

  return validatedContent;
}

module.exports = validateContentStructure;