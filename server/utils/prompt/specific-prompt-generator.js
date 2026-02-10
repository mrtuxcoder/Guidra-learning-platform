
const conceptPrompt = require('../../prompts/content/conceptPrompt').generateConceptPrompt;
const coreExamplePrompt = require('../../prompts/content/coreExamplePrompt').generateCoreExamplePrompt;
const explanationPrompt = require('../../prompts/content/explanationPrompt').generateExplanationPrompt;
const learningActionsPrompt = require('../../prompts/content/learningActionsPrompt').generateLearningActionsPrompt;
const mindmapPrompt = require('../../prompts/content/mindmapPrompt').generateMindmapPrompt;
const practicePrompt = require('../../prompts/content/practicePrompt').generatePracticePrompt;
const quizPrompt = require('../../prompts/content/quizPrompt').generateQuizPrompt;
const titlePrompt = require('../../prompts/content/titlePrompt').generateTitlePrompt;

/**
 * Generate prompts for specific components only
 */
function generateSpecificPrompts(user, topic, subtopic, components) {
  // Define components with their generators
  const COMPONENTS = {
    title: (user, topic, subtopic) => titlePrompt(topic, subtopic),
    concept: (user, topic, subtopic) => conceptPrompt(user, subtopic),
    explanation: (user, topic, subtopic) => explanationPrompt(user, topic, subtopic),
    coreExample: (user, topic, subtopic) => coreExamplePrompt(user, topic, subtopic),
    practice: (user, topic, subtopic) => practicePrompt(user, topic, subtopic),
    learningActions: (user, topic, subtopic) => learningActionsPrompt(user, subtopic),
    mindmap: (user, topic, subtopic) => mindmapPrompt(user, topic, subtopic),
    quiz: (user, topic, subtopic, context) => quizPrompt(user, subtopic, context)
  };
  
  // Convert single string to array
  const componentList = Array.isArray(components) ? components : [components];
  const prompts = {};
  const errors = [];
  
  componentList.forEach(component => {
    if (!COMPONENTS[component]) {
      errors.push(`${component}: Component not available`);
      prompts[component] = { error: "Component not available" };
      return;
    }
    
    try {
      let prompt;
      const generator = COMPONENTS[component];
      
      if (component === 'quiz') {
        const context = JSON.stringify({
          topic,
          subtopic,
          userLevel: user.difficultyPreference
        }).substring(0, 150);
        prompt = generator(user, topic, subtopic, context);
      } else {
        prompt = generator(user, topic, subtopic);
      }
      
      prompts[component] = {
        prompt: prompt,
        expectsPlainText: true,
        length: prompt.length
      };
      
    } catch (error) {
      errors.push(`${component}: ${error.message}`);
      prompts[component] = { error: error.message };
    }
  });
  
  return {
    success: errors.length === 0,
    prompts,
    errors: errors.length > 0 ? errors : undefined,
    metadata: {
      user: user.name,
      topic,
      subtopic,
      componentsRequested: componentList,
      generatedAt: new Date().toISOString()
    }
  };
}

// Export only the required functions
module.exports = generateSpecificPrompts

