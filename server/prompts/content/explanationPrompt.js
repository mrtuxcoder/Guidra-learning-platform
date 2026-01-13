function generateExplanationPrompt(user, topic, subtopic) {
  const { name, learningStyle, tonePreference } = user;

  return `Explain "${subtopic}" for ${name}. Tone: ${tonePreference}. Style: ${learningStyle}.
Include 1 personalized sentence for ${name}. 3-4 paragraphs.
OUTPUT ONLY JSON: {"explanation": "text here"}
Practical=action steps, Conceptual=principles, Visual=patterns.`;
}


module.exports = { generateExplanationPrompt };
