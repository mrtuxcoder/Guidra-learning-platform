function generateMindmapPrompt(user, topic, subtopic) {
  const { learningStyle } = user;
  
  return `Generate Mermaid.js mindmap for "${subtopic}" (topic: "${topic}").
Learner style: ${learningStyle}.
OUTPUT ONLY valid JSON: {"mindmap": "mermaid code here"}
Mermaid format: graph TD\\nA[${subtopic}] --> B[Branch1]...
Max 8 nodes. Labels: 2-5 words. No extra text.`;
}


module.exports = { generateMindmapPrompt};