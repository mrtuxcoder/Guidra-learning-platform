
// Import ALL prompt functions
const conceptPrompt = require('../prompts/content/conceptPrompt').generateConceptPrompt;
const coreExamplePrompt = require('../prompts/content/coreExamplePrompt').generateCoreExamplePrompt;
const explanationPrompt = require('../prompts/content/explanationPrompt').generateExplanationPrompt;
const keyConceptsPrompt = require('../prompts/content/keyConceptsPrompt').generateKeyConceptsPrompt;
const learningActionsPrompt = require('../prompts/content/learningActionsPrompt').generateLearningActionsPrompt;
const mindmapPrompt = require('../prompts/content/mindmapPrompt').generateMindmapPrompt;
const practicePrompt = require('../prompts/content/practicePrompt').generatePracticePrompt;
const quizPrompt = require('../prompts/content/quizPrompt').generateQuizPrompt;
const titlePrompt = require('../prompts/content/titlePrompt').generateTitlePrompt;

/**
 * Generate prompts for specific components only
 */
function generateSpecificPrompts(user, topic, subtopic, components) {
  // Define components with their generators
  const COMPONENTS = {
    title: (user, topic, subtopic) => titlePrompt(topic, subtopic),
    concept: (user, topic, subtopic) => conceptPrompt(user, subtopic),
    explanation: (user, topic, subtopic) => explanationPrompt(user, topic, subtopic),
    keyConcepts: (user, topic, subtopic) => keyConceptsPrompt(user, subtopic),
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
        expectsJson: prompt.includes('OUTPUT ONLY JSON') || prompt.includes('JSON:'),
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

/**
 * Generate unified prompt using imported prompt functions
 */
function generateUnifiedPrompt(user, topic, subtopic) {
  const { difficultyPreference, learningStyle, reasonForLearning, tonePreference, name } = user;
  
  // Generate individual prompts using imported functions
  const title = titlePrompt(topic, subtopic);
  const concept = conceptPrompt(user, subtopic);
  const explanation = explanationPrompt(user, topic, subtopic);
  const keyConcepts = keyConceptsPrompt(user, subtopic);
  const coreExample = coreExamplePrompt(user, topic, subtopic);
  const practice = practicePrompt(user, topic, subtopic);
  const learningActions = learningActionsPrompt(user, subtopic);
  const mindmap = mindmapPrompt(user, topic, subtopic);
  
  // Create quiz context
  const quizContext = JSON.stringify({
    topic,
    subtopic,
    userLevel: difficultyPreference,
    learningStyle: learningStyle
  }).substring(0, 200);
  const quiz = quizPrompt(user, subtopic, quizContext);
  
  return `Create exceptionally structured, personalized, and educational content for "${subtopic}" under the broader topic "${topic}".

LEARNER PROFILE:
- Name: ${name}
- Learning Level: ${difficultyPreference}
- Learning Style: ${learningStyle}
- Motivation: ${reasonForLearning}
- Preferred Tone: ${tonePreference}

COMPONENT PROMPTS (FOLLOW EACH ONE'S SPECIFIC INSTRUCTIONS):

TITLE:
${title}

CONCEPT:
${concept}

EXPLANATION:
${explanation}

KEY CONCEPTS:
${keyConcepts}

CORE EXAMPLE:
${coreExample}

PRACTICE:
${practice}

LEARNING ACTIONS:
${learningActions}

MINDMAP:
${mindmap}

QUIZ:
${quiz}

INTEGRATION INSTRUCTIONS:
1. Execute each prompt above independently and combine their outputs
2. Ensure personalization elements address ${name} using ${tonePreference} tone
3. Align all content with ${learningStyle} learning style
4. All quiz questions MUST be derived from the generated content
5. Maintain logical flow across all sections

OUTPUT FORMAT (STRICT JSON):
{
  "title": "generated from title prompt",
  "concept": "generated from concept prompt", 
  "explanation": "generated from explanation prompt",
  "keyConcepts": ["generated from keyConcepts prompt"],
  "coreExample": "generated from coreExample prompt",
  "practice": "generated from practice prompt",
  "mindmap": "generated from mindmap prompt",
  "learningActions": ["generated from learningActions prompt"],
  "examples": ["Short real-world example 1", "Practical scenario 2"],
  "quiz": [
    {
      "question": "Based on generated content",
      "choices": ["Correct", "Distractor", "Distractor", "Distractor"],
      "answer": "Correct",
      "correctIndex": 0,
      "source": "content source"
    }
  ]
}

RULES:
- Execute each component prompt exactly as written above
- Each component output must follow its own format instructions
- Final JSON must be valid and parseable
- Add "examples" array with 2 real-world scenarios
- Quiz must have 3 questions derived from generated content
- Mindmap must be valid Mermaid.js starting with 'graph TD'

FINAL OUTPUT MUST BE THE COMPLETE JSON OBJECT ONLY — no other text.
`;
}

// Export only the two requested functions
module.exports = {
  generateSpecificPrompts,
  generateUnifiedPrompt
};