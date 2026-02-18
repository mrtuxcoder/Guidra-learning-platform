
const conceptPrompt = require('../../prompts/content/conceptPrompt').generateConceptPrompt;
const coreExamplePrompt = require('../../prompts/content/coreExamplePrompt').generateCoreExamplePrompt;
const explanationPrompt = require('../../prompts/content/explanationPrompt').generateExplanationPrompt;
const learningActionsPrompt = require('../../prompts/content/learningActionsPrompt').generateLearningActionsPrompt;
const mindmapPrompt = require('../../prompts/content/mindmapPrompt').generateMindmapPrompt;
const practicePrompt = require('../../prompts/content/practicePrompt').generatePracticePrompt;
const quizPrompt = require('../../prompts/content/quizPrompt').generateQuizPrompt;
const titlePrompt = require('../../prompts/content/titlePrompt').generateTitlePrompt;

// Import teaching style prompts
const {
  generateExplanationLike5,
  generateConceptLike5,
  generateCoreExampleLike5,
  generatePracticeLike5,
} = require('../../prompts/content/teachingStyles/explainLike5');

const {
  generateExplanationPopularWay,
  generateConceptPopularWay,
  generateCoreExamplePopularWay,
  generatePracticePopularWay,
} = require('../../prompts/content/teachingStyles/explainPopularWay');

const {
  generateExplanationStorytelling,
  generateConceptStorytelling,
  generateCoreExampleStorytelling,
  generatePracticeStorytelling,
} = require('../../prompts/content/teachingStyles/explainStorytelling');

const {
  generateExplanationTechnical,
  generateConceptTechnical,
  generateCoreExampleTechnical,
  generatePracticeTechnical,
} = require('../../prompts/content/teachingStyles/explainTechnical');

/**
 * Get teaching style prompt generators
 */
function getTeachingStyleGenerators(teachingStyle) {
  const styleMap = {
    default: {
      explanation: explanationPrompt,
      concept: conceptPrompt,
      coreExample: coreExamplePrompt,
      practice: practicePrompt,
    },
    like5: {
      explanation: generateExplanationLike5,
      concept: generateConceptLike5,
      coreExample: generateCoreExampleLike5,
      practice: generatePracticeLike5,
    },
    popular: {
      explanation: generateExplanationPopularWay,
      concept: generateConceptPopularWay,
      coreExample: generateCoreExamplePopularWay,
      practice: generatePracticePopularWay,
    },
    storytelling: {
      explanation: generateExplanationStorytelling,
      concept: generateConceptStorytelling,
      coreExample: generateCoreExampleStorytelling,
      practice: generatePracticeStorytelling,
    },
    technical: {
      explanation: generateExplanationTechnical,
      concept: generateConceptTechnical,
      coreExample: generateCoreExampleTechnical,
      practice: generatePracticeTechnical,
    },
  };

  return styleMap[teachingStyle] || styleMap.default;
}

/**
 * Generate prompts for specific components only
 * @param {Object} user - User object
 * @param {String} topic - Topic name
 * @param {String} subtopic - Subtopic name
 * @param {Array|String} components - Components to generate
 * @param {String} teachingStyle - Teaching style (default, like5, popular, storytelling, technical)
 */
function generateSpecificPrompts(user, topic, subtopic, components, teachingStyle = 'default') {
  const styleGenerators = getTeachingStyleGenerators(teachingStyle);
  
  // Define components with their generators
  const COMPONENTS = {
    title: (user, topic, subtopic) => titlePrompt(topic, subtopic),
    concept: (user, topic, subtopic) => styleGenerators.concept(user, subtopic),
    explanation: (user, topic, subtopic) => styleGenerators.explanation(user, topic, subtopic),
    coreExample: (user, topic, subtopic) => styleGenerators.coreExample(user, topic, subtopic),
    practice: (user, topic, subtopic) => styleGenerators.practice(user, topic, subtopic),
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
      teachingStyle: teachingStyle,
      generatedAt: new Date().toISOString()
    }
  };
}

// Export only the required functions
module.exports = generateSpecificPrompts

