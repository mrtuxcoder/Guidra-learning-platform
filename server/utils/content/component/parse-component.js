// file: componentParsers.js
const { validateAndFixMermaidSyntax } = require('../mermaid-utils');

/**
 * Clean component data according to its type
 */
function cleanComponentData(componentData, componentType) {
  if (componentData === undefined || componentData === null) {
    // Return appropriate default based on component type
    if (['learningActions', 'quiz', 'examples'].includes(componentType)) {
      return [];
    } else if (componentType === 'mindmap') {
      return '';
    }
    return '';
  }

  // Already parsed correctly, just ensure format
  return componentData;
}

/**
 * Parse learning actions from text
 */
function parseLearningActions(text) {
  if (!text || typeof text !== 'string') return [];
  
  const actions = text
    .split('\n')
    .filter(line => line.trim().match(/^\d+\.\s/))
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(action => action.length > 0);
  
  return actions.slice(0, 4); // Max 4 actions
}

/**
 * Parse quiz from text
 */
function parseQuizFromText(text) {
  if (!text || typeof text !== 'string') return [];
  
  const questions = [];
  const lines = text.split('\n');
  let currentQuestion = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Start of a question
    if (line.match(/^Q\d+:/i)) {
      if (currentQuestion && currentQuestion.choices.length >= 2) {
        questions.push(currentQuestion);
      }
      
      currentQuestion = {
        question: line.replace(/^Q\d+:\s*/i, '').trim(),
        choices: [],
        answer: '',
        correctIndex: -1,
        source: 'quiz'
      };
    }
    // Multiple choice option
    else if (line.match(/^[A-D]\)/i) && currentQuestion) {
      const choiceText = line.replace(/^[A-D]\)\s*/i, '').trim();
      currentQuestion.choices.push(choiceText);
    }
    // Correct answer indicator
    else if (line.match(/^Correct:/i) && currentQuestion) {
      const match = line.match(/^Correct:\s*([A-D])/i);
      if (match) {
        const correctLetter = match[1].toUpperCase();
        currentQuestion.correctIndex = 'ABCD'.indexOf(correctLetter);
        if (currentQuestion.correctIndex >= 0 && currentQuestion.choices[currentQuestion.correctIndex]) {
          currentQuestion.answer = currentQuestion.choices[currentQuestion.correctIndex];
        }
      }
    }
    // Question text continuation
    else if (currentQuestion && line && !line.match(/^[A-D]\)/i) && !line.match(/^Correct:/i)) {
      if (currentQuestion.choices.length === 0) {
        currentQuestion.question += ' ' + line;
      }
    }
  }
  
  // Add the last question
  if (currentQuestion && currentQuestion.choices.length >= 2) {
    questions.push(currentQuestion);
  }
  
  return questions.slice(0, 3); // Max 3 questions
}

/**
 * Parse examples from text
 */
function parseExamples(text) {
  if (!text || typeof text !== 'string') return [];
  
  const examples = text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .filter(line => !line.match(/^real.?world examples?:/i))
    .map(line => line.replace(/^\s*\d+\.\s*/, '').trim())
    .filter(example => example.length > 0);
  
  return examples.slice(0, 2); // Max 2 examples
}

/**
 * Parse single component from AI response
 */
function parseSingleComponent(aiResponse, componentType) {
  console.log(`=== Parsing single component: ${componentType} ===`);
  
  if (!aiResponse || typeof aiResponse !== 'string') {
    console.warn(`Empty or invalid response for ${componentType}`);
    return getDefaultForComponent(componentType);
  }
  
  // Clean the response
  let cleanText = aiResponse.trim();
  
  // Remove markdown code blocks
  cleanText = cleanText.replace(/```[\w]*\n?/g, '').trim();
  
  // Handle different component types
  switch(componentType) {
    // Simple text components
    case 'title':
    case 'concept':
    case 'explanation':
    case 'coreExample':
    case 'practice':
      return cleanText;
    
    // Mermaid mindmap
    case 'mindmap': {
      const mermaidStartPattern = /(?:^|\n)\s*(graph\s+(?:TD|LR|RL|BT)|flowchart\s+\w+|mindmap)\b/i;
      const startMatch = cleanText.match(mermaidStartPattern);

      const mermaidOnly = startMatch
        ? cleanText.slice(startMatch.index).trim()
        : cleanText;

      return validateAndFixMermaidSyntax(mermaidOnly);
    }
    
    // Learning actions - array of strings
    case 'learningActions':
      return parseLearningActions(cleanText);
    
    // Quiz questions - array of objects
    case 'quiz':
      return parseQuizFromText(cleanText);
    
    // Examples - array of strings
    case 'examples':
      return parseExamples(cleanText);
    
    default:
      console.warn(`Unknown component type: ${componentType}`);
      return cleanText;
  }
}

/**
 * Get default/fallback value for a component type
 */
function getDefaultForComponent(componentType) {
  if (['title', 'concept', 'explanation', 'coreExample', 'practice', 'mindmap'].includes(componentType)) {
    return '';
  } else if (['learningActions', 'examples', 'quiz'].includes(componentType)) {
    return [];
  }
  return '';
}

/**
 * Parse complete structured response (for full content generation)
 */
function parseStructuredResponse(aiResponse) {
  console.log("=== Parsing structured response ===");
  
  try {
    // Try to parse as JSON first
    let jsonString = aiResponse.trim();
    
    // Remove markdown code blocks
    jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to parse as JSON
    const parsed = JSON.parse(jsonString);
    
    // Validate and clean each field
    return {
      title: parsed.title || '',
      concept: parsed.concept || '',
      explanation: parsed.explanation || '',
      coreExample: parsed.coreExample || '',
      practice: parsed.practice || '',
      mindmap: parsed.mindmap ? validateAndFixMermaidSyntax(parsed.mindmap) : '',
      learningActions: Array.isArray(parsed.learningActions) ? parsed.learningActions.slice(0, 4) : [],
      quiz: Array.isArray(parsed.quiz) ? parsed.quiz.slice(0, 3) : [],
      examples: Array.isArray(parsed.examples) ? parsed.examples.slice(0, 2) : [],
    };
  } catch (error) {
    console.error("Failed to parse structured response as JSON:", error);
    return null;
  }
}

/**
 * Extract component content from AI response using new utilities
 */
function extractComponentFromAIResponse(aiResponse, component) {
  try {
    return parseSingleComponent(aiResponse, component);
  } catch (error) {
    console.error(`Error parsing ${component}:`, error);

    // Fallback for different component types
    if (['title', 'concept', 'explanation', 'coreExample', 'practice'].includes(component)) {
      return aiResponse.trim().replace(/```[\w]*\n?/g, '').trim();
    } else if (['learningActions', 'examples', 'quiz'].includes(component)) {
      return [];
    } else if (component === 'mindmap') {
      return validateAndFixMermaidSyntax(String(aiResponse || ''));
    }

    return aiResponse.trim();
  }
}

module.exports = {
  cleanComponentData,
  parseLearningActions,
  parseQuizFromText,
  parseExamples,
  parseSingleComponent,
  extractComponentFromAIResponse,
  parseStructuredResponse,
  getDefaultForComponent,
};