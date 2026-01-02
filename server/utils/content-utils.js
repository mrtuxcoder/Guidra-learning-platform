/**
 * Helper function to create structured content from text - IMPROVED
 */
function createStructuredContentFromText(text, topic, subtopic) {
  console.log("🔄 Creating structured content from AI text response");
  
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  // Use the actual AI response text instead of placeholders
  return {
    title: `${subtopic} - ${topic}`,
    explanation: paragraphs.length > 1 ? paragraphs.slice(1).join('\n\n') : text,
    keyConcepts: extractKeyConceptsFromText(text, subtopic),
    coreExample: extractExampleFromText(text, subtopic),
    practice: generatePracticeFromTopic(subtopic),
    mindmap: generateFallbackMindmap(subtopic)
  };
}

/**
 * Extract key concepts from AI text response
 */
function extractKeyConceptsFromText(text, subtopic) {
  // Try to find bullet points or numbered lists in the text
  const bulletPoints = text.match(/[-•*]\s*(.+?)(?=\n|$)/g) || 
                      text.match(/\d+\.\s*(.+?)(?=\n|$)/g);
  
  if (bulletPoints && bulletPoints.length >= 2) {
    return bulletPoints.slice(0, 3).map(point => 
      point.replace(/^[-•*\d\.\s]+/, '').trim()
    );
  }
  
  // Fallback to topic-based concepts
  return [
    `Fundamental principles of ${subtopic}`,
    `Core components of ${subtopic}`,
    `Key applications of ${subtopic}`
  ];
}

/**
 * Extract example from AI text response
 */
function extractExampleFromText(text, subtopic) {
  // Look for example indicators in the text
  const exampleIndicators = [/for example/i, /for instance/i, /such as/i, /example:/i];
  
  for (const indicator of exampleIndicators) {
    const exampleMatch = text.match(new RegExp(`${indicator.source}[^.!?]+[.!?]`, 'i'));
    if (exampleMatch) {
      return exampleMatch[0].trim();
    }
  }
  
  // Fallback
  return `Practical demonstration of ${subtopic} concepts`;
}

/**
 * Generate practice based on topic
 */
function generatePracticeFromTopic(subtopic) {
  return `Apply your knowledge of ${subtopic} by solving this challenge: Create a simple project or solve a problem using the concepts you've learned.`;
}

/**
 * Generate fallback mindmap
 */
function generateFallbackMindmap(subtopic) {
  return `graph TD
    A[${subtopic}] --> B[Core Concept]
    A --> C[Key Principles] 
    A --> D[Practical Applications]
    
    B --> B1[Fundamental Idea]
    B --> B2[Basic Components]
    
    C --> C1[Main Rule 1]
    C --> C2[Main Rule 2]
    
    D --> D1[Real-world Example]
    D --> D2[Practice Exercise]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0`;
}

module.exports = {
  createStructuredContentFromText,
  extractKeyConceptsFromText,
  extractExampleFromText,
  generatePracticeFromTopic,
  generateFallbackMindmap
};