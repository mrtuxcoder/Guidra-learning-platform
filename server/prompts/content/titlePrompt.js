function generateTitlePrompt(topic, subtopic) {
  return `Create engaging title for "${subtopic}" (topic: "${topic}").
OUTPUT ONLY JSON: {"title": "title text here"}
3-8 words. Catchy, educational.`;
}


module.exports = { generateTitlePrompt };