/**
 * Storytelling - Narrative driven, as a story or adventure
 */

function generateExplanationStorytelling(user, topic, subtopic) {
  const { name } = user;

  return `Explain "${subtopic}" to ${name} as a compelling story or narrative.

IMPORTANT RULES:
- Tell it as a story with a beginning, middle, and end
- Create characters or a narrative journey
- 3-4 paragraphs
- Make it engaging and memorable
- Include 1 personalized sentence for ${name}
- Use storytelling language (once, suddenly, imagine, etc.)

Focus on the narrative arc while teaching the concept.

Your response must be ONLY the story/explanation text, nothing else.`;
}

function generateConceptStorytelling(user, subtopic) {
  return `Define "${subtopic}" as a brief story or narrative moment.

IMPORTANT RULES:
- Present it as part of a narrative or adventure
- 1-2 sentences that tell a quick story
- Use narrative language
- Make it memorable through story structure

Example: "Once upon a time, photosynthesis was when plants discovered they could eat sunlight..."

Your response must be ONLY the definition text, nothing else.`;
}

function generateCoreExampleStorytelling(user, topic, subtopic) {
  const { name } = user;

  return `Give a narrative-driven example for "${subtopic}" for ${name}.

IMPORTANT RULES:
- Tell it as part of a short story or scenario
- Include characters or a protagonist
- 2-3 sentences
- Feel like a mini-adventure
- Create a vivid mental image

Example: "Imagine a brave explorer discovering gravity when an apple fell on their head..."

Your response must be ONLY the example text, nothing else.`;
}

function generatePracticeStorytelling(user, topic, subtopic) {
  const { name } = user;

  return `Create a story-based quest or adventure for ${name} to explore "${subtopic}".

IMPORTANT RULES:
- Frame it as a quest, mission, or adventure
- 3-4 steps presented as a narrative journey
- Each step: 1-2 sentences with story elements
- Include a "story outcome" - what they'll discover
- Make it feel like an adventure

Example: "Your mission: Journey into the world of..."

Your response must be ONLY the quest/activity text, nothing else.`;
}

module.exports = {
  generateExplanationStorytelling,
  generateConceptStorytelling,
  generateCoreExampleStorytelling,
  generatePracticeStorytelling,
};
