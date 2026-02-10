// function generateCoreExamplePrompt(user, topic, subtopic) {
//   const { difficultyPreference } = user;

//   return `Create core example for "${subtopic}" (${difficultyPreference} level).
// OUTPUT ONLY JSON: {"coreExample": "example and explanation here"}
// Include: 1) Working example/code, 2) One-paragraph explanation.
// Self-contained. Runnable if code.`;
// }


// module.exports = { generateCoreExamplePrompt };


function generateCoreExamplePrompt(user, topic, subtopic) {
  const { difficultyPreference } = user;

  return `Create a core example for "${subtopic}" at ${difficultyPreference} level.

IMPORTANT FORMATTING RULES:
- Provide ONLY the example and explanation text
- No labels like "Example:" or "Core Example:"
- No markdown formatting
- No JSON formatting
- If using code, include it naturally in the text
- Make it self-contained and runnable if code

Include:
1. A working example or code demonstration
2. A one-paragraph explanation of how it works

Your response must be ONLY the example and explanation text, nothing else.`;
}

module.exports = { generateCoreExamplePrompt };