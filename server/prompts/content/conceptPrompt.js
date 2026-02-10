// function generateConceptPrompt(user, subtopic) {
//   const { difficultyPreference } = user;

//   return `Define "${subtopic}" (${difficultyPreference} level). 1-2 sentences.
// OUTPUT ONLY JSON: {"concept": "definition here"}
// Precise, clear, standalone. Focus on what it IS.
// Beginner=simple, Advanced=technical.`;
// }

// module.exports = { generateConceptPrompt };

function generateConceptPrompt(user, subtopic) {
  const { difficultyPreference } = user;

  return `Define "${subtopic}" at ${difficultyPreference} level.

IMPORTANT FORMATTING RULES:
- Provide ONLY the definition text
- No labels like "Concept:" or "Definition:"
- No markdown (**bold**, # headers, etc.)
- No JSON formatting
- No quotes around the text
- Just 1-2 clear sentences

Beginner level: Use simple, everyday language.
Advanced level: Use technical, precise terminology.

Focus on what "${subtopic}" IS, not what it does or examples.

Your response must be ONLY the definition text, nothing else.`;
}

module.exports = { generateConceptPrompt };
