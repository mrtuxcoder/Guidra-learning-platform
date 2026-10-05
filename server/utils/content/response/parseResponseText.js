function parseResponseText(aiResponses) {
  console.log("=== DEBUG: parseResponseText called ===");
  console.log("Input type:", typeof aiResponses);
  
  const structuredContent = {};
  const errors = [];
  
  // Get the text - handle different input formats
  let text = '';
  if (typeof aiResponses === 'string') {
    text = aiResponses;
  } else if (aiResponses && aiResponses.unified) {
    text = aiResponses.unified;
  } else {
    errors.push("Invalid input format");
    return {
      success: false,
      content: null,
      errors: errors
    };
  }
  
  console.log("Text length:", text.length);
  console.log("First 200 chars:", text.substring(0, 200));
  
  try {
    // Extract sections more reliably
    const sections = {};
    const lines = text.split('\n');
    let currentSection = '';
    let sectionContent = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line is a section header (allows hyphens)
      if (line.match(/^[A-Z][A-Z\s-]+:$/)) {
        // Save previous section if exists
        if (currentSection) {
          const sectionKey = currentSection.toLowerCase().replace(/\s+/g, '');
          sections[sectionKey] = sectionContent.join('\n').trim();
        }
        
        // Start new section
        currentSection = line.replace(':', '').trim();
        sectionContent = [];
      } else if (currentSection) {
        sectionContent.push(line);
      }
    }
    
    // Save last section
    if (currentSection) {
      const sectionKey = currentSection.toLowerCase().replace(/\s+/g, '');
      sections[sectionKey] = sectionContent.join('\n').trim();
    }
    
    console.log("Extracted sections:", Object.keys(sections));
    
    // Build structured content
    structuredContent.title = sections.title || '';
    structuredContent.concept = sections.concept || '';
    structuredContent.explanation = sections.explanation || '';
    structuredContent.coreExample = sections.coreexample || '';
    structuredContent.practice = sections.practice || '';
    
    // Handle mindmap: Only set if it exists and has content
    if (sections.mindmap && sections.mindmap.trim()) {
      // Clean the mindmap before storing
      const { validateAndFixMermaidSyntax } = require('../mermaid-utils');
      structuredContent.mindmap = validateAndFixMermaidSyntax(sections.mindmap);
    } 
    // Don't set mindmap at all if empty - let validateContentStructure handle fallback
    
    // Parse learning actions
    if (sections.learningactions) {
      const actions = sections.learningactions
        .split('\n')
        .filter(line => line.trim().match(/^\d+\.\s/))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 4);
      
      structuredContent.learningActions = actions.length >= 4 ? actions : [];
    } else {
      structuredContent.learningActions = [];
    }
    
    // Parse quiz
    if (sections.quiz) {
      const quizQuestions = parseQuizFromText(sections.quiz);
      structuredContent.quiz = quizQuestions;
    } else {
      structuredContent.quiz = [];
    }
    
    // Parse REAL-WORLD EXAMPLES if they exist
    if (sections.realworldexamples) {
      const examplesText = sections.realworldexamples;
      const exampleLines = examplesText.split('\n');
      const examples = [];
      
      for (const line of exampleLines) {
        // Match lines starting with a number and period (1., 2., etc.)
        const match = line.match(/^\s*\d+\.\s*(.+)/);
        if (match) {
          examples.push(match[1].trim());
        } else if (line.trim() && !line.includes("REAL-WORLD EXAMPLES:")) {
          // Also include non-empty lines that aren't headers
          examples.push(line.trim());
        }
      }
      
      if (examples.length > 0) {
        structuredContent.examples = examples.slice(0, 2);
      }
    }
    // Don't set examples array if not found - keep it undefined
    
  } catch (error) {
    console.error("Error in parseResponseText:", error);
    errors.push(`Processing error: ${error.message}`);
  }
  
  return {
    success: errors.length === 0,
    content: structuredContent,
    errors: errors.length > 0 ? errors : undefined
  };
}

// Helper function to parse quiz
function parseQuizFromText(quizText) {
  const questions = [];
  const questionBlocks = quizText.split(/(?=Q[123]:)/g);
  
  questionBlocks.forEach(block => {
    const lines = block.split('\n');
    const questionLine = lines.find(line => line.match(/^Q[123]:/));
    
    if (questionLine) {
      const question = {
        question: questionLine.replace(/^Q[123]:\s*/, '').trim(),
        choices: [],
        answer: '',
        correctIndex: 0,
        source: 'quiz'
      };
      
      // Extract choices
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].match(/^[A-D]\)/)) {
          question.choices.push(lines[i].replace(/^[A-D]\)\s*/, '').trim());
        } else if (lines[i].match(/^Correct:/)) {
          const correctMatch = lines[i].match(/^Correct:\s*([A-D])/);
          if (correctMatch) {
            const correctLetter = correctMatch[1];
            question.correctIndex = 'ABCD'.indexOf(correctLetter);
            question.answer = question.choices[question.correctIndex] || '';
          }
        }
      }
      
      if (question.choices.length >= 4) {
        questions.push(question);
      }
    }
  });
  
  return questions.slice(0, 3);
}

module.exports = parseResponseText;
