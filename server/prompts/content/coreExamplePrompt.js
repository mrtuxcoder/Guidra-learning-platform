function generateCoreExamplePrompt(user, topic, subtopic) {
  const { difficultyPreference } = user;

  return `Create core example for "${subtopic}" (${difficultyPreference} level).
OUTPUT ONLY JSON: {"coreExample": "example and explanation here"}
Include: 1) Working example/code, 2) One-paragraph explanation.
Self-contained. Runnable if code.`;
}


module.exports = { generateCoreExamplePrompt };
