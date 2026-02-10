// // practicePrompt.js - FIXED VERSION
// function generatePracticePrompt(user, topic, subtopic) {
//   const { name, tonePreference } = user;
  
//   return `Create 5-min practice for "${subtopic}". Address ${name} with ${tonePreference} tone.
// OUTPUT ONLY JSON: {"practice": "exercise text here"}
// Include: 1) Motivational sentence, 2) Clear instructions, 3) Success criteria.
// Hands-on, reinforces concepts.`;
// }

// module.exports = { generatePracticePrompt };

function generatePracticePrompt(user, topic, subtopic) {
  const { name, tonePreference } = user;
  
  return `Create a 5-minute practice exercise for "${subtopic}".

IMPORTANT FORMATTING RULES:
- Provide ONLY the practice text
- No labels like "Practice:"
- No markdown formatting
- No JSON formatting
- Address ${name} directly using ${tonePreference} tone

Include three parts:
1. A motivational sentence to encourage ${name}
2. Clear, step-by-step instructions for the practice
3. Success criteria - how ${name} will know they've completed it well

Make it hands-on and designed to reinforce the core concepts.
The practice should be achievable in about 5 minutes.

Your response must be ONLY the practice text, nothing else.`;
}

module.exports = { generatePracticePrompt };