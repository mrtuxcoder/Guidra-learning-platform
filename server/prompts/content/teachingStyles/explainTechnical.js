/**
 * Technical Deep Dive - Advanced, detailed, technical explanations
 */

function generateExplanationTechnical(user, topic, subtopic) {
  const { name } = user;

  return `Provide a technical deep dive explanation of "${subtopic}" for ${name}.

IMPORTANT RULES:
- Use technical terminology and advanced concepts
- Explain mechanisms, processes, and underlying principles
- 3-4 detailed paragraphs
- Include scientific or technical details
- Assume advanced knowledge level
- Include 1 personalized sentence for ${name}

Focus on the "why" and "how" at a technical level.

Your response must be ONLY the explanation text, nothing else.`;
}

function generateConceptTechnical(user, subtopic) {
  return `Define "${subtopic}" with technical precision.

IMPORTANT RULES:
- Use precise, technical terminology
- 1-2 sentences
- Include the mechanism or process if relevant
- Assume advanced reader
- Be formal and precise

Example: "Photosynthesis is the biochemical process by which plants convert light energy into chemical energy through the light-dependent and light-independent reactions..."

Your response must be ONLY the definition text, nothing else.`;
}

function generateCoreExampleTechnical(user, topic, subtopic) {
  const { name } = user;

  return `Provide a technical, detailed example for "${subtopic}" for ${name}.

IMPORTANT RULES:
- Use real technical or scientific examples
- Include specific details, measurements, or data if relevant
- 2-3 sentences
- Assume technical knowledge
- Reference specific cases or mechanisms

Example: "Consider the oxidation of glucose (C6H12O6) during cellular respiration, where..."

Your response must be ONLY the example text, nothing else.`;
}

function generatePracticeTechnical(user, topic, subtopic) {
  const { name } = user;

  return `Create a technical experiment or deep-dive project for ${name} to master "${subtopic}".

IMPORTANT RULES:
- Designa technical project or hands-on experiment
- 3-4 detailed steps with technical depth
- Each step: 1-2 sentences with technical details
- Include how to measure or verify results
- Be specific about tools, equipment, or methodology

Example: "Build a circuit that demonstrates..."

Your response must be ONLY the project text, nothing else.`;
}

module.exports = {
  generateExplanationTechnical,
  generateConceptTechnical,
  generateCoreExampleTechnical,
  generatePracticeTechnical,
};
