// function generateMindmapPrompt(user, topic, subtopic) {
//   const { learningStyle } = user;
  
//   return `Generate Mermaid.js mindmap for "${subtopic}" (topic: "${topic}").
// Learner style: ${learningStyle}.
// OUTPUT ONLY valid JSON: {"mindmap": "mermaid code here"}
// Mermaid format: graph TD\\nA[${subtopic}] --> B[Branch1]...
// Max 8 nodes. Labels: 2-5 words. No extra text.`;
// }


// module.exports = { generateMindmapPrompt};

function generateMindmapPrompt(user, topic, subtopic) {
  const { learningStyle } = user;
  
  return `Create a Mermaid.js mindmap for "${subtopic}" (topic: "${topic}").

IMPORTANT FORMATTING RULES:
- Provide ONLY the Mermaid.js code
- No labels like "Mindmap:" 
- No markdown formatting
- No JSON formatting
- No explanation text
- Start with "graph TD" exactly

Requirements:
- Learner style: ${learningStyle}
- Center node: "${subtopic}"
- 3-5 main branches
- Max 8 nodes total
- Labels: 2-5 words each
- Use proper Mermaid.js syntax

Example format (but create your own):
graph TD
    A[${subtopic}] --> B[Branch 1]
    A --> C[Branch 2]
    A --> D[Branch 3]
    B --> B1[Sub-point 1]
    B --> B2[Sub-point 2]

Your response must be ONLY the Mermaid.js code starting with "graph TD", nothing else.`;
}

module.exports = { generateMindmapPrompt};
