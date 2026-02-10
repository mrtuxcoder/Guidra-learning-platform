// function generateTitlePrompt(topic, subtopic) {
//   return `Create engaging title for "${subtopic}" (topic: "${topic}").
// OUTPUT ONLY JSON: {"title": "title text here"}
// 3-8 words. Catchy, educational.`;
// }


// module.exports = { generateTitlePrompt };

function generateTitlePrompt(topic, subtopic) {
  return `Create an engaging educational title for "${subtopic}" (within topic "${topic}").

IMPORTANT FORMATTING RULES:
- Provide ONLY the title text
- No labels like "Title:"
- No quotes around the title
- No markdown formatting
- No JSON formatting
- Just the title words

Requirements:
- 3-8 words long
- Catchy and memorable
- Clearly indicates the learning focus
- Educational but not dry
- No punctuation at the end

Your response must be ONLY the title text, nothing else.`;
}

module.exports = { generateTitlePrompt };