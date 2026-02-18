/**
 * Popular Ways - Current trends, memes, pop culture references
 */

function generateExplanationPopularWay(user, topic, subtopic) {
  const { name } = user;

  return `Explain "${subtopic}" for ${name} using current trends and pop culture.

IMPORTANT RULES:
- Reference trending shows, memes, music, or apps that are popular NOW
- Use modern slang naturally (not forced)
- Make it relatable to current events or viral moments
- 3-4 paragraphs
- Keep it fun and contemporary
- Include 1 personalized sentence for ${name}

Focus on HOW it connects to what's trending or what's currently popular.

Your response must be ONLY the explanation text, nothing else.`;
}

function generateConceptPopularWay(user, subtopic) {
  return `Define "${subtopic}" using a trending reference or pop culture example.

IMPORTANT RULES:
- Lead with a trending reference (TikTok, Netflix, gaming, memes, etc.)
- Then explain the concept
- 1-2 sentences
- Use modern language
- Make it instantly relatable

Example: "Momentum is like the viral energy of a TikTok trend - once it starts, it's hard to stop!"

Your response must be ONLY the definition text, nothing else.`;
}

function generateCoreExamplePopularWay(user, topic, subtopic) {
  const { name } = user;

  return `Give a trendy, modern real-world example for "${subtopic}" for ${name}.

IMPORTANT RULES:
- Use current trends, apps, shows, games, or viral moments
- Make it something happening RIGHT NOW
- 2-3 sentences
- Feel contemporary and relatable
- Connect to pop culture or trending topics

Example: "Like how TikTok's algorithm learns what you like and keeps showing you more..."

Your response must be ONLY the example text, nothing else.`;
}

function generatePracticePopularWay(user, topic, subtopic) {
  const { name } = user;

  return `Create a trendy, fun activity for ${name} to explore "${subtopic}".

IMPORTANT RULES:
- Use trending apps, platforms, or modern tools
- Make it feel like something they'd want to share
- 3-4 simple steps
- Each step: 1-2 sentences
- Include a "share-worthy" aspect

Example: "Create a TikTok that shows..."

Your response must be ONLY the activity text, nothing else.`;
}

module.exports = {
  generateExplanationPopularWay,
  generateConceptPopularWay,
  generateCoreExamplePopularWay,
  generatePracticePopularWay,
};
