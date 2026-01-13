function generateConceptPrompt(user, subtopic) {
  const { difficultyPreference } = user;

  return `Define "${subtopic}" (${difficultyPreference} level). 1-2 sentences.
OUTPUT ONLY JSON: {"concept": "definition here"}
Precise, clear, standalone. Focus on what it IS.
Beginner=simple, Advanced=technical.`;
}


module.exports = { generateConceptPrompt };
