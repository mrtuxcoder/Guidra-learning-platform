/**
 * Teach like I'm 5 - Simple, fun, everyday analogies
 */

function generateExplanationLike5(user, topic, subtopic) {
  const { name } = user;

  return `Explain "${subtopic}" to a 5-year-old ${name}.

IMPORTANT RULES:
- Use ONLY simple, everyday words a child would understand
- Use fun analogies and comparisons to toys, animals, or activities
- Make it playful and engaging
- 3-4 short, simple paragraphs
- No technical terms at all
- Include 1 personalized sentence for ${name}

Example style: "It's like when you stack blocks..."

Your response must be ONLY the explanation text, nothing else.`;
}

function generateConceptLike5(user, subtopic) {
  return `Define "${subtopic}" for a 5-year-old.

IMPORTANT RULES:
- Use ONLY simple, everyday words
- 1-2 very short sentences
- No technical terms
- Use a fun comparison if possible
- Like explaining to a young child

Example: "A plant is like a person - it eats, drinks, and grows!"

Your response must be ONLY the definition text, nothing else.`;
}

function generateCoreExampleLike5(user, topic, subtopic) {
  const { name } = user;

  return `Give the simplest, most fun real-world example for "${subtopic}" for ${name}.

IMPORTANT RULES:
- Use everyday things a 5-year-old knows (toys, animals, food, family)
- Make it playful and relatable
- 2-3 short, simple sentences
- No technical jargon
- Include the word "like" for comparisons

Example: "Gravity is like an invisible friend that pulls everything down."

Your response must be ONLY the example text, nothing else.`;
}

function generatePracticeLike5(user, topic, subtopic) {
  const { name } = user;

  return `Create a super fun, simple activity for ${name} to try "${subtopic}".

IMPORTANT RULES:
- Use only things they can find at home (toys, water, food, etc.)
- Make it feel like a game, not learning
- 3-4 simple steps
- Each step: 1-2 sentences
- Include what they'll discover

Example: "Try making a tower and knocking it down!"

Your response must be ONLY the activity text, nothing else.`;
}

module.exports = {
  generateExplanationLike5,
  generateConceptLike5,
  generateCoreExampleLike5,
  generatePracticeLike5,
};
