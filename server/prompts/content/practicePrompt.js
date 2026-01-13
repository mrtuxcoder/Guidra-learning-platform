// practicePrompt.js - FIXED VERSION
function generatePracticePrompt(user, topic, subtopic) {
  const { name, tonePreference } = user;
  
  return `Create 5-min practice for "${subtopic}". Address ${name} with ${tonePreference} tone.
OUTPUT ONLY JSON: {"practice": "exercise text here"}
Include: 1) Motivational sentence, 2) Clear instructions, 3) Success criteria.
Hands-on, reinforces concepts.`;
}

module.exports = { generatePracticePrompt };