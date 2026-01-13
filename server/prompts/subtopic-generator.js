function generateSubtopicPrompt(topic, difficulty = "beginner") {
  return `
Generate exactly 15 subtopic names for: "${topic}"

STRICT OUTPUT RULES:
- ONLY subtopic names
- One per line
- No numbering (1., 2., etc)
- No bullet points
- No explanations
- No conversational phrases
- No "often called" or "think of it as"
- No descriptions
- Clean, direct names only

BAD EXAMPLES:
"1. Introduction to Topic"
"Reconnaissance (often called recon)"
"Setting up your environment - let's get started!"

GOOD EXAMPLES:
"Introduction to Cybersecurity"
"Reconnaissance Techniques" 
"Network Scanning"
"Vulnerability Assessment"

CONTENT GUIDANCE:
- Difficulty: ${difficulty}
- Logical order: basic → advanced
- Include both theory and practice
- Use standard terminology

Generate subtopics for "${topic}":
`;
}

module.exports = generateSubtopicPrompt;
