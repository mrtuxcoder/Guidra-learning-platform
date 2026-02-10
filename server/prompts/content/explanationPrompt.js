// function generateExplanationPrompt(user, topic, subtopic) {
//   const { name, learningStyle, tonePreference } = user;

//   return `Explain "${subtopic}" for ${name}. Tone: ${tonePreference}. Style: ${learningStyle}.
// Include 1 personalized sentence for ${name}. 3-4 paragraphs.
// OUTPUT ONLY JSON: {"explanation": "text here"}
// Practical=action steps, Conceptual=principles, Visual=patterns.`;
// }


// module.exports = { generateExplanationPrompt };


function generateExplanationPrompt(user, topic, subtopic) {
  const { name, learningStyle, tonePreference } = user;

  return `Explain "${subtopic}" for ${name}.

IMPORTANT FORMATTING RULES:
- Provide ONLY the explanation text
- No labels like "Explanation:" 
- No markdown formatting
- No JSON formatting
- Write 3-4 clear paragraphs
- Include 1 personalized sentence for ${name}

Requirements:
- Use a ${tonePreference} tone
- Follow a ${learningStyle} learning style
- Focus on: ${learningStyle === 'Practical' ? 'action steps' : learningStyle === 'Conceptual' ? 'principles' : 'patterns'}

Your response must be ONLY the explanation text, nothing else.`;
}

module.exports = { generateExplanationPrompt };